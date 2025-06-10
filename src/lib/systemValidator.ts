// lib/systemValidator.ts
// ==========================================================================
// SYSTEM INTEGRATION VALIDATOR - UPDATED FOR STORE COMPATIBILITY
// ==========================================================================

import {
  generateArchetypeResults,
  calculateConfidenceGap,
  areDistancesTied,
} from './archetypeCalculator';
import {
  calculateExtendedScores,
  safeCalculateExtendedScores,
  getUserScenarioPath,
  getExtendedScenarioById,
  validateScenarioData, // FIXED: Updated from validateScenarioIntegrity
  createExtendedUserAnswer,
  validateAnswerObject,
} from './data';
import { selectPersonasForUser } from './personaSelector';
import {
  ExtendedUserAnswer,
  ScoreData,
  ArchetypeResults,
  ExtendedAnswerOption,
  ExtendedScenario,
} from './types';
import { generateVulnerabilityAssessment, VulnerabilityAssessment } from './vulnerabilityPipeline';

// ==========================================================================
// SYSTEM VALIDATION TYPES
// ==========================================================================

export interface SystemValidationResult {
  isValid: boolean;
  overallScore: number; // 0-100
  summary: string;
  phases: {
    phase1: PhaseValidationResult;
    phase2: PhaseValidationResult;
    phase3: PhaseValidationResult;
    integration: PhaseValidationResult;
  };
  recommendations: string[];
  criticalIssues: string[];
  warnings: string[];
}

export interface PhaseValidationResult {
  name: string;
  isValid: boolean;
  score: number; // 0-100
  tests: TestResult[];
  duration: number; // ms
}

export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: Record<string, unknown>;
  duration: number; // ms
}

// ==========================================================================
// ENHANCED SYSTEM VALIDATOR CLASS
// ==========================================================================

export class EnhancedSystemValidator {
  /**
   * Run complete system validation suite
   */
  async validateCompleteSystem(): Promise<SystemValidationResult> {
    const startTime = Date.now();

    try {
      // Phase 1: Data and Scenario Validation
      const phase1 = await this.validatePhase1DataIntegrity();

      // Phase 2: Archetype Calculation Validation
      const phase2 = await this.validatePhase2ArchetypeSystem();

      // Phase 3: Persona and Vulnerability Validation
      const phase3 = await this.validatePhase3VulnerabilitySystem();

      // Integration: End-to-End System Validation
      const integration = await this.validateSystemIntegration();

      // Calculate overall score
      const phases = { phase1, phase2, phase3, integration };
      const overallScore = this.calculateOverallScore(phases);
      const isValid = Object.values(phases).every(phase => phase.isValid);

      // Generate recommendations and issues
      const recommendations = this.generateRecommendations(...Object.values(phases));
      const criticalIssues = this.extractCriticalIssues(...Object.values(phases));
      const warnings = this.extractWarnings(...Object.values(phases));

      return {
        isValid,
        overallScore,
        summary: this.generateSummary(overallScore, isValid),
        phases,
        recommendations,
        criticalIssues,
        warnings,
      };
    } catch (error) {
      console.error('System validation failed:', error);
      return this.generateFailureResult(error);
    }
  }

  /**
   * Phase 1: Validate data integrity and scenario system
   */
  private async validatePhase1DataIntegrity(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    // Test 1: Scenario Data Validation
    tests.push(
      await this.runTest('Scenario Data Integrity', async () => {
        const validation = validateScenarioData(); // FIXED: Updated function name

        if (!validation.isValid) {
          throw new Error(`Scenario validation failed: ${validation.errors.join(', ')}`);
        }

        return {
          totalScenarios: validation.errors.length === 0,
          errors: validation.errors,
          warnings: validation.warnings,
        };
      })
    );

    // Test 2: Extended User Answer Structure
    tests.push(
      await this.runTest('Extended User Answer Validation', async () => {
        const testAnswer = createExtendedUserAnswer(1, {
          letter: 'A',
          text: 'Test option',
          scores: { emotional: 2, logical: 1, exploratory: 0 },
          next: 2,
        });

        const validation = validateAnswerObject(testAnswer);

        if (!validation.isValid) {
          throw new Error(`Answer validation failed: ${validation.errors.join(', ')}`);
        }

        return { answerStructure: 'valid', validation };
      })
    );

    // Test 3: Score Calculation with Enhanced Structure
    tests.push(
      await this.runTest('Enhanced Score Calculation', async () => {
        const testAnswers = this.generateTestAnswers(5);
        const scoreResult = safeCalculateExtendedScores(testAnswers);

        if (scoreResult.errors.length > 0) {
          throw new Error(`Score calculation errors: ${scoreResult.errors.join(', ')}`);
        }

        const totalScore =
          scoreResult.scores.emotional +
          scoreResult.scores.logical +
          scoreResult.scores.exploratory;
        if (totalScore === 0) {
          throw new Error('Total score is zero');
        }

        return {
          totalScore,
          scores: scoreResult.scores,
          warnings: scoreResult.warnings,
        };
      })
    );

    // Test 4: Multi-Select Answer Handling
    tests.push(
      await this.runTest('Multi-Select Answer Support', async () => {
        const multiSelectAnswer = createExtendedUserAnswer(
          1,
          {
            letter: 'A',
            text: 'Primary option',
            scores: { emotional: 1, logical: 1, exploratory: 1 },
            next: 2,
          },
          true,
          [
            {
              letter: 'A',
              text: 'Option A',
              scores: { emotional: 1, logical: 0, exploratory: 0 },
              next: 2,
            },
            {
              letter: 'B',
              text: 'Option B',
              scores: { emotional: 0, logical: 1, exploratory: 0 },
              next: 2,
            },
          ]
        );

        const validation = validateAnswerObject(multiSelectAnswer);
        if (!validation.isValid) {
          throw new Error('Multi-select answer validation failed');
        }

        return {
          multiSelectSupport: 'working',
          selectedOptions: multiSelectAnswer.selectedOptions?.length,
        };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);

    return {
      name: 'Data & Scenario Validation',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
    };
  }

  /**
   * Phase 2: Validate archetype calculation system
   */
  private async validatePhase2ArchetypeSystem(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    // Test 1: Archetype Generation
    tests.push(
      await this.runTest('Archetype Results Generation', async () => {
        const testScores: ScoreData = { emotional: 8, logical: 4, exploratory: 2 };
        const results = generateArchetypeResults(testScores);

        if (!results.topMatches || results.topMatches.length === 0) {
          throw new Error('No archetype matches generated');
        }

        if (results.topMatches[0].confidence < 30) {
          throw new Error('Top archetype confidence too low');
        }

        return {
          topArchetype: results.topMatches[0].archetype.name,
          confidence: results.topMatches[0].confidence,
          totalMatches: results.topMatches.length,
        };
      })
    );

    // Test 2: Confidence Gap Calculation
    tests.push(
      await this.runTest('Confidence Gap Analysis', async () => {
        const testScores: ScoreData = { emotional: 10, logical: 2, exploratory: 1 };
        const results = generateArchetypeResults(testScores);
        const confidenceGap = calculateConfidenceGap(results.topMatches);

        if (typeof confidenceGap.gap !== 'number') {
          throw new Error('Confidence gap not calculated');
        }

        return {
          gap: confidenceGap.gap,
          gapType: confidenceGap.gapType,
          primaryArchetype: confidenceGap.primaryArchetype,
        };
      })
    );

    // Test 3: Distance Tie Detection
    tests.push(
      await this.runTest('Distance Tie Detection', async () => {
        const similarDistances = areDistancesTied(2.1, 2.0, 0.5);
        const differentDistances = areDistancesTied(3.0, 1.0, 0.5);

        if (!similarDistances || differentDistances) {
          throw new Error('Distance tie detection not working correctly');
        }

        return { tieDetection: 'working' };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);

    return {
      name: 'Archetype Calculation System',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
    };
  }

  /**
   * Phase 3: Validate vulnerability and persona system
   */
  private async validatePhase3VulnerabilitySystem(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    // Test 1: Persona Selection
    tests.push(
      await this.runTest('Persona Selection System', async () => {
        const testScores: ScoreData = { emotional: 9, logical: 3, exploratory: 4 };
        const archetypeResults = generateArchetypeResults(testScores);

        try {
          const personaSelection = selectPersonasForUser(
            archetypeResults.topMatches,
            15,
            'mediumGap'
          );

          if (
            !personaSelection.selectedPersonas ||
            personaSelection.selectedPersonas.length === 0
          ) {
            throw new Error('No personas selected');
          }

          return {
            selectedCount: personaSelection.selectedPersonas.length,
            primaryArchetype: personaSelection.primaryArchetype,
            confidenceGap: personaSelection.confidenceGap,
          };
        } catch (error) {
          // If persona selector has compatibility issues, this will catch them
          throw new Error(`Persona selection failed: ${error}`);
        }
      })
    );

    // Test 2: Vulnerability Assessment Pipeline
    tests.push(
      await this.runTest('Vulnerability Assessment Pipeline', async () => {
        const testAnswers = this.generateTestAnswers(5);
        const testScores = calculateExtendedScores(testAnswers);
        const archetypeResults = generateArchetypeResults(testScores);

        try {
          const vulnerabilityAssessment = generateVulnerabilityAssessment(
            testAnswers,
            archetypeResults
          );

          if (!vulnerabilityAssessment.personaSelection) {
            throw new Error('Vulnerability assessment missing persona selection');
          }

          return {
            hasEducationalContent: !!vulnerabilityAssessment.educationalContent,
            hasRiskProfile: !!vulnerabilityAssessment.riskProfile,
            hasActionablePlan: !!vulnerabilityAssessment.actionablePlan,
          };
        } catch (error) {
          throw new Error(`Vulnerability assessment failed: ${error}`);
        }
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);

    return {
      name: 'Vulnerability & Persona System',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
    };
  }

  /**
   * Integration: End-to-end system validation
   */
  private async validateSystemIntegration(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    // Test 1: Complete Assessment Flow
    tests.push(
      await this.runTest('Complete Assessment Flow', async () => {
        const completeAnswers = this.generateTestAnswers(8);

        // Step 1: Calculate scores
        const scores = calculateExtendedScores(completeAnswers);
        if (scores.emotional + scores.logical + scores.exploratory === 0) {
          throw new Error('Score calculation failed in integration test');
        }

        // Step 2: Generate archetypes
        const archetypes = generateArchetypeResults(scores);
        if (archetypes.topMatches.length === 0) {
          throw new Error('Archetype generation failed in integration test');
        }

        // Step 3: Generate vulnerability assessment
        const vulnerability = generateVulnerabilityAssessment(completeAnswers, archetypes);
        if (!vulnerability.personaSelection) {
          throw new Error('Vulnerability assessment failed in integration test');
        }

        // Step 4: Validate path tracking
        const userPath = getUserScenarioPath(completeAnswers);
        if (userPath.totalSteps !== completeAnswers.length) {
          throw new Error('Path tracking failed in integration test');
        }

        return {
          totalSteps: userPath.totalSteps,
          finalScores: scores,
          topArchetype: archetypes.topMatches[0].archetype.name,
          vulnerabilityAssessment: 'generated',
        };
      })
    );

    // Test 2: Error Handling Resilience
    tests.push(
      await this.runTest('Error Handling & Resilience', async () => {
        let errorsHandledCorrectly = 0;
        const totalErrorTests = 3;

        // Test 1: Empty answers array
        try {
          const emptyScores = calculateExtendedScores([]);
          if (
            emptyScores.emotional === 0 &&
            emptyScores.logical === 0 &&
            emptyScores.exploratory === 0
          ) {
            errorsHandledCorrectly++; // Should return zero scores
          }
        } catch (error) {
          // Error handling failed if it throws
        }

        // Test 2: Invalid answer structure
        try {
          const invalidAnswer = { scenarioId: 999, selectedOption: null } as any;
          const validation = validateAnswerObject(invalidAnswer);
          if (!validation.isValid) {
            errorsHandledCorrectly++; // Should detect invalid structure
          }
        } catch (error) {
          // Should not throw, should return validation result
        }

        // Test 3: Safe score calculation with problematic data
        try {
          const problematicAnswers = [
            createExtendedUserAnswer(1, {
              letter: 'A',
              text: 'Test',
              scores: { emotional: 1, logical: 1, exploratory: 1 },
              next: 2,
            }),
          ];
          const safeResult = safeCalculateExtendedScores(problematicAnswers);
          if (safeResult.scores) {
            errorsHandledCorrectly++; // Should produce scores safely
          }
        } catch (error) {
          // Error handling failed if it throws
        }

        if (errorsHandledCorrectly < totalErrorTests) {
          throw new Error(
            `Error handling failed: ${errorsHandledCorrectly}/${totalErrorTests} tests passed`
          );
        }

        return {
          errorTestsPassed: errorsHandledCorrectly,
          totalErrorTests,
          errorHandlingScore: Math.round((errorsHandledCorrectly / totalErrorTests) * 100),
        };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);

    return {
      name: 'System Integration',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
    };
  }

  /**
   * Run individual test with error handling and timing
   */
  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;

      return {
        name,
        status: 'pass',
        message: 'Test passed successfully',
        details: result,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Determine if this is a critical failure or just a warning
      const isWarning = errorMessage.includes('warning') || errorMessage.includes('deprecated');

      return {
        name,
        status: isWarning ? 'warning' : 'fail',
        message: errorMessage,
        duration,
      };
    }
  }

  /**
   * Generate test answers with proper ExtendedUserAnswer structure
   */
  private generateTestAnswers(count: number): ExtendedUserAnswer[] {
    const answers: ExtendedUserAnswer[] = [];

    for (let i = 0; i < count; i++) {
      const scenarioId = i + 1;
      const option: ExtendedAnswerOption = {
        letter: String.fromCharCode(65 + (i % 3)), // A, B, C rotation
        text: `Test option ${i + 1}`,
        scores: {
          emotional: i % 3 === 0 ? 2 : 0,
          logical: i % 3 === 1 ? 2 : 0,
          exploratory: i % 3 === 2 ? 2 : 0,
        },
        next: i + 2 > count ? 'complete' : i + 2,
      };

      answers.push(createExtendedUserAnswer(scenarioId, option));
    }

    return answers;
  }

  /**
   * Calculate overall score from phase results
   */
  private calculateOverallScore(phases: Record<string, PhaseValidationResult>): number {
    const scores = Object.values(phases).map(phase => phase.score);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Generate summary based on overall score
   */
  private generateSummary(score: number, isValid: boolean): string {
    if (score >= 95 && isValid)
      return '🎉 Excellent! System is production-ready with outstanding performance.';
    if (score >= 85 && isValid)
      return '✅ Great! System is ready for production with minor optimizations needed.';
    if (score >= 75)
      return '👍 Good! System is functional but needs some improvements before production.';
    if (score >= 60) return '⚠️ Fair! System has significant issues that need addressing.';
    return '❌ Poor! System has critical issues that must be fixed before deployment.';
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(...phases: PhaseValidationResult[]): string[] {
    const recommendations: string[] = [];

    phases.forEach(phase => {
      const failedTests = phase.tests.filter(t => t.status === 'fail');
      const warningTests = phase.tests.filter(t => t.status === 'warning');

      if (failedTests.length > 0) {
        recommendations.push(`${phase.name}: Fix ${failedTests.length} critical issue(s)`);
      }

      if (warningTests.length > 0) {
        recommendations.push(`${phase.name}: Address ${warningTests.length} warning(s)`);
      }

      if (phase.score < 90) {
        recommendations.push(`${phase.name}: Consider performance optimizations`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push(
        'System is performing well! Consider adding more comprehensive test coverage.',
        'Monitor performance metrics in production environment.',
        'Set up automated testing pipeline for continuous validation.'
      );
    }

    return recommendations;
  }

  /**
   * Extract critical issues from test results
   */
  private extractCriticalIssues(...phases: PhaseValidationResult[]): string[] {
    const criticalIssues: string[] = [];

    phases.forEach(phase => {
      const failedTests = phase.tests.filter(t => t.status === 'fail');
      failedTests.forEach(test => {
        criticalIssues.push(`${phase.name}: ${test.name} - ${test.message}`);
      });
    });

    return criticalIssues;
  }

  /**
   * Extract warnings from test results
   */
  private extractWarnings(...phases: PhaseValidationResult[]): string[] {
    const warnings: string[] = [];

    phases.forEach(phase => {
      const warningTests = phase.tests.filter(t => t.status === 'warning');
      warningTests.forEach(test => {
        warnings.push(`${phase.name}: ${test.name} - ${test.message}`);
      });
    });

    return warnings;
  }

  /**
   * Generate failure result when validation crashes
   */
  private generateFailureResult(error: unknown): SystemValidationResult {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      isValid: false,
      overallScore: 0,
      summary: '❌ System validation failed due to critical error',
      phases: {
        phase1: this.createFailedPhase('Data & Scenario Validation', errorMessage),
        phase2: this.createFailedPhase('Archetype Calculation System', errorMessage),
        phase3: this.createFailedPhase('Vulnerability & Persona System', errorMessage),
        integration: this.createFailedPhase('System Integration', errorMessage),
      },
      recommendations: [
        'Fix critical system validation error',
        'Check console for detailed error information',
      ],
      criticalIssues: [`System validation crashed: ${errorMessage}`],
      warnings: [],
    };
  }

  /**
   * Create a failed phase result
   */
  private createFailedPhase(name: string, error: string): PhaseValidationResult {
    return {
      name,
      isValid: false,
      score: 0,
      tests: [
        {
          name: 'System Validation',
          status: 'fail',
          message: error,
          duration: 0,
        },
      ],
      duration: 0,
    };
  }
}

// ==========================================================================
// CONVENIENCE FUNCTIONS
// ==========================================================================

/**
 * Quick system validation check
 */
export const validateSystem = async (): Promise<SystemValidationResult> => {
  const validator = new EnhancedSystemValidator();
  return validator.validateCompleteSystem();
};

/**
 * Simple integration test for development
 */
export const runQuickIntegrationTest = (): boolean => {
  try {
    // Test basic data functions
    const testScores: ScoreData = { emotional: 5, logical: 3, exploratory: 2 };
    const archetypeResults = generateArchetypeResults(testScores);

    return archetypeResults.topMatches.length > 0;
  } catch (error) {
    console.error('Quick integration test failed:', error);
    return false;
  }
};

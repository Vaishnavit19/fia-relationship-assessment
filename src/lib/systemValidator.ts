// src/lib/systemValidator.ts
// ==========================================================================
// UPDATED SYSTEM INTEGRATION VALIDATOR - Based on New Architecture
// ==========================================================================

import {
  generateArchetypeResults,
  calculateConfidenceGap,
  areDistancesTied,
  calculateEuclideanDistance,
  getDetailedScoreAnalysis,
} from './archetypeCalculator';
import {
  calculateExtendedScores,
  getUserScenarioPath,
  getExtendedScenarioById,
  validateScenarioIntegrity,
  calculateExtendedProgress,
  isScenarioPathComplete,
} from './data';
import {
  selectPersonasForUser,
  validatePersonaSelectionSetup,
  getPersonaDistribution,
  getArchetypeVulnerabilities,
} from './personaSelector';
import {
  generateCompleteAssessmentResults,
  formatArchetypeResultsForDisplay,
} from './resultsEngine';
import {
  ExtendedUserAnswer,
  ScoreData,
  ArchetypeResults,
  VulnerabilityAssessment,
  ExtendedAssessmentResult,
} from './types';
import {
  generateVulnerabilityAssessment,
  calculateOverallRiskLevel,
  generateRiskProfile,
} from './vulnerabilityPipeline';

// ==========================================================================
// ENHANCED SYSTEM VALIDATION TYPES
// ==========================================================================

export interface SystemValidationResult {
  isValid: boolean;
  overallScore: number; // 0-100
  summary: string;
  phases: {
    scenarioValidation: PhaseValidationResult;
    mathematicalEngine: PhaseValidationResult;
    personaSelection: PhaseValidationResult;
    vulnerabilityPipeline: PhaseValidationResult;
    integrationTesting: PhaseValidationResult;
  };
  recommendations: string[];
  criticalIssues: string[];
  warnings: string[];
  performanceMetrics: {
    averageProcessingTime: number;
    memoryUsage: number;
    successRate: number;
  };
}

export interface PhaseValidationResult {
  name: string;
  isValid: boolean;
  score: number; // 0-100
  tests: TestResult[];
  duration: number; // ms
  coverage: number; // 0-100
}

export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
  duration?: number;
  expectedResult?: any;
  actualResult?: any;
}

// ==========================================================================
// ENHANCED SYSTEM VALIDATOR CLASS
// ==========================================================================

export class SystemValidator {
  private testStartTime = 0;

  /**
   * Run complete system validation with enhanced coverage
   */
  async validateSystem(): Promise<SystemValidationResult> {
    this.testStartTime = Date.now();

    console.log('🔍 Starting comprehensive system validation...');

    // Run all validation phases
    const scenarioValidation = await this.validateScenarioPhase();
    const mathematicalEngine = await this.validateMathematicalEngine();
    const personaSelection = await this.validatePersonaSelectionPhase();
    const vulnerabilityPipeline = await this.validateVulnerabilityPipeline();
    const integrationTesting = await this.validateIntegrationPhase();

    // Calculate overall metrics
    const phases = {
      scenarioValidation,
      mathematicalEngine,
      personaSelection,
      vulnerabilityPipeline,
      integrationTesting,
    };

    const allTests = Object.values(phases).flatMap(phase => phase.tests);
    const passedTests = allTests.filter(t => t.status === 'pass').length;
    const overallScore = Math.round((passedTests / allTests.length) * 100);
    const isValid = !allTests.some(t => t.status === 'fail');

    // Generate performance metrics
    const performanceMetrics = await this.calculatePerformanceMetrics();

    const result: SystemValidationResult = {
      isValid,
      overallScore,
      summary: this.generateSummary(overallScore, isValid),
      phases,
      recommendations: this.generateRecommendations(...Object.values(phases)),
      criticalIssues: this.extractCriticalIssues(...Object.values(phases)),
      warnings: this.extractWarnings(...Object.values(phases)),
      performanceMetrics,
    };

    const totalDuration = Date.now() - this.testStartTime;
    console.log(`✅ System validation completed in ${totalDuration}ms`);
    console.log(`📊 Overall Score: ${overallScore}/100`);
    console.log(`🎯 Status: ${isValid ? 'VALID' : 'ISSUES DETECTED'}`);

    return result;
  }

  /**
   * Phase 1: Validate Extended Scenario System
   */
  private async validateScenarioPhase(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    console.log('📋 Validating Extended Scenario System...');

    // Test 1: Scenario Data Integrity
    tests.push(
      await this.runTest('Scenario Data Integrity', async () => {
        const validation = validateScenarioIntegrity();

        if (!validation.isValid) {
          throw new Error(`Scenario integrity failed: ${validation.errors.join(', ')}`);
        }

        return {
          totalScenarios: validation.totalScenarios || 0,
          branchingScenarios: validation.branchingScenarios || 0,
          errors: validation.errors,
        };
      })
    );

    // Test 2: Branching Logic Validation
    tests.push(
      await this.runTest('Branching Logic Validation', async () => {
        const branchingScenarios = [3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 7.1, 7.2];
        let validBranches = 0;

        for (const id of branchingScenarios) {
          const scenario = getExtendedScenarioById(id);
          if (scenario?.options && scenario.options.length > 0) {
            validBranches++;
          }
        }

        if (validBranches < branchingScenarios.length * 0.8) {
          throw new Error(
            `Only ${validBranches}/${branchingScenarios.length} branching scenarios are valid`
          );
        }

        return { validBranches, totalBranches: branchingScenarios.length };
      })
    );

    // Test 3: Score Calculation
    tests.push(
      await this.runTest('Score Calculation', async () => {
        const testAnswers: ExtendedUserAnswer[] = [
          {
            scenarioId: 1,
            selectedOption: {
              letter: 'a',
              text: 'Test',
              scores: { emotional: 2, logical: 3, exploratory: 1 },
              next: 2,
            },
            timestamp: new Date(),
          },
          {
            scenarioId: 2,
            selectedOption: {
              letter: 'b',
              text: 'Test',
              scores: { emotional: 1, logical: 1, exploratory: 2 },
              next: 3,
            },
            timestamp: new Date(),
          },
        ];

        const scores = calculateExtendedScores(testAnswers);
        const expectedScores = { emotional: 3, logical: 4, exploratory: 3 };

        if (JSON.stringify(scores) !== JSON.stringify(expectedScores)) {
          throw new Error(
            `Score calculation mismatch. Expected: ${JSON.stringify(expectedScores)}, Got: ${JSON.stringify(scores)}`
          );
        }

        return { calculatedScores: scores, expectedScores };
      })
    );

    // Test 4: Path Tracking
    tests.push(
      await this.runTest('Path Tracking', async () => {
        const testAnswers: ExtendedUserAnswer[] = [
          {
            scenarioId: 1,
            selectedOption: {
              letter: 'a',
              text: 'Test',
              scores: { emotional: 1, logical: 1, exploratory: 1 },
              next: 2,
            },
            timestamp: new Date(),
          },
          {
            scenarioId: 2,
            selectedOption: {
              letter: 'b',
              text: 'Test',
              scores: { emotional: 1, logical: 1, exploratory: 1 },
              next: 3.1,
            },
            timestamp: new Date(),
          },
        ];

        const userPath = getUserScenarioPath(testAnswers);

        if (!userPath || userPath.totalSteps !== 2) {
          throw new Error(
            `Path tracking failed. Expected 2 steps, got ${userPath?.totalSteps || 0}`
          );
        }

        return userPath;
      })
    );

    // Test 5: Progress Calculation
    tests.push(
      await this.runTest('Progress Calculation', async () => {
        const testAnswers: ExtendedUserAnswer[] = [
          {
            scenarioId: 1,
            selectedOption: {
              letter: 'a',
              text: 'Test',
              scores: { emotional: 1, logical: 1, exploratory: 1 },
              next: 2,
            },
            timestamp: new Date(),
          },
        ];

        const progress = calculateExtendedProgress(testAnswers, 2);

        if (progress < 0 || progress > 100) {
          throw new Error(`Invalid progress value: ${progress}`);
        }

        return { progress };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);
    const coverage = Math.round((tests.length / 5) * 100); // 5 expected tests

    return {
      name: 'Extended Scenario System',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
      coverage,
    };
  }

  /**
   * Phase 2: Validate Mathematical Engine
   */
  private async validateMathematicalEngine(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    console.log('🧮 Validating Mathematical Proximity Engine...');

    // Test 1: Euclidean Distance Calculation
    tests.push(
      await this.runTest('Euclidean Distance Calculation', async () => {
        const userScores: ScoreData = { logical: 10, emotional: 5, exploratory: 3 };
        const targetScores: ScoreData = { logical: 8, emotional: 7, exploratory: 5 };

        const distance = calculateEuclideanDistance(userScores, targetScores);
        const expectedDistance = Math.sqrt((10 - 8) ** 2 + (5 - 7) ** 2 + (3 - 5) ** 2); // sqrt(12) ≈ 3.464

        if (Math.abs(distance - expectedDistance) > 0.01) {
          throw new Error(
            `Distance calculation incorrect. Expected: ${expectedDistance}, Got: ${distance}`
          );
        }

        return { distance, expectedDistance };
      })
    );

    // Test 2: Archetype Results Generation
    tests.push(
      await this.runTest('Archetype Results Generation', async () => {
        const testScores: ScoreData = { logical: 8, emotional: 6, exploratory: 4 };
        const results = generateArchetypeResults(testScores);

        if (!results.matches || results.matches.length === 0) {
          throw new Error('No archetype matches generated');
        }

        if (!results.topMatches || results.topMatches.length < 3) {
          throw new Error(
            `Insufficient top matches. Expected at least 3, got ${results.topMatches?.length || 0}`
          );
        }

        // Verify distance ordering
        for (let i = 1; i < results.matches.length; i++) {
          if (results.matches[i].distance < results.matches[i - 1].distance) {
            throw new Error('Matches not properly ordered by distance');
          }
        }

        return {
          totalMatches: results.matches.length,
          topMatches: results.topMatches.length,
          topArchetype: results.topMatches[0].archetype.name,
          topConfidence: results.topMatches[0].confidence,
        };
      })
    );

    // Test 3: Confidence Gap Analysis
    tests.push(
      await this.runTest('Confidence Gap Analysis', async () => {
        const testScores: ScoreData = { logical: 10, emotional: 2, exploratory: 3 };
        const results = generateArchetypeResults(testScores);
        const confidenceGap = calculateConfidenceGap(results.topMatches);

        if (!confidenceGap.primaryArchetype) {
          throw new Error('Primary archetype not identified');
        }

        if (!['largeGap', 'mediumGap', 'smallGap'].includes(confidenceGap.gapType)) {
          throw new Error(`Invalid gap type: ${confidenceGap.gapType}`);
        }

        return confidenceGap;
      })
    );

    // Test 4: Tie Detection
    tests.push(
      await this.runTest('Distance Tie Detection', async () => {
        const testCases = [
          { d1: 3.1, d2: 3.2, threshold: 1, expected: true },
          { d1: 3.1, d2: 4.5, threshold: 1, expected: false },
          { d1: 5.0, d2: 5.0, threshold: 1, expected: true },
        ];

        for (const testCase of testCases) {
          const result = areDistancesTied(testCase.d1, testCase.d2, testCase.threshold);
          if (result !== testCase.expected) {
            throw new Error(`Tie detection failed for distances ${testCase.d1} and ${testCase.d2}`);
          }
        }

        return { testsPassed: testCases.length };
      })
    );

    // Test 5: Detailed Score Analysis
    tests.push(
      await this.runTest('Detailed Score Analysis', async () => {
        const testScores: ScoreData = { logical: 12, emotional: 4, exploratory: 6 };
        const analysis = getDetailedScoreAnalysis(testScores);

        if (!Array.isArray(analysis) || analysis.length === 0) {
          throw new Error('Detailed analysis failed to generate results');
        }

        // Verify analysis structure
        const firstResult = analysis[0];
        const requiredFields = [
          'archetypeId',
          'name',
          'distance',
          'confidence',
          'targetScores',
          'scoreDifferences',
        ];

        for (const field of requiredFields) {
          if (!(field in firstResult)) {
            throw new Error(`Missing field in analysis: ${field}`);
          }
        }

        return { analysisCount: analysis.length, topResult: firstResult.name };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);
    const coverage = Math.round((tests.length / 5) * 100);

    return {
      name: 'Mathematical Proximity Engine',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
      coverage,
    };
  }

  /**
   * Phase 3: Validate Persona Selection System
   */
  private async validatePersonaSelectionPhase(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    console.log('👥 Validating Persona Selection System...');

    // Test 1: Persona Selection Setup
    tests.push(
      await this.runTest('Persona Selection Setup', async () => {
        const validation = validatePersonaSelectionSetup();

        if (!validation.isValid) {
          throw new Error(`Persona setup invalid: ${validation.errors.join(', ')}`);
        }

        return validation;
      })
    );

    // Test 2: Distribution Rules
    tests.push(
      await this.runTest('Distribution Rules', async () => {
        const gapTypes = ['largeGap', 'mediumGap', 'smallGap'] as const;
        const distributions: Record<string, any> = {};

        for (const gapType of gapTypes) {
          const distribution = getPersonaDistribution(gapType);

          if (!distribution || distribution.total < 3 || distribution.total > 8) {
            throw new Error(`Invalid distribution for ${gapType}: ${JSON.stringify(distribution)}`);
          }

          distributions[gapType] = distribution;
        }

        return distributions;
      })
    );

    // Test 3: Vulnerability Mapping
    tests.push(
      await this.runTest('Vulnerability Mapping', async () => {
        const testArchetypes = ['intellectual', 'achiever', 'leader', 'explorer'];
        let mappingsFound = 0;

        for (const archetypeId of testArchetypes) {
          const vulnerabilities = getArchetypeVulnerabilities(archetypeId);
          if (Array.isArray(vulnerabilities)) {
            mappingsFound++;
          }
        }

        return { mappingsFound, totalTested: testArchetypes.length };
      })
    );

    // Test 4: Persona Selection Algorithm
    tests.push(
      await this.runTest('Persona Selection Algorithm', async () => {
        const testScores: ScoreData = { logical: 9, emotional: 5, exploratory: 4 };
        const archetypeResults = generateArchetypeResults(testScores);
        const confidenceGap = calculateConfidenceGap(archetypeResults.topMatches);

        const personaSelection = selectPersonasForUser(
          archetypeResults.topMatches,
          confidenceGap.gap,
          confidenceGap.gapType
        );

        if (!personaSelection.selectedPersonas || personaSelection.selectedPersonas.length < 3) {
          throw new Error(
            `Insufficient personas selected: ${personaSelection.selectedPersonas?.length || 0}`
          );
        }

        if (personaSelection.selectedPersonas.length > 8) {
          throw new Error(
            `Too many personas selected: ${personaSelection.selectedPersonas.length}`
          );
        }

        return {
          selectedCount: personaSelection.selectedPersonas.length,
          primaryArchetype: personaSelection.primaryArchetype.archetype.name,
          confidenceGap: personaSelection.confidenceGap,
        };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);
    const coverage = Math.round((tests.length / 4) * 100);

    return {
      name: 'Persona Selection System',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
      coverage,
    };
  }

  /**
   * Phase 4: Validate Vulnerability Pipeline
   */
  private async validateVulnerabilityPipeline(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    console.log('🛡️ Validating Vulnerability Assessment Pipeline...');

    // Test 1: Vulnerability Assessment Generation
    tests.push(
      await this.runTest('Vulnerability Assessment Generation', async () => {
        const testScores: ScoreData = { logical: 7, emotional: 8, exploratory: 5 };
        const archetypeResults = generateArchetypeResults(testScores);

        const vulnerabilityAssessment = generateVulnerabilityAssessment(archetypeResults);

        if (!vulnerabilityAssessment.personaSelection) {
          throw new Error('Persona selection missing from vulnerability assessment');
        }

        if (!vulnerabilityAssessment.educationalContent) {
          throw new Error('Educational content missing from vulnerability assessment');
        }

        if (!vulnerabilityAssessment.riskProfile) {
          throw new Error('Risk profile missing from vulnerability assessment');
        }

        return {
          personaCount: vulnerabilityAssessment.personaSelection.selectedPersonas.length,
          hasEducationalContent: !!vulnerabilityAssessment.educationalContent,
          riskLevel: vulnerabilityAssessment.riskProfile.overallRiskLevel,
        };
      })
    );

    // Test 2: Risk Level Calculation
    tests.push(
      await this.runTest('Risk Level Calculation', async () => {
        const testScores: ScoreData = { logical: 6, emotional: 9, exploratory: 3 };
        const archetypeResults = generateArchetypeResults(testScores);
        const confidenceGap = calculateConfidenceGap(archetypeResults.topMatches);

        const personaSelection = selectPersonasForUser(
          archetypeResults.topMatches,
          confidenceGap.gap,
          confidenceGap.gapType
        );

        const riskLevel = calculateOverallRiskLevel(personaSelection);

        if (!['high', 'medium', 'low'].includes(riskLevel)) {
          throw new Error(`Invalid risk level: ${riskLevel}`);
        }

        return { riskLevel };
      })
    );

    // Test 3: Risk Profile Generation
    tests.push(
      await this.runTest('Risk Profile Generation', async () => {
        const testScores: ScoreData = { logical: 8, emotional: 6, exploratory: 7 };
        const archetypeResults = generateArchetypeResults(testScores);
        const confidenceGap = calculateConfidenceGap(archetypeResults.topMatches);

        const personaSelection = selectPersonasForUser(
          archetypeResults.topMatches,
          confidenceGap.gap,
          confidenceGap.gapType
        );

        const riskProfile = generateRiskProfile(personaSelection, archetypeResults);

        if (!riskProfile.vulnerabilityFactors || !Array.isArray(riskProfile.vulnerabilityFactors)) {
          throw new Error('Vulnerability factors missing or invalid');
        }

        if (!riskProfile.protectiveFactors || !Array.isArray(riskProfile.protectiveFactors)) {
          throw new Error('Protective factors missing or invalid');
        }

        if (typeof riskProfile.riskScore !== 'number' || riskProfile.riskScore < 0) {
          throw new Error(`Invalid risk score: ${riskProfile.riskScore}`);
        }

        return {
          vulnerabilityFactors: riskProfile.vulnerabilityFactors.length,
          protectiveFactors: riskProfile.protectiveFactors.length,
          riskScore: riskProfile.riskScore,
          overallRiskLevel: riskProfile.overallRiskLevel,
        };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);
    const coverage = Math.round((tests.length / 3) * 100);

    return {
      name: 'Vulnerability Assessment Pipeline',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
      coverage,
    };
  }

  /**
   * Phase 5: Integration Testing
   */
  private async validateIntegrationPhase(): Promise<PhaseValidationResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    console.log('🔗 Validating System Integration...');

    // Test 1: Complete Assessment Pipeline
    tests.push(
      await this.runTest('Complete Assessment Pipeline', async () => {
        const testAnswers: ExtendedUserAnswer[] = [
          {
            scenarioId: 1,
            selectedOption: {
              letter: 'a',
              text: 'Test Answer 1',
              scores: { emotional: 2, logical: 3, exploratory: 1 },
              next: 2,
            },
            timestamp: new Date(),
          },
          {
            scenarioId: 2,
            selectedOption: {
              letter: 'b',
              text: 'Test Answer 2',
              scores: { emotional: 1, logical: 2, exploratory: 3 },
              next: 3,
            },
            timestamp: new Date(),
          },
          {
            scenarioId: 3,
            selectedOption: {
              letter: 'c',
              text: 'Test Answer 3',
              scores: { emotional: 3, logical: 1, exploratory: 2 },
              next: null,
            },
            timestamp: new Date(),
          },
        ];

        const startTime = new Date();
        const userData = { name: 'Integration Test User', email: 'test@example.com' };

        const completeResults = generateCompleteAssessmentResults(testAnswers, startTime, userData);

        if (!completeResults.userScores) {
          throw new Error('User scores missing from complete results');
        }

        if (!completeResults.archetypeResults) {
          throw new Error('Archetype results missing from complete results');
        }

        if (!completeResults.personaSelection) {
          throw new Error('Persona selection missing from complete results');
        }

        return {
          totalScores:
            completeResults.userScores.emotional +
            completeResults.userScores.logical +
            completeResults.userScores.exploratory,
          topArchetype: completeResults.archetypeResults.topMatches[0]?.archetype.name,
          assessmentDuration: completeResults.assessmentDuration,
        };
      })
    );

    // Test 2: Results Display Formatting
    tests.push(
      await this.runTest('Results Display Formatting', async () => {
        const testScores: ScoreData = { logical: 9, emotional: 6, exploratory: 4 };
        const archetypeResults = generateArchetypeResults(testScores);

        const displayResults = formatArchetypeResultsForDisplay(archetypeResults);

        if (!displayResults.topMatches || displayResults.topMatches.length === 0) {
          throw new Error('No top matches in display results');
        }

        if (!displayResults.confidenceRange) {
          throw new Error('Confidence range missing from display results');
        }

        return {
          displayCount: displayResults.displayCount,
          hasties: displayResults.hasties,
          confidenceRange: displayResults.confidenceRange,
        };
      })
    );

    // Test 3: Error Handling
    tests.push(
      await this.runTest('Error Handling', async () => {
        let errorsHandledCorrectly = 0;
        const totalErrorTests = 3;

        // Test 1: Empty user answers
        try {
          const emptyAnswers: ExtendedUserAnswer[] = [];
          const scores = calculateExtendedScores(emptyAnswers);
          if (scores.emotional === 0 && scores.logical === 0 && scores.exploratory === 0) {
            errorsHandledCorrectly++;
          }
        } catch (error) {
          // Should not throw for empty answers
        }

        // Test 2: Invalid scenario ID
        try {
          const invalidScenario = getExtendedScenarioById(999);
          if (invalidScenario === undefined) {
            errorsHandledCorrectly++; // Should return undefined for invalid ID
          }
        } catch (error) {
          // Should not throw for invalid ID
        }

        // Test 3: Malformed scores
        try {
          const malformedScores: ScoreData = { emotional: -1, logical: 100, exploratory: -5 };
          const results = generateArchetypeResults(malformedScores);
          if (results.matches.length > 0) {
            errorsHandledCorrectly++; // Should still produce results
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

    // Test 4: Performance Test
    tests.push(
      await this.runTest('Performance Test', async () => {
        const iterations = 50;
        const startTime = Date.now();
        let successfulRuns = 0;

        for (let i = 0; i < iterations; i++) {
          try {
            const testAnswers = this.generateRandomTestAnswers(5);
            const scores = calculateExtendedScores(testAnswers);
            const results = generateArchetypeResults(scores);
            const vulnerability = generateVulnerabilityAssessment(results);

            if (vulnerability.personaSelection.selectedPersonas.length > 0) {
              successfulRuns++;
            }
          } catch (error) {
            // Count failed runs
          }
        }

        const endTime = Date.now();
        const avgTime = (endTime - startTime) / iterations;
        const successRate = successfulRuns / iterations;

        if (successRate < 0.95) {
          // 95% success rate minimum
          throw new Error(`Performance test failed: ${successRate * 100}% success rate`);
        }

        if (avgTime > 100) {
          // Should complete within 100ms on average
          throw new Error(`Performance test failed: ${avgTime}ms average time`);
        }

        return {
          iterations,
          successfulRuns,
          successRate,
          avgTime,
        };
      })
    );

    const duration = Date.now() - startTime;
    const passedTests = tests.filter(t => t.status === 'pass').length;
    const score = Math.round((passedTests / tests.length) * 100);
    const coverage = Math.round((tests.length / 4) * 100);

    return {
      name: 'System Integration',
      isValid: tests.every(t => t.status !== 'fail'),
      score,
      tests,
      duration,
      coverage,
    };
  }

  /**
   * Calculate performance metrics
   */
  private async calculatePerformanceMetrics(): Promise<{
    averageProcessingTime: number;
    memoryUsage: number;
    successRate: number;
  }> {
    const iterations = 25;
    const startTime = Date.now();
    let successfulRuns = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const testAnswers = this.generateRandomTestAnswers(Math.floor(Math.random() * 8) + 3);
        const startTestTime = new Date();
        const userData = { name: `Performance Test ${i}` };

        const results = generateCompleteAssessmentResults(testAnswers, startTestTime, userData);
        const vulnerability = generateVulnerabilityAssessment(results.archetypeResults);

        if (vulnerability.personaSelection.selectedPersonas.length > 0) {
          successfulRuns++;
        }
      } catch (error) {
        // Count as failed run
      }
    }

    const endTime = Date.now();
    const averageProcessingTime = (endTime - startTime) / iterations;
    const successRate = successfulRuns / iterations;

    // Memory usage (approximation)
    const memoryUsage = process.memoryUsage ? process.memoryUsage().heapUsed / 1024 / 1024 : 0;

    return {
      averageProcessingTime,
      memoryUsage,
      successRate,
    };
  }

  /**
   * Generate random test answers for performance testing
   */
  private generateRandomTestAnswers(count: number): ExtendedUserAnswer[] {
    return Array.from({ length: count }, (_, i) => ({
      scenarioId: i + 1,
      selectedOption: {
        letter: String.fromCharCode(97 + Math.floor(Math.random() * 3)), // a, b, or c
        text: `Random answer ${i + 1}`,
        scores: {
          emotional: Math.floor(Math.random() * 4),
          logical: Math.floor(Math.random() * 4),
          exploratory: Math.floor(Math.random() * 4),
        },
        next: i < count - 1 ? i + 2 : null,
      },
      timestamp: new Date(),
    }));
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
      const isWarning =
        errorMessage.includes('warning') ||
        errorMessage.includes('deprecated') ||
        errorMessage.includes('performance');

      return {
        name,
        status: isWarning ? 'warning' : 'fail',
        message: errorMessage,
        duration,
      };
    }
  }

  /**
   * Generate overall system summary
   */
  private generateSummary(score: number, isValid: boolean): string {
    if (score >= 95 && isValid) {
      return '🎉 Excellent! System is production-ready with outstanding performance.';
    }
    if (score >= 85 && isValid) {
      return '✅ Great! System is ready for production with minor optimizations needed.';
    }
    if (score >= 75) {
      return '👍 Good! System is functional but needs some improvements before production.';
    }
    if (score >= 60) {
      return '⚠️ Fair! System has significant issues that need addressing.';
    }
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
        failedTests.forEach(test => {
          recommendations.push(`  - ${test.name}: ${test.message}`);
        });
      }

      if (warningTests.length > 0) {
        recommendations.push(`${phase.name}: Address ${warningTests.length} warning(s)`);
      }

      if (phase.score < 90) {
        recommendations.push(
          `${phase.name}: Consider performance optimizations (Current: ${phase.score}%)`
        );
      }

      if (phase.coverage < 100) {
        recommendations.push(`${phase.name}: Increase test coverage (Current: ${phase.coverage}%)`);
      }
    });

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('🎯 System is performing excellently!');
      recommendations.push('📈 Consider adding more comprehensive edge case testing');
      recommendations.push('🚀 Monitor performance metrics in production environment');
      recommendations.push('🔄 Set up automated testing pipeline for continuous validation');
    } else {
      recommendations.push('🔧 Run system validation regularly during development');
      recommendations.push('📊 Monitor performance metrics after implementing fixes');
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
        criticalIssues.push(`${phase.name} → ${test.name}: ${test.message}`);
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
        warnings.push(`${phase.name} → ${test.name}: ${test.message}`);
      });

      // Add performance warnings
      if (phase.duration > 5000) {
        warnings.push(`${phase.name}: Slow execution time (${phase.duration}ms)`);
      }

      // Add coverage warnings
      if (phase.coverage < 80) {
        warnings.push(`${phase.name}: Low test coverage (${phase.coverage}%)`);
      }
    });

    return warnings;
  }
}

// ==========================================================================
// QUICK VALIDATION UTILITIES
// ==========================================================================

/**
 * Quick system health check for rapid validation
 */
export async function quickHealthCheck(): Promise<{
  isHealthy: boolean;
  score: number;
  issues: string[];
  summary: string;
  duration: number;
}> {
  const startTime = Date.now();
  const issues: string[] = [];
  let score = 100;

  try {
    // Test 1: Basic score calculation
    const testAnswers: ExtendedUserAnswer[] = [
      {
        scenarioId: 1,
        selectedOption: {
          letter: 'a',
          text: 'Test',
          scores: { emotional: 2, logical: 3, exploratory: 1 },
          next: 2,
        },
        timestamp: new Date(),
      },
      {
        scenarioId: 2,
        selectedOption: {
          letter: 'b',
          text: 'Test',
          scores: { emotional: 1, logical: 1, exploratory: 2 },
          next: null,
        },
        timestamp: new Date(),
      },
    ];

    const scores = calculateExtendedScores(testAnswers);
    if (scores.emotional + scores.logical + scores.exploratory === 0) {
      issues.push('Score calculation system failure');
      score -= 30;
    }

    // Test 2: Archetype matching
    const archetypes = generateArchetypeResults(scores);
    if (archetypes.topMatches.length === 0) {
      issues.push('Archetype matching system failure');
      score -= 30;
    }

    // Test 3: Persona selection
    const vulnerability = generateVulnerabilityAssessment(archetypes);
    if (vulnerability.personaSelection.selectedPersonas.length === 0) {
      issues.push('Persona selection system failure');
      score -= 30;
    }

    // Test 4: Educational content
    if (!vulnerability.educationalContent) {
      issues.push('Educational content generation failure');
      score -= 10;
    }

    // Test 5: Scenario integrity
    const scenarioValidation = validateScenarioIntegrity();
    if (!scenarioValidation.isValid) {
      issues.push('Scenario integrity issues detected');
      score -= 15;
    }

    // Test 6: Persona setup
    const personaValidation = validatePersonaSelectionSetup();
    if (!personaValidation.isValid) {
      issues.push('Persona selection setup issues detected');
      score -= 15;
    }
  } catch (error) {
    issues.push(`System health check crashed: ${error}`);
    score = 0;
  }

  const duration = Date.now() - startTime;
  const isHealthy = issues.length === 0;

  let summary: string;
  if (isHealthy) {
    summary = '✅ System is healthy and ready for use';
  } else if (score >= 70) {
    summary = '⚠️ System has minor issues but is functional';
  } else if (score >= 40) {
    summary = '🔧 System has significant issues requiring attention';
  } else {
    summary = '❌ System has critical failures and is not operational';
  }

  return {
    isHealthy,
    score: Math.max(0, score),
    issues,
    summary,
    duration,
  };
}

/**
 * Validate specific archetype calculation for testing
 */
export function validateArchetypeCalculation(
  userScores: ScoreData,
  expectedTopArchetype?: string
): {
  isValid: boolean;
  actualTopArchetype: string;
  confidence: number;
  distance: number;
  message: string;
} {
  try {
    const results = generateArchetypeResults(userScores);

    if (results.topMatches.length === 0) {
      return {
        isValid: false,
        actualTopArchetype: 'none',
        confidence: 0,
        distance: Infinity,
        message: 'No archetype matches generated',
      };
    }

    const topMatch = results.topMatches[0];
    const isValid = expectedTopArchetype
      ? topMatch.archetype.name.toLowerCase().includes(expectedTopArchetype.toLowerCase())
      : true;

    return {
      isValid,
      actualTopArchetype: topMatch.archetype.name,
      confidence: topMatch.confidence,
      distance: topMatch.distance,
      message: isValid
        ? 'Archetype calculation is working correctly'
        : `Expected ${expectedTopArchetype}, got ${topMatch.archetype.name}`,
    };
  } catch (error) {
    return {
      isValid: false,
      actualTopArchetype: 'error',
      confidence: 0,
      distance: Infinity,
      message: `Archetype calculation failed: ${error}`,
    };
  }
}

/**
 * Run performance benchmark test
 */
export async function runPerformanceBenchmark(iterations = 100): Promise<{
  averageTime: number;
  minTime: number;
  maxTime: number;
  successRate: number;
  throughput: number;
  memoryUsage: number;
}> {
  const times: number[] = [];
  let successfulRuns = 0;
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    const testStart = Date.now();

    try {
      // Generate random test data
      const testAnswers: ExtendedUserAnswer[] = Array.from(
        { length: Math.floor(Math.random() * 8) + 3 },
        (_, j) => ({
          scenarioId: j + 1,
          selectedOption: {
            letter: String.fromCharCode(97 + Math.floor(Math.random() * 3)),
            text: `Test ${j}`,
            scores: {
              emotional: Math.floor(Math.random() * 4),
              logical: Math.floor(Math.random() * 4),
              exploratory: Math.floor(Math.random() * 4),
            },
            next: j < 7 ? j + 2 : null,
          },
          timestamp: new Date(),
        })
      );

      // Run complete pipeline
      const scores = calculateExtendedScores(testAnswers);
      const archetypes = generateArchetypeResults(scores);
      const vulnerability = generateVulnerabilityAssessment(archetypes);

      if (vulnerability.personaSelection.selectedPersonas.length > 0) {
        successfulRuns++;
      }

      const testEnd = Date.now();
      times.push(testEnd - testStart);
    } catch (error) {
      const testEnd = Date.now();
      times.push(testEnd - testStart);
      // Count as failed run
    }
  }

  const totalTime = Date.now() - startTime;
  const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const successRate = successfulRuns / iterations;
  const throughput = iterations / (totalTime / 1000); // operations per second

  // Memory usage (if available)
  const memoryUsage = process.memoryUsage ? process.memoryUsage().heapUsed / 1024 / 1024 : 0;

  return {
    averageTime,
    minTime,
    maxTime,
    successRate,
    throughput,
    memoryUsage,
  };
}

/**
 * Validate system with custom test data
 */
export function validateWithCustomData(
  customAnswers: ExtendedUserAnswer[],
  expectedOutcome?: {
    topArchetype?: string;
    minPersonas?: number;
    maxPersonas?: number;
    expectedRiskLevel?: 'high' | 'medium' | 'low';
  }
): {
  isValid: boolean;
  results: any;
  issues: string[];
  summary: string;
} {
  const issues: string[] = [];

  try {
    // Run complete assessment
    const startTime = new Date();
    const userData = { name: 'Custom Validation User' };

    const completeResults = generateCompleteAssessmentResults(customAnswers, startTime, userData);
    const vulnerability = generateVulnerabilityAssessment(completeResults.archetypeResults);

    // Validate against expected outcomes
    if (expectedOutcome) {
      if (expectedOutcome.topArchetype) {
        const actualTop = completeResults.archetypeResults.topMatches[0]?.archetype.name;
        if (!actualTop.toLowerCase().includes(expectedOutcome.topArchetype.toLowerCase())) {
          issues.push(`Expected top archetype: ${expectedOutcome.topArchetype}, got: ${actualTop}`);
        }
      }

      if (expectedOutcome.minPersonas) {
        const personaCount = vulnerability.personaSelection.selectedPersonas.length;
        if (personaCount < expectedOutcome.minPersonas) {
          issues.push(
            `Expected at least ${expectedOutcome.minPersonas} personas, got: ${personaCount}`
          );
        }
      }

      if (expectedOutcome.maxPersonas) {
        const personaCount = vulnerability.personaSelection.selectedPersonas.length;
        if (personaCount > expectedOutcome.maxPersonas) {
          issues.push(
            `Expected at most ${expectedOutcome.maxPersonas} personas, got: ${personaCount}`
          );
        }
      }

      if (expectedOutcome.expectedRiskLevel) {
        const actualRisk = vulnerability.riskProfile.overallRiskLevel;
        if (actualRisk !== expectedOutcome.expectedRiskLevel) {
          issues.push(
            `Expected risk level: ${expectedOutcome.expectedRiskLevel}, got: ${actualRisk}`
          );
        }
      }
    }

    const isValid = issues.length === 0;
    const summary = isValid
      ? '✅ Custom validation passed successfully'
      : `⚠️ Custom validation found ${issues.length} issue(s)`;

    return {
      isValid,
      results: {
        completeResults,
        vulnerability,
        processingTime: completeResults.assessmentDuration,
      },
      issues,
      summary,
    };
  } catch (error) {
    return {
      isValid: false,
      results: null,
      issues: [`Custom validation failed: ${error}`],
      summary: '❌ Custom validation crashed',
    };
  }
}

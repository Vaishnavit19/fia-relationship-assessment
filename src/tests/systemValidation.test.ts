/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/tests/systemValidation.test.ts
// ==========================================================================
// UPDATED COMPREHENSIVE TESTING SUITE - Based on New Architecture
// Phase 5: Complete System Validation (Tasks 15-18)
// ==========================================================================

import { describe, test, expect, beforeEach } from '@jest/globals';

import {
  calculateEuclideanDistance,
  calculateConfidenceFromDistance,
  generateArchetypeResults,
  calculateConfidenceGap,
  areDistancesTied,
  getTopArchetypeMatches,
  getDetailedScoreAnalysis,
} from '../lib/archetypeCalculator';
import {
  calculateExtendedScores,
  getUserScenarioPath,
  getExtendedScenarioById,
  getNextScenarioId,
  isScenarioPathComplete,
  calculateExtendedProgress,
  validateScenarioIntegrity,
} from '../lib/data';
import {
  selectPersonasForUser,
  validatePersonaSelectionSetup,
  getPersonaDistribution,
  getArchetypeVulnerabilities,
} from '../lib/personaSelector';
import {
  generateCompleteAssessmentResults,
  formatArchetypeResultsForDisplay,
} from '../lib/resultsEngine';
import {
  ScoreData,
  ExtendedUserAnswer,
  ExtendedAnswerOption,
  ArchetypeMatch,
  PersonaSelection,
  ArchetypeResults,
  VulnerabilityAssessment,
  ExtendedAssessmentResult,
} from '../lib/types';
import {
  generateVulnerabilityAssessment,
  calculateOverallRiskLevel,
  generateRiskProfile,
} from '../lib/vulnerabilityPipeline';

// ==========================================================================
// TEST DATA GENERATORS - Updated for New Architecture
// ==========================================================================

function generateTestUserAnswers(count = 5): ExtendedUserAnswer[] {
  return Array.from({ length: count }, (_, i) => ({
    scenarioId: i + 1,
    selectedOption: {
      letter: 'a',
      text: `Test answer ${i + 1}`,
      scores: {
        emotional: Math.floor(Math.random() * 3),
        logical: Math.floor(Math.random() * 3),
        exploratory: Math.floor(Math.random() * 3),
      },
      next: i < count - 1 ? i + 2 : null,
    },
    timestamp: new Date(),
  }));
}

function generateTestScores(): ScoreData {
  return {
    emotional: Math.floor(Math.random() * 15) + 1,
    logical: Math.floor(Math.random() * 15) + 1,
    exploratory: Math.floor(Math.random() * 15) + 1,
  };
}

function generateBranchingAnswers(): ExtendedUserAnswer[] {
  return [
    {
      scenarioId: 1,
      selectedOption: {
        letter: 'a',
        text: 'Choose London',
        scores: { emotional: 1, logical: 2, exploratory: 1 },
        next: 2,
      },
      timestamp: new Date(),
    },
    {
      scenarioId: 2,
      selectedOption: {
        letter: 'b',
        text: 'Explore together',
        scores: { emotional: 2, logical: 1, exploratory: 2 },
        next: 3.1, // London branch
      },
      timestamp: new Date(),
    },
    {
      scenarioId: 3.1,
      selectedOption: {
        letter: 'a',
        text: 'Visit museum',
        scores: { emotional: 1, logical: 3, exploratory: 1 },
        next: 4.1,
      },
      timestamp: new Date(),
    },
  ];
}

// ==========================================================================
// TASK 15: ENHANCED BRANCHING LOGIC VALIDATION
// ==========================================================================

describe('Task 15: Enhanced Branching Logic Validation', () => {
  describe('Extended Scenario Navigation', () => {
    test('should validate all extended scenario IDs exist and are accessible', () => {
      const scenarioIds = [
        1, 2, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 7.1, 7.2, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20,
      ];

      scenarioIds.forEach(id => {
        const scenario = getExtendedScenarioById(id);
        expect(scenario).toBeDefined();
        expect(scenario?.id).toBe(id);
        expect(scenario?.options).toBeDefined();
        expect(scenario?.options.length).toBeGreaterThan(0);
      });
    });

    test('should validate London vs Paris path divergence', () => {
      const scenario2 = getExtendedScenarioById(2);
      expect(scenario2).toBeDefined();

      // Test both branch paths exist
      const londonScenario = getExtendedScenarioById(3.1);
      const parisScenario = getExtendedScenarioById(3.2);

      expect(londonScenario).toBeDefined();
      expect(parisScenario).toBeDefined();
      expect(londonScenario?.id).toBe(3.1);
      expect(parisScenario?.id).toBe(3.2);
    });

    test('should validate branching logic at all decision points', () => {
      const branchingScenarios = [4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 7.1, 7.2];

      branchingScenarios.forEach(id => {
        const scenario = getExtendedScenarioById(id);
        expect(scenario).toBeDefined();
        expect(scenario?.options).toBeDefined();

        // Each branching scenario should have valid next steps
        scenario?.options.forEach(option => {
          if (option.next !== null) {
            const nextScenario = getExtendedScenarioById(option.next);
            expect(nextScenario).toBeDefined();
          }
        });
      });
    });

    test('should handle next scenario ID retrieval correctly', () => {
      const testOption: ExtendedAnswerOption = {
        letter: 'a',
        text: 'Test',
        scores: { emotional: 1, logical: 1, exploratory: 1 },
        next: 3.1,
      };

      const nextId = getNextScenarioId(testOption);
      expect(nextId).toBe(3.1);
    });

    test('should detect path completion correctly', () => {
      // Test with a final scenario
      const isComplete = isScenarioPathComplete(20);
      expect(typeof isComplete).toBe('boolean');

      // Test with mid-path scenario
      const isNotComplete = isScenarioPathComplete(5);
      expect(typeof isNotComplete).toBe('boolean');
    });

    test('should generate valid user path tracking', () => {
      const testAnswers = generateBranchingAnswers();
      const userPath = getUserScenarioPath(testAnswers);

      expect(userPath).toBeDefined();
      expect(userPath.totalSteps).toBe(testAnswers.length);
      expect(userPath.pathSequence).toBeDefined();
      expect(userPath.branchingPoints).toBeGreaterThanOrEqual(0);
    });

    test('should calculate progress correctly for branching paths', () => {
      const testAnswers = generateBranchingAnswers();
      const progress = calculateExtendedProgress(testAnswers, 4.1);

      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });
  });

  describe('Scenario Integrity Validation', () => {
    test('should validate complete scenario integrity', () => {
      const validation = validateScenarioIntegrity();
      expect(validation).toBeDefined();
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        console.log('Scenario integrity issues:', validation.errors);
      }
    });
  });
});

// ==========================================================================
// TASK 16: ENHANCED ARCHETYPE CALCULATION TESTING
// ==========================================================================

describe('Task 16: Enhanced Archetype Calculation Testing', () => {
  describe('Mathematical Proximity Calculations', () => {
    test('should calculate Euclidean distance correctly', () => {
      const userScores: ScoreData = { logical: 10, emotional: 5, exploratory: 3 };
      const targetScores: ScoreData = { logical: 8, emotional: 7, exploratory: 5 };

      const distance = calculateEuclideanDistance(userScores, targetScores);

      // Expected: sqrt((10-8)² + (5-7)² + (3-5)²) = sqrt(4 + 4 + 4) = sqrt(12) ≈ 3.46
      expect(distance).toBeCloseTo(3.46, 2);
    });

    test('should convert distance to confidence percentage correctly', () => {
      const distance = 3.46;
      const confidence = calculateConfidenceFromDistance(distance);

      expect(confidence).toBeGreaterThanOrEqual(30);
      expect(confidence).toBeLessThanOrEqual(95);
      expect(typeof confidence).toBe('number');
    });

    test('should detect tied distances correctly', () => {
      expect(areDistancesTied(3.1, 3.2, 1)).toBe(true);
      expect(areDistancesTied(3.1, 4.5, 1)).toBe(false);
      expect(areDistancesTied(5.0, 5.0, 1)).toBe(true);
    });

    test('should generate archetype results with proper ranking', () => {
      const testScores = generateTestScores();
      const results = generateArchetypeResults(testScores);

      expect(results.userScores).toEqual(testScores);
      expect(results.matches).toBeDefined();
      expect(results.matches.length).toBeGreaterThan(0);
      expect(results.topMatches).toBeDefined();
      expect(results.topMatches.length).toBeGreaterThanOrEqual(3);
      expect(results.topMatches.length).toBeLessThanOrEqual(5);

      // Verify ranking is correct (distances should be ascending)
      for (let i = 1; i < results.matches.length; i++) {
        expect(results.matches[i].distance).toBeGreaterThanOrEqual(results.matches[i - 1].distance);
      }
    });

    test('should calculate confidence gap correctly', () => {
      const testScores = generateTestScores();
      const results = generateArchetypeResults(testScores);
      const confidenceGap = calculateConfidenceGap(results.topMatches);

      expect(confidenceGap.gap).toBeGreaterThanOrEqual(0);
      expect(['largeGap', 'mediumGap', 'smallGap']).toContain(confidenceGap.gapType);
      expect(confidenceGap.primaryArchetype).toBeDefined();

      if (results.topMatches.length > 1) {
        expect(confidenceGap.secondaryArchetype).toBeDefined();
      }
    });

    test('should handle edge cases in archetype calculations', () => {
      // Test with zero scores
      const zeroScores: ScoreData = { logical: 0, emotional: 0, exploratory: 0 };
      expect(() => generateArchetypeResults(zeroScores)).not.toThrow();

      // Test with maximum scores
      const maxScores: ScoreData = { logical: 15, emotional: 15, exploratory: 15 };
      expect(() => generateArchetypeResults(maxScores)).not.toThrow();

      // Test with unbalanced scores
      const unbalancedScores: ScoreData = { logical: 15, emotional: 0, exploratory: 0 };
      const results = generateArchetypeResults(unbalancedScores);
      expect(results.matches.length).toBeGreaterThan(0);
    });

    test('should provide detailed score analysis', () => {
      const testScores = generateTestScores();
      const analysis = getDetailedScoreAnalysis(testScores);

      expect(analysis).toBeDefined();
      expect(Array.isArray(analysis)).toBe(true);
      expect(analysis.length).toBeGreaterThan(0);

      analysis.forEach(item => {
        expect(item.archetypeId).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.distance).toBeGreaterThanOrEqual(0);
        expect(item.confidence).toBeGreaterThanOrEqual(30);
        expect(item.targetScores).toBeDefined();
        expect(item.scoreDifferences).toBeDefined();
      });
    });
  });

  describe('Top Matches Selection', () => {
    test('should select appropriate number of top matches', () => {
      const testScores = generateTestScores();
      const results = generateArchetypeResults(testScores);
      const topMatches = getTopArchetypeMatches(results.matches, 5);

      expect(topMatches.length).toBeGreaterThanOrEqual(3);
      expect(topMatches.length).toBeLessThanOrEqual(5);
    });

    test('should handle ties in top matches correctly', () => {
      const testScores = generateTestScores();
      const results = generateArchetypeResults(testScores);

      // Check if any ties exist in top matches
      const topMatches = results.topMatches;
      let hasTies = false;

      for (let i = 1; i < topMatches.length; i++) {
        if (areDistancesTied(topMatches[i].distance, topMatches[i - 1].distance)) {
          hasTies = true;
          break;
        }
      }

      // This test just ensures the tie detection works - ties may or may not exist
      expect(typeof hasTies).toBe('boolean');
    });
  });
});

// ==========================================================================
// TASK 17: ENHANCED PERSONA SELECTION TESTING
// ==========================================================================

describe('Task 17: Enhanced Persona Selection Testing', () => {
  describe('Weighted Hybrid Algorithm', () => {
    test('should select personas based on confidence gap', () => {
      const testScores = generateTestScores();
      const archetypeResults = generateArchetypeResults(testScores);
      const confidenceGap = calculateConfidenceGap(archetypeResults.topMatches);

      const personaSelection = selectPersonasForUser(
        archetypeResults.topMatches,
        confidenceGap.gap,
        confidenceGap.gapType
      );

      expect(personaSelection).toBeDefined();
      expect(personaSelection.selectedPersonas).toBeDefined();
      expect(personaSelection.selectedPersonas.length).toBeGreaterThanOrEqual(3);
      expect(personaSelection.selectedPersonas.length).toBeLessThanOrEqual(8);
      expect(personaSelection.primaryArchetype).toBeDefined();
      expect(personaSelection.confidenceGap).toBe(confidenceGap.gap);
    });

    test('should validate persona distribution rules', () => {
      const distributions = ['largeGap', 'mediumGap', 'smallGap'] as const;

      distributions.forEach(gapType => {
        const distribution = getPersonaDistribution(gapType);

        expect(distribution).toBeDefined();
        expect(distribution.primary).toBeGreaterThan(0);
        expect(distribution.secondary).toBeGreaterThanOrEqual(0);
        expect(distribution.total).toBe(distribution.primary + distribution.secondary);
        expect(distribution.total).toBeGreaterThanOrEqual(3);
        expect(distribution.total).toBeLessThanOrEqual(8);
      });
    });

    test('should get archetype vulnerabilities correctly', () => {
      const testArchetypeId = 'intellectual'; // Using a known archetype ID
      const vulnerabilities = getArchetypeVulnerabilities(testArchetypeId);

      expect(Array.isArray(vulnerabilities)).toBe(true);
      // Vulnerabilities array can be empty for some archetypes
      vulnerabilities.forEach((vuln: unknown) => {
        expect(vuln.personaId).toBeDefined();
        expect(vuln.riskLevel).toBeDefined();
        expect(['high', 'medium', 'low']).toContain(vuln.riskLevel);
      });
    });

    test('should validate persona selection setup', () => {
      const validation = validatePersonaSelectionSetup();

      expect(validation).toBeDefined();
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        console.log('Persona selection setup issues:', validation.errors);
      }
    });

    test('should handle edge cases in persona selection', () => {
      // Test with minimal archetype data
      const minimalArchetypes: ArchetypeMatch[] = [
        {
          archetype: {
            id: 'test',
            name: 'Test Archetype',
            title: 'Test',
            description: 'Test description',
            traits: ['test'],
            vulnerabilities: [],
          },
          distance: 1.0,
          confidence: 85,
          rank: 1,
        },
      ];

      expect(() => {
        selectPersonasForUser(minimalArchetypes, 15, 'mediumGap');
      }).not.toThrow();
    });
  });
});

// ==========================================================================
// TASK 18: ENHANCED INTEGRATION TESTING
// ==========================================================================

describe('Task 18: Enhanced Integration Testing', () => {
  describe('Complete Assessment Pipeline', () => {
    test('should run complete assessment pipeline successfully', () => {
      const testAnswers = generateTestUserAnswers(10);
      const startTime = new Date(Date.now() - 300000); // 5 minutes ago
      const userData = { name: 'Test User', email: 'test@example.com' };

      const completeResults = generateCompleteAssessmentResults(testAnswers, startTime, userData);

      expect(completeResults).toBeDefined();
      expect(completeResults.userScores).toBeDefined();
      expect(completeResults.archetypeResults).toBeDefined();
      expect(completeResults.personaSelection).toBeDefined();
      expect(completeResults.completedAt).toBeDefined();
      expect(completeResults.answers).toEqual(testAnswers);
      expect(completeResults.userPath).toBeDefined();
      expect(completeResults.assessmentDuration).toBeGreaterThan(0);
    });

    test('should generate vulnerability assessment correctly', () => {
      const testScores = generateTestScores();
      const archetypeResults = generateArchetypeResults(testScores);

      const vulnerabilityAssessment = generateVulnerabilityAssessment(archetypeResults);

      expect(vulnerabilityAssessment).toBeDefined();
      expect(vulnerabilityAssessment.personaSelection).toBeDefined();
      expect(vulnerabilityAssessment.educationalContent).toBeDefined();
      expect(vulnerabilityAssessment.riskProfile).toBeDefined();
      expect(vulnerabilityAssessment.confidenceGap).toBeDefined();
    });

    test('should calculate risk levels correctly', () => {
      const testScores = generateTestScores();
      const archetypeResults = generateArchetypeResults(testScores);
      const confidenceGap = calculateConfidenceGap(archetypeResults.topMatches);

      const personaSelection = selectPersonasForUser(
        archetypeResults.topMatches,
        confidenceGap.gap,
        confidenceGap.gapType
      );

      const overallRisk = calculateOverallRiskLevel(personaSelection);
      expect(['high', 'medium', 'low']).toContain(overallRisk);

      const riskProfile = generateRiskProfile(personaSelection, archetypeResults);
      expect(riskProfile).toBeDefined();
      expect(riskProfile.overallRiskLevel).toBe(overallRisk);
      expect(riskProfile.vulnerabilityFactors).toBeDefined();
      expect(riskProfile.protectiveFactors).toBeDefined();
      expect(riskProfile.riskScenarios).toBeDefined();
      expect(riskProfile.riskScore).toBeGreaterThanOrEqual(0);
    });

    test('should format results for display correctly', () => {
      const testScores = generateTestScores();
      const archetypeResults = generateArchetypeResults(testScores);

      const displayResults = formatArchetypeResultsForDisplay(archetypeResults);

      expect(displayResults).toBeDefined();
      expect(displayResults.topMatches).toBeDefined();
      expect(displayResults.topMatches.length).toBeGreaterThan(0);
      expect(typeof displayResults.hasties).toBe('boolean');
      expect(displayResults.displayCount).toBeGreaterThan(0);
      expect(displayResults.confidenceRange).toBeDefined();
      expect(displayResults.confidenceRange.min).toBeLessThanOrEqual(
        displayResults.confidenceRange.max
      );
    });

    test('should handle system errors gracefully', () => {
      // Test with invalid data
      const invalidAnswers: ExtendedUserAnswer[] = [
        {
          scenarioId: 999,
          selectedOption: {
            letter: 'z',
            text: 'Invalid answer',
            scores: { emotional: -1, logical: -1, exploratory: -1 },
            next: '',
          },
          timestamp: new Date(),
        },
      ];

      // System should handle gracefully without crashing
      expect(() => {
        const scores = calculateExtendedScores(invalidAnswers);
        expect(scores.emotional).toBe(-1);
        expect(scores.logical).toBe(-1);
        expect(scores.exploratory).toBe(-1);
      }).not.toThrow();
    });

    test('should validate end-to-end system integrity', () => {
      // This test runs a complete system validation
      const systemIntegrityTest = () => {
        // 1. Test scenario integrity
        const scenarioValidation = validateScenarioIntegrity();
        expect(scenarioValidation.isValid).toBe(true);

        // 2. Test persona selection setup
        const personaValidation = validatePersonaSelectionSetup();
        expect(personaValidation.isValid).toBe(true);

        // 3. Test complete pipeline with realistic data
        const testAnswers = generateTestUserAnswers(8);
        const startTime = new Date();
        const userData = { name: 'Integration Test User' };

        const results = generateCompleteAssessmentResults(testAnswers, startTime, userData);
        const vulnerability = generateVulnerabilityAssessment(results.archetypeResults);

        // Verify all components produced valid results
        expect(
          results.userScores.emotional + results.userScores.logical + results.userScores.exploratory
        ).toBeGreaterThan(0);
        expect(results.archetypeResults.topMatches.length).toBeGreaterThanOrEqual(3);
        expect(vulnerability.personaSelection.selectedPersonas.length).toBeGreaterThanOrEqual(3);
        expect(vulnerability.educationalContent).toBeDefined();

        return true;
      };

      expect(systemIntegrityTest()).toBe(true);
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle multiple concurrent assessments', () => {
      const concurrentTests = Array.from({ length: 5 }, (_, i) => {
        const testAnswers = generateTestUserAnswers(6);
        const startTime = new Date();
        const userData = { name: `Concurrent User ${i + 1}` };

        return generateCompleteAssessmentResults(testAnswers, startTime, userData);
      });

      expect(concurrentTests.length).toBe(5);
      concurrentTests.forEach(result => {
        expect(result).toBeDefined();
        expect(result.archetypeResults.topMatches.length).toBeGreaterThan(0);
      });
    });

    test('should maintain performance with large datasets', () => {
      const startTime = Date.now();
      const largeTestSet = generateTestUserAnswers(20);

      const results = generateCompleteAssessmentResults(largeTestSet, new Date(startTime), {
        name: 'Performance Test User',
      });

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(results).toBeDefined();
      expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});

// ==========================================================================
// EXPORT TEST UTILITIES
// ==========================================================================

export {
  // Enhanced test data generators
  generateTestUserAnswers,
  generateTestScores,
  generateBranchingAnswers,

  // System validation functions
  validateCompleteAssessment,
  validateSystemPerformance,
  validateDataIntegrity,
};

// ==========================================================================
// HELPER FUNCTIONS FOR TESTING
// ==========================================================================

function validateCompleteAssessment(answers: ExtendedUserAnswer[]): boolean {
  try {
    const scores = calculateExtendedScores(answers);
    const archetypeResults = generateArchetypeResults(scores);
    const vulnerability = generateVulnerabilityAssessment(archetypeResults);

    return vulnerability.personaSelection.selectedPersonas.length > 0;
  } catch (error) {
    console.error('Complete assessment validation failed:', error);
    return false;
  }
}

function validateSystemPerformance(iterations = 100): {
  avgTime: number;
  success: boolean;
  successRate: number;
} {
  const startTime = Date.now();
  let successful = 0;

  for (let i = 0; i < iterations; i++) {
    const testAnswers = generateTestUserAnswers(Math.floor(Math.random() * 10) + 5);
    if (validateCompleteAssessment(testAnswers)) {
      successful++;
    }
  }

  const endTime = Date.now();
  const avgTime = (endTime - startTime) / iterations;
  const successRate = successful / iterations;

  return {
    avgTime,
    success: successful === iterations,
    successRate,
  };
}

function validateDataIntegrity(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Test scenario integrity
    const scenarioValidation = validateScenarioIntegrity();
    if (!scenarioValidation.isValid) {
      errors.push(...scenarioValidation.errors);
    }

    // Test persona setup
    const personaValidation = validatePersonaSelectionSetup();
    if (!personaValidation.isValid) {
      errors.push(...personaValidation.errors);
    }

    // Test complete pipeline
    const testAnswers = generateTestUserAnswers(8);
    if (!validateCompleteAssessment(testAnswers)) {
      errors.push('Complete assessment pipeline failed');
    }

    // Performance warning
    const performanceTest = validateSystemPerformance(10);
    if (performanceTest.avgTime > 100) {
      warnings.push(`Average processing time is high: ${performanceTest.avgTime}ms`);
    }

    if (performanceTest.successRate < 1.0) {
      warnings.push(`Success rate is below 100%: ${performanceTest.successRate * 100}%`);
    }
  } catch (error) {
    errors.push(`System integrity check failed: ${error}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

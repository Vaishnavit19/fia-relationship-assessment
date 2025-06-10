// lib/resultsEngine.ts
// ==========================================================================
// ENHANCED RESULTS GENERATION ENGINE - UPDATED FOR STORE COMPATIBILITY
// ==========================================================================

import {
  generateArchetypeResults,
  calculateConfidenceGap,
  getDetailedScoreAnalysis,
  areDistancesTied,
} from './archetypeCalculator';
import {
  calculateExtendedScores,
  safeCalculateExtendedScores,
  getUserScenarioPath,
  getScenarioStatistics,
} from './data';
import {
  ExtendedUserAnswer,
  ScoreData,
  ArchetypeResults,
  ArchetypeMatch,
  UserPath,
  ExtendedAssessmentResult,
  UserData,
} from './types';

// ==========================================================================
// ENHANCED RESULTS GENERATION ENGINE
// ==========================================================================

/**
 * Generate complete assessment results - Updated for enhanced store compatibility
 */
export const generateCompleteAssessmentResults = (
  answers: ExtendedUserAnswer[],
  startTime: Date,
  userData: UserData
): ExtendedAssessmentResult => {
  const endTime = new Date();
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

  try {
    // Enhanced score calculation with error handling
    const scoreResult = safeCalculateExtendedScores(answers);

    if (scoreResult.errors.length > 0) {
      console.error('Score calculation errors in results engine:', scoreResult.errors);
    }

    const userScores = scoreResult.scores;
    const userPath = getUserScenarioPath(answers);

    // Generate archetype matches using mathematical proximity
    const archetypeResults = generateArchetypeResults(userScores);

    // GUARD CLAUSE: Ensure archetypeResults and topMatches exist
    if (!archetypeResults?.topMatches || archetypeResults.topMatches.length === 0) {
      console.error('generateCompleteAssessmentResults: Invalid archetype results');
      return generateFallbackResults(answers, startTime, endTime, userData);
    }

    const confidenceGapAnalysis = calculateConfidenceGap(archetypeResults.topMatches);

    const result: ExtendedAssessmentResult = {
      userScores,
      archetypeResults,
      personaSelection: {
        selectedPersonas: [],
        selectionReason: confidenceGapAnalysis.gapType,
        confidenceGap: confidenceGapAnalysis.gap,
        primaryArchetype: confidenceGapAnalysis.primaryArchetype,
        secondaryArchetype: confidenceGapAnalysis.secondaryArchetype,
      },
      completedAt: endTime,
      answers,
      userPath,
      assessmentDuration: duration,
    };

    return result;
  } catch (error) {
    console.error('Error in results generation:', error);
    return generateFallbackResults(answers, startTime, endTime, userData);
  }
};

/**
 * Generate enhanced assessment results with vulnerability assessment
 * This is the main function called by the store
 */
export const generateEnhancedAssessmentResults = (
  answers: ExtendedUserAnswer[],
  startTime: Date,
  userData: UserData,
  includeVulnerabilityAssessment = true
): ExtendedAssessmentResult => {
  // Generate base results
  const baseResults = generateCompleteAssessmentResults(answers, startTime, userData);

  // Add vulnerability assessment if requested
  if (includeVulnerabilityAssessment) {
    try {
      // This would be called by the vulnerability pipeline
      // For now, we ensure the base structure is correct
      console.log('Enhanced results generated successfully');
    } catch (error) {
      console.warn('Vulnerability assessment failed, using base results:', error);
    }
  }

  return baseResults;
};

// ==========================================================================
// RESULTS FORMATTING & DISPLAY (UPDATED)
// ==========================================================================

/**
 * Format archetype results for display with proper ranking and tie handling
 */
export const formatArchetypeResultsForDisplay = (
  archetypeResults: ArchetypeResults
): {
  topMatches: ArchetypeMatch[];
  hasTies: boolean;
  displayCount: number;
  confidenceRange: { min: number; max: number };
} => {
  const topMatches = archetypeResults.topMatches;

  // Check for ties in top results
  const hasTies =
    topMatches.length > 1 &&
    topMatches.slice(1).some(match => areDistancesTied(match.distance, topMatches[0].distance));

  // Calculate confidence range
  const confidences = topMatches.map(match => match.confidence);
  const confidenceRange = {
    min: Math.min(...confidences),
    max: Math.max(...confidences),
  };

  return {
    topMatches: topMatches.slice(0, 5), // Show top 5 matches
    hasTies,
    displayCount: Math.min(5, topMatches.length),
    confidenceRange,
  };
};

/**
 * Generate summary statistics for display
 */
export const generateResultsSummary = (
  results: ExtendedAssessmentResult
): {
  totalAnswers: number;
  assessmentTime: string;
  topArchetype: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  pathComplexity: 'simple' | 'moderate' | 'complex';
} => {
  const { answers, assessmentDuration, archetypeResults, userPath } = results;

  // Format assessment time
  const minutes = Math.floor(assessmentDuration / 60);
  const seconds = assessmentDuration % 60;
  const assessmentTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  // Determine confidence level
  const topConfidence = archetypeResults.topMatches[0]?.confidence || 0;
  const confidenceLevel: 'high' | 'medium' | 'low' =
    topConfidence >= 80 ? 'high' : topConfidence >= 60 ? 'medium' : 'low';

  // Determine path complexity
  const pathComplexity: 'simple' | 'moderate' | 'complex' =
    userPath.branchingPoints === 0
      ? 'simple'
      : userPath.branchingPoints <= 2
        ? 'moderate'
        : 'complex';

  return {
    totalAnswers: answers.length,
    assessmentTime,
    topArchetype: archetypeResults.topMatches[0]?.archetype.name || 'Unknown',
    confidenceLevel,
    pathComplexity,
  };
};

/**
 * Generate detailed score breakdown for analysis
 */
export const generateScoreBreakdown = (
  answers: ExtendedUserAnswer[]
): {
  totalScores: ScoreData;
  averageScores: ScoreData;
  scoreDistribution: {
    emotional: { count: number; percentage: number };
    logical: { count: number; percentage: number };
    exploratory: { count: number; percentage: number };
  };
  dominantDimension: 'emotional' | 'logical' | 'exploratory';
} => {
  const totalScores = calculateExtendedScores(answers);
  const totalSum = totalScores.emotional + totalScores.logical + totalScores.exploratory;

  const averageScores: ScoreData = {
    emotional: totalScores.emotional / answers.length,
    logical: totalScores.logical / answers.length,
    exploratory: totalScores.exploratory / answers.length,
  };

  // Count answers that contributed to each dimension
  const emotionalCount = answers.filter(a => a.selectedOption.scores.emotional > 0).length;
  const logicalCount = answers.filter(a => a.selectedOption.scores.logical > 0).length;
  const exploratoryCount = answers.filter(a => a.selectedOption.scores.exploratory > 0).length;

  const scoreDistribution = {
    emotional: {
      count: emotionalCount,
      percentage: Math.round((totalScores.emotional / totalSum) * 100) || 0,
    },
    logical: {
      count: logicalCount,
      percentage: Math.round((totalScores.logical / totalSum) * 100) || 0,
    },
    exploratory: {
      count: exploratoryCount,
      percentage: Math.round((totalScores.exploratory / totalSum) * 100) || 0,
    },
  };

  // Determine dominant dimension
  const dominantDimension: 'emotional' | 'logical' | 'exploratory' =
    totalScores.emotional >= totalScores.logical && totalScores.emotional >= totalScores.exploratory
      ? 'emotional'
      : totalScores.logical >= totalScores.exploratory
        ? 'logical'
        : 'exploratory';

  return {
    totalScores,
    averageScores,
    scoreDistribution,
    dominantDimension,
  };
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Map confidence gap type to persona selection reason format
 */
const mapConfidenceGapToSelectionReason = (
  gapType: 'largeGap' | 'mediumGap' | 'smallGap' | undefined
): 'large_gap' | 'medium_gap' | 'small_gap' => {
  const mapping = {
    largeGap: 'large_gap' as const,
    mediumGap: 'medium_gap' as const,
    smallGap: 'small_gap' as const,
  };

  return mapping[gapType!] || 'small_gap';
};

/**
 * Validate results data integrity
 */
export const validateResultsIntegrity = (
  results: ExtendedAssessmentResult
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!results.userScores) {
    errors.push('Missing user scores in results');
  }

  if (!results.archetypeResults || results.archetypeResults.topMatches.length === 0) {
    errors.push('Missing or empty archetype results');
  }

  if (results.answers.length === 0) {
    errors.push('No answers found in results');
  }

  if (!results.completedAt) {
    warnings.push('Missing completion timestamp');
  }

  // Score validation
  if (results.userScores) {
    const totalScore =
      results.userScores.emotional + results.userScores.logical + results.userScores.exploratory;
    if (totalScore === 0) {
      errors.push('All scores are zero - invalid assessment');
    }
  }

  // Path validation
  if (results.userPath && results.userPath.totalSteps !== results.answers.length) {
    warnings.push('Path steps count does not match answers count');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Generate fallback results when main generation fails
 */
const generateFallbackResults = (
  answers: ExtendedUserAnswer[],
  startTime: Date,
  endTime: Date,
  userData: UserData
): ExtendedAssessmentResult => {
  const fallbackScores: ScoreData = { emotional: 1, logical: 1, exploratory: 1 };

  const fallbackArchetypeResults: ArchetypeResults = {
    userScores: fallbackScores,
    matches: [],
    topMatches: [],
  };

  const fallbackPath: UserPath = {
    totalSteps: answers.length,
    pathSequence: answers.map(answer => ({
      scenarioId: answer.scenarioId,
      nextScenarioId: answer.selectedOption.next,
      timestamp: answer.timestamp,
    })),
    branchingPoints: 0,
  };

  return {
    userScores: fallbackScores,
    archetypeResults: fallbackArchetypeResults,
    personaSelection: {
      selectedPersonas: [],
      selectionReason: 'small_gap',
      confidenceGap: 0,
      primaryArchetype: 'Unknown',
    },
    completedAt: endTime,
    answers,
    userPath: fallbackPath,
    assessmentDuration: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
  };
};

// ==========================================================================
// EXPORT FUNCTIONS FOR BACKWARD COMPATIBILITY
// ==========================================================================

/**
 * Legacy function name for backward compatibility
 * @deprecated Use generateEnhancedAssessmentResults instead
 */
export const generateCompleteResults = generateCompleteAssessmentResults;

/**
 * Export scenario statistics for analysis
 */
export { getScenarioStatistics } from './data';

// lib/resultsEngine.ts
// ==========================================================================
// PHASE 1 STEP 3: COMBINED RESULTS RANKING ALGORITHM (Files 1 + 3)
// ==========================================================================

import {
  generateArchetypeResults,
  calculateConfidenceGap,
  getDetailedScoreAnalysis,
  areDistancesTied,
} from './archetypeCalculator';
import { calculateExtendedScores, getUserScenarioPath, getScenarioStatistics } from './data';
import {
  ExtendedUserAnswer,
  ScoreData,
  ArchetypeResults,
  ArchetypeMatch,
  UserPath,
  ExtendedAssessmentResult,
} from './types';

// ==========================================================================
// COMBINED RESULTS GENERATION ENGINE
// ==========================================================================

/**
 * Generate complete assessment results combining File 1 (scenarios) and File 3 (archetypes)
 */
export const generateCompleteAssessmentResults = (
  answers: ExtendedUserAnswer[],
  startTime: Date,
  userData: { name: string; email?: string }
): ExtendedAssessmentResult => {
  const endTime = new Date();
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

  // File 1: Calculate scores from extended scenarios
  const userScores = calculateExtendedScores(answers);
  const userPath = getUserScenarioPath(answers);

  // File 3: Generate archetype matches using mathematical proximity
  const archetypeResults = generateArchetypeResults(userScores);
  const confidenceGapAnalysis = calculateConfidenceGap(archetypeResults.topMatches);

  return {
    userScores,
    archetypeResults,
    personaSelection: {
      selectedPersonas: [], // Will be populated in Phase 2
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
};

// ==========================================================================
// RESULTS FORMATTING & DISPLAY
// ==========================================================================

/**
 * Format archetype results for display with proper ranking and tie handling
 */
export const formatArchetypeResultsForDisplay = (
  archetypeResults: ArchetypeResults
): {
  topMatches: ArchetypeMatch[];
  hasties: boolean;
  displayCount: number;
  confidenceRange: { min: number; max: number };
} => {
  const topMatches = archetypeResults.topMatches;

  // Check for ties in top results
  const hasties =
    topMatches.length > 1 &&
    topMatches.slice(1).some(match => areDistancesTied(match.distance, topMatches[0].distance));

  // Calculate confidence range
  const confidences = topMatches.map(match => match.confidence);
  const confidenceRange = {
    min: Math.min(...confidences),
    max: Math.max(...confidences),
  };

  return {
    topMatches,
    hasties,
    displayCount: topMatches.length,
    confidenceRange,
  };
};

/**
 * Generate user-friendly archetype summary
 */
export const generateArchetypeSummary = (
  archetypeResults: ArchetypeResults
): {
  primaryArchetype: {
    name: string;
    confidence: number;
    description: string;
    dominantTrait: string;
  };
  secondaryArchetypes: {
    name: string;
    confidence: number;
    description: string;
  }[];
  userProfileSummary: {
    strongestDimension: 'logical' | 'emotional' | 'exploratory';
    dimensionScores: ScoreData;
    personalityBalance: string;
  };
} => {
  const primary = archetypeResults.topMatches[0];
  const secondary = archetypeResults.topMatches.slice(1, 3);

  // Determine user's strongest dimension
  const { userScores } = archetypeResults;
  let strongestDimension: 'logical' | 'emotional' | 'exploratory';

  if (userScores.logical >= userScores.emotional && userScores.logical >= userScores.exploratory) {
    strongestDimension = 'logical';
  } else if (userScores.emotional >= userScores.exploratory) {
    strongestDimension = 'emotional';
  } else {
    strongestDimension = 'exploratory';
  }

  // Generate personality balance description
  const total = userScores.logical + userScores.emotional + userScores.exploratory;
  const logicalPct = Math.round((userScores.logical / total) * 100);
  const emotionalPct = Math.round((userScores.emotional / total) * 100);
  const exploratoryPct = Math.round((userScores.exploratory / total) * 100);

  let personalityBalance: string;

  if (Math.max(logicalPct, emotionalPct, exploratoryPct) > 50) {
    personalityBalance = `Strong ${strongestDimension} focus`;
  } else if (
    Math.abs(logicalPct - emotionalPct) <= 10 &&
    Math.abs(emotionalPct - exploratoryPct) <= 10
  ) {
    personalityBalance = 'Well-balanced across all dimensions';
  } else {
    personalityBalance = `Mixed ${strongestDimension}-leaning personality`;
  }

  return {
    primaryArchetype: {
      name: primary.archetype.name,
      confidence: primary.confidence,
      description: primary.archetype.description,
      dominantTrait: primary.archetype.traits[0] || 'Not specified',
    },
    secondaryArchetypes: secondary.map(match => ({
      name: match.archetype.name,
      confidence: match.confidence,
      description: match.archetype.description,
    })),
    userProfileSummary: {
      strongestDimension,
      dimensionScores: userScores,
      personalityBalance,
    },
  };
};

// ==========================================================================
// RESULTS ANALYTICS & INSIGHTS
// ==========================================================================

/**
 * Generate insights from user's assessment journey
 */
export const generateAssessmentInsights = (
  result: ExtendedAssessmentResult
): {
  journeyInsights: {
    pathComplexity: 'simple' | 'moderate' | 'complex';
    branchingDecisions: number;
    completionTime: string;
    decisiveAnswers: number;
  };
  scoreInsights: {
    dimensionalBalance: string;
    strongestTendency: string;
    uniquePatterns: string[];
  };
  archetypeInsights: {
    confidenceLevel: 'high' | 'medium' | 'low';
    resultClarity: string;
    secondaryTraits: string[];
  };
} => {
  const { userPath, assessmentDuration, userScores, archetypeResults } = result;

  // Journey insights
  const pathComplexity =
    userPath.branchingPoints >= 3
      ? 'complex'
      : userPath.branchingPoints >= 1
        ? 'moderate'
        : 'simple';

  const completionTime =
    assessmentDuration < 120 ? 'Quick' : assessmentDuration < 300 ? 'Thoughtful' : 'Deliberate';

  const decisiveAnswers = result.answers.filter(
    answer => Math.max(...Object.values(answer.selectedOption.scores)) >= 2
  ).length;

  // Score insights
  const total = userScores.logical + userScores.emotional + userScores.exploratory;
  const highest = Math.max(userScores.logical, userScores.emotional, userScores.exploratory);
  const highestPct = (highest / total) * 100;

  const dimensionalBalance =
    highestPct > 60
      ? 'Strongly focused'
      : highestPct > 40
        ? 'Moderately balanced'
        : 'Highly balanced';

  let strongestTendency: string;
  if (userScores.logical === highest) {
    strongestTendency = 'Analytical and planning-oriented';
  } else if (userScores.emotional === highest) {
    strongestTendency = 'Relationship and emotion-focused';
  } else {
    strongestTendency = 'Adventure and exploration-driven';
  }

  const uniquePatterns: string[] = [];
  if (Math.abs(userScores.logical - userScores.emotional) <= 1) {
    uniquePatterns.push('Balance between logic and emotion');
  }
  if (userScores.exploratory > userScores.logical + userScores.emotional) {
    uniquePatterns.push('Strong adventure-seeking tendency');
  }
  if (userScores.logical > 8 && userScores.emotional < 3) {
    uniquePatterns.push('Highly analytical with low emotional prioritization');
  }

  // Archetype insights
  const primaryConfidence = archetypeResults.topMatches[0].confidence;
  const confidenceLevel =
    primaryConfidence >= 80 ? 'high' : primaryConfidence >= 60 ? 'medium' : 'low';

  const confidenceGap =
    archetypeResults.topMatches.length > 1
      ? archetypeResults.topMatches[0].confidence - archetypeResults.topMatches[1].confidence
      : 100;

  const resultClarity =
    confidenceGap > 20
      ? 'Very clear primary archetype'
      : confidenceGap > 10
        ? 'Clear primary with secondary traits'
        : 'Blended personality across multiple archetypes';

  const secondaryTraits = archetypeResults.topMatches
    .slice(1, 3)
    .map(match => match.archetype.traits[0])
    .filter(trait => trait);

  return {
    journeyInsights: {
      pathComplexity,
      branchingDecisions: userPath.branchingPoints,
      completionTime: `${completionTime} (${Math.round(assessmentDuration / 60)} min)`,
      decisiveAnswers,
    },
    scoreInsights: {
      dimensionalBalance,
      strongestTendency,
      uniquePatterns,
    },
    archetypeInsights: {
      confidenceLevel,
      resultClarity,
      secondaryTraits,
    },
  };
};

// ==========================================================================
// VALIDATION & QUALITY CHECKS
// ==========================================================================

/**
 * Validate the quality and completeness of assessment results
 */
export const validateAssessmentResults = (
  result: ExtendedAssessmentResult
): {
  isValid: boolean;
  quality: 'high' | 'medium' | 'low';
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check answer count
  const minAnswers = 8;
  const maxAnswers = 12;
  if (result.answers.length < minAnswers) {
    issues.push(`Too few answers (${result.answers.length}, expected ${minAnswers}+)`);
  }
  if (result.answers.length > maxAnswers) {
    issues.push(`Unexpectedly many answers (${result.answers.length}, expected <${maxAnswers})`);
  }

  // Check score distribution
  const totalScore =
    result.userScores.logical + result.userScores.emotional + result.userScores.exploratory;
  if (totalScore < 8) {
    issues.push('Very low total scores - user may not have engaged meaningfully');
  }

  // Check archetype confidence
  const primaryConfidence = result.archetypeResults.topMatches[0]?.confidence;
  if (primaryConfidence < 40) {
    issues.push('Low confidence in primary archetype match');
    recommendations.push('Consider retaking assessment with more deliberate choices');
  }

  // Check assessment duration
  if (result.assessmentDuration < 60) {
    issues.push('Assessment completed very quickly - may lack thoughtful consideration');
    recommendations.push('Take time to read questions carefully for more accurate results');
  }

  // Check for score patterns that might indicate random clicking
  const scoreVariance =
    Math.max(
      result.userScores.logical,
      result.userScores.emotional,
      result.userScores.exploratory
    ) -
    Math.min(result.userScores.logical, result.userScores.emotional, result.userScores.exploratory);

  if (scoreVariance < 2 && totalScore > 10) {
    issues.push('Unusually balanced scores across all dimensions');
    recommendations.push('Results may indicate indecisive answering patterns');
  }

  // Determine overall quality
  let quality: 'high' | 'medium' | 'low';
  if (issues.length === 0 && primaryConfidence >= 70) {
    quality = 'high';
  } else if (issues.length <= 2 && primaryConfidence >= 50) {
    quality = 'medium';
  } else {
    quality = 'low';
  }

  return {
    isValid: issues.length === 0,
    quality,
    issues,
    recommendations,
  };
};

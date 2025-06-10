// lib/pathTracking.ts
// ==========================================================================
// ENHANCED PATH TRACKING SYSTEM FOR COMPLEX BRANCHING SCENARIOS
// ==========================================================================

import { getExtendedScenarioById } from './data';
import { ExtendedUserAnswer, ExtendedScenario, UserPath } from './types';

// ==========================================================================
// ENHANCED PATH TRACKING TYPES
// ==========================================================================

export interface BranchingPoint {
  scenarioId: number | string;
  selectedOption: string; // A, B, C
  branchType: 'city_choice' | 'delay_response' | 'waiting_choice' | 'linear';
  branchDirection: 'london' | 'paris' | 'wait' | 'go' | 'neutral';
  timestamp: Date;
  alternativePaths: {
    option: string;
    leadsTo: number | string;
    description: string;
  }[];
}

export interface EnhancedUserPath extends UserPath {
  // Enhanced path details
  branchingHistory: BranchingPoint[];
  pathEfficiency: number; // 0-1 scale, higher = more direct
  explorationScore: number; // 0-1 scale, higher = more branching
  uniquePathId: string; // Unique identifier for this specific path

  // Path complexity analysis
  complexity: {
    totalDecisionPoints: number;
    criticalDecisions: number;
    routeChanges: number;
    backtrackingEvents: number;
  };

  // Path prediction and analytics
  predictedEndScenario: number | string;
  estimatedRemainingSteps: number;
  completionProbability: number; // 0-1 scale

  // Educational insights
  pathPersonality: 'methodical' | 'exploratory' | 'decisive' | 'backtracking';
  decisionPattern:
    | 'consistent'
    | 'varied'
    | 'emotional_focused'
    | 'logical_focused'
    | 'exploratory_focused';
}

export interface PathAnalytics {
  // User behavior patterns
  averageTimePerScenario: number;
  hesitationPoints: {
    scenarioId: number | string;
    timeSpent: number;
    reason: string;
  }[];

  // Path comparison
  popularPaths: {
    pathId: string;
    frequency: number;
    description: string;
  }[];

  // Completion insights
  dropOffPoints: {
    scenarioId: number | string;
    frequency: number;
  }[];

  // Educational value
  learningOpportunities: string[];
  missedBranches: {
    scenarioId: number | string;
    alternativeOption: string;
    educationalValue: string;
  }[];
}

// ==========================================================================
// CORE PATH TRACKING FUNCTIONS
// ==========================================================================

/**
 * Generate enhanced user path from answers with detailed branching analysis
 */
export const generateEnhancedUserPath = (
  answers: ExtendedUserAnswer[],
  sessionStartTime: Date
): EnhancedUserPath => {
  const branchingHistory = analyzeBranchingPoints(answers);
  const pathSequence = answers.map(answer => ({
    scenarioId: answer.scenarioId,
    nextScenarioId: answer.selectedOption.next,
    timestamp: answer.timestamp,
  }));

  const complexity = calculatePathComplexity(answers, branchingHistory);
  const efficiency = calculatePathEfficiency(answers);
  const explorationScore = calculateExplorationScore(branchingHistory);
  const uniquePathId = generateUniquePathId(answers);

  const prediction = predictPathCompletion(answers);
  const personality = analyzePathPersonality(answers, branchingHistory);

  return {
    // Base UserPath properties
    totalSteps: answers.length,
    pathSequence,
    branchingPoints: branchingHistory.length,

    // Enhanced properties
    branchingHistory,
    pathEfficiency: efficiency,
    explorationScore,
    uniquePathId,
    complexity,
    predictedEndScenario: prediction.endScenario,
    estimatedRemainingSteps: prediction.remainingSteps,
    completionProbability: prediction.completionProbability,
    pathPersonality: personality.type,
    decisionPattern: personality.pattern,
  };
};

/**
 * Analyze branching points to understand decision-making patterns
 */
export const analyzeBranchingPoints = (answers: ExtendedUserAnswer[]): BranchingPoint[] => {
  const branchingPoints: BranchingPoint[] = [];

  answers.forEach(answer => {
    const scenario = getExtendedScenarioById(answer.scenarioId);
    if (!scenario) return;

    const branchType = identifyBranchType(answer.scenarioId);
    const branchDirection = identifyBranchDirection(
      answer.selectedOption.letter,
      answer.scenarioId
    );

    // Only track actual branching points
    if (branchType !== 'linear') {
      const alternativePaths = scenario.options
        .filter(opt => opt.letter !== answer.selectedOption.letter)
        .map(opt => ({
          option: opt.letter,
          leadsTo: opt.next,
          description: opt.text.substring(0, 50) + '...',
        }));

      branchingPoints.push({
        scenarioId: answer.scenarioId,
        selectedOption: answer.selectedOption.letter,
        branchType,
        branchDirection,
        timestamp: answer.timestamp,
        alternativePaths,
      });
    }
  });

  return branchingPoints;
};

/**
 * Identify the type of branching decision
 */
export const identifyBranchType = (scenarioId: number | string): BranchingPoint['branchType'] => {
  const id = scenarioId.toString();

  if (id === '2') return 'city_choice';
  if (id === '3.1' || id === '3.2') return 'delay_response';
  if (id === '4.1' || id === '4.2') return 'waiting_choice';

  return 'linear';
};

/**
 * Identify the direction of the branch taken
 */
export const identifyBranchDirection = (
  optionLetter: string,
  scenarioId: number | string
): BranchingPoint['branchDirection'] => {
  const id = scenarioId.toString();

  // City choice scenario (2)
  if (id === '2') {
    if (optionLetter === 'A' || optionLetter === 'C') return 'london';
    if (optionLetter === 'B') return 'paris';
  }

  // Delay response scenarios (3.1, 3.2)
  if (id === '3.1' || id === '3.2') {
    if (optionLetter === 'A') return 'wait';
    if (optionLetter === 'B' || optionLetter === 'C') return 'go';
  }

  return 'neutral';
};

/**
 * Calculate path efficiency (how direct the route was)
 */
export const calculatePathEfficiency = (answers: ExtendedUserAnswer[]): number => {
  const actualSteps = answers.length;
  const minPossibleSteps = 8; // Minimum possible path through scenarios

  // Higher efficiency = more direct path
  return Math.max(0.3, Math.min(1.0, minPossibleSteps / actualSteps));
};

/**
 * Calculate exploration score (how much branching was utilized)
 */
export const calculateExplorationScore = (branchingHistory: BranchingPoint[]): number => {
  const maxPossibleBranches = 3; // Maximum branching points in the system
  const actualBranches = branchingHistory.length;

  return Math.min(1.0, actualBranches / maxPossibleBranches);
};

/**
 * Calculate path complexity metrics
 */
export const calculatePathComplexity = (
  answers: ExtendedUserAnswer[],
  branchingHistory: BranchingPoint[]
): EnhancedUserPath['complexity'] => {
  return {
    totalDecisionPoints: answers.length,
    criticalDecisions: branchingHistory.length,
    routeChanges: branchingHistory.filter(bp => bp.branchType !== 'linear').length,
    backtrackingEvents: 0, // Would be calculated from navigation history if available
  };
};

/**
 * Generate unique path identifier for analytics
 */
export const generateUniquePathId = (answers: ExtendedUserAnswer[]): string => {
  const pathSignature = answers
    .map(answer => `${answer.scenarioId}-${answer.selectedOption.letter}`)
    .join('|');

  // Create a simple hash of the path
  let hash = 0;
  for (let i = 0; i < pathSignature.length; i++) {
    const char = pathSignature.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `path_${Math.abs(hash).toString(16)}`;
};

/**
 * Predict path completion based on current progress
 */
export const predictPathCompletion = (
  answers: ExtendedUserAnswer[]
): {
  endScenario: number | string;
  remainingSteps: number;
  completionProbability: number;
} => {
  if (answers.length === 0) {
    return {
      endScenario: 1,
      remainingSteps: 10,
      completionProbability: 0.8,
    };
  }

  const lastAnswer = answers[answers.length - 1];
  const nextScenario = lastAnswer.selectedOption.next;

  // Estimate remaining steps based on current scenario
  const estimatedRemaining = Math.max(1, 10 - answers.length);

  return {
    endScenario: nextScenario || 'complete',
    remainingSteps: estimatedRemaining,
    completionProbability: Math.min(0.95, 0.6 + answers.length * 0.05),
  };
};

/**
 * Analyze path personality and decision patterns
 */
export const analyzePathPersonality = (
  answers: ExtendedUserAnswer[],
  branchingHistory: BranchingPoint[]
): {
  type: EnhancedUserPath['pathPersonality'];
  pattern: EnhancedUserPath['decisionPattern'];
} => {
  if (answers.length < 3) {
    return { type: 'decisive', pattern: 'consistent' };
  }

  // Analyze decision speed and consistency
  const avgScores = {
    emotional:
      answers.reduce((sum, a) => sum + a.selectedOption.scores.emotional, 0) / answers.length,
    logical: answers.reduce((sum, a) => sum + a.selectedOption.scores.logical, 0) / answers.length,
    exploratory:
      answers.reduce((sum, a) => sum + a.selectedOption.scores.exploratory, 0) / answers.length,
  };

  // Determine dominant pattern
  let pattern: EnhancedUserPath['decisionPattern'] = 'consistent';
  const maxScore = Math.max(avgScores.emotional, avgScores.logical, avgScores.exploratory);

  if (avgScores.emotional === maxScore) pattern = 'emotional_focused';
  else if (avgScores.logical === maxScore) pattern = 'logical_focused';
  else if (avgScores.exploratory === maxScore) pattern = 'exploratory_focused';

  const variance = calculateScoreVariance(answers);
  if (variance > 0.5) pattern = 'varied';

  // Determine personality type
  let type: EnhancedUserPath['pathPersonality'] = 'decisive';

  if (branchingHistory.length > 2) type = 'exploratory';
  else if (answers.length > 12) type = 'methodical';

  return { type, pattern };
};

/**
 * Calculate variance in decision scores to determine consistency
 */
export const calculateScoreVariance = (answers: ExtendedUserAnswer[]): number => {
  if (answers.length < 2) return 0;

  const scores = answers.map(
    a =>
      a.selectedOption.scores.emotional +
      a.selectedOption.scores.logical +
      a.selectedOption.scores.exploratory
  );
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;

  return Math.sqrt(variance) / 2; // Normalize to 0-1 range approximately
};

// ==========================================================================
// PATH VALIDATION AND RECOVERY
// ==========================================================================

/**
 * Validate path integrity and suggest corrections
 */
export const validatePathIntegrity = (
  answers: ExtendedUserAnswer[]
): {
  isValid: boolean;
  errors: {
    type: 'missing_scenario' | 'broken_link' | 'invalid_option' | 'orphaned_answer';
    scenarioId: number | string;
    description: string;
    suggestedFix?: string;
  }[];
  warnings: string[];
} => {
  const errors: any[] = [];
  const warnings: string[] = [];

  // Check each answer for validity
  answers.forEach((answer, index) => {
    const scenario = getExtendedScenarioById(answer.scenarioId);

    if (!scenario) {
      errors.push({
        type: 'missing_scenario',
        scenarioId: answer.scenarioId,
        description: `Scenario ${answer.scenarioId} not found`,
        suggestedFix: 'Remove this answer or update scenario data',
      });
      return;
    }

    // Check if selected option exists
    const option = scenario.options.find(opt => opt.letter === answer.selectedOption.letter);
    if (!option) {
      errors.push({
        type: 'invalid_option',
        scenarioId: answer.scenarioId,
        description: `Option ${answer.selectedOption.letter} not found in scenario ${answer.scenarioId}`,
        suggestedFix: 'Reset to valid option or remove answer',
      });
    }

    // Check if next scenario link is valid
    if (index < answers.length - 1) {
      const nextAnswer = answers[index + 1];
      const expectedNext = answer.selectedOption.next;

      if (nextAnswer.scenarioId !== expectedNext) {
        warnings.push(
          `Path discontinuity: Expected scenario ${expectedNext} but found ${nextAnswer.scenarioId}`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Recover from path errors by suggesting alternative routes
 */
export const suggestPathRecovery = (
  answers: ExtendedUserAnswer[],
  currentScenario: number | string
): {
  canRecover: boolean;
  recoveryOptions: {
    type: 'backtrack' | 'reset_from_point' | 'complete_restart';
    description: string;
    targetScenario: number | string;
    stepsLost: number;
  }[];
} => {
  const validation = validatePathIntegrity(answers);

  if (validation.isValid) {
    return { canRecover: true, recoveryOptions: [] };
  }

  const recoveryOptions: any[] = [];

  // Suggest backtracking to last valid point
  const lastValidIndex = findLastValidAnswerIndex(answers);
  if (lastValidIndex >= 0) {
    recoveryOptions.push({
      type: 'backtrack',
      description: `Return to scenario ${answers[lastValidIndex].scenarioId}`,
      targetScenario: answers[lastValidIndex].scenarioId,
      stepsLost: answers.length - lastValidIndex - 1,
    });
  }

  // Suggest reset from a key branching point
  const lastBranchingPoint = findLastBranchingPoint(answers);
  if (lastBranchingPoint) {
    recoveryOptions.push({
      type: 'reset_from_point',
      description: `Restart from branching point at scenario ${lastBranchingPoint.scenarioId}`,
      targetScenario: lastBranchingPoint.scenarioId,
      stepsLost:
        answers.length - answers.findIndex(a => a.scenarioId === lastBranchingPoint.scenarioId),
    });
  }

  // Always offer complete restart as last resort
  recoveryOptions.push({
    type: 'complete_restart',
    description: 'Start assessment over from the beginning',
    targetScenario: 1,
    stepsLost: answers.length,
  });

  return {
    canRecover: recoveryOptions.length > 0,
    recoveryOptions,
  };
};

/**
 * Find the last valid answer index in the sequence
 */
export const findLastValidAnswerIndex = (answers: ExtendedUserAnswer[]): number => {
  for (let i = answers.length - 1; i >= 0; i--) {
    const scenario = getExtendedScenarioById(answers[i].scenarioId);
    if (scenario?.options.find(opt => opt.letter === answers[i].selectedOption.letter)) {
      return i;
    }
  }
  return -1;
};

/**
 * Find the last branching point for recovery purposes
 */
export const findLastBranchingPoint = (answers: ExtendedUserAnswer[]): BranchingPoint | null => {
  const branchingHistory = analyzeBranchingPoints(answers);
  return branchingHistory.length > 0 ? branchingHistory[branchingHistory.length - 1] : null;
};

// ==========================================================================
// ANALYTICS AND INSIGHTS
// ==========================================================================

/**
 * Generate path analytics for educational insights
 */
export const generatePathAnalytics = (
  enhancedPath: EnhancedUserPath,
  answers: ExtendedUserAnswer[]
): PathAnalytics => {
  return {
    averageTimePerScenario: calculateAverageTimePerScenario(answers),
    hesitationPoints: identifyHesitationPoints(answers),
    popularPaths: [], // Would be populated from aggregated data
    dropOffPoints: [], // Would be populated from aggregated data
    learningOpportunities: generateLearningOpportunities(enhancedPath),
    missedBranches: identifyMissedBranches(answers, enhancedPath),
  };
};

/**
 * Calculate average time spent per scenario
 */
export const calculateAverageTimePerScenario = (answers: ExtendedUserAnswer[]): number => {
  if (answers.length < 2) return 0;

  const times = [];
  for (let i = 1; i < answers.length; i++) {
    const timeDiff = answers[i].timestamp.getTime() - answers[i - 1].timestamp.getTime();
    times.push(timeDiff / 1000); // Convert to seconds
  }

  return times.reduce((sum, time) => sum + time, 0) / times.length;
};

/**
 * Identify points where user spent unusually long time (hesitation)
 */
export const identifyHesitationPoints = (
  answers: ExtendedUserAnswer[]
): PathAnalytics['hesitationPoints'] => {
  const hesitationPoints: PathAnalytics['hesitationPoints'] = [];
  const avgTime = calculateAverageTimePerScenario(answers);

  for (let i = 1; i < answers.length; i++) {
    const timeDiff = (answers[i].timestamp.getTime() - answers[i - 1].timestamp.getTime()) / 1000;

    if (timeDiff > avgTime * 2) {
      // More than 2x average time
      hesitationPoints.push({
        scenarioId: answers[i - 1].scenarioId,
        timeSpent: timeDiff,
        reason: identifyHesitationReason(answers[i - 1].scenarioId),
      });
    }
  }

  return hesitationPoints;
};

/**
 * Identify likely reason for hesitation based on scenario type
 */
export const identifyHesitationReason = (scenarioId: number | string): string => {
  const branchType = identifyBranchType(scenarioId);

  switch (branchType) {
    case 'city_choice':
      return 'Major destination decision - choosing between partner preference and personal preference';
    case 'delay_response':
      return 'Relationship crisis response - deciding between accommodation and independence';
    case 'waiting_choice':
      return 'Patience vs action decision - balancing support and self-care';
    default:
      return 'Complex relationship decision requiring careful consideration';
  }
};

/**
 * Generate learning opportunities based on path taken
 */
export const generateLearningOpportunities = (enhancedPath: EnhancedUserPath): string[] => {
  const opportunities: string[] = [];

  // Based on path personality
  switch (enhancedPath.pathPersonality) {
    case 'methodical':
      opportunities.push(
        'Consider practicing more spontaneous decision-making in low-stakes situations'
      );
      break;
    case 'exploratory':
      opportunities.push('Reflect on the value of consistent decision-making patterns');
      break;
    case 'decisive':
      opportunities.push(
        'Explore the benefits of taking more time for complex relationship decisions'
      );
      break;
    case 'backtracking':
      opportunities.push('Practice trusting initial instincts while remaining open to change');
      break;
  }

  // Based on decision pattern
  switch (enhancedPath.decisionPattern) {
    case 'emotional_focused':
      opportunities.push('Consider incorporating more logical analysis into emotional decisions');
      break;
    case 'logical_focused':
      opportunities.push('Explore the role of emotions and intuition in relationship decisions');
      break;
    case 'exploratory_focused':
      opportunities.push('Balance adventure-seeking with stability and planning');
      break;
  }

  return opportunities;
};

/**
 * Identify branches that were available but not taken
 */
export const identifyMissedBranches = (
  answers: ExtendedUserAnswer[],
  enhancedPath: EnhancedUserPath
): PathAnalytics['missedBranches'] => {
  const missedBranches: PathAnalytics['missedBranches'] = [];

  enhancedPath.branchingHistory.forEach(branch => {
    branch.alternativePaths.forEach(altPath => {
      const educationalValue = getEducationalValueForPath(branch.scenarioId, altPath.option);

      missedBranches.push({
        scenarioId: branch.scenarioId,
        alternativeOption: altPath.option,
        educationalValue,
      });
    });
  });

  return missedBranches;
};

/**
 * Determine educational value of alternative paths
 */
export const getEducationalValueForPath = (scenarioId: number | string, option: string): string => {
  const id = scenarioId.toString();

  if (id === '2') {
    if (option === 'A') return 'Partner accommodation and relationship harmony priorities';
    if (option === 'B') return 'Logical decision-making and practical considerations';
    if (option === 'C') return 'Personal preference assertion and authentic choice-making';
  }

  if (id === '3.1' || id === '3.2') {
    if (option === 'A') return 'Relationship unity and shared experience prioritization';
    if (option === 'B') return 'Balanced decision-making considering practical constraints';
    if (option === 'C') return 'Independence and adaptability in relationship challenges';
  }

  return 'Alternative relationship decision-making approach';
};

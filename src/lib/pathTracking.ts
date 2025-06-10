// lib/pathTracking.ts
// ==========================================================================
// ENHANCED PATH TRACKING SYSTEM FOR COMPLEX BRANCHING SCENARIOS
// Updated to match store.ts interface requirements
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
  // Basic metrics
  totalPathLength: number;
  branchingPoints: number;
  backtrackCount: number;
  explorationDepth: number;
  decisionSpeed: number;
  consistencyScore: number;
  pathEfficiency: number;

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

// Navigation history interface (to match store.ts)
interface NavigationHistoryEntry {
  scenarioId: number | string;
  action: 'forward' | 'backward' | 'jump' | 'restart';
  timestamp: Date;
}

// Path validation interface (to match store.ts)
interface PathValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastValidatedAt: Date | null;
}

// Recovery option interface (to match store.ts)
interface RecoveryOption {
  type: 'backtrack' | 'reset_from_point' | 'complete_restart';
  description: string;
  targetScenario: number | string;
  stepsLost: number;
}

// ==========================================================================
// CORE PATH TRACKING FUNCTIONS (UPDATED FOR STORE COMPATIBILITY)
// ==========================================================================

/**
 * Generate enhanced user path from answers and navigation history
 * Updated to match store.ts function call signature
 */
export const generateEnhancedUserPath = (
  answers: ExtendedUserAnswer[],
  navigationHistory: NavigationHistoryEntry[]
): EnhancedUserPath => {
  const branchingHistory = analyzeBranchingPoints(answers);
  const pathSequence = answers.map(answer => ({
    scenarioId: answer.scenarioId,
    nextScenarioId: answer.selectedOption.next,
    timestamp: answer.timestamp,
  }));

  const complexity = calculatePathComplexity(answers, branchingHistory, navigationHistory);
  const efficiency = calculatePathEfficiency(answers, navigationHistory);
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

    // Only track actual branching scenarios
    if (branchType !== 'linear') {
      branchingPoints.push({
        scenarioId: answer.scenarioId,
        selectedOption: answer.selectedOption.letter,
        branchType,
        branchDirection,
        timestamp: answer.timestamp,
        alternativePaths: getAlternativePaths(scenario, answer.selectedOption.letter),
      });
    }
  });

  return branchingPoints;
};

/**
 * Calculate path efficiency based on answers and navigation history
 */
export const calculatePathEfficiency = (
  answers: ExtendedUserAnswer[],
  navigationHistory: NavigationHistoryEntry[]
): number => {
  if (answers.length === 0) return 1.0;

  const totalSteps = navigationHistory.length;
  const backwardSteps = navigationHistory.filter(h => h.action === 'backward').length;
  const jumpSteps = navigationHistory.filter(h => h.action === 'jump').length;

  // Calculate efficiency: penalize backtracking and jumping
  const inefficiencyPenalty = backwardSteps * 0.5 + jumpSteps * 0.3;
  const efficiency = Math.max(0, 1 - inefficiencyPenalty / Math.max(1, totalSteps));

  return Math.min(1.0, efficiency);
};

/**
 * Calculate exploration score based on branching history
 */
export const calculateExplorationScore = (branchingHistory: BranchingPoint[]): number => {
  if (branchingHistory.length === 0) return 0;

  const maxPossibleBranches = 10; // Approximate maximum branching points
  const actualBranches = branchingHistory.length;
  const uniqueBranchTypes = new Set(branchingHistory.map(bp => bp.branchType)).size;

  // Score based on quantity and variety of branching
  const quantityScore = Math.min(1.0, actualBranches / maxPossibleBranches);
  const varietyScore = Math.min(1.0, uniqueBranchTypes / 4); // 4 branch types available

  return (quantityScore + varietyScore) / 2;
};

/**
 * Calculate path complexity metrics including navigation history
 */
export const calculatePathComplexity = (
  answers: ExtendedUserAnswer[],
  branchingHistory: BranchingPoint[],
  navigationHistory: NavigationHistoryEntry[]
): EnhancedUserPath['complexity'] => {
  const backtrackingEvents = navigationHistory.filter(h => h.action === 'backward').length;
  const routeChanges = navigationHistory.filter(h => h.action === 'jump').length;

  return {
    totalDecisionPoints: answers.length,
    criticalDecisions: branchingHistory.length,
    routeChanges,
    backtrackingEvents,
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
// PATH VALIDATION AND RECOVERY (UPDATED FOR STORE COMPATIBILITY)
// ==========================================================================

/**
 * Validate path integrity - Updated to accept EnhancedUserPath parameter
 * to match store.ts function call signature
 */
export const validatePathIntegrity = (
  enhancedUserPath: EnhancedUserPath | null
): PathValidationResult => {
  if (!enhancedUserPath) {
    return {
      isValid: false,
      errors: ['No enhanced user path provided'],
      warnings: [],
      lastValidatedAt: new Date(),
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate path sequence
  if (enhancedUserPath.pathSequence.length === 0) {
    errors.push('Empty path sequence');
  }

  // Validate branching history
  if (enhancedUserPath.branchingHistory.length > enhancedUserPath.totalSteps) {
    warnings.push('More branching points than total steps');
  }

  // Validate complexity metrics
  if (enhancedUserPath.complexity.totalDecisionPoints !== enhancedUserPath.totalSteps) {
    warnings.push('Decision points count mismatch');
  }

  // Validate efficiency score
  if (enhancedUserPath.pathEfficiency < 0 || enhancedUserPath.pathEfficiency > 1) {
    errors.push('Path efficiency out of valid range');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    lastValidatedAt: new Date(),
  };
};

/**
 * Suggest path recovery options - New function to match store.ts requirements
 */
export const suggestPathRecovery = (
  enhancedUserPath: EnhancedUserPath | null
): RecoveryOption[] => {
  const recoveryOptions: RecoveryOption[] = [];

  if (!enhancedUserPath) {
    // Complete restart if no path available
    recoveryOptions.push({
      type: 'complete_restart',
      description: 'Start assessment over from the beginning',
      targetScenario: 1,
      stepsLost: 0,
    });
    return recoveryOptions;
  }

  // If there are branching points, offer backtrack option
  if (enhancedUserPath.branchingHistory.length > 0) {
    const lastBranchingPoint =
      enhancedUserPath.branchingHistory[enhancedUserPath.branchingHistory.length - 1];
    const stepsLost =
      enhancedUserPath.totalSteps -
      enhancedUserPath.pathSequence.findIndex(p => p.scenarioId === lastBranchingPoint.scenarioId);

    recoveryOptions.push({
      type: 'backtrack',
      description: `Go back to last branching point at scenario ${lastBranchingPoint.scenarioId}`,
      targetScenario: lastBranchingPoint.scenarioId,
      stepsLost: Math.max(0, stepsLost),
    });
  }

  // If path is complex, offer mid-point reset
  if (enhancedUserPath.complexity.totalDecisionPoints > 5) {
    const midPoint = Math.ceil(enhancedUserPath.totalSteps / 2);
    const midScenario = enhancedUserPath.pathSequence[midPoint - 1]?.scenarioId || 1;

    recoveryOptions.push({
      type: 'reset_from_point',
      description: `Restart from scenario ${midScenario}`,
      targetScenario: midScenario,
      stepsLost: enhancedUserPath.totalSteps - midPoint,
    });
  }

  // Always offer complete restart as last resort
  recoveryOptions.push({
    type: 'complete_restart',
    description: 'Start assessment over from the beginning',
    targetScenario: 1,
    stepsLost: enhancedUserPath.totalSteps,
  });

  return recoveryOptions;
};

// ==========================================================================
// ANALYTICS AND INSIGHTS (UPDATED FOR STORE COMPATIBILITY)
// ==========================================================================

/**
 * Generate path analytics - Updated to accept only EnhancedUserPath parameter
 * to match store.ts function call signature
 */
export const generatePathAnalytics = (enhancedPath: EnhancedUserPath): PathAnalytics => {
  // Extract answers from path sequence for backward compatibility
  const mockAnswers: ExtendedUserAnswer[] = enhancedPath.pathSequence.map((step, index) => ({
    scenarioId: step.scenarioId,
    selectedOption: {
      letter: 'A', // Mock data - in real implementation, this would be stored
      text: 'Mock option',
      scores: { emotional: 0, logical: 0, exploratory: 0 },
      next: step.nextScenarioId,
    },
    timestamp: new Date(Date.now() - (enhancedPath.totalSteps - index) * 60000), // Mock timestamps
    responseTime: 30000, // Mock response time
  }));

  return {
    // Basic metrics from enhanced path
    totalPathLength: enhancedPath.totalSteps,
    branchingPoints: enhancedPath.branchingPoints,
    backtrackCount: enhancedPath.complexity.backtrackingEvents,
    explorationDepth: enhancedPath.explorationScore,
    decisionSpeed: calculateAverageTimePerScenario(mockAnswers),
    consistencyScore: enhancedPath.pathEfficiency,
    pathEfficiency: enhancedPath.pathEfficiency,

    // Detailed analytics
    averageTimePerScenario: calculateAverageTimePerScenario(mockAnswers),
    hesitationPoints: identifyHesitationPoints(mockAnswers),
    popularPaths: [], // Would be populated from aggregated data
    dropOffPoints: [], // Would be populated from aggregated data
    learningOpportunities: generateLearningOpportunities(enhancedPath),
    missedBranches: identifyMissedBranches(mockAnswers, enhancedPath),
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
        scenarioId: answers[i].scenarioId,
        timeSpent: timeDiff,
        reason: 'Extended deliberation time detected',
      });
    }
  }

  return hesitationPoints;
};

/**
 * Generate learning opportunities based on path analysis
 */
export const generateLearningOpportunities = (enhancedPath: EnhancedUserPath): string[] => {
  const opportunities: string[] = [];

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
    case 'consistent':
      opportunities.push('Try exploring alternative approaches to broaden your perspective');
      break;
    case 'varied':
      opportunities.push('Focus on developing a more consistent decision-making framework');
      break;
  }

  // Based on path personality
  switch (enhancedPath.pathPersonality) {
    case 'methodical':
      opportunities.push('Consider the value of spontaneity and adaptability');
      break;
    case 'exploratory':
      opportunities.push('Practice focusing on key decisions and avoiding over-analysis');
      break;
    case 'decisive':
      opportunities.push('Take time to explore alternatives before making quick decisions');
      break;
    case 'backtracking':
      opportunities.push('Build confidence in initial decision-making to reduce second-guessing');
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

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Identify the type of branching for a given scenario
 */
export const identifyBranchType = (scenarioId: number | string): BranchingPoint['branchType'] => {
  const id = scenarioId.toString();

  if (id === '2') return 'city_choice';
  if (id === '3.1' || id === '3.2') return 'delay_response';
  if (id === '4.1' || id === '4.2') return 'waiting_choice';

  return 'linear';
};

/**
 * Identify the direction of branching based on option and scenario
 */
export const identifyBranchDirection = (
  optionLetter: string,
  scenarioId: number | string
): BranchingPoint['branchDirection'] => {
  const id = scenarioId.toString();

  if (id === '2') {
    if (optionLetter === 'A') return 'london';
    if (optionLetter === 'B') return 'paris';
    return 'neutral';
  }

  if (id.includes('3.') || id.includes('4.')) {
    if (optionLetter === 'A') return 'wait';
    if (optionLetter === 'B') return 'go';
    return 'neutral';
  }

  return 'neutral';
};

/**
 * Get alternative paths for a given scenario and selected option
 */
export const getAlternativePaths = (
  scenario: ExtendedScenario,
  selectedOption: string
): BranchingPoint['alternativePaths'] => {
  return scenario.options
    .filter(option => option.letter !== selectedOption)
    .map(option => ({
      option: option.letter,
      leadsTo: option.next,
      description: option.text.substring(0, 50) + '...',
    }));
};

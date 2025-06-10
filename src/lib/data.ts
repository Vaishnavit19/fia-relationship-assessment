// lib/data.ts
// ==========================================================================
// EXTENDED ASSESSMENT DATA LOADER - COMPLETE REPLACEMENT
// ==========================================================================

import archetypeScoringData from '../data/archetype-scoring-profiles.json';
import config from '../data/config.json';
import personaCardsData from '../data/enhanced-persona-cards.json';
import extendedArchetypesData from '../data/extended-archetypes.json';
import extendedScenariosData from '../data/extended-travel-scenarios.json';
import personaMappingData from '../data/persona-archetype-mapping.json';

import {
  ExtendedScenario,
  ExtendedArchetype,
  ArchetypeScoringProfile,
  PersonaCard,
  PersonaArchetypeMapping,
  ScoreData,
  UserPath,
} from './types';

// ==========================================================================
// DATA IMPORTS - Files 1-5
// ==========================================================================

export const extendedScenarios: ExtendedScenario[] = extendedScenariosData.scenarios;
export const extendedArchetypes: ExtendedArchetype[] = extendedArchetypesData.archetypes;
export const archetypeScoringProfiles: ArchetypeScoringProfile[] =
  archetypeScoringData.scoringProfiles;
export const personaCards: PersonaCard[] = personaCardsData.personas;
export const personaMapping = {
  ...personaMappingData.archetypeVulnerabilityMap,
  selectionAlgorithm: personaMappingData.selectionAlgorithm,
};
export const appConfig = config;

// ==========================================================================
// FILE 1: EXTENDED SCENARIOS LOGIC
// ==========================================================================

/**
 * Get scenario by ID - handles both numeric and string IDs for branching
 */
export const getExtendedScenarioById = (id: number | string): ExtendedScenario | undefined => {
  return extendedScenarios.find(
    scenario => scenario.id === id || scenario.id.toString() === id.toString()
  );
};

/**
 * Calculate total scores from user answers
 */
export const calculateExtendedScores = (
  answers: {
    scenarioId: number | string;
    selectedOption: {
      scores: ScoreData;
    };
  }[]
): ScoreData => {
  return answers.reduce(
    (totalScores, answer) => ({
      logical: totalScores.logical + answer.selectedOption.scores.logical,
      emotional: totalScores.emotional + answer.selectedOption.scores.emotional,
      exploratory: totalScores.exploratory + answer.selectedOption.scores.exploratory,
    }),
    { logical: 0, emotional: 0, exploratory: 0 }
  );
};

/**
 * Get next scenario ID from current answer - handles branching logic
 */
export const getNextScenarioId = (selectedOption: { next: number | string }): number | string => {
  return selectedOption.next;
};

/**
 * Validate if scenario path is complete (reached end)
 */
export const isScenarioPathComplete = (currentScenarioId: number | string): boolean => {
  const scenario = getExtendedScenarioById(currentScenarioId);

  // Path is complete if we can't find the next scenario
  // or if we've reached a designated end point
  if (!scenario) return true;

  // Check if this is a final scenario (all next options point to null or undefined)
  const hasValidNextSteps = scenario.options.some(
    option => option.next !== null && option.next !== undefined
  );

  return !hasValidNextSteps;
};

/**
 * Get user's path through scenarios for debugging/analytics
 */
export const getUserScenarioPath = (
  answers: {
    scenarioId: number | string;
    selectedOption: { next: number | string };
  }[]
): UserPath => {
  const path = answers.map(answer => ({
    scenarioId: answer.scenarioId,
    nextScenarioId: answer.selectedOption.next,
  }));

  return {
    totalSteps: path.length,
    pathSequence: path,
    branchingPoints: path.filter(
      step => typeof step.scenarioId === 'string' && step.scenarioId.includes('.')
    ).length,
  };
};

/**
 * Calculate progress for extended scenarios (dynamic based on user path)
 */
export const calculateExtendedProgress = (
  currentAnswers: { scenarioId: number | string }[],
  currentScenarioId: number | string
): number => {
  const answeredCount = currentAnswers.length;
  const estimatedTotal = extendedScenariosData.metadata.averageQuestions;

  // Calculate progress with some buffer for remaining questions
  const baseProgress = Math.min((answeredCount / estimatedTotal) * 100, 95);

  // If we've reached a completion state, show 100%
  if (isScenarioPathComplete(currentScenarioId)) {
    return 100;
  }

  return Math.round(baseProgress);
};

/**
 * Get scenario statistics for analytics
 */
export const getScenarioStatistics = () => ({
  totalScenarios: extendedScenarios.length,
  averageQuestions: extendedScenariosData.metadata.averageQuestions,
  maxQuestions: extendedScenariosData.metadata.maxQuestions,
  minQuestions: extendedScenariosData.metadata.minQuestions,
  branchingScenarios: extendedScenarios.filter(s => typeof s.id === 'string' && s.id.includes('.'))
    .length,
});

/**
 * Validate scenario data integrity
 */
export const validateScenarioData = (): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Check if all scenarios have valid next references
  extendedScenarios.forEach(scenario => {
    scenario.options.forEach((option, optionIndex) => {
      if (option.next !== null && option.next !== undefined) {
        const nextScenario = getExtendedScenarioById(option.next);
        if (!nextScenario) {
          errors.push(
            `Scenario ${scenario.id}, option ${optionIndex}: 
             references non-existent scenario ${option.next}`
          );
        }
      }
    });
  });

  // Check for orphaned scenarios (scenarios that can't be reached)
  const reachableScenarios = new Set<number | string>();
  const addReachableScenarios = (scenarioId: number | string) => {
    if (reachableScenarios.has(scenarioId)) return;

    const scenario = getExtendedScenarioById(scenarioId);
    if (!scenario) return;

    reachableScenarios.add(scenarioId);
    scenario.options.forEach(option => {
      if (option.next !== null && option.next !== undefined) {
        addReachableScenarios(option.next);
      }
    });
  };

  // Start from scenario 1 (entry point)
  addReachableScenarios(1);

  const orphanedScenarios = extendedScenarios.filter(
    scenario => !reachableScenarios.has(scenario.id)
  );

  if (orphanedScenarios.length > 0) {
    errors.push(`Orphaned scenarios found: ${orphanedScenarios.map(s => s.id).join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

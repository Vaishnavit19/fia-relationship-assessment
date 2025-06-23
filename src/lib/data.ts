// lib/data.ts
// ==========================================================================
// EXTENDED ASSESSMENT DATA LOADER - UPDATED FOR STORE COMPATIBILITY
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
  ExtendedUserAnswer,
  ExtendedAnswerOption,
  ExtendedScenariosData,
  ScenarioMetadata,
} from './types';

// ==========================================================================
// DATA IMPORTS - Files 1-5
// ==========================================================================

export const extendedScenariosMetadata: ScenarioMetadata = extendedScenariosData.metadata;
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
// CORE SCENARIO FUNCTIONS (UPDATED FOR STORE COMPATIBILITY)
// ==========================================================================

/**
 * Get scenario by ID - handles both numeric and string IDs for branching
 * Updated to work with store.ts expectations
 */
export const getExtendedScenarioById = (id: number | string): ExtendedScenario | null => {
  if (id === null) return id;

  const scenario = extendedScenarios.find(
    scenario => scenario.id === id || scenario.id.toString() === id.toString()
  );

  return scenario || null;
};

/**
 * Calculate total scores from user answers
 * Updated to handle both single and multi-select answers properly with defensive programming
 * ✅ NEW: Added deduplication to prevent inflated scores from back navigation
 */
export const calculateExtendedScores = (answers: ExtendedUserAnswer[]): ScoreData => {
  if (!Array.isArray(answers) || answers.length === 0) {
    return { logical: 0, emotional: 0, exploratory: 0 };
  }

  // ✅ DEDUPLICATION: Keep only the most recent answer for each scenario
  const uniqueAnswers = new Map<number | string, ExtendedUserAnswer>();

  // Process answers in order, so later answers overwrite earlier ones for same scenario
  answers.forEach(answer => {
    if (answer && answer.scenarioId !== null && answer.scenarioId !== undefined) {
      uniqueAnswers.set(answer.scenarioId, answer);
    }
  });

  // Convert back to array and process
  const deduplicatedAnswers = Array.from(uniqueAnswers.values());

  return deduplicatedAnswers.reduce(
    (totalScores, answer) => {
      // Defensive check: ensure answer exists
      if (!answer) {
        console.warn('Invalid answer object found, skipping');
        return totalScores;
      }

      if (answer.isMultiSelect && answer.selectedOptions && Array.isArray(answer.selectedOptions)) {
        // Handle multi-select answers - sum all selected options
        const multiSelectScores = answer.selectedOptions.reduce(
          (optionSum, option) => {
            // Defensive check: ensure option and scores exist
            if (!option?.scores) {
              console.warn('Invalid multi-select option found, skipping', option);
              return optionSum;
            }

            return {
              logical: optionSum.logical + (option.scores.logical || 0),
              emotional: optionSum.emotional + (option.scores.emotional || 0),
              exploratory: optionSum.exploratory + (option.scores.exploratory || 0),
            };
          },
          { logical: 0, emotional: 0, exploratory: 0 }
        );

        return {
          logical: totalScores.logical + multiSelectScores.logical,
          emotional: totalScores.emotional + multiSelectScores.emotional,
          exploratory: totalScores.exploratory + multiSelectScores.exploratory,
        };
      } else if (answer.selectedOption?.scores) {
        // Handle single-select answers
        return {
          logical: totalScores.logical + (answer.selectedOption.scores.logical || 0),
          emotional: totalScores.emotional + (answer.selectedOption.scores.emotional || 0),
          exploratory: totalScores.exploratory + (answer.selectedOption.scores.exploratory || 0),
        };
      } else {
        console.warn('Answer has no valid scores, skipping', answer);
        return totalScores;
      }
    },
    { logical: 0, emotional: 0, exploratory: 0 }
  );
};

/**
 * Get next scenario ID from selected option
 * Updated function signature to match store.ts expectations
 */
export const getNextScenarioId = (
  currentScenarioId: number | string,
  selectedOption: ExtendedAnswerOption
): number | string | null => {
  // Return the next scenario ID from the selected option
  if (selectedOption.next === null || selectedOption.next === undefined) {
    return null; // Assessment complete
  }

  return selectedOption.next;
};

/**
 * Check if scenario path is complete
 * Updated to work with the new assessment flow
 */
export const isScenarioPathComplete = (
  scenarioId: number | string | null,
  answers: ExtendedUserAnswer[]
): boolean => {
  // If scenario ID is null, undefined, or 'complete', assessment is done
  if (
    scenarioId === null ||
    scenarioId === undefined ||
    scenarioId === 'complete' ||
    scenarioId === 'end'
  ) {
    return true;
  }

  // If we can't find the scenario, consider it complete
  const scenario = getExtendedScenarioById(scenarioId);
  if (!scenario) {
    return true;
  }

  // Check if we've reached the estimated maximum questions
  if (answers.length >= extendedScenariosMetadata.maxQuestions) {
    return true;
  }

  // Check if all options in the current scenario lead to completion
  const allOptionsComplete = scenario.options.every(
    option => option.next === null || option.next === undefined || option.next === 'complete'
  );

  return allOptionsComplete;
};

/**
 * Calculate progress for extended scenarios (dynamic based on user path)
 * Updated to work with current store state
 */
export const calculateExtendedProgress = (
  answers: ExtendedUserAnswer[],
  currentScenarioId: number | string | null
): number => {
  const answeredCount = answers.length;
  const estimatedTotal = extendedScenariosMetadata.averageQuestions;

  // If assessment is complete, return 100%
  if (isScenarioPathComplete(currentScenarioId, answers)) {
    return 100;
  }

  // Calculate progress with some buffer for remaining questions
  const baseProgress = Math.min((answeredCount / estimatedTotal) * 100, 95);

  // Add bonus progress based on how far we are in the flow
  const progressBonus = Math.min(answeredCount * 2, 10); // Up to 10% bonus

  return Math.round(Math.min(baseProgress + progressBonus, 95));
};

/**
 * Get user's path through scenarios for analytics
 * Updated to work with new ExtendedUserAnswer type
 */
export const getUserScenarioPath = (answers: ExtendedUserAnswer[]): UserPath => {
  const pathSequence = answers.map(answer => ({
    scenarioId: answer.scenarioId,
    nextScenarioId: answer.selectedOption.next,
    timestamp: answer.timestamp,
  }));

  // Count branching points (scenarios with decimal IDs like 3.1, 4.2)
  const branchingPoints = answers.filter(
    answer => typeof answer.scenarioId === 'string' && answer.scenarioId.toString().includes('.')
  ).length;

  return {
    totalSteps: pathSequence.length,
    pathSequence,
    branchingPoints,
  };
};

/**
 * Find the convergence point for multiple scenario paths
 * This analyzes where different scenario paths merge back together
 */
export const findConvergencePoint = (scenarioIds: (number | string)[]): number | string | null => {
  if (scenarioIds.length === 0) return null;
  if (scenarioIds.length === 1) {
    // Single scenario - find where it leads
    const scenario = getExtendedScenarioById(scenarioIds[0]);
    return scenario?.options[0]?.next || null;
  }

  // Get all possible next scenarios for each scenario
  const allPaths: Set<number | string>[] = scenarioIds.map(id => {
    const possibleNextScenarios = getPossibleNextScenarios(id);
    return new Set(possibleNextScenarios);
  });

  // Find common scenarios across all paths
  const convergencePoints = allPaths.reduce((intersection, currentSet) => {
    return new Set([...intersection].filter(x => currentSet.has(x)));
  });

  // Return the first convergence point (or null if no convergence)
  return convergencePoints.size > 0 ? Array.from(convergencePoints)[0] : null;
};

/**
 * Create a scenario queue from multi-select options
 * This determines the order in which scenarios should be experienced
 */
export const createScenarioQueue = (
  multiSelectOptions: ExtendedAnswerOption[],
  originalScenarioId: number | string
): ScenarioQueueItem[] => {
  // Sort options by letter to ensure consistent ordering
  const sortedOptions = [...multiSelectOptions].sort((a, b) => a.letter.localeCompare(b.letter));

  return sortedOptions
    .map(option => ({
      scenarioId: option.next,
      originOption: option,
      isProcessed: false,
    }))
    .filter(item => item.scenarioId !== null && item.scenarioId !== undefined);
};

/**
 * Validate that all scenarios in queue lead to the same convergence point
 */
export const validateQueueConvergence = (
  queue: ScenarioQueueItem[]
): {
  isValid: boolean;
  convergencePoint: number | string | null;
  warnings: string[];
} => {
  const warnings: string[] = [];
  const scenarioIds = queue.map(item => item.scenarioId);
  const convergencePoint = findConvergencePoint(scenarioIds);

  if (!convergencePoint) {
    warnings.push('No convergence point found for multi-select scenarios');
  }

  // Verify each scenario actually leads to the convergence point
  let isValid = true;
  if (convergencePoint) {
    queue.forEach(item => {
      const scenario = getExtendedScenarioById(item.scenarioId);
      if (scenario) {
        const allOptionsLeadToConvergence = scenario.options.every(
          option => option.next === convergencePoint
        );
        if (!allOptionsLeadToConvergence) {
          warnings.push(
            `Scenario ${item.scenarioId} doesn't lead to convergence point ${convergencePoint}`
          );
          isValid = false;
        }
      }
    });
  }

  return { isValid, convergencePoint, warnings };
};

// ==========================================================================
// VALIDATION AND ERROR HANDLING
// ==========================================================================

/**
 * Validate scenario data integrity
 * Enhanced validation for the extended scenario system
 */
export const validateScenarioData = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if metadata matches actual scenario count
  if (extendedScenarios.length !== extendedScenariosMetadata.totalScenarios) {
    warnings.push(
      `Metadata shows ${extendedScenariosMetadata.totalScenarios} scenarios but found ${extendedScenarios.length}`
    );
  }

  // Check if all scenarios have valid next references
  extendedScenarios.forEach(scenario => {
    scenario.options.forEach((option, optionIndex) => {
      if (option.next !== null && option.next !== undefined && option.next !== 'complete') {
        const nextScenario = getExtendedScenarioById(option.next);
        if (!nextScenario) {
          errors.push(
            `Scenario ${scenario.id}, option ${option.letter}: references non-existent scenario ${option.next}`
          );
        }
      }
    });

    // Validate multi-select scenarios
    if (scenario.minSelection && scenario.minSelection > scenario.options.length) {
      errors.push(
        `Scenario ${scenario.id}: minSelection (${scenario.minSelection}) exceeds available options (${scenario.options.length})`
      );
    }
  });

  // Check for orphaned scenarios (scenarios that can't be reached)
  const reachableScenarios = new Set<number | string>();
  const addReachableScenarios = (scenarioId: number | string) => {
    if (reachableScenarios.has(scenarioId)) return;

    const scenario = getExtendedScenarioById(scenarioId);
    if (!scenario) return;

    reachableScenarios.add(scenarioId);
    scenario.options.forEach(option => {
      if (option.next !== null && option.next !== undefined && option.next !== 'complete') {
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
    warnings.push(
      `Orphaned scenarios found (unreachable): ${orphanedScenarios.map(s => s.id).join(', ')}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate a specific user answer against scenario data
 */
export const validateUserAnswer = (
  answer: ExtendedUserAnswer
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Check if scenario exists
  const scenario = getExtendedScenarioById(answer.scenarioId);
  if (!scenario) {
    errors.push(`Scenario ${answer.scenarioId} not found`);
    return { isValid: false, errors };
  }

  // Validate selected option exists
  const optionExists = scenario.options.some(opt => opt.letter === answer.selectedOption.letter);
  if (!optionExists) {
    errors.push(
      `Option ${answer.selectedOption.letter} not found in scenario ${answer.scenarioId}`
    );
  }

  // Validate multi-select answers
  if (answer.isMultiSelect && answer.selectedOptions) {
    if (scenario.minSelection && answer.selectedOptions.length < scenario.minSelection) {
      errors.push(
        `Multi-select scenario ${answer.scenarioId} requires at least ${scenario.minSelection} selections, but got ${answer.selectedOptions.length}`
      );
    }

    // Check all selected options exist
    answer.selectedOptions.forEach(option => {
      const exists = scenario.options.some(opt => opt.letter === option.letter);
      if (!exists) {
        errors.push(
          `Multi-select option ${option.letter} not found in scenario ${answer.scenarioId}`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ==========================================================================
// ANSWER VALIDATION AND CREATION UTILITIES
// ==========================================================================

/**
 * Create a properly structured ExtendedUserAnswer object
 * This ensures the answer has all required properties
 */
export const createExtendedUserAnswer = (
  scenarioId: number | string,
  selectedOption: ExtendedAnswerOption,
  isMultiSelect = false,
  selectedOptions?: ExtendedAnswerOption[]
): ExtendedUserAnswer => {
  const baseAnswer: ExtendedUserAnswer = {
    scenarioId,
    selectedOption,
    timestamp: new Date(),
    isMultiSelect,
  };

  if (isMultiSelect && selectedOptions) {
    baseAnswer.selectedOptions = selectedOptions;
    baseAnswer.totalScore = selectedOptions.reduce(
      (total, option) => ({
        logical: total.logical + (option.scores?.logical || 0),
        emotional: total.emotional + (option.scores?.emotional || 0),
        exploratory: total.exploratory + (option.scores?.exploratory || 0),
      }),
      { logical: 0, emotional: 0, exploratory: 0 }
    );
  }

  return baseAnswer;
};

/**
 * Validate an answer object to ensure it has the required structure
 */
export const validateAnswerObject = (
  answer: any
): {
  isValid: boolean;
  errors: string[];
  fixedAnswer?: ExtendedUserAnswer;
} => {
  const errors: string[] = [];

  if (!answer) {
    errors.push('Answer object is null or undefined');
    return { isValid: false, errors };
  }

  if (!answer.scenarioId) {
    errors.push('Missing scenarioId');
  }

  if (!answer.selectedOption) {
    errors.push('Missing selectedOption');
  } else {
    if (!answer.selectedOption.scores) {
      errors.push('Missing scores in selectedOption');
    }
    if (!answer.selectedOption.letter) {
      errors.push('Missing letter in selectedOption');
    }
    if (!answer.selectedOption.text) {
      errors.push('Missing text in selectedOption');
    }
  }

  if (!answer.timestamp) {
    errors.push('Missing timestamp');
  }

  // Try to fix the answer if possible
  if (errors.length > 0 && answer.scenarioId && answer.selectedOption) {
    try {
      const fixedAnswer: ExtendedUserAnswer = {
        scenarioId: answer.scenarioId,
        selectedOption: {
          letter: answer.selectedOption.letter || 'A',
          text: answer.selectedOption.text || 'Unknown option',
          scores: answer.selectedOption.scores || { logical: 0, emotional: 0, exploratory: 0 },
          next: answer.selectedOption.next || null,
        },
        timestamp: answer.timestamp || new Date(),
        isMultiSelect: answer.isMultiSelect || false,
      };

      if (answer.selectedOptions) {
        fixedAnswer.selectedOptions = answer.selectedOptions;
      }

      return {
        isValid: false,
        errors,
        fixedAnswer,
      };
    } catch (fixError) {
      errors.push(`Failed to fix answer: ${fixError}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Safely calculate scores with comprehensive error handling and logging
 */
export const safeCalculateExtendedScores = (
  answers: ExtendedUserAnswer[]
): {
  scores: ScoreData;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(answers)) {
    errors.push('Answers is not an array');
    return {
      scores: { logical: 0, emotional: 0, exploratory: 0 },
      errors,
      warnings,
    };
  }

  if (answers.length === 0) {
    return {
      scores: { logical: 0, emotional: 0, exploratory: 0 },
      errors,
      warnings,
    };
  }

  // Validate each answer and attempt to fix issues
  const validatedAnswers: ExtendedUserAnswer[] = [];

  answers.forEach((answer, index) => {
    const validation = validateAnswerObject(answer);

    if (validation.isValid) {
      validatedAnswers.push(answer);
    } else {
      warnings.push(`Answer ${index}: ${validation.errors.join(', ')}`);

      if (validation.fixedAnswer) {
        warnings.push(`Answer ${index}: Using fixed version`);
        validatedAnswers.push(validation.fixedAnswer);
      } else {
        errors.push(`Answer ${index}: Could not fix, skipping`);
      }
    }
  });

  // Calculate scores with the validated answers
  const scores = calculateExtendedScores(validatedAnswers);

  return {
    scores,
    errors,
    warnings,
  };
};

/**
 * Get scenario statistics for analytics and debugging
 */
export const getScenarioStatistics = () => ({
  totalScenarios: extendedScenarios.length,
  averageQuestions: extendedScenariosMetadata.averageQuestions,
  maxQuestions: extendedScenariosMetadata.maxQuestions,
  minQuestions: extendedScenariosMetadata.minQuestions,
  multiSelectScenarios: extendedScenarios.filter(s => s.minSelection && s.minSelection > 1).length,
  branchingScenarios: extendedScenarios.filter(
    s => typeof s.id === 'string' && s.id.toString().includes('.')
  ).length,
  linearScenarios: extendedScenarios.filter(
    s => typeof s.id === 'number' || !s.id.toString().includes('.')
  ).length,
});

/**
 * Get all possible next scenarios from current scenario
 * Useful for path tracking and analytics
 */
export const getPossibleNextScenarios = (scenarioId: number | string): (number | string)[] => {
  const scenario = getExtendedScenarioById(scenarioId);
  if (!scenario) return [];

  return scenario.options
    .map(option => option.next)
    .filter(next => next !== null && next !== undefined)
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
};

/**
 * Check if a scenario requires multi-select
 */
export const isMultiSelectScenario = (scenarioId: number | string): boolean => {
  const scenario = getExtendedScenarioById(scenarioId);
  return !!(scenario?.minSelection && scenario.minSelection > 1);
};

/**
 * Get the minimum and maximum selections for a multi-select scenario
 */
export const getMultiSelectRequirements = (
  scenarioId: number | string
): {
  minSelections: number;
  maxSelections: number;
} | null => {
  const scenario = getExtendedScenarioById(scenarioId);
  if (!scenario?.minSelection) return null;

  return {
    minSelections: scenario.minSelection,
    maxSelections: scenario.maxSelections || scenario.options.length,
  };
};

/**
 * Find all scenarios that lead to a specific target scenario
 * Useful for path analysis and recovery
 */
export const findScenariosLeadingTo = (
  targetScenarioId: number | string
): {
  scenarioId: number | string;
  optionLetter: string;
}[] => {
  const leadingScenarios: { scenarioId: number | string; optionLetter: string }[] = [];

  extendedScenarios.forEach(scenario => {
    scenario.options.forEach(option => {
      if (option.next === targetScenarioId) {
        leadingScenarios.push({
          scenarioId: scenario.id,
          optionLetter: option.letter,
        });
      }
    });
  });

  return leadingScenarios;
};

/**
 * Get scenario metadata for display purposes
 */
export const getScenarioMetadata = (
  scenarioId: number | string
): {
  isMultiSelect: boolean;
  isBranching: boolean;
  possibleNextScenarios: (number | string)[];
  leadingScenarios: { scenarioId: number | string; optionLetter: string }[];
} | null => {
  const scenario = getExtendedScenarioById(scenarioId);
  if (!scenario) return null;

  return {
    isMultiSelect: isMultiSelectScenario(scenarioId),
    isBranching: typeof scenarioId === 'string' && scenarioId.toString().includes('.'),
    possibleNextScenarios: getPossibleNextScenarios(scenarioId),
    leadingScenarios: findScenariosLeadingTo(scenarioId),
  };
};

// ==========================================================================
// ASSESSMENT COMPLETION DETECTION
// ==========================================================================

/**
 * Determine if the assessment should complete based on current state
 * More sophisticated completion logic
 */
export const shouldCompleteAssessment = (
  answers: ExtendedUserAnswer[],
  currentScenarioId: number | string | null
): {
  shouldComplete: boolean;
  reason: 'max_questions' | 'end_scenario' | 'no_next_scenario' | 'completion_flag' | 'continuing';
} => {
  // Check for explicit completion indicators
  if (
    currentScenarioId === null ||
    currentScenarioId === 'complete' ||
    currentScenarioId === 'end'
  ) {
    return { shouldComplete: true, reason: 'completion_flag' };
  }

  // Check if we've reached maximum questions
  if (answers.length >= extendedScenariosMetadata.maxQuestions) {
    return { shouldComplete: true, reason: 'max_questions' };
  }

  // Check if current scenario exists
  const currentScenario = getExtendedScenarioById(currentScenarioId);
  if (!currentScenario) {
    return { shouldComplete: true, reason: 'no_next_scenario' };
  }

  // Check if all options in current scenario lead to completion
  const allOptionsComplete = currentScenario.options.every(
    option => option.next === null || option.next === undefined || option.next === 'complete'
  );

  if (allOptionsComplete) {
    return { shouldComplete: true, reason: 'end_scenario' };
  }

  return { shouldComplete: false, reason: 'continuing' };
};

// ==========================================================================
// DEBUGGING AND DEVELOPMENT UTILITIES
// ==========================================================================

/**
 * Export debug information about the scenario system
 */
export const exportScenarioDebugInfo = () => {
  const validation = validateScenarioData();
  const stats = getScenarioStatistics();

  return {
    metadata: extendedScenariosMetadata,
    validation,
    statistics: stats,
    scenarios: extendedScenarios.map(scenario => ({
      id: scenario.id,
      isMultiSelect: isMultiSelectScenario(scenario.id),
      optionCount: scenario.options.length,
      possibleNextScenarios: getPossibleNextScenarios(scenario.id),
    })),
  };
};

/**
 * Test scenario navigation from a given starting point
 */
export const testScenarioNavigation = (
  startScenarioId: number | string = 1,
  maxDepth = 20
): {
  path: (number | string)[];
  reachableScenarios: Set<number | string>;
  deadEnds: (number | string)[];
} => {
  const reachableScenarios = new Set<number | string>();
  const deadEnds: (number | string)[] = [];
  const path: (number | string)[] = [];

  const explore = (scenarioId: number | string, depth: number) => {
    if (depth > maxDepth || reachableScenarios.has(scenarioId)) return;

    const scenario = getExtendedScenarioById(scenarioId);
    if (!scenario) {
      deadEnds.push(scenarioId);
      return;
    }

    reachableScenarios.add(scenarioId);
    path.push(scenarioId);

    const nextScenarios = getPossibleNextScenarios(scenarioId);
    if (nextScenarios.length === 0) {
      deadEnds.push(scenarioId);
    } else {
      nextScenarios.forEach(nextId => explore(nextId, depth + 1));
    }
  };

  explore(startScenarioId, 0);

  return {
    path,
    reachableScenarios,
    deadEnds,
  };
};

/**
 * Debug function to analyze answer objects and identify issues
 */
export const debugAnswerObjects = (
  answers: any[]
): {
  summary: string;
  details: {
    index: number;
    isValid: boolean;
    issues: string[];
    structure: any;
  }[];
  recommendations: string[];
} => {
  const details = answers.map((answer, index) => {
    const validation = validateAnswerObject(answer);

    return {
      index,
      isValid: validation.isValid,
      issues: validation.errors,
      structure: {
        hasScenarioId: !!answer?.scenarioId,
        hasSelectedOption: !!answer?.selectedOption,
        hasScores: !!answer?.selectedOption?.scores,
        hasTimestamp: !!answer?.timestamp,
        isMultiSelect: !!answer?.isMultiSelect,
        hasSelectedOptions: !!answer?.selectedOptions,
        actualStructure: Object.keys(answer || {}),
      },
    };
  });

  const validCount = details.filter(d => d.isValid).length;
  const invalidCount = details.length - validCount;

  const recommendations: string[] = [];

  if (invalidCount > 0) {
    recommendations.push(`Fix ${invalidCount} invalid answer objects`);

    const missingScores = details.filter(
      d => d.structure.hasSelectedOption && !d.structure.hasScores
    ).length;

    if (missingScores > 0) {
      recommendations.push(`${missingScores} answers missing scores in selectedOption`);
    }

    const missingSelectedOption = details.filter(d => !d.structure.hasSelectedOption).length;

    if (missingSelectedOption > 0) {
      recommendations.push(`${missingSelectedOption} answers missing selectedOption entirely`);
    }
  }

  return {
    summary: `${validCount}/${details.length} answers are valid. ${invalidCount} need fixing.`,
    details,
    recommendations,
  };
};

/**
 * Emergency function to attempt to reconstruct answer objects from minimal data
 * This is a last resort when answer objects are severely malformed
 */
export const reconstructAnswerObjects = (
  corruptedAnswers: any[],
  fallbackScenarioId = 1
): ExtendedUserAnswer[] => {
  console.warn('Attempting to reconstruct corrupted answer objects');

  return corruptedAnswers.map((answer, index) => {
    // Try to salvage what we can
    const scenarioId = answer?.scenarioId || fallbackScenarioId + index;

    const selectedOption: ExtendedAnswerOption = {
      letter: answer?.selectedOption?.letter || 'A',
      text: answer?.selectedOption?.text || `Reconstructed option ${index + 1}`,
      scores: answer?.selectedOption?.scores || { logical: 1, emotional: 1, exploratory: 1 },
      next: answer?.selectedOption?.next || scenarioId + 1,
    };

    return createExtendedUserAnswer(scenarioId, selectedOption, false);
  });
};

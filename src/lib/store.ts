// lib/store.ts
// ==========================================================================
// ENHANCED ZUSTAND STORE WITH MULTI-SELECT AND ADVANCED PATH TRACKING
// ==========================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { generateArchetypeResults, calculateConfidenceGap } from './archetypeCalculator';
import {
  getExtendedScenarioById,
  calculateExtendedScores,
  safeCalculateExtendedScores,
  getNextScenarioId,
  isScenarioPathComplete,
  calculateExtendedProgress,
  createExtendedUserAnswer,
  validateAnswerObject,
  createScenarioQueue,
  validateQueueConvergence,
} from './data';
import {
  generateEnhancedUserPath,
  validatePathIntegrity,
  suggestPathRecovery,
  generatePathAnalytics,
  EnhancedUserPath,
  PathAnalytics,
} from './pathTracking';
import { generateAnalysisPromptFromStore, parseAIResponse } from './prompt';
import {
  ArchetypeResults,
  ExtendedUserAnswer,
  ExtendedAnswerOption,
  ExtendedScenario,
  UserData,
  ScoreData,
  ExtendedAssessmentResult,
  MultiSelectState,
  MultiSelectValidation,
  AIGeneratedSummary,
} from './types';
import { generateVulnerabilityAssessment, VulnerabilityAssessment } from './vulnerabilityPipeline';

// ==========================================================================
// TYPE DEFINITIONS FOR STORE
// ==========================================================================

interface NavigationHistoryEntry {
  scenarioId: number | string;
  action: 'forward' | 'backward' | 'jump' | 'restart';
  timestamp: Date;
}

interface ProgressPrediction {
  estimatedCompletion: Date | null;
  remainingTime: number; // in minutes
  completionProbability: number;
}

interface PathValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastValidatedAt: Date | null;
}

interface RecoveryOption {
  type: 'backtrack' | 'reset_from_point' | 'complete_restart';
  description: string;
  targetScenario: number | string;
  stepsLost: number;
}

interface PerformanceMetrics {
  storeUpdateCount: number;
  averageUpdateTime: number;
  lastUpdateTime: Date | null;
}

// interface ArchetypeResults {
//   primary: string;
//   secondary: string;
//   scores: Record<string, number>;
//   confidence: number;
//   description: string;
// }

// ==========================================================================
// ENHANCED STORE STATE INTERFACE
// ==========================================================================

const safeCalculateConfidenceGap = (archetypeResults: ArchetypeResults | null) => {
  if (!archetypeResults?.topMatches || archetypeResults.topMatches.length === 0) {
    console.warn('safeCalculateConfidenceGap: No valid archetype results');
    return {
      gap: 0,
      gapType: 'small_gap' as const,
      primaryArchetype: 'Unknown',
    };
  }
  return calculateConfidenceGap(archetypeResults.topMatches);
};

export interface EnhancedAssessmentState {
  // Core assessment data
  currentScenario: number | string;
  answers: ExtendedUserAnswer[];
  scores: ScoreData;
  userData: UserData | null;
  isComplete: boolean;
  isStarted: boolean;

  // Multi-select state
  currentMultiSelectState: MultiSelectState | null;
  isMultiSelectMode: boolean;
  multiSelectError: string | null;

  // Enhanced path tracking
  enhancedUserPath: EnhancedUserPath | null;
  pathAnalytics: PathAnalytics | null;
  navigationHistory: NavigationHistoryEntry[];

  // Session management
  sessionId: string;
  startTime: Date | null;
  lastActivityTime: Date | null;

  // Enhanced progress tracking
  estimatedProgress: number;
  progressPrediction: ProgressPrediction;

  // Path validation and error handling
  pathValidation: PathValidation;

  // Recovery state
  recoveryOptions: RecoveryOption[];

  // Results and analysis
  archetypeResults: ArchetypeResults | null;
  vulnerabilityAssessment: VulnerabilityAssessment | null;

  // Debug and development
  debugMode: boolean;
  performanceMetrics: PerformanceMetrics;

  aiGeneratedSummary: AIGeneratedSummary | null;
  aiResponseStatus: AIResponseStatus;
}

// ==========================================================================
// STORE ACTIONS INTERFACE
// ==========================================================================

export interface EnhancedAssessmentActions {
  // Computed properties (as functions)
  getCurrentQuestion: () => ExtendedScenario | null;
  getCanGoBack: () => boolean;
  getCanGoForward: () => boolean;
  getTotalAnswered: () => number;
  getIsCurrentScenarioMultiSelect: () => boolean;
  getPathComplexity: () => number;
  getPathEfficiency: () => number;
  getExplorationScore: () => number;
  getDecisionConsistency: () => number;

  // User management
  setUserData: (data: UserData) => void;

  // Assessment flow
  startAssessment: () => void;
  submitAnswer: (option: ExtendedAnswerOption) => void;
  submitMultiSelectAnswer: (options: ExtendedAnswerOption[]) => void;
  goToNextScenario: () => void;
  goToPreviousScenario: () => void;
  goToScenario: (scenarioId: number | string) => void;

  /**
   * ✅ NEW: Navigate back during queue processing
   * Handles the complex logic of going back within multi-select queues
   */
  goToPreviousQueueScenario: () => void;

  // Multi-select management
  initializeMultiSelect: (scenario: ExtendedScenario) => void;
  toggleMultiSelectOption: (optionId: string) => void;
  validateMultiSelectState: () => MultiSelectValidation;
  clearMultiSelectError: () => void;

  // Path tracking and navigation
  generateEnhancedPath: () => void;
  validatePath: () => void;
  recoverPath: (option: RecoveryOption) => void;
  savePathCheckpoint: () => void;
  restoreFromCheckpoint: () => void;
  generatePathInsights: () => PathAnalytics;
  getPathPrediction: () => ProgressPrediction;

  // Results generation
  generateResults: () => void;
  getEnhancedAssessmentResult: () => ExtendedAssessmentResult | null;

  // Session management
  updateActivityTime: () => void;
  exportSessionData: () => string;
  importSessionData: (data: string) => void;
  validateStoreIntegrity: () => { isValid: boolean; errors: string[] };

  // State management
  resetAssessment: () => void;

  // Debug and performance
  enableDebugMode: () => void;
  disableDebugMode: () => void;
  toggleDebugMode: () => void;
  resetPerformanceMetrics: () => void;
  exportDebugData: () => Record<string, unknown>;

  // NEW: AI response management actions
  generateAISummary: (prompt: string, aiModel?: string) => Promise<void>;
  autoGenerateAISummaryIfNeeded: () => Promise<void>;
  shouldRegenerateAISummary: () => boolean;
  setAISummary: (summary: AIGeneratedSummary) => void;
  clearAISummary: () => void;
  retryAIGeneration: () => Promise<void>;
  getAISummaryStatus: () => AIResponseStatus;
}

// Combined store interface
export interface EnhancedAssessmentStore
  extends EnhancedAssessmentState,
    EnhancedAssessmentActions {}

// ==========================================================================
// INITIAL STATE
// ==========================================================================

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

const initialState: EnhancedAssessmentState = {
  // Core assessment data
  currentScenario: 1,
  answers: [],
  scores: { emotional: 0, logical: 0, exploratory: 0 },
  userData: null,
  isComplete: false,
  isStarted: false,

  // Multi-select state
  currentMultiSelectState: null,
  isMultiSelectMode: false,
  multiSelectError: null,
  multiSelectNavigation: null,

  // Enhanced path tracking
  enhancedUserPath: null,
  pathAnalytics: null,
  navigationHistory: [],

  // Session management
  sessionId: generateSessionId(),
  startTime: null,
  lastActivityTime: null,

  // Enhanced progress tracking
  estimatedProgress: 0,
  progressPrediction: {
    estimatedCompletion: null,
    remainingTime: 0,
    completionProbability: 0,
  },

  // Path validation and error handling
  pathValidation: {
    isValid: true,
    errors: [],
    warnings: [],
    lastValidatedAt: null,
  },

  // Recovery state
  recoveryOptions: [],

  // Results and analysis
  archetypeResults: null,
  vulnerabilityAssessment: null,

  // Debug and development
  debugMode: false,
  performanceMetrics: {
    storeUpdateCount: 0,
    averageUpdateTime: 0,
    lastUpdateTime: null,
  },

  // NEW: AI response initial state
  aiGeneratedSummary: null,
  aiResponseStatus: {
    isGenerating: false,
    lastError: null,
    retryCount: 0,
    lastGeneratedAt: null,
  },
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

const updateComputedProperties = (
  set: (partial: Partial<EnhancedAssessmentState>) => void,
  get: () => EnhancedAssessmentStore
): void => {
  const state = get();
  const currentQuestion = getExtendedScenarioById(state.currentScenario);

  set({
    estimatedProgress: calculateExtendedProgress(state.answers, state.currentScenario),
    progressPrediction: {
      ...state.progressPrediction,
      completionProbability: Math.min(0.95, 0.6 + state.answers.length * 0.05),
    },
  });
};

// ==========================================================================
// ENHANCED ZUSTAND STORE
// ==========================================================================

export const useEnhancedAssessmentStore = create<EnhancedAssessmentStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        ...initialState,

        // ==========================================================================
        // COMPUTED PROPERTIES AS FUNCTIONS
        // ==========================================================================

        getCurrentQuestion: () => {
          const state = get();
          return getExtendedScenarioById(state.currentScenario);
        },

        getCanGoBack: () => {
          const state = get();
          return state.answers.length > 0;
        },

        getCanGoForward: () => {
          const state = get();
          return !state.isComplete;
        },

        getTotalAnswered: () => {
          const state = get();
          return state.answers.length;
        },

        getIsCurrentScenarioMultiSelect: () => {
          const state = get();
          const currentQuestion = getExtendedScenarioById(state.currentScenario);
          return currentQuestion?.type === 'multi-select';
        },

        getPathComplexity: () => {
          const state = get();
          return state.navigationHistory.length * 0.1;
        },

        getPathEfficiency: () => {
          const state = get();
          const totalSteps = state.navigationHistory.length;
          const backwardSteps = state.navigationHistory.filter(h => h.action === 'backward').length;
          return totalSteps > 0 ? 1 - backwardSteps / totalSteps : 1.0;
        },

        getExplorationScore: () => {
          const state = get();
          const uniqueScenarios = new Set(state.navigationHistory.map(h => h.scenarioId));
          return uniqueScenarios.size * 0.1;
        },

        getDecisionConsistency: () => {
          const state = get();
          return state.answers.length > 0 ? 1.0 : 0.0;
        },

        // ==========================================================================
        // USER MANAGEMENT
        // ==========================================================================

        setUserData: (data: UserData) => {
          set({
            userData: data,
            lastActivityTime: new Date(),
          });
        },

        // ==========================================================================
        // ASSESSMENT FLOW
        // ==========================================================================

        startAssessment: () => {
          const now = new Date();
          set(state => ({
            isStarted: true,
            startTime: now,
            lastActivityTime: now,
            currentScenario: 1,
            sessionId: generateSessionId(),
            navigationHistory: [
              ...state.navigationHistory,
              {
                scenarioId: 1,
                action: 'forward' as const,
                timestamp: now,
              },
            ],
          }));

          updateComputedProperties(set, get);
        },

        submitAnswer: (option: ExtendedAnswerOption) => {
          const state = get();
          const currentQuestion = getExtendedScenarioById(state.currentScenario);

          if (!currentQuestion || !option) {
            console.error('Missing currentQuestion or option in submitAnswer');
            return;
          }

          // Validate that the option has required properties
          if (!option.scores || !option.letter || !option.text) {
            console.error('Invalid option structure:', option);
            return;
          }

          const now = new Date();
          const answer: ExtendedUserAnswer = {
            scenarioId: state.currentScenario,
            selectedOption: option, // Single option for backward compatibility
            timestamp: now,
            responseTime: now.getTime() - (state.lastActivityTime?.getTime() || now.getTime()),
            isMultiSelect: false,
          };

          // ✅ PREVENT DUPLICATES: Remove any existing answers for this scenario
          const filteredAnswers = state.answers.filter(
            existingAnswer => existingAnswer.scenarioId !== state.currentScenario
          );
          const newAnswers = [...filteredAnswers, answer];

          // Use safe calculation with error handling
          const calculationResult = safeCalculateExtendedScores(newAnswers);
          if (calculationResult.errors.length > 0) {
            console.error('Score calculation errors:', calculationResult.errors);
          }
          if (calculationResult.warnings.length > 0) {
            console.warn('Score calculation warnings:', calculationResult.warnings);
          }

          const nextScenarioId = getNextScenarioId(state.currentScenario, option);

          // ✅ FIX: Don't check completion when navigating TO a scenario
          // Only set completion if we're explicitly told to complete (nextScenarioId is null)
          const shouldComplete = nextScenarioId === null || nextScenarioId === undefined;

          set({
            answers: newAnswers,
            scores: calculationResult.scores,
            currentScenario: nextScenarioId,
            lastActivityTime: now,
            isComplete: shouldComplete, // ✅ Only complete if explicitly told to
            navigationHistory: [
              ...state.navigationHistory,
              {
                scenarioId: nextScenarioId,
                action: 'forward' as const,
                timestamp: now,
              },
            ],
          });

          updateComputedProperties(set, get);
        },

        submitMultiSelectAnswer: (options: ExtendedAnswerOption[]) => {
          const state = get();
          const currentQuestion = getExtendedScenarioById(state.currentScenario);

          if (!currentQuestion || !options || options.length === 0) {
            console.error('Missing currentQuestion or options in submitMultiSelectAnswer');
            return;
          }

          // Validate all options
          const invalidOptions = options.filter(
            option => !option.scores || !option.letter || !option.text
          );

          if (invalidOptions.length > 0) {
            console.error('Invalid options found:', invalidOptions);
            return;
          }

          // Create scenario queue for sequential processing
          const scenarioQueue = createScenarioQueue(options, state.currentScenario);
          const queueValidation = validateQueueConvergence(scenarioQueue);

          if (!queueValidation.isValid) {
            console.warn('Queue validation warnings:', queueValidation.warnings);
          }

          // Create the multi-select answer record
          const now = new Date();
          const answer: ExtendedUserAnswer = {
            scenarioId: state.currentScenario,
            selectedOption: options[0], // First option for backward compatibility
            selectedOptions: options,
            timestamp: now,
            responseTime: now.getTime() - (state.lastActivityTime?.getTime() || now.getTime()),
            isMultiSelect: true,
            totalScore: options.reduce(
              (total, option) => ({
                logical: total.logical + (option.scores?.logical || 0),
                emotional: total.emotional + (option.scores?.emotional || 0),
                exploratory: total.exploratory + (option.scores?.exploratory || 0),
              }),
              { logical: 0, emotional: 0, exploratory: 0 }
            ),
          };

          // ✅ PREVENT DUPLICATES: Remove any existing answers for this scenario
          const filteredAnswers = state.answers.filter(
            existingAnswer => existingAnswer.scenarioId !== state.currentScenario
          );
          const newAnswers = [...filteredAnswers, answer];

          // Use safe calculation with error handling
          const calculationResult = safeCalculateExtendedScores(newAnswers);
          if (calculationResult.errors.length > 0) {
            console.error('Multi-select score calculation errors:', calculationResult.errors);
          }
          if (calculationResult.warnings.length > 0) {
            console.warn('Multi-select score calculation warnings:', calculationResult.warnings);
          }

          // Initialize multi-select navigation
          const multiSelectNavigation: MultiSelectNavigationState = {
            isProcessingQueue: true,
            scenarioQueue,
            currentQueueIndex: 0,
            originalMultiSelectScenario: state.currentScenario,
            convergencePoint: queueValidation.convergencePoint || undefined,
            queueAnswers: [],
          };

          // Navigate to first scenario in queue
          const firstScenarioId = scenarioQueue[0]?.scenarioId;
          const shouldComplete = firstScenarioId === null || firstScenarioId === undefined;

          set({
            answers: newAnswers,
            scores: calculationResult.scores,
            currentScenario: firstScenarioId,
            isMultiSelectMode: false,
            currentMultiSelectState: null,
            multiSelectNavigation, // ✅ New navigation state
            lastActivityTime: now,
            isComplete: shouldComplete,
            navigationHistory: [
              ...state.navigationHistory,
              {
                scenarioId: firstScenarioId,
                action: 'forward' as const,
                timestamp: now,
              },
            ],
          });

          updateComputedProperties(set, get);
        },

        // New action for processing queue scenarios:
        processQueueScenario: (option: ExtendedAnswerOption) => {
          const state = get();
          const navigation = state.multiSelectNavigation;

          if (!navigation?.isProcessingQueue) {
            console.error('Not in queue processing mode');
            return;
          }

          const currentQueueItem = navigation.scenarioQueue[navigation.currentQueueIndex];
          if (!currentQueueItem) {
            console.error('No current queue item');
            return;
          }

          // Create answer for current queue scenario
          const now = new Date();
          const queueAnswer: ExtendedUserAnswer = {
            scenarioId: currentQueueItem.scenarioId,
            selectedOption: option,
            timestamp: now,
            responseTime: now.getTime() - (state.lastActivityTime?.getTime() || now.getTime()),
            isMultiSelect: false,
          };

          // Update queue state
          const updatedQueue = [...navigation.scenarioQueue];
          updatedQueue[navigation.currentQueueIndex] = {
            ...currentQueueItem,
            isProcessed: true,
          };

          const updatedQueueAnswers = [...navigation.queueAnswers, queueAnswer];
          const nextQueueIndex = navigation.currentQueueIndex + 1;
          const hasMoreInQueue = nextQueueIndex < navigation.scenarioQueue.length;

          let nextScenarioId: number | string | null;
          let isComplete = false;

          if (hasMoreInQueue) {
            // Move to next scenario in queue
            nextScenarioId = navigation.scenarioQueue[nextQueueIndex].scenarioId;
          } else {
            // Queue complete - move to convergence point
            nextScenarioId = navigation.convergencePoint || null;
            isComplete = nextScenarioId === null || nextScenarioId === undefined;
          }

          // Update main answers with queue answers
          const allAnswers = [...state.answers, ...updatedQueueAnswers];
          const calculationResult = safeCalculateExtendedScores(allAnswers);

          const updatedNavigation: MultiSelectNavigationState = {
            ...navigation,
            scenarioQueue: updatedQueue,
            currentQueueIndex: nextQueueIndex,
            queueAnswers: updatedQueueAnswers,
            isProcessingQueue: hasMoreInQueue,
          };

          set({
            answers: allAnswers,
            scores: calculationResult.scores,
            currentScenario: nextScenarioId,
            multiSelectNavigation: hasMoreInQueue ? updatedNavigation : null, // Clear when done
            lastActivityTime: now,
            isComplete,
            navigationHistory: [
              ...state.navigationHistory,
              {
                scenarioId: nextScenarioId,
                action: 'forward' as const,
                timestamp: now,
              },
            ],
          });

          updateComputedProperties(set, get);
        },

        goToNextScenario: () => {
          const state = get();
          if (state.isComplete) return;

          const nextScenarioId = (state.currentScenario as number) + 1;
          set({
            currentScenario: nextScenarioId,
            lastActivityTime: new Date(),
            navigationHistory: [
              ...state.navigationHistory,
              {
                scenarioId: nextScenarioId,
                action: 'forward' as const,
                timestamp: new Date(),
              },
            ],
          });

          updateComputedProperties(set, get);
        },

        goToPreviousScenario: () => {
          const state = get();

          // ✅ NEW: Check if we're in queue processing mode
          if (state.multiSelectNavigation?.isProcessingQueue) {
            // Delegate to queue-specific navigation
            get().goToPreviousQueueScenario();
            return;
          }

          if (state.answers.length === 0) return;

          const now = new Date();

          // ✅ SIMPLE FIX: Find which answer led TO the current scenario
          const answerThatLedHere = state.answers.find(
            answer => answer.selectedOption.next === state.currentScenario
          );

          // const newAnswers = state.answers.slice(0, -1);

          let newAnswers: ExtendedUserAnswer[];
          let previousScenario: number | string;

          if (answerThatLedHere) {
            // ✅ Go back to where that answer was given & remove it
            previousScenario = answerThatLedHere.scenarioId;
            newAnswers = state.answers.filter(answer => answer !== answerThatLedHere);
          } else {
            // ✅ Fallback: use the old logic
            newAnswers = state.answers.slice(0, -1);
            previousScenario =
              newAnswers.length > 0 ? newAnswers[newAnswers.length - 1].scenarioId : 1;
          }

          // Use safe calculation with error handling
          const calculationResult = safeCalculateExtendedScores(newAnswers);
          if (calculationResult.errors.length > 0) {
            console.error('Previous scenario score calculation errors:', calculationResult.errors);
          }

          // const previousScenario =
          //   newAnswers.length > 0 ? newAnswers[newAnswers.length - 1].scenarioId : 1;

          set({
            answers: newAnswers,
            scores: calculationResult.scores,
            currentScenario: previousScenario,
            isComplete: false,
            lastActivityTime: now,
            navigationHistory: [
              ...state.navigationHistory,
              {
                scenarioId: previousScenario,
                action: 'backward' as const,
                timestamp: now,
              },
            ],
          });

          updateComputedProperties(set, get);
        },

        /**
         * ✅ NEW: Navigate back during queue processing
         * This is the new function that handles queue-specific back navigation
         */
        goToPreviousQueueScenario: () => {
          const state = get();
          const navigation = state.multiSelectNavigation;

          if (!navigation?.isProcessingQueue) {
            console.error('Not in queue processing mode');
            return;
          }

          const currentQueueIndex = navigation.currentQueueIndex;
          const now = new Date();

          if (currentQueueIndex > 0) {
            // ✅ Go back to previous scenario in queue
            const previousQueueIndex = currentQueueIndex - 1;
            const previousQueueItem = navigation.scenarioQueue[previousQueueIndex];

            // Remove the last queue answer if it exists
            const updatedQueueAnswers = navigation.queueAnswers.slice(0, -1);

            // Update queue state
            const updatedQueue = [...navigation.scenarioQueue];
            updatedQueue[currentQueueIndex] = {
              ...updatedQueue[currentQueueIndex],
              isProcessed: false, // Mark current as unprocessed
            };

            const updatedNavigation: MultiSelectNavigationState = {
              ...navigation,
              scenarioQueue: updatedQueue,
              currentQueueIndex: previousQueueIndex,
              queueAnswers: updatedQueueAnswers,
            };

            // Recalculate main answers (original multi-select + remaining queue answers)
            const allAnswers = [...state.answers, ...updatedQueueAnswers];
            const calculationResult = safeCalculateExtendedScores(allAnswers);

            set({
              answers: allAnswers,
              scores: calculationResult.scores,
              currentScenario: previousQueueItem.scenarioId,
              multiSelectNavigation: updatedNavigation,
              lastActivityTime: now,
              navigationHistory: [
                ...state.navigationHistory,
                {
                  scenarioId: previousQueueItem.scenarioId,
                  action: 'backward' as const,
                  timestamp: now,
                },
              ],
            });
          } else {
            // ✅ Go back to original multi-select scenario
            // Clear all queue answers and return to the multi-select question

            // Remove the multi-select answer from main answers
            const newMainAnswers = state.answers.slice(0, -1);
            const calculationResult = safeCalculateExtendedScores(newMainAnswers);

            // Determine the previous scenario before multi-select
            const previousScenario = navigation.originalMultiSelectScenario;

            set({
              answers: newMainAnswers,
              scores: calculationResult.scores,
              currentScenario: previousScenario,
              isMultiSelectMode: true, // Return to multi-select mode
              multiSelectNavigation: null, // Clear queue processing
              currentMultiSelectState: {
                scenarioId: previousScenario,
                selectedOptions: [], // Reset selections
                minSelections: getExtendedScenarioById(previousScenario)?.minSelection || 2,
                maxSelections: getExtendedScenarioById(previousScenario)?.maxSelection || 3,
                isValid: false,
              },
              lastActivityTime: now,
              isComplete: false,
              navigationHistory: [
                ...state.navigationHistory,
                {
                  scenarioId: previousScenario,
                  action: 'backward' as const,
                  timestamp: now,
                },
              ],
            });
          }

          updateComputedProperties(set, get);
        },

        goToScenario: (scenarioId: number | string) => {
          set(state => ({
            currentScenario: scenarioId,
            lastActivityTime: new Date(),
            navigationHistory: [
              ...state.navigationHistory,
              {
                scenarioId,
                action: 'jump' as const,
                timestamp: new Date(),
              },
            ],
          }));

          updateComputedProperties(set, get);
        },

        // ==========================================================================
        // MULTI-SELECT MANAGEMENT
        // ==========================================================================

        initializeMultiSelect: (scenario: ExtendedScenario) => {
          set({
            isMultiSelectMode: true,
            currentMultiSelectState: {
              scenarioId: scenario.id,
              selectedOptions: [],
              minSelections: scenario.minSelections || 1,
              maxSelections: scenario.maxSelections || scenario.options.length,
              isValid: false,
            },
            multiSelectError: null,
          });
        },

        toggleMultiSelectOption: (optionId: string) => {
          const state = get();
          if (!state.currentMultiSelectState) return;

          const currentSelections = state.currentMultiSelectState.selectedOptions;
          const isSelected = currentSelections.some(opt => opt.id === optionId);

          let newSelections: ExtendedAnswerOption[];

          if (isSelected) {
            newSelections = currentSelections.filter(opt => opt.id !== optionId);
          } else {
            const scenario = getExtendedScenarioById(state.currentScenario);
            const option = scenario?.options.find(opt => opt.id === optionId);
            if (option) {
              newSelections = [...currentSelections, option];
            } else {
              return;
            }
          }

          const isValid =
            newSelections.length >= state.currentMultiSelectState.minSelections &&
            newSelections.length <= state.currentMultiSelectState.maxSelections;

          set({
            currentMultiSelectState: {
              ...state.currentMultiSelectState,
              selectedOptions: newSelections,
              isValid,
            },
            multiSelectError: null,
          });
        },

        validateMultiSelectState: (): MultiSelectValidation => {
          const state = get();
          if (!state.currentMultiSelectState) {
            return { isValid: false, errors: ['No multi-select state found'] };
          }

          const errors: string[] = [];
          const { selectedOptions, minSelections, maxSelections } = state.currentMultiSelectState;

          if (selectedOptions.length < minSelections) {
            errors.push(`Please select at least ${minSelections} option(s)`);
          }

          if (selectedOptions.length > maxSelections) {
            errors.push(`Please select no more than ${maxSelections} option(s)`);
          }

          return {
            isValid: errors.length === 0,
            errors,
          };
        },

        clearMultiSelectError: () => {
          set({ multiSelectError: null });
        },

        // ==========================================================================
        // PATH TRACKING AND NAVIGATION
        // ==========================================================================

        generateEnhancedPath: () => {
          const state = get();
          const enhancedPath = generateEnhancedUserPath(state.answers, state.navigationHistory);
          set({ enhancedUserPath: enhancedPath });
        },

        validatePath: () => {
          const state = get();
          if (!state.enhancedUserPath) return;

          const validation = validatePathIntegrity(state.enhancedUserPath);
          const recoveryOptions = validation.isValid
            ? []
            : suggestPathRecovery(state.enhancedUserPath);

          set({
            pathValidation: {
              ...validation,
              lastValidatedAt: new Date(),
            },
            recoveryOptions,
          });
        },

        recoverPath: (option: RecoveryOption) => {
          switch (option.type) {
            case 'backtrack': {
              set(state => ({
                currentScenario: option.targetScenario,
                answers: state.answers.slice(0, -option.stepsLost),
                lastActivityTime: new Date(),
              }));
              break;
            }
            case 'reset_from_point': {
              set({
                currentScenario: option.targetScenario,
                answers: [],
                scores: { emotional: 0, logical: 0, exploratory: 0 },
                lastActivityTime: new Date(),
              });
              break;
            }
            case 'complete_restart': {
              get().resetAssessment();
              break;
            }
            default:
              break;
          }

          updateComputedProperties(set, get);
        },

        savePathCheckpoint: () => {
          const state = get();
          set({
            pathValidation: {
              ...state.pathValidation,
              lastValidatedAt: new Date(),
            },
          });
        },

        restoreFromCheckpoint: () => {
          // Implementation for checkpoint restoration
          set({
            lastActivityTime: new Date(),
          });
        },

        generatePathInsights: (): PathAnalytics => {
          const state = get();
          if (state.enhancedUserPath) {
            return generatePathAnalytics(state.enhancedUserPath);
          }

          return {
            totalPathLength: 0,
            branchingPoints: 0,
            backtrackCount: 0,
            explorationDepth: 0,
            decisionSpeed: 0,
            consistencyScore: 0,
            pathEfficiency: 0,
          };
        },

        getPathPrediction: (): ProgressPrediction => {
          const state = get();
          const estimatedTime = (10 - state.answers.length) * 45; // 45 seconds per question

          return {
            estimatedCompletion: new Date(Date.now() + estimatedTime * 1000),
            remainingTime: Math.ceil(estimatedTime / 60),
            completionProbability: Math.min(0.95, 0.6 + state.answers.length * 0.05),
          };
        },

        // ==========================================================================
        // RESULTS GENERATION
        // ==========================================================================

        generateResults: () => {
          const state = get();
          if (!state.isComplete || !state.scores) {
            console.warn('Cannot generate results: assessment not complete or missing scores');
            return;
          }

          try {
            console.log('Generating results with scores:', state.scores);

            // Step 1: Generate archetype results with correct parameters (scores only)
            const archetypeResults = generateArchetypeResults(state.scores);

            if (!archetypeResults?.topMatches || archetypeResults.topMatches.length === 0) {
              console.error('Failed to generate valid archetype results');
              return;
            }

            console.log('Generated archetype results:', {
              topMatches: archetypeResults.topMatches.length,
              primaryArchetype: archetypeResults.topMatches[0]?.archetype?.name,
            });

            // Step 2: Generate vulnerability assessment with correct parameters (answers + archetypeResults)
            const vulnerabilityAssessment = generateVulnerabilityAssessment(
              state.answers,
              archetypeResults
            );

            if (!vulnerabilityAssessment?.personaSelection?.selectedPersonas) {
              console.error('Failed to generate valid vulnerability assessment');
            } else {
              console.log('Generated vulnerability assessment:', {
                selectedPersonas: vulnerabilityAssessment.personaSelection.selectedPersonas.length,
                primaryArchetype: vulnerabilityAssessment.personaSelection.primaryArchetype,
              });
            }

            // Step 3: Update store with correct results (preserve the original data structures)
            set({
              archetypeResults,
              vulnerabilityAssessment,
              lastActivityTime: new Date(),
            });

            console.log('✅ Results generation completed successfully');
          } catch (error) {
            console.error('Error generating results:', error);

            // Set fallback state to prevent undefined errors
            set({
              archetypeResults: null,
              vulnerabilityAssessment: {
                personaSelection: {
                  selectedPersonas: [],
                  selectionReason: 'small_gap',
                  confidenceGap: 0,
                  primaryArchetype: 'Unknown',
                },
                educationalContent: {
                  overviewMessage: 'Results generation failed. Please try again.',
                  personaEducation: [],
                  keyRedFlags: [],
                  protectionStrategies: [],
                  confidenceMessage: 'Unable to generate assessment',
                },
                selectionAnalysis: {
                  totalPersonasSelected: 0,
                  riskDistribution: { high: 0, medium: 0, low: 0 },
                  dominantManipulationTypes: [],
                  vulnerabilityThemes: [],
                },
                riskProfile: {
                  overallRiskLevel: 'low',
                  riskScore: 0,
                  vulnerabilityFactors: [],
                  protectiveFactors: [],
                  riskScenarios: [],
                },
                actionablePlan: {
                  immediateActions: ['Retake the assessment for accurate results'],
                  ongoingPractices: [],
                  relationshipGuidelines: [],
                  redFlagChecklist: [],
                  emergencySigns: [],
                  resourceLinks: [],
                },
                confidenceGap: {
                  gap: 0,
                  gapType: 'small_gap',
                  primaryArchetype: 'Unknown',
                  interpretation: 'Results generation failed',
                },
              },
              lastActivityTime: new Date(),
            });
          }
        },

        getEnhancedAssessmentResult: (): ExtendedAssessmentResult | null => {
          const state = get();
          if (!state.isComplete || !state.archetypeResults) return null;

          try {
            // Safe date handling - handle both string and Date objects
            const parseDate = (dateValue: string | Date | null): Date | null => {
              if (!dateValue) return null;
              if (dateValue instanceof Date) return dateValue;
              if (typeof dateValue === 'string') return new Date(dateValue);
              return null;
            };

            const startTimeDate = new Date(state.startTime);
            // const currentTime = Date.now();
            const lastActivityDate = new Date(state.lastActivityTime);
            const totalTime = startTimeDate ? lastActivityDate - startTimeDate : 0;

            return {
              answers: state.answers,
              scores: state.scores,
              archetypeResults: state.archetypeResults,
              vulnerabilityAssessment: state.vulnerabilityAssessment,
              userData: state.userData,
              enhancedUserPath: state.enhancedUserPath,
              pathAnalytics: state.pathAnalytics,
              completedAt: new Date(),
              assessmentDuration: Math.round(totalTime / 1000), // Convert to seconds
              sessionData: {
                sessionId: state.sessionId,
                startTime: startTimeDate,
                totalTime: Math.round(totalTime / 1000), // Convert to seconds
              },
            };
          } catch (error) {
            console.error('Error in getEnhancedAssessmentResult:', error);
            return null;
          }
        },

        // ==========================================================================
        // SESSION MANAGEMENT
        // ==========================================================================

        updateActivityTime: () => {
          set({ lastActivityTime: new Date() });
        },

        exportSessionData: (): string => {
          const state = get();
          const exportData = {
            answers: state.answers,
            scores: state.scores,
            userPath: state.enhancedUserPath,
            sessionId: state.sessionId,
            startTime: state.startTime,
            navigationHistory: state.navigationHistory,
          };

          return JSON.stringify(exportData, null, 2);
        },

        importSessionData: (data: string) => {
          try {
            const importedData = JSON.parse(data) as {
              answers?: ExtendedUserAnswer[];
              scores?: ScoreData;
              userPath?: EnhancedUserPath;
              navigationHistory?: NavigationHistoryEntry[];
            };

            set(state => ({
              ...state,
              answers: importedData.answers || [],
              scores: importedData.scores || { emotional: 0, logical: 0, exploratory: 0 },
              enhancedUserPath: importedData.userPath || null,
              navigationHistory: importedData.navigationHistory || [],
              lastActivityTime: new Date(),
            }));

            updateComputedProperties(set, get);
          } catch (error) {
            console.error('Failed to import session data:', error);
          }
        },

        validateStoreIntegrity: (): { isValid: boolean; errors: string[] } => {
          const state = get();
          const errors: string[] = [];

          if (!state.sessionId) errors.push('Missing session ID');
          if (state.answers.length > 0 && !state.startTime) errors.push('Missing start time');
          if (state.isComplete && !state.archetypeResults) errors.push('Missing archetype results');

          if (state.isMultiSelectMode && !state.currentMultiSelectState) {
            errors.push('Multi-select mode active but no multi-select state');
          }

          if (state.answers.length > 0 && !state.enhancedUserPath) {
            errors.push('Missing enhanced user path');
          }

          return {
            isValid: errors.length === 0,
            errors,
          };
        },

        // ==========================================================================
        // STATE MANAGEMENT
        // ==========================================================================

        resetAssessment: () => {
          set(state => ({
            ...initialState,
            // userData: state.userData,
            debugMode: state.debugMode,
            sessionId: generateSessionId(),
          }));

          updateComputedProperties(set, get);
        },

        // ==========================================================================
        // DEBUG AND PERFORMANCE
        // ==========================================================================

        enableDebugMode: () => {
          set({ debugMode: true });
        },

        disableDebugMode: () => {
          set({ debugMode: false });
        },

        toggleDebugMode: () => {
          set(state => ({ debugMode: !state.debugMode }));
        },

        resetPerformanceMetrics: () => {
          set({
            performanceMetrics: {
              storeUpdateCount: 0,
              averageUpdateTime: 0,
              lastUpdateTime: null,
            },
          });
        },

        exportDebugData: (): Record<string, unknown> => {
          const state = get();

          // Validate current answers
          const answerValidation = state.answers.map((answer, index) => {
            const validation = validateAnswerObject(answer);
            return {
              index,
              isValid: validation.isValid,
              errors: validation.errors,
              answer: answer,
            };
          });

          return {
            sessionId: state.sessionId,
            currentScenario: state.currentScenario,
            answers: state.answers,
            answerValidation,
            scores: state.scores,
            enhancedUserPath: state.enhancedUserPath,
            pathAnalytics: state.pathAnalytics,
            navigationHistory: state.navigationHistory,
            pathValidation: state.pathValidation,
            recoveryOptions: state.recoveryOptions,
            performanceMetrics: state.performanceMetrics,
            isMultiSelectMode: state.isMultiSelectMode,
            currentMultiSelectState: state.currentMultiSelectState,
            storeIntegrity: state.validateStoreIntegrity(),
          };
        },

        // ==========================================================================
        // NEW: AI SUMMARY MANAGEMENT ACTIONS
        // ==========================================================================

        generateAISummary: async (
          prompt: string,
          aiModel = 'gemini-1.5-flash',
          forceRegenerate = false
        ) => {
          const state = get();

          // CHECK 1: Avoid API call if summary already exists (unless forced)
          if (!forceRegenerate && state.aiGeneratedSummary) {
            console.log('AI summary already exists, skipping generation');
            return;
          }

          // CHECK 2: Avoid API call if already generating
          if (state.aiResponseStatus.isGenerating) {
            console.log('AI summary generation already in progress');
            return;
          }

          // CHECK 3: Ensure we have the required data to generate
          if (!state.archetypeResults || !state.vulnerabilityAssessment || !state.isComplete) {
            console.warn('Cannot generate AI summary: missing required assessment data');
            set(state => ({
              aiResponseStatus: {
                ...state.aiResponseStatus,
                lastError: 'Assessment not complete or missing results',
              },
            }));
            return;
          }

          // CHECK 4: Ensure meaningful text segregation is taken
          // if (state.aiGeneratedSummary && !state.aiGeneratedSummary.sectionsComplete) {
          //   console.log('Segregated AI response is unavailable. retrying.');
          //   if (state.aiGeneratedSummary.rawResponse) {
          //     console.log('we have raw');
          //     parseAIResponse(state.aiGeneratedSummary.rawResponse);
          //   }
          //   return;
          // }

          const startTime = Date.now();

          set(state => ({
            aiResponseStatus: {
              ...state.aiResponseStatus,
              isGenerating: true,
              lastError: null,
            },
          }));

          try {
            // Call your AI service (replace with your actual implementation)
            const response = await fetch('/api/gemini', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: prompt,
                model: aiModel,
              }),
            });

            if (!response.ok) {
              throw new Error(`AI generation failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('raw response', data);
            const responseTime = Date.now() - startTime;

            // Parse the AI response into sections
            const sections = parseAIResponse(data.text);

            const aiSummary: AIGeneratedSummary = {
              personalizedInterpretation: sections.personalizedInterpretation,
              vulnerabilityAnalysis: sections.vulnerabilityAnalysis,
              relationshipInsights: sections.relationshipInsights,
              rawResponse: data.text,
              generatedAt: new Date(),
              promptUsed: prompt,
              aiModel,
              responseTime,
              wordCount: data.text.split(/\s+/).length,
              sectionsComplete:
                sections.personalizedInterpretation &&
                sections.vulnerabilityAnalysis &&
                sections.relationshipInsights,
              version: '1.0',
            };

            set(state => ({
              aiGeneratedSummary: aiSummary,
              aiResponseStatus: {
                ...state.aiResponseStatus,
                isGenerating: false,
                lastGeneratedAt: new Date(),
                retryCount: 0,
              },
            }));

            console.log('✅ AI summary generated successfully');
          } catch (error) {
            console.error('AI summary generation failed:', error);

            set(state => ({
              aiResponseStatus: {
                ...state.aiResponseStatus,
                isGenerating: false,
                lastError: error instanceof Error ? error.message : 'Unknown error',
                retryCount: state.aiResponseStatus.retryCount + 1,
              },
            }));
          }
        },

        // NEW: Auto-generate summary when results are ready
        autoGenerateAISummaryIfNeeded: async () => {
          const state = get();

          // Only auto-generate if:
          // 1. Assessment is complete
          // 2. We have archetype and vulnerability results
          // 3. No AI summary exists yet
          // 4. Not currently generating
          // 5. No recent generation errors (avoid retry loops)
          if (
            state.isComplete &&
            state.archetypeResults &&
            state.vulnerabilityAssessment &&
            !state.aiGeneratedSummary &&
            !state.aiResponseStatus.isGenerating &&
            state.aiResponseStatus.retryCount < 3
          ) {
            console.log('Auto-generating AI summary...');

            // Generate the prompt using the current store state
            const prompt = generateAnalysisPromptFromStore();
            await get().generateAISummary(prompt, 'gemini-1.5-flash');
          }
        },

        // NEW: Check if AI summary should be regenerated (for data changes)
        shouldRegenerateAISummary: (): boolean => {
          const state = get();

          if (!state.aiGeneratedSummary) return true;

          // Check if core data has changed since last generation
          const lastGenerated = state.aiGeneratedSummary.generatedAt;
          const lastResultsUpdate = state.lastActivityTime;

          if (lastResultsUpdate && lastGenerated && lastResultsUpdate > lastGenerated) {
            return true;
          }

          // Check if summary is incomplete
          if (!state.aiGeneratedSummary.sectionsComplete) {
            return true;
          }

          return false;
        },

        setAISummary: (summary: AIGeneratedSummary) => {
          set({
            aiGeneratedSummary: summary,
            aiResponseStatus: {
              isGenerating: false,
              lastError: null,
              retryCount: 0,
              lastGeneratedAt: summary.generatedAt,
            },
          });
        },

        clearAISummary: () => {
          set({
            aiGeneratedSummary: null,
            aiResponseStatus: {
              isGenerating: false,
              lastError: null,
              retryCount: 0,
              lastGeneratedAt: null,
            },
          });
        },

        retryAIGeneration: async () => {
          const state = get();
          if (state.aiGeneratedSummary?.promptUsed) {
            await get().generateAISummary(
              state.aiGeneratedSummary.promptUsed,
              state.aiGeneratedSummary.aiModel
            );
          } else {
            throw new Error('No previous prompt available for retry');
          }
        },

        getAISummaryStatus: () => {
          return get().aiResponseStatus;
        },
      }),
      {
        name: 'enhanced-assessment-store',
        version: 1,
      }
    )
  )
);

// ==========================================================================
// SELECTOR HOOKS WITH PROPER ZUSTAND V5 COMPATIBILITY
// ==========================================================================

export const useEnhancedAssessmentData = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      currentScenario: state.currentScenario,
      answers: state.answers,
      scores: state.scores,
      userData: state.userData,
      isComplete: state.isComplete,
      isStarted: state.isStarted,
      estimatedProgress: state.estimatedProgress,
      getCurrentQuestion: state.getCurrentQuestion,
      getCanGoBack: state.getCanGoBack,
      getCanGoForward: state.getCanGoForward,
      getTotalAnswered: state.getTotalAnswered,
    }))
  );
};

export const useEnhancedAssessmentActions = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      setUserData: state.setUserData,
      startAssessment: state.startAssessment,
      submitAnswer: state.submitAnswer,
      submitMultiSelectAnswer: state.submitMultiSelectAnswer,
      goToNextScenario: state.goToNextScenario,
      goToPreviousScenario: state.goToPreviousScenario,
      goToScenario: state.goToScenario,
      generateResults: state.generateResults,
      resetAssessment: state.resetAssessment,
      updateActivityTime: state.updateActivityTime,
    }))
  );
};

export const useEnhancedMultiSelectState = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      isMultiSelectMode: state.isMultiSelectMode,
      currentMultiSelectState: state.currentMultiSelectState,
      multiSelectError: state.multiSelectError,
      getIsCurrentScenarioMultiSelect: state.getIsCurrentScenarioMultiSelect,
      initializeMultiSelect: state.initializeMultiSelect,
      toggleMultiSelectOption: state.toggleMultiSelectOption,
      validateMultiSelectState: state.validateMultiSelectState,
      clearMultiSelectError: state.clearMultiSelectError,
    }))
  );
};

export const useEnhancedAssessmentResults = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      answers: state.answers,
      scores: state.scores,
      archetypeResults: state.archetypeResults,
      vulnerabilityAssessment: state.vulnerabilityAssessment,
      enhancedUserPath: state.enhancedUserPath,
      pathAnalytics: state.pathAnalytics,
      isComplete: state.isComplete,
      getEnhancedAssessmentResult: state.getEnhancedAssessmentResult,
    }))
  );
};

export const useEnhancedPathTracking = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      enhancedUserPath: state.enhancedUserPath,
      pathAnalytics: state.pathAnalytics,
      navigationHistory: state.navigationHistory,
      pathValidation: state.pathValidation,
      recoveryOptions: state.recoveryOptions,
      progressPrediction: state.progressPrediction,
      generatePathInsights: state.generatePathInsights,
      getPathPrediction: state.getPathPrediction,
      generateEnhancedPath: state.generateEnhancedPath,
      validatePath: state.validatePath,
      recoverPath: state.recoverPath,
      savePathCheckpoint: state.savePathCheckpoint,
      restoreFromCheckpoint: state.restoreFromCheckpoint,
    }))
  );
};

export const useEnhancedDebugMode = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      debugMode: state.debugMode,
      performanceMetrics: state.performanceMetrics,
      sessionId: state.sessionId,
      toggleDebugMode: state.toggleDebugMode,
      exportDebugData: state.exportDebugData,
      validateStoreIntegrity: state.validateStoreIntegrity,
      exportSessionData: state.exportSessionData,
      importSessionData: state.importSessionData,
      resetPerformanceMetrics: state.resetPerformanceMetrics,
    }))
  );
};

export const useAISummary = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      aiGeneratedSummary: state.aiGeneratedSummary,
      aiResponseStatus: state.aiResponseStatus,
      generateAISummary: state.generateAISummary,
      autoGenerateAISummaryIfNeeded: state.autoGenerateAISummaryIfNeeded,
      shouldRegenerateAISummary: state.shouldRegenerateAISummary,
      setAISummary: state.setAISummary,
      clearAISummary: state.clearAISummary,
      retryAIGeneration: state.retryAIGeneration,
    }))
  );
};

// ==========================================================================
// DEBUG AND TESTING UTILITIES
// ==========================================================================

/**
 * Test function to debug store and data integration
 * Call this from browser console: window.testAssessmentFlow()
 */
export const testAssessmentFlow = () => {
  const store = useEnhancedAssessmentStore.getState();

  console.log('=== Assessment Flow Debug Test ===');
  console.log('Current scenario:', store.currentScenario);
  console.log('Current answers:', store.answers);
  console.log('Current scores:', store.scores);

  // Test getting current question
  const currentQuestion = getExtendedScenarioById(store.currentScenario);
  console.log('Current question:', currentQuestion);

  if (currentQuestion && currentQuestion.options.length > 0) {
    const testOption = currentQuestion.options[0];
    console.log('Testing with option:', testOption);

    // Validate the option
    const mockAnswer = createExtendedUserAnswer(store.currentScenario, testOption);
    const validation = validateAnswerObject(mockAnswer);
    console.log('Answer validation:', validation);

    // Test score calculation
    const testAnswers = [...store.answers, mockAnswer];
    const scoreResult = safeCalculateExtendedScores(testAnswers);
    console.log('Score calculation result:', scoreResult);
  }

  console.log('Debug data:', store.exportDebugData());
  console.log('=== End Debug Test ===');
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testAssessmentFlow = testAssessmentFlow;
}

// Default export for backward compatibility
export default useEnhancedAssessmentStore;

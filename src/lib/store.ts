// lib/store.ts
// ==========================================================================
// ZUSTAND ASSESSMENT STORE - RESTRUCTURED FOR V5 COMPATIBILITY
// ==========================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { scenarios, getScenarioById, getArchetypeByHighestScore, calculateProgress } from './data';
import { ScoreData, UserAnswer, UserData, AssessmentResult, Scenario, AnswerOption } from './types';

// Store State Interface
export interface AssessmentState {
  // Core assessment state
  currentScenario: number;
  answers: UserAnswer[];
  scores: ScoreData;
  userData: UserData | null;
  isComplete: boolean;
  isStarted: boolean;

  // Computed/cached values
  progress: number;
  currentQuestion: Scenario | null;
  totalQuestions: number;
  cachedResults: AssessmentResult | null;
}

// Store Actions Interface
export interface AssessmentActions {
  // User data actions
  setUserData: (data: UserData) => void;

  // Assessment flow actions
  startAssessment: () => void;
  addAnswer: (scenarioId: number, selectedOption: AnswerOption) => void;
  goToNextScenario: (nextScenarioId: number | string) => void;
  goToPreviousQuestion: () => void;

  // Navigation actions
  goToScenario: (scenarioId: number) => void;
  canGoBack: () => boolean;

  // Results actions
  completeAssessment: () => void;
  getResults: () => AssessmentResult | null;

  // Reset actions
  resetAssessment: () => void;
  resetToQuestion: (scenarioId: number) => void;

  // Internal helpers
  _updateComputedValues: () => void;
  _createResults: () => AssessmentResult | null;
}

// Complete Store Type
export type AssessmentStore = AssessmentState & AssessmentActions;

// Initial State
const initialState: AssessmentState = {
  currentScenario: 1,
  answers: [],
  scores: { emotional: 0, logical: 0, exploratory: 0 },
  userData: null,
  isComplete: false,
  isStarted: false,
  progress: 0,
  currentQuestion: null,
  totalQuestions: scenarios.length,
  cachedResults: null,
};

// Helper function to create results
const createAssessmentResults = (
  scores: ScoreData,
  answers: UserAnswer[],
  userData: UserData | null
): AssessmentResult | null => {
  if (!userData) return null;

  const archetype = getArchetypeByHighestScore(scores);

  return {
    totalScores: scores,
    archetype,
    completedAt: new Date(),
    answers,
  };
};

// Create the Zustand Store
export const useAssessmentStore = create<AssessmentStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        ...initialState,

        // Internal helper to update computed values
        _updateComputedValues: () => {
          const state = get();
          const currentQuestion = getScenarioById(state.currentScenario);
          const progress = calculateProgress(state.currentScenario);

          set(
            {
              currentQuestion,
              progress,
            },
            false,
            '_updateComputedValues'
          );
        },

        // Internal helper to create results
        _createResults: () => {
          const state = get();
          return createAssessmentResults(state.scores, state.answers, state.userData);
        },

        // Actions
        setUserData: (data: UserData) => {
          set({ userData: data }, false, 'setUserData');
        },

        startAssessment: () => {
          const firstScenario = getScenarioById(1);
          set(
            {
              isStarted: true,
              currentScenario: 1,
              currentQuestion: firstScenario,
              progress: calculateProgress(1),
            },
            false,
            'startAssessment'
          );
        },

        addAnswer: (scenarioId: number, selectedOption: AnswerOption) => {
          const state = get();

          // Create new answer
          const newAnswer: UserAnswer = {
            scenarioId,
            selectedOption,
            timestamp: new Date(),
          };

          // Remove any existing answer for this scenario (in case user goes back)
          const filteredAnswers = state.answers.filter(a => a.scenarioId !== scenarioId);
          const updatedAnswers = [...filteredAnswers, newAnswer];

          // Calculate new scores
          const newScores = updatedAnswers.reduce(
            (acc, answer) => ({
              emotional: acc.emotional + answer.selectedOption.scores.emotional,
              logical: acc.logical + answer.selectedOption.scores.logical,
              exploratory: acc.exploratory + answer.selectedOption.scores.exploratory,
            }),
            { emotional: 0, logical: 0, exploratory: 0 }
          );

          set(
            {
              answers: updatedAnswers,
              scores: newScores,
            },
            false,
            'addAnswer'
          );
        },

        goToNextScenario: (nextScenarioId: number | string) => {
          if (nextScenarioId === 'end') {
            get().completeAssessment();
            return;
          }

          const nextScenario = getScenarioById(nextScenarioId as number);
          if (nextScenario) {
            set(
              {
                currentScenario: nextScenario.id,
                currentQuestion: nextScenario,
                progress: calculateProgress(nextScenario.id),
              },
              false,
              'goToNextScenario'
            );
          }
        },

        goToPreviousQuestion: () => {
          const state = get();
          const answers = state.answers;

          if (answers.length === 0) return;

          // Get the previous question from answers history
          const lastAnswer = answers[answers.length - 1];
          const previousScenario = getScenarioById(lastAnswer.scenarioId);

          if (previousScenario) {
            set(
              {
                currentScenario: previousScenario.id,
                currentQuestion: previousScenario,
                progress: calculateProgress(previousScenario.id),
              },
              false,
              'goToPreviousQuestion'
            );
          }
        },

        goToScenario: (scenarioId: number) => {
          const scenario = getScenarioById(scenarioId);
          if (scenario) {
            set(
              {
                currentScenario: scenarioId,
                currentQuestion: scenario,
                progress: calculateProgress(scenarioId),
              },
              false,
              'goToScenario'
            );
          }
        },

        canGoBack: (): boolean => {
          const state = get();
          return state.answers.length > 0 && !state.isComplete;
        },

        completeAssessment: () => {
          const state = get();
          const results = createAssessmentResults(state.scores, state.answers, state.userData);

          set(
            {
              isComplete: true,
              progress: 100,
              cachedResults: results,
            },
            false,
            'completeAssessment'
          );
        },

        getResults: (): AssessmentResult | null => {
          const state = get();
          return state.cachedResults;
        },

        resetAssessment: () => {
          const userData = get().userData; // Preserve user data
          set(
            {
              ...initialState,
              userData,
            },
            false,
            'resetAssessment'
          );
        },

        resetToQuestion: (scenarioId: number) => {
          const state = get();

          // Remove answers from this question onwards
          const filteredAnswers = state.answers.filter(a => a.scenarioId < scenarioId);

          // Recalculate scores
          const newScores = filteredAnswers.reduce(
            (acc, answer) => ({
              emotional: acc.emotional + answer.selectedOption.scores.emotional,
              logical: acc.logical + answer.selectedOption.scores.logical,
              exploratory: acc.exploratory + answer.selectedOption.scores.exploratory,
            }),
            { emotional: 0, logical: 0, exploratory: 0 }
          );

          const scenario = getScenarioById(scenarioId);

          set(
            {
              currentScenario: scenarioId,
              currentQuestion: scenario,
              answers: filteredAnswers,
              scores: newScores,
              isComplete: false,
              progress: calculateProgress(scenarioId),
              cachedResults: null, // Clear cached results
            },
            false,
            'resetToQuestion'
          );
        },
      }),
      {
        name: 'fia-assessment-store',
        partialize: state => ({
          // Only persist essential data
          userData: state.userData,
          answers: state.answers,
          scores: state.scores,
          currentScenario: state.currentScenario,
          isStarted: state.isStarted,
          isComplete: state.isComplete,
          cachedResults: state.cachedResults,
        }),
        // Add onRehydrateStorage to restore computed values after hydration
        onRehydrateStorage: () => state => {
          if (state) {
            // Restore computed values after hydration
            const currentQuestion = getScenarioById(state.currentScenario);
            const progress = calculateProgress(state.currentScenario);

            // Update the state with computed values
            state.currentQuestion = currentQuestion;
            state.progress = progress;
            state.totalQuestions = scenarios.length;
          }
        },
      }
    ),
    {
      name: 'assessment-store',
    }
  )
);

// ==========================================================================
// STABLE SELECTOR HOOKS FOR ZUSTAND V5
// ==========================================================================

// Multi-value selectors using useShallow for stability
export const useAssessmentData = () => {
  return useAssessmentStore(
    useShallow(state => ({
      currentScenario: state.currentScenario,
      currentQuestion: state.currentQuestion,
      progress: state.progress,
      isComplete: state.isComplete,
      isStarted: state.isStarted,
    }))
  );
};

// Primitive selectors (no useShallow needed)
export const useAssessmentScores = () => {
  return useAssessmentStore(state => state.scores);
};

export const useAssessmentAnswers = () => {
  return useAssessmentStore(state => state.answers);
};

export const useUserData = () => {
  return useAssessmentStore(state => state.userData);
};

export const useCurrentScenario = () => {
  return useAssessmentStore(state => state.currentScenario);
};

export const useCurrentQuestion = () => {
  return useAssessmentStore(state => state.currentQuestion);
};

export const useProgress = () => {
  return useAssessmentStore(state => state.progress);
};

export const useIsComplete = () => {
  return useAssessmentStore(state => state.isComplete);
};

export const useIsStarted = () => {
  return useAssessmentStore(state => state.isStarted);
};

// Results selector (returns cached result - stable reference)
export const useAssessmentResults = () => {
  return useAssessmentStore(state => state.cachedResults);
};

// Helper function selectors (return primitives)
export const useCanGoBack = () => {
  return useAssessmentStore(state => state.canGoBack());
};

// Action selectors (stable function references from Zustand)
export const useAssessmentActions = () => {
  return useAssessmentStore(
    useShallow(state => ({
      setUserData: state.setUserData,
      startAssessment: state.startAssessment,
      addAnswer: state.addAnswer,
      goToNextScenario: state.goToNextScenario,
      goToPreviousQuestion: state.goToPreviousQuestion,
      goToScenario: state.goToScenario,
      completeAssessment: state.completeAssessment,
      resetAssessment: state.resetAssessment,
      resetToQuestion: state.resetToQuestion,
    }))
  );
};

// ==========================================================================
// CONVENIENCE HOOKS FOR COMMON PATTERNS
// ==========================================================================

// Combined hook for assessment page
export const useAssessmentPage = () => {
  return useAssessmentStore(
    useShallow(state => ({
      // State
      currentScenario: state.currentScenario,
      currentQuestion: state.currentQuestion,
      progress: state.progress,
      isComplete: state.isComplete,
      isStarted: state.isStarted,
      answers: state.answers,
      userData: state.userData,

      // Actions
      setUserData: state.setUserData,
      startAssessment: state.startAssessment,
      addAnswer: state.addAnswer,
      goToNextScenario: state.goToNextScenario,
      goToPreviousQuestion: state.goToPreviousQuestion,
      canGoBack: state.canGoBack,
      resetAssessment: state.resetAssessment,
    }))
  );
};

// Combined hook for results page
export const useResultsPage = () => {
  return useAssessmentStore(
    useShallow(state => ({
      // State
      results: state.cachedResults,
      userData: state.userData,
      isComplete: state.isComplete,

      // Actions
      resetAssessment: state.resetAssessment,
    }))
  );
};

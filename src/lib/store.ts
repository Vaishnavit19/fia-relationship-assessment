// lib/store.ts
// ==========================================================================
// ZUSTAND ASSESSMENT STORE
// ==========================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ScoreData, UserAnswer, UserData, AssessmentResult, Scenario } from './types';
import { scenarios, getScenarioById, getArchetypeByHighestScore, calculateProgress } from './data';

// Store State Interface
export interface AssessmentState {
  // Current state
  currentScenario: number;
  answers: UserAnswer[];
  scores: ScoreData;
  userData: UserData | null;
  isComplete: boolean;
  isStarted: boolean;
  
  // Computed values
  progress: number;
  currentQuestion: Scenario | null;
  totalQuestions: number;
}

// Store Actions Interface  
export interface AssessmentActions {
  // User data actions
  setUserData: (data: UserData) => void;
  
  // Assessment flow actions
  startAssessment: () => void;
  addAnswer: (scenarioId: number, selectedOption: any) => void;
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
};

// Create the Zustand Store
export const useAssessmentStore = create<AssessmentStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        ...initialState,
        
        // Actions
        setUserData: (data: UserData) => {
          set({ userData: data }, false, 'setUserData');
        },

        startAssessment: () => {
          const firstScenario = getScenarioById(1);
          set({
            isStarted: true,
            currentScenario: 1,
            currentQuestion: firstScenario,
            progress: calculateProgress(1),
          }, false, 'startAssessment');
        },

        addAnswer: (scenarioId: number, selectedOption: any) => {
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

          set({
            answers: updatedAnswers,
            scores: newScores,
          }, false, 'addAnswer');
        },

        goToNextScenario: (nextScenarioId: number | string) => {
          if (nextScenarioId === 'end') {
            get().completeAssessment();
            return;
          }

          const nextScenario = getScenarioById(nextScenarioId as number);
          if (nextScenario) {
            set({
              currentScenario: nextScenario.id,
              currentQuestion: nextScenario,
              progress: calculateProgress(nextScenario.id),
            }, false, 'goToNextScenario');
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
            set({
              currentScenario: previousScenario.id,
              currentQuestion: previousScenario,
              progress: calculateProgress(previousScenario.id),
            }, false, 'goToPreviousQuestion');
          }
        },

        goToScenario: (scenarioId: number) => {
          const scenario = getScenarioById(scenarioId);
          if (scenario) {
            set({
              currentScenario: scenarioId,
              currentQuestion: scenario,
              progress: calculateProgress(scenarioId),
            }, false, 'goToScenario');
          }
        },

        canGoBack: (): boolean => {
          const state = get();
          return state.answers.length > 0 && !state.isComplete;
        },

        completeAssessment: () => {
          set({
            isComplete: true,
            progress: 100,
          }, false, 'completeAssessment');
        },

        getResults: (): AssessmentResult | null => {
          const state = get();
          
          if (!state.isComplete || !state.userData) {
            return null;
          }

          const archetype = getArchetypeByHighestScore(state.scores);
          
          return {
            totalScores: state.scores,
            archetype,
            completedAt: new Date(),
            answers: state.answers,
          };
        },

        resetAssessment: () => {
          set({
            ...initialState,
            userData: get().userData, // Keep user data
          }, false, 'resetAssessment');
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
          
          set({
            currentScenario: scenarioId,
            currentQuestion: scenario,
            answers: filteredAnswers,
            scores: newScores,
            isComplete: false,
            progress: calculateProgress(scenarioId),
          }, false, 'resetToQuestion');
        },
      }),
      {
        name: 'fia-assessment-store',
        partialize: (state) => ({
          // Only persist essential data
          userData: state.userData,
          answers: state.answers,
          scores: state.scores,
          currentScenario: state.currentScenario,
          isStarted: state.isStarted,
          isComplete: state.isComplete,
        }),
      }
    ),
    {
      name: 'assessment-store',
    }
  )
);

// Selector Hooks for better performance
export const useAssessmentData = () => {
  return useAssessmentStore(state => ({
    currentScenario: state.currentScenario,
    currentQuestion: state.currentQuestion,
    progress: state.progress,
    isComplete: state.isComplete,
    isStarted: state.isStarted,
  }));
};

export const useAssessmentScores = () => {
  return useAssessmentStore(state => state.scores);
};

export const useAssessmentAnswers = () => {
  return useAssessmentStore(state => state.answers);
};

export const useUserData = () => {
  return useAssessmentStore(state => state.userData);
};

// Helper hooks
export const useCanGoBack = () => {
  return useAssessmentStore(state => state.canGoBack());
};

export const useAssessmentResults = () => {
  return useAssessmentStore(state => state.getResults());
};
// lib/store.ts
// ==========================================================================
// ENHANCED ZUSTAND STORE WITH ADVANCED PATH TRACKING
// ==========================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

import { generateArchetypeResults, calculateConfidenceGap } from './archetypeCalculator';
import {
  getExtendedScenarioById,
  calculateExtendedScores,
  getNextScenarioId,
  isScenarioPathComplete,
  calculateExtendedProgress,
} from './data';
import {
  generateEnhancedUserPath,
  validatePathIntegrity,
  suggestPathRecovery,
  generatePathAnalytics,
  EnhancedUserPath,
  PathAnalytics,
} from './pathTracking';
import {
  ExtendedUserAnswer,
  ExtendedAnswerOption,
  ExtendedScenario,
  UserData,
  ScoreData,
  ExtendedAssessmentResult,
} from './types';
import { generateVulnerabilityAssessment, VulnerabilityAssessment } from './vulnerabilityPipeline';

// ==========================================================================
// ENHANCED STORE STATE INTERFACE
// ==========================================================================

export interface EnhancedAssessmentState {
  // Core assessment data
  currentScenario: number | string;
  answers: ExtendedUserAnswer[];
  scores: ScoreData;
  userData: UserData | null;
  isComplete: boolean;
  isStarted: boolean;

  // Enhanced path tracking
  enhancedUserPath: EnhancedUserPath | null;
  pathAnalytics: PathAnalytics | null;
  navigationHistory: {
    scenarioId: number | string;
    action: 'forward' | 'backward' | 'jump' | 'restart';
    timestamp: Date;
  }[];

  // Session management
  sessionId: string;
  startTime: Date | null;
  lastActivityTime: Date | null;

  // Enhanced progress tracking
  estimatedProgress: number;
  progressPrediction: {
    estimatedCompletion: Date | null;
    remainingTime: number; // in minutes
    completionProbability: number;
  };

  // Path validation and error handling
  pathValidation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    lastValidatedAt: Date | null;
  };

  // Recovery state
  recoveryOptions: {
    type: 'backtrack' | 'reset_from_point' | 'complete_restart';
    description: string;
    targetScenario: number | string;
    stepsLost: number;
  }[];

  // Results and analysis
  archetypeResults: any | null;
  vulnerabilityAssessment: VulnerabilityAssessment | null;

  // Debug and development
  debugMode: boolean;
  performanceMetrics: {
    storeUpdateCount: number;
    averageUpdateTime: number;
    lastUpdateTime: Date | null;
  };
}

export interface EnhancedAssessmentStore extends EnhancedAssessmentState {
  // Computed properties
  currentQuestion: ExtendedScenario | null;
  canGoBack: boolean;
  canGoForward: boolean;
  totalAnswered: number;

  // Path analysis computed properties
  pathComplexity: number;
  pathEfficiency: number;
  explorationScore: number;
  decisionConsistency: number;

  // Enhanced actions - User Management
  setUserData: (data: UserData) => void;

  // Enhanced actions - Assessment Flow
  startAssessment: () => void;
  addAnswer: (scenarioId: number | string, selectedOption: ExtendedAnswerOption) => void;
  goToNextScenario: (nextScenarioId: number | string) => void;
  goToPreviousQuestion: () => void;

  // Enhanced actions - Advanced Navigation
  goToScenario: (scenarioId: number | string, reason?: string) => void;
  jumpToScenario: (scenarioId: number | string) => void;
  restartFromScenario: (scenarioId: number | string) => void;

  // Enhanced actions - Path Management
  validateCurrentPath: () => void;
  recoverFromError: (recoveryType: 'backtrack' | 'reset_from_point' | 'complete_restart') => void;
  savePathCheckpoint: () => void;
  restoreFromCheckpoint: () => void;

  // Enhanced actions - Analytics
  generatePathInsights: () => void;
  getPathPrediction: () => void;
  updateActivityTime: () => void;

  // Enhanced actions - Completion
  completeAssessment: () => void;
  getEnhancedAssessmentResult: () => ExtendedAssessmentResult | null;

  // Enhanced actions - Reset & Debugging
  resetAssessment: () => void;
  toggleDebugMode: () => void;
  exportDebugData: () => any;
  validateStoreIntegrity: () => { isValid: boolean; errors: string[] };
}

// ==========================================================================
// INITIAL STATE
// ==========================================================================

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const initialState: EnhancedAssessmentState = {
  currentScenario: 1,
  answers: [],
  scores: { emotional: 0, logical: 0, exploratory: 0 },
  userData: null,
  isComplete: false,
  isStarted: false,

  enhancedUserPath: null,
  pathAnalytics: null,
  navigationHistory: [],

  sessionId: generateSessionId(),
  startTime: null,
  lastActivityTime: null,

  estimatedProgress: 0,
  progressPrediction: {
    estimatedCompletion: null,
    remainingTime: 0,
    completionProbability: 0.8,
  },

  pathValidation: {
    isValid: true,
    errors: [],
    warnings: [],
    lastValidatedAt: null,
  },

  recoveryOptions: [],
  archetypeResults: null,
  vulnerabilityAssessment: null,

  debugMode: false,
  performanceMetrics: {
    storeUpdateCount: 0,
    averageUpdateTime: 0,
    lastUpdateTime: null,
  },
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
        // COMPUTED PROPERTIES
        // ==========================================================================

        get currentQuestion() {
          const state = get();
          return getExtendedScenarioById(state.currentScenario);
        },

        get canGoBack() {
          const state = get();
          return state.answers.length > 0;
        },

        get canGoForward() {
          const state = get();
          const currentQuestion = state.currentQuestion;
          return currentQuestion !== null && !state.isComplete;
        },

        get totalAnswered() {
          const state = get();
          return state.answers.length;
        },

        get pathComplexity() {
          const state = get();
          return state.enhancedUserPath?.complexity.totalDecisionPoints || 0;
        },

        get pathEfficiency() {
          const state = get();
          return state.enhancedUserPath?.pathEfficiency || 1.0;
        },

        get explorationScore() {
          const state = get();
          return state.enhancedUserPath?.explorationScore || 0;
        },

        get decisionConsistency() {
          const state = get();
          if (!state.answers.length) return 1.0;

          // Calculate consistency based on score patterns
          const scores = state.answers.map(a => a.selectedOption.scores);
          const avgEmotional = scores.reduce((sum, s) => sum + s.emotional, 0) / scores.length;
          const avgLogical = scores.reduce((sum, s) => sum + s.logical, 0) / scores.length;
          const avgExploratory = scores.reduce((sum, s) => sum + s.exploratory, 0) / scores.length;

          const variance =
            scores.reduce((sum, s) => {
              return (
                sum +
                Math.pow(s.emotional - avgEmotional, 2) +
                Math.pow(s.logical - avgLogical, 2) +
                Math.pow(s.exploratory - avgExploratory, 2)
              );
            }, 0) / scores.length;

          return Math.max(0, 1 - Math.sqrt(variance) / 4); // Normalize to 0-1
        },

        // ==========================================================================
        // ENHANCED USER MANAGEMENT
        // ==========================================================================

        setUserData: (data: UserData) => {
          const startTime = Date.now();

          set(
            state => ({
              ...state,
              userData: data,
              sessionId: generateSessionId(),
              performanceMetrics: {
                ...state.performanceMetrics,
                storeUpdateCount: state.performanceMetrics.storeUpdateCount + 1,
                lastUpdateTime: new Date(),
              },
            }),
            false,
            'setUserData'
          );

          // Update performance metrics
          const endTime = Date.now();
          const updateTime = endTime - startTime;

          set(
            state => ({
              ...state,
              performanceMetrics: {
                ...state.performanceMetrics,
                averageUpdateTime: (state.performanceMetrics.averageUpdateTime + updateTime) / 2,
              },
            }),
            false,
            'updatePerformanceMetrics'
          );
        },

        // ==========================================================================
        // ENHANCED ASSESSMENT FLOW
        // ==========================================================================

        startAssessment: () => {
          const now = new Date();

          set(
            state => ({
              ...state,
              isStarted: true,
              startTime: now,
              lastActivityTime: now,
              currentScenario: 1,
              sessionId: generateSessionId(),
              navigationHistory: [
                {
                  scenarioId: 1,
                  action: 'restart',
                  timestamp: now,
                },
              ],
            }),
            false,
            'startAssessment'
          );
        },

        addAnswer: (scenarioId: number | string, selectedOption: ExtendedAnswerOption) => {
          const now = new Date();

          set(
            state => {
              const newAnswer: ExtendedUserAnswer = {
                scenarioId,
                selectedOption,
                timestamp: now,
              };

              const newAnswers = [...state.answers, newAnswer];
              const newScores = calculateExtendedScores(newAnswers);
              const newProgress = calculateExtendedProgress(newAnswers, selectedOption.next);

              // Generate enhanced path tracking
              const enhancedPath = generateEnhancedUserPath(newAnswers, state.startTime || now);
              const pathAnalytics = generatePathAnalytics(enhancedPath, newAnswers);

              // Validate path integrity
              const validation = validatePathIntegrity(newAnswers);
              const recovery = suggestPathRecovery(newAnswers, state.currentScenario);

              // Update progress prediction
              const remainingTime = Math.max(1, (10 - newAnswers.length) * 2); // Estimate 2 minutes per question
              const completionProbability = Math.min(0.95, 0.6 + newAnswers.length * 0.05);

              return {
                ...state,
                answers: newAnswers,
                scores: newScores,
                estimatedProgress: newProgress,
                enhancedUserPath: enhancedPath,
                pathAnalytics: pathAnalytics,
                lastActivityTime: now,

                pathValidation: {
                  isValid: validation.isValid,
                  errors: validation.errors.map(e => e.description),
                  warnings: validation.warnings,
                  lastValidatedAt: now,
                },

                recoveryOptions: recovery.recoveryOptions,

                progressPrediction: {
                  estimatedCompletion: new Date(now.getTime() + remainingTime * 60000),
                  remainingTime,
                  completionProbability,
                },

                performanceMetrics: {
                  ...state.performanceMetrics,
                  storeUpdateCount: state.performanceMetrics.storeUpdateCount + 1,
                  lastUpdateTime: now,
                },
              };
            },
            false,
            'addAnswer'
          );
        },

        goToNextScenario: (nextScenarioId: number | string) => {
          const now = new Date();

          set(
            state => {
              const isComplete = isScenarioPathComplete(nextScenarioId);

              const newNavigationHistory = [
                ...state.navigationHistory,
                {
                  scenarioId: nextScenarioId,
                  action: 'forward' as const,
                  timestamp: now,
                },
              ];

              return {
                ...state,
                currentScenario: nextScenarioId,
                isComplete,
                estimatedProgress: isComplete ? 100 : state.estimatedProgress,
                lastActivityTime: now,
                navigationHistory: newNavigationHistory,
              };
            },
            false,
            'goToNextScenario'
          );
        },

        goToPreviousQuestion: () => {
          const now = new Date();

          set(
            state => {
              if (state.answers.length === 0) return state;

              const newAnswers = state.answers.slice(0, -1);
              const newScores = calculateExtendedScores(newAnswers);

              let previousScenarioId: number | string = 1;
              if (newAnswers.length > 0) {
                const lastAnswer = newAnswers[newAnswers.length - 1];
                previousScenarioId = getNextScenarioId(lastAnswer.selectedOption);
              }

              const newProgress = calculateExtendedProgress(newAnswers, previousScenarioId);
              const enhancedPath =
                newAnswers.length > 0
                  ? generateEnhancedUserPath(newAnswers, state.startTime || now)
                  : null;

              const newNavigationHistory = [
                ...state.navigationHistory,
                {
                  scenarioId: previousScenarioId,
                  action: 'backward' as const,
                  timestamp: now,
                },
              ];

              return {
                ...state,
                answers: newAnswers,
                scores: newScores,
                currentScenario: previousScenarioId,
                estimatedProgress: newProgress,
                enhancedUserPath: enhancedPath,
                isComplete: false,
                lastActivityTime: now,
                navigationHistory: newNavigationHistory,
              };
            },
            false,
            'goToPreviousQuestion'
          );
        },

        // ==========================================================================
        // ENHANCED NAVIGATION ACTIONS
        // ==========================================================================

        goToScenario: (scenarioId: number | string, reason?: string) => {
          const now = new Date();
          const scenario = getExtendedScenarioById(scenarioId);

          if (!scenario) {
            console.error(`Cannot navigate to non-existent scenario: ${scenarioId}`);
            return;
          }

          set(
            state => {
              const newNavigationHistory = [
                ...state.navigationHistory,
                {
                  scenarioId,
                  action: 'jump' as const,
                  timestamp: now,
                },
              ];

              return {
                ...state,
                currentScenario: scenarioId,
                lastActivityTime: now,
                navigationHistory: newNavigationHistory,
              };
            },
            false,
            `goToScenario${reason ? `_${reason}` : ''}`
          );
        },

        jumpToScenario: (scenarioId: number | string) => {
          get().goToScenario(scenarioId, 'jump');
        },

        restartFromScenario: (scenarioId: number | string) => {
          const now = new Date();

          set(
            state => {
              // Find the index of the target scenario in answers
              const targetIndex = state.answers.findIndex(a => a.scenarioId === scenarioId);

              let newAnswers = state.answers;
              if (targetIndex >= 0) {
                newAnswers = state.answers.slice(0, targetIndex);
              }

              const newScores = calculateExtendedScores(newAnswers);
              const enhancedPath =
                newAnswers.length > 0
                  ? generateEnhancedUserPath(newAnswers, state.startTime || now)
                  : null;

              const newNavigationHistory = [
                ...state.navigationHistory,
                {
                  scenarioId,
                  action: 'restart' as const,
                  timestamp: now,
                },
              ];

              return {
                ...state,
                currentScenario: scenarioId,
                answers: newAnswers,
                scores: newScores,
                enhancedUserPath: enhancedPath,
                isComplete: false,
                lastActivityTime: now,
                navigationHistory: newNavigationHistory,
              };
            },
            false,
            'restartFromScenario'
          );
        },

        // ==========================================================================
        // PATH MANAGEMENT ACTIONS
        // ==========================================================================

        validateCurrentPath: () => {
          const now = new Date();

          set(
            state => {
              const validation = validatePathIntegrity(state.answers);
              const recovery = suggestPathRecovery(state.answers, state.currentScenario);

              return {
                ...state,
                pathValidation: {
                  isValid: validation.isValid,
                  errors: validation.errors.map(e => e.description),
                  warnings: validation.warnings,
                  lastValidatedAt: now,
                },
                recoveryOptions: recovery.recoveryOptions,
              };
            },
            false,
            'validateCurrentPath'
          );
        },

        recoverFromError: (recoveryType: 'backtrack' | 'reset_from_point' | 'complete_restart') => {
          const state = get();
          const recovery = state.recoveryOptions.find(r => r.type === recoveryType);

          if (!recovery) {
            console.error(`Recovery option ${recoveryType} not available`);
            return;
          }

          switch (recoveryType) {
            case 'backtrack':
              get().goToPreviousQuestion();
              break;
            case 'reset_from_point':
              get().restartFromScenario(recovery.targetScenario);
              break;
            case 'complete_restart':
              get().resetAssessment();
              break;
          }
        },

        savePathCheckpoint: () => {
          // In a real implementation, this would save to external storage
          const state = get();
          const checkpoint = {
            sessionId: state.sessionId,
            currentScenario: state.currentScenario,
            answers: state.answers,
            scores: state.scores,
            timestamp: new Date(),
          };

          localStorage.setItem(`checkpoint_${state.sessionId}`, JSON.stringify(checkpoint));
        },

        restoreFromCheckpoint: () => {
          const state = get();
          const checkpointData = localStorage.getItem(`checkpoint_${state.sessionId}`);

          if (checkpointData) {
            try {
              const checkpoint = JSON.parse(checkpointData);

              set(
                prevState => ({
                  ...prevState,
                  currentScenario: checkpoint.currentScenario,
                  answers: checkpoint.answers,
                  scores: checkpoint.scores,
                }),
                false,
                'restoreFromCheckpoint'
              );
            } catch (error) {
              console.error('Failed to restore checkpoint:', error);
            }
          }
        },

        // ==========================================================================
        // ANALYTICS ACTIONS
        // ==========================================================================

        generatePathInsights: () => {
          set(
            state => {
              if (!state.enhancedUserPath) return state;

              const insights = generatePathAnalytics(state.enhancedUserPath, state.answers);

              return {
                ...state,
                pathAnalytics: insights,
              };
            },
            false,
            'generatePathInsights'
          );
        },

        getPathPrediction: () => {
          const state = get();

          if (state.answers.length === 0) return;

          const avgTimePerQuestion = state.pathAnalytics?.averageTimePerScenario || 120; // 2 minutes default
          const remainingQuestions = Math.max(1, 10 - state.answers.length);

          set(
            prevState => ({
              ...prevState,
              progressPrediction: {
                estimatedCompletion: new Date(
                  Date.now() + remainingQuestions * avgTimePerQuestion * 1000
                ),
                remainingTime: Math.round((remainingQuestions * avgTimePerQuestion) / 60),
                completionProbability: Math.min(0.95, 0.6 + state.answers.length * 0.05),
              },
            }),
            false,
            'getPathPrediction'
          );
        },

        updateActivityTime: () => {
          set(
            state => ({
              ...state,
              lastActivityTime: new Date(),
            }),
            false,
            'updateActivityTime'
          );
        },

        // ==========================================================================
        // COMPLETION ACTIONS
        // ==========================================================================

        completeAssessment: () => {
          const now = new Date();

          set(
            state => {
              const archetypeResults = generateArchetypeResults(state.scores);
              const vulnerabilityAssessment = generateVulnerabilityAssessment(archetypeResults);

              return {
                ...state,
                isComplete: true,
                estimatedProgress: 100,
                archetypeResults,
                vulnerabilityAssessment,
                lastActivityTime: now,
                progressPrediction: {
                  estimatedCompletion: now,
                  remainingTime: 0,
                  completionProbability: 1.0,
                },
              };
            },
            false,
            'completeAssessment'
          );
        },

        getEnhancedAssessmentResult: (): ExtendedAssessmentResult | null => {
          const state = get();

          if (!state.isComplete || !state.userData || !state.startTime) {
            return null;
          }

          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - state.startTime.getTime()) / 1000);

          return {
            userScores: state.scores,
            archetypeResults: state.archetypeResults || {
              userScores: state.scores,
              matches: [],
              topMatches: [],
            },
            personaSelection: state.vulnerabilityAssessment?.personaSelection || {
              selectedPersonas: [],
              selectionReason: 'smallGap',
              confidenceGap: 0,
              primaryArchetype: {} as any,
            },
            completedAt: endTime,
            answers: state.answers,
            userPath: state.enhancedUserPath || {
              totalSteps: state.answers.length,
              pathSequence: [],
              branchingPoints: 0,
            },
            assessmentDuration: duration,

            // Enhanced result properties
            sessionId: state.sessionId,
            pathAnalytics: state.pathAnalytics,
            navigationHistory: state.navigationHistory,
            pathValidation: state.pathValidation,
          };
        },

        // ==========================================================================
        // RESET & DEBUGGING ACTIONS
        // ==========================================================================

        resetAssessment: () => {
          set(
            () => ({
              ...initialState,
              sessionId: generateSessionId(),
              debugMode: get().debugMode, // Preserve debug mode
            }),
            false,
            'resetAssessment'
          );
        },

        toggleDebugMode: () => {
          set(
            state => ({
              ...state,
              debugMode: !state.debugMode,
            }),
            false,
            'toggleDebugMode'
          );
        },

        exportDebugData: () => {
          const state = get();

          return {
            sessionId: state.sessionId,
            currentScenario: state.currentScenario,
            answers: state.answers,
            scores: state.scores,
            enhancedUserPath: state.enhancedUserPath,
            pathAnalytics: state.pathAnalytics,
            navigationHistory: state.navigationHistory,
            pathValidation: state.pathValidation,
            recoveryOptions: state.recoveryOptions,
            performanceMetrics: state.performanceMetrics,
            timestamp: new Date(),
          };
        },

        validateStoreIntegrity: () => {
          const state = get();
          const errors: string[] = [];

          // Basic validation checks
          if (!state.sessionId) errors.push('Missing session ID');
          if (state.answers.length > 0 && !state.startTime) errors.push('Missing start time');
          if (state.isComplete && !state.archetypeResults) errors.push('Missing archetype results');

          // Path validation
          if (state.answers.length > 0 && !state.enhancedUserPath) {
            errors.push('Missing enhanced user path');
          }

          return {
            isValid: errors.length === 0,
            errors,
          };
        },
      }),
      {
        name: 'enhanced-assessment-storage',
        version: 2,
        // Custom storage to handle complex objects
        storage: {
          getItem: name => {
            const str = localStorage.getItem(name);
            if (!str) return null;

            try {
              const data = JSON.parse(str);
              // Restore Date objects
              if (data.state.startTime) {
                data.state.startTime = new Date(data.state.startTime);
              }
              if (data.state.lastActivityTime) {
                data.state.lastActivityTime = new Date(data.state.lastActivityTime);
              }
              if (data.state.answers) {
                data.state.answers = data.state.answers.map((answer: any) => ({
                  ...answer,
                  timestamp: new Date(answer.timestamp),
                }));
              }
              return data;
            } catch (error) {
              console.error('Error parsing stored data:', error);
              return null;
            }
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: name => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    {
      name: 'EnhancedAssessmentStore',
    }
  )
);

// ==========================================================================
// ENHANCED SELECTOR HOOKS
// ==========================================================================

export const useEnhancedAssessmentData = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      currentScenario: state.currentScenario,
      currentQuestion: state.currentQuestion,
      estimatedProgress: state.estimatedProgress,
      isComplete: state.isComplete,
      isStarted: state.isStarted,
      userData: state.userData,
      canGoBack: state.canGoBack,
      canGoForward: state.canGoForward,
      totalAnswered: state.totalAnswered,
      pathComplexity: state.pathComplexity,
      pathEfficiency: state.pathEfficiency,
      explorationScore: state.explorationScore,
      decisionConsistency: state.decisionConsistency,
    }))
  );
};

export const useEnhancedAssessmentActions = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      setUserData: state.setUserData,
      startAssessment: state.startAssessment,
      addAnswer: state.addAnswer,
      goToNextScenario: state.goToNextScenario,
      goToPreviousQuestion: state.goToPreviousQuestion,
      goToScenario: state.goToScenario,
      jumpToScenario: state.jumpToScenario,
      restartFromScenario: state.restartFromScenario,
      validateCurrentPath: state.validateCurrentPath,
      recoverFromError: state.recoverFromError,
      savePathCheckpoint: state.savePathCheckpoint,
      restoreFromCheckpoint: state.restoreFromCheckpoint,
      completeAssessment: state.completeAssessment,
      resetAssessment: state.resetAssessment,
      updateActivityTime: state.updateActivityTime,
    }))
  );
};

export const useEnhancedAssessmentResults = () => {
  return useEnhancedAssessmentStore(
    useShallow(state => ({
      scores: state.scores,
      answers: state.answers,
      enhancedUserPath: state.enhancedUserPath,
      pathAnalytics: state.pathAnalytics,
      archetypeResults: state.archetypeResults,
      vulnerabilityAssessment: state.vulnerabilityAssessment,
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
    }))
  );
};

// Export the store as default for backward compatibility
export default useEnhancedAssessmentStore;

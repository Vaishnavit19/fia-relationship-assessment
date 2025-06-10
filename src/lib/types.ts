// lib/types.ts
// ==========================================================================
// EXTENDED TYPESCRIPT TYPES AND INTERFACES - COMPLETE REPLACEMENT
// Updated to support multi-select scenarios and metadata structure
// ==========================================================================

// ==========================================================================
// CORE ASSESSMENT TYPES
// ==========================================================================

export interface ScoreData {
  emotional: number;
  logical: number;
  exploratory: number;
}

export interface ExtendedAnswerOption {
  letter: string;
  text: string;
  scores: ScoreData;
  next: number | string; // Support for branching IDs like "3.1", "4.2"
}

export interface ExtendedScenario {
  id: number | string; // Support for branching IDs
  text: string;
  options: ExtendedAnswerOption[];
  minSelection?: number; // NEW: For multi-select scenarios (e.g., "Pick exactly 2 activities")
}

export interface ExtendedUserAnswer {
  scenarioId: number | string;
  selectedOption: ExtendedAnswerOption; // Single selection (for backward compatibility)
  selectedOptions?: ExtendedAnswerOption[]; // NEW: Multiple selections for minSelection scenarios
  timestamp: Date;
  isMultiSelect?: boolean; // NEW: Flag to indicate multi-select scenario
  totalScore?: ScoreData; // NEW: Combined scores for multi-select scenarios
}

// ==========================================================================
// SCENARIO DATA STRUCTURE WITH METADATA
// ==========================================================================

export interface ScenarioMetadata {
  title: string;
  description: string;
  totalScenarios: number;
  averageQuestions: number;
  maxQuestions: number;
  minQuestions: number;
  multiSelectScenarios: number;
  branchingPoints: number;
  scoringDimensions: string[];
  version: string;
}

export interface ExtendedScenariosData {
  metadata: ScenarioMetadata;
  scenarios: ExtendedScenario[];
}

// ==========================================================================
// FILE 2: EXTENDED ARCHETYPE TYPES
// ==========================================================================

export interface ExtendedArchetype {
  id: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  vulnerabilities: {
    manipulatorType: string;
    source: string;
    vulnerability: string;
  }[];
}

// ==========================================================================
// FILE 3: MATHEMATICAL SCORING TYPES
// ==========================================================================

export interface ArchetypeScoringProfile {
  archetypeId: string;
  name: string;
  targetScores: ScoreData;
  totalScore: number;
  percentages: {
    logical: number;
    emotional: number;
    exploratory: number;
  };
  dominantDimension: 'logical' | 'emotional' | 'exploratory';
  description: string;
}

export interface ArchetypeMatch {
  archetype: ExtendedArchetype;
  distance: number;
  confidence: number;
  rank: number;
}

export interface ArchetypeResults {
  userScores: ScoreData;
  matches: ArchetypeMatch[];
  topMatches: ArchetypeMatch[]; // Top 3-5 matches
}

// ==========================================================================
// FILE 4: PERSONA CARD TYPES
// ==========================================================================

export interface PersonaCard {
  id: string;
  persona: string;
  title: string;
  characters: string[];
  why: string;
  plotTwist: string;
  blindSpot: string;
  punchline: string;
  vulnerableArchetypes: string[];
  manipulatorTypes: string[];
  psychologicalTactics: string[];
}

// ==========================================================================
// FILE 5: PERSONA MAPPING TYPES
// ==========================================================================

export interface PersonaRisk {
  personaId: string;
  riskLevel: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
}

export type PersonaArchetypeMapping = Record<
  string,
  {
    highRiskPersonas: PersonaRisk[];
    mediumRiskPersonas: PersonaRisk[];
    lowRiskPersonas: PersonaRisk[];
    totalVulnerabilityScore: number;
  }
>;

export interface PersonaSelection {
  selectedPersonas: (PersonaCard & { riskLevel: 'high' | 'medium' | 'low' })[];
  selectionReason: 'large_gap' | 'medium_gap' | 'small_gap';
  confidenceGap: number;
  primaryArchetype: string;
  secondaryArchetype?: string;
}

// ==========================================================================
// ENHANCED USER PATH AND ANALYTICS
// ==========================================================================

export interface UserPath {
  totalSteps: number;
  pathSequence: {
    scenarioId: number | string;
    nextScenarioId: number | string;
  }[];
  branchingPoints: number;
}

export interface UserData {
  name: string;
  email?: string;
  age?: number;
  relationshipStatus?: string;
}

export interface ExtendedAssessmentResult {
  userScores: ScoreData;
  archetypeResults: ArchetypeResults;
  personaSelection: PersonaSelection;
  completedAt: Date;
  answers: ExtendedUserAnswer[];
  userPath: UserPath;
  assessmentDuration: number; // in seconds
}

export interface VulnerabilityAssessment {
  riskLevel: 'high' | 'medium' | 'low';
  topVulnerabilities: string[];
  recommendedPersonas: PersonaCard[];
  educationalInsights: string[];
  protectionStrategies: string[];
  personaSelection: PersonaSelection;
}

// ==========================================================================
// MULTI-SELECT SUPPORT TYPES
// ==========================================================================

export interface MultiSelectState {
  selectedOptions: ExtendedAnswerOption[];
  requiredSelections: number;
  isComplete: boolean;
  combinedScores: ScoreData;
}

export interface MultiSelectValidation {
  isValid: boolean;
  errors: string[];
  missingSelections: number;
}

// ==========================================================================
// STORE STATE TYPES (UPDATED FOR MULTI-SELECT)
// ==========================================================================

export interface ExtendedAssessmentState {
  // Current state
  currentScenario: number | string;
  answers: ExtendedUserAnswer[];
  scores: ScoreData;
  userData: UserData | null;
  isComplete: boolean;
  isStarted: boolean;

  // Multi-select state
  currentMultiSelectState: MultiSelectState | null;
  isMultiSelectMode: boolean;

  // Extended state
  userPath: UserPath | null;
  estimatedProgress: number;
  startTime: Date | null;

  // Results
  archetypeResults: ArchetypeResults | null;
  personaSelection: PersonaSelection | null;
}

// ==========================================================================
// COMPONENT PROP TYPES (UPDATED FOR MULTI-SELECT)
// ==========================================================================

export interface ExtendedProgressBarProps {
  current: number;
  estimated: number;
  isComplete: boolean;
}

export interface ExtendedQuestionCardProps {
  scenario: ExtendedScenario;
  onAnswer: (option: ExtendedAnswerOption | ExtendedAnswerOption[]) => void; // Updated for multi-select
  selectedOption?: ExtendedAnswerOption;
  selectedOptions?: ExtendedAnswerOption[]; // NEW: For multi-select scenarios
  canGoBack: boolean;
  onGoBack: () => void;
  multiSelectState?: MultiSelectState; // NEW: Multi-select state
}

export interface ArchetypeResultsProps {
  results: ArchetypeResults;
  userData: UserData;
}

export interface PersonaCardProps {
  persona: PersonaCard;
  riskLevel: 'high' | 'medium' | 'low';
  isSelected?: boolean;
}

export interface PersonaSelectionProps {
  selection: PersonaSelection;
  onPersonaSelect?: (persona: PersonaCard) => void;
}

export interface VulnerabilityCardProps {
  archetype: ExtendedArchetype;
  vulnerablePersonas: PersonaCard[];
  riskLevels: Record<string, 'high' | 'medium' | 'low'>;
}

// ==========================================================================
// MULTI-SELECT SPECIFIC COMPONENT PROPS
// ==========================================================================

export interface MultiSelectQuestionCardProps extends ExtendedQuestionCardProps {
  minSelection: number;
  onMultiSelectComplete: (selectedOptions: ExtendedAnswerOption[]) => void;
  multiSelectError?: string;
}

export interface MultiSelectProgressProps {
  selected: number;
  required: number;
  options: ExtendedAnswerOption[];
}

// ==========================================================================
// API AND UTILITY TYPES
// ==========================================================================

export interface ScenarioValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface AssessmentAnalytics {
  totalUsers: number;
  averageCompletionTime: number;
  mostCommonPath: string[];
  archetypeDistribution: Record<string, number>;
  dropoffPoints: Record<string, number>;
  multiSelectCompletionRate: number; // NEW: Multi-select scenario completion rate
}

export interface MultiSelectAnalytics {
  scenarioId: number | string;
  averageSelections: number;
  mostPopularCombinations: {
    options: string[];
    frequency: number;
  }[];
  dropoffRate: number;
}

// ==========================================================================
// SCORING AND CALCULATION TYPES (UPDATED)
// ==========================================================================

export interface ScoreCalculationOptions {
  includeMultiSelect: boolean;
  weightMultiSelectScores?: boolean;
  multiSelectWeight?: number;
}

export interface ExtendedScoreData extends ScoreData {
  multiSelectContribution?: ScoreData; // NEW: Separate tracking of multi-select scores
  singleSelectContribution?: ScoreData; // NEW: Separate tracking of single-select scores
}

// ==========================================================================
// LEGACY COMPATIBILITY (IF NEEDED - BUT WE'RE REPLACING)
// ==========================================================================

// Keep these for reference but mark as deprecated
/** @deprecated Use ExtendedScenario instead */
// export interface Scenario extends ExtendedScenario {}

// /** @deprecated Use ExtendedUserAnswer instead */
// export interface UserAnswer extends ExtendedUserAnswer {}

/** @deprecated Use ExtendedAssessmentResult instead */
export interface AssessmentResult {
  totalScores: ScoreData;
  archetype: ExtendedArchetype;
  completedAt: Date;
  answers: ExtendedUserAnswer[];
}

/** @deprecated Use ExtendedArchetype instead */
export interface RelationshipArchetype extends ExtendedArchetype {
  icon?: string;
  color?: string;
  gradient?: string;
}

// ==========================================================================
// VALIDATION AND ERROR HANDLING TYPES
// ==========================================================================

export interface ValidationError {
  type: 'missing_selection' | 'invalid_option' | 'scenario_not_found' | 'multi_select_incomplete';
  message: string;
  scenarioId?: number | string;
  optionLetter?: string;
}

export interface AssessmentValidation {
  isValid: boolean;
  errors: ValidationError[];
  canProceed: boolean;
  completionPercentage: number;
}

// ==========================================================================
// NAVIGATION AND FLOW CONTROL TYPES
// ==========================================================================

export interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  currentScenarioType: 'single_select' | 'multi_select' | 'completion';
}

export interface FlowControlActions {
  goToNext: () => void;
  goToPrevious: () => void;
  goToScenario: (id: number | string) => void;
  resetAssessment: () => void;
  completeAssessment: () => void;
}

// ==========================================================================
// EXPORT GROUPINGS FOR CONVENIENCE
// ==========================================================================

// Core assessment types
export type CoreAssessmentTypes =
  | ExtendedScenario
  | ExtendedAnswerOption
  | ExtendedUserAnswer
  | ScoreData;

// Multi-select related types
export type MultiSelectTypes =
  | MultiSelectState
  | MultiSelectValidation
  | MultiSelectQuestionCardProps
  | MultiSelectProgressProps;

// Results and analysis types
export type ResultsTypes =
  | ArchetypeResults
  | PersonaSelection
  | VulnerabilityAssessment
  | ExtendedAssessmentResult;

// Component prop types
export type ComponentPropTypes =
  | ExtendedQuestionCardProps
  | PersonaCardProps
  | VulnerabilityCardProps
  | ArchetypeResultsProps;

// lib/types.ts
// ==========================================================================
// EXTENDED TYPESCRIPT TYPES AND INTERFACES - COMPLETE REPLACEMENT
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
}

export interface ExtendedUserAnswer {
  scenarioId: number | string;
  selectedOption: ExtendedAnswerOption;
  timestamp: Date;
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
  exploitedTraits: string[];
  manipulationMethods: string[];
}

export interface ArchetypeVulnerability {
  archetypeId: string;
  archetypeName: string;
  primaryVulnerabilities: string[];
  highRiskPersonas: PersonaRisk[];
}

export interface PersonaArchetypeMapping {
  [archetypeId: string]: ArchetypeVulnerability;
  selectionAlgorithm: {
    weightedHybridRules: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
    confidenceGapCalculation: {
      largeGap: {
        threshold: string;
        selection: {
          primaryArchetypePersonas: number;
          secondaryArchetypePersonas: number;
          totalCards: number;
        };
      };
      mediumGap: {
        threshold: string;
        selection: {
          primaryArchetypePersonas: number;
          secondaryArchetypePersonas: number;
          totalCards: number;
        };
      };
      smallGap: {
        threshold: string;
        selection: {
          primaryArchetypePersonas: number;
          secondaryArchetypePersonas: number;
          totalCards: number;
        };
      };
    };
    personaSelectionPriority: {
      highRisk: string;
      mediumRisk: string;
      lowRisk: string;
    };
  };
}

export interface PersonaSelection {
  selectedPersonas: PersonaCard[];
  selectionReason: 'largeGap' | 'mediumGap' | 'smallGap';
  confidenceGap: number;
  primaryArchetype: ArchetypeMatch;
  secondaryArchetype?: ArchetypeMatch;
}

// ==========================================================================
// ASSESSMENT FLOW TYPES
// ==========================================================================

export interface UserPath {
  totalSteps: number;
  pathSequence: {
    scenarioId: number | string;
    nextScenarioId: number | string;
  }[];
  branchingPoints: number;
}

export interface ExtendedAssessmentResult {
  // Core Results
  userScores: ScoreData;
  archetypeResults: ArchetypeResults;
  personaSelection: PersonaSelection;

  // Metadata
  completedAt: Date;
  answers: ExtendedUserAnswer[];
  userPath: UserPath;
  assessmentDuration: number; // in seconds
}

export interface UserData {
  name: string;
  email?: string;
}

// ==========================================================================
// STORE STATE TYPES
// ==========================================================================

export interface ExtendedAssessmentState {
  // Current state
  currentScenario: number | string;
  answers: ExtendedUserAnswer[];
  scores: ScoreData;
  userData: UserData | null;
  isComplete: boolean;
  isStarted: boolean;

  // Extended state
  userPath: UserPath | null;
  estimatedProgress: number;
  startTime: Date | null;

  // Results
  archetypeResults: ArchetypeResults | null;
  personaSelection: PersonaSelection | null;
}

// ==========================================================================
// COMPONENT PROP TYPES
// ==========================================================================

export interface ExtendedProgressBarProps {
  current: number;
  estimated: number;
  isComplete: boolean;
}

export interface ExtendedQuestionCardProps {
  scenario: ExtendedScenario;
  onAnswer: (option: ExtendedAnswerOption) => void;
  selectedOption?: ExtendedAnswerOption;
  canGoBack: boolean;
  onGoBack: () => void;
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
// API AND UTILITY TYPES
// ==========================================================================

export interface ScenarioValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AssessmentAnalytics {
  totalUsers: number;
  averageCompletionTime: number;
  mostCommonPath: string[];
  archetypeDistribution: Record<string, number>;
  dropoffPoints: Record<string, number>;
}

// ==========================================================================
// LEGACY COMPATIBILITY (IF NEEDED - BUT WE'RE REPLACING)
// ==========================================================================

// Keep these for reference but mark as deprecated
/** @deprecated Use ExtendedScenario instead */
export interface Scenario extends ExtendedScenario {}

/** @deprecated Use ExtendedUserAnswer instead */
export interface UserAnswer extends ExtendedUserAnswer {}

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

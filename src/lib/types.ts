// lib/types.ts
// ==========================================================================
// TYPESCRIPT TYPES AND INTERFACES
// ==========================================================================

export interface ScoreData {
  emotional: number;
  logical: number;
  exploratory: number;
}

export interface AnswerOption {
  letter: string;
  text: string;
  scores: ScoreData;
  next: number | string;
}

export interface Scenario {
  id: number;
  text: string;
  options: AnswerOption[];
}

export interface UserAnswer {
  scenarioId: number;
  selectedOption: AnswerOption;
  timestamp: Date;
}

export interface AssessmentResult {
  totalScores: ScoreData;
  archetype: RelationshipArchetype;
  completedAt: Date;
  answers: UserAnswer[];
}

export interface UserData {
  name: string;
  email?: string;
}

export interface RelationshipArchetype {
  id: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  color: string;
  gradient: string;
}

export interface AssessmentState {
  currentScenario: number;
  answers: UserAnswer[];
  scores: ScoreData;
  isComplete: boolean;
  userData?: UserData;
}

// Component Props Types
export interface ProgressBarProps {
  current: number;
  total: number;
}

export interface QuestionCardProps {
  scenario: Scenario;
  onAnswer: (option: AnswerOption) => void;
  selectedOption?: AnswerOption;
}

export interface ResultsCardProps {
  result: AssessmentResult;
  userData: UserData;
}

export interface ArchetypeCardProps {
  archetype: RelationshipArchetype;
  score: number;
  isHighest: boolean;
}
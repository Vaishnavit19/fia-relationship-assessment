// lib/data.ts
// ==========================================================================
// ASSESSMENT DATA LOADER
// ==========================================================================

import archetypesData from '../data/archetypes.json';
import config from '../data/config.json';
import scenariosData from '../data/scenarios.json';

import { Scenario, RelationshipArchetype } from './types';

// Load data from JSON files
export const scenarios: Scenario[] = scenariosData.scenarios;
export const archetypes: RelationshipArchetype[] = archetypesData.archetypes;
export const appConfig = config;

// Helper functions
export const getScenarioById = (id: number): Scenario | null => {
  return scenarios.find(scenario => scenario.id === id) ?? null;
};

export const getArchetypeByHighestScore = (scores: {
  emotional: number;
  logical: number;
  exploratory: number;
}): RelationshipArchetype => {
  const { emotional, logical, exploratory } = scores;

  if (emotional >= logical && emotional >= exploratory) {
    return archetypes.find(a => a.id === 'heartfelt') ?? archetypes[0];
  } else if (logical >= exploratory) {
    return archetypes.find(a => a.id === 'strategic') ?? archetypes[1];
  } else {
    return archetypes.find(a => a.id === 'spontaneous') ?? archetypes[2];
  }
};

export const calculateProgress = (currentScenario: number): number => {
  const totalScenarios = scenarios.length;
  return Math.round((currentScenario / totalScenarios) * 100);
};

// Type assertions for better type safety
export const getArchetypeById = (id: string): RelationshipArchetype | undefined => {
  return archetypes.find(archetype => archetype.id === id);
};

export const isValidArchetypeId = (id: string): boolean => {
  return ['heartfelt', 'strategic', 'spontaneous'].includes(id);
};

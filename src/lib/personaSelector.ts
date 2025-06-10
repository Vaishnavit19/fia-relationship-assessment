// lib/personaSelector.ts
// ==========================================================================
// FILE 5: PERSONA SELECTION ENGINE - WEIGHTED HYBRID ALGORITHM
// ==========================================================================

import { personaMapping, personaCards } from './data';
import {
  ArchetypeMatch,
  PersonaCard,
  PersonaSelection,
  PersonaRisk,
  ArchetypeVulnerability,
} from './types';

// ==========================================================================
// CORE PERSONA SELECTION ALGORITHM
// ==========================================================================

/**
 * Main persona selection function implementing weighted hybrid algorithm
 */
export const selectPersonasForUser = (
  topArchetypes: ArchetypeMatch[],
  confidenceGap: number,
  gapType: 'largeGap' | 'mediumGap' | 'smallGap'
): PersonaSelection => {
  if (topArchetypes.length === 0) {
    throw new Error('No archetypes provided for persona selection');
  }

  const primaryArchetype = topArchetypes[0];
  const secondaryArchetype = topArchetypes[1];

  // Get distribution rules based on confidence gap
  const distribution = getPersonaDistribution(gapType);

  // Get vulnerability data for primary archetype
  const primaryVulnerabilities = getArchetypeVulnerabilities(primaryArchetype.archetype.id);
  const secondaryVulnerabilities = secondaryArchetype
    ? getArchetypeVulnerabilities(secondaryArchetype.archetype.id)
    : null;

  // Select personas based on weighted algorithm
  const selectedPersonas = selectPersonasByWeight(
    primaryVulnerabilities,
    secondaryVulnerabilities,
    distribution
  );

  return {
    selectedPersonas,
    selectionReason: gapType,
    confidenceGap,
    primaryArchetype,
    secondaryArchetype,
  };
};

/**
 * Get persona distribution based on confidence gap type
 */
export const getPersonaDistribution = (
  gapType: 'largeGap' | 'mediumGap' | 'smallGap'
): {
  primaryArchetypePersonas: number;
  secondaryArchetypePersonas: number;
  totalCards: number;
} => {
  // Safe access to the algorithm
  const algorithm =
    personaMapping?.selectionAlgorithm?.confidenceGapCalculation ||
    personaMapping?.archetypeVulnerabilityMap?.selectionAlgorithm?.confidenceGapCalculation;

  if (!algorithm) {
    // Fallback default values
    console.warn('Selection algorithm not found, using defaults');
    return { primaryArchetypePersonas: 3, secondaryArchetypePersonas: 3, totalCards: 6 };
  }

  switch (gapType) {
    case 'largeGap':
      return algorithm.largeGap.selection;
    case 'mediumGap':
      return algorithm.mediumGap.selection;
    case 'smallGap':
      return algorithm.smallGap.selection;
    default:
      return algorithm.smallGap.selection;
  }
};

/**
 * Get vulnerability data for a specific archetype
 */
export const getArchetypeVulnerabilities = (archetypeId: string): ArchetypeVulnerability | null => {
  // Access the nested archetypeVulnerabilityMap
  const mapping = personaMapping?.archetypeVulnerabilityMap || personaMapping;
  return mapping[archetypeId] ?? null;
};
/**
 * Select personas using weighted risk prioritization
 */
export const selectPersonasByWeight = (
  primaryVulnerabilities: ArchetypeVulnerability | null,
  secondaryVulnerabilities: ArchetypeVulnerability | null,
  distribution: {
    primaryArchetypePersonas: number;
    secondaryArchetypePersonas: number;
    totalCards: number;
  }
): PersonaCard[] => {
  const selectedPersonas: PersonaCard[] = [];

  // Select from primary archetype vulnerabilities
  if (primaryVulnerabilities) {
    const primaryPersonas = selectPersonasFromArchetype(
      primaryVulnerabilities,
      distribution.primaryArchetypePersonas
    );
    selectedPersonas.push(...primaryPersonas);
  }

  // Select from secondary archetype vulnerabilities (if exists)
  if (secondaryVulnerabilities && distribution.secondaryArchetypePersonas > 0) {
    const secondaryPersonas = selectPersonasFromArchetype(
      secondaryVulnerabilities,
      distribution.secondaryArchetypePersonas
    );
    selectedPersonas.push(...secondaryPersonas);
  }

  // Ensure we don't exceed limits and have minimum required
  const finalPersonas = enforceLimits(selectedPersonas, distribution.totalCards);

  return finalPersonas;
};

/**
 * Select personas from a single archetype based on risk prioritization
 */
export const selectPersonasFromArchetype = (
  vulnerabilities: ArchetypeVulnerability,
  count: number
): PersonaCard[] => {
  // Sort personas by risk level (high > medium > low) and apply weights
  const weightedPersonas = vulnerabilities.highRiskPersonas
    .map(risk => ({
      ...risk,
      weight: getRiskWeight(risk.riskLevel),
    }))
    .sort((a, b) => b.weight - a.weight);

  // Select top personas by weight
  const selectedRisks = weightedPersonas.slice(0, count);

  // Convert to PersonaCard objects
  const personas: PersonaCard[] = [];

  for (const risk of selectedRisks) {
    const persona = findPersonaById(risk.personaId);
    if (persona) {
      personas.push(persona);
    }
  }

  return personas;
};

/**
 * Get numerical weight for risk level
 */
export const getRiskWeight = (riskLevel: 'high' | 'medium' | 'low'): number => {
  const weights = personaMapping.selectionAlgorithm.personaSelectionPriority;

  switch (riskLevel) {
    case 'high':
      return parseInt(weights.highRisk.split('=')[1].trim()) || 3;
    case 'medium':
      return parseInt(weights.mediumRisk.split('=')[1].trim()) || 2;
    case 'low':
      return parseInt(weights.lowRisk.split('=')[1].trim()) || 1;
    default:
      return 1;
  }
};

/**
 * Find persona card by ID
 */
export const findPersonaById = (personaId: string): PersonaCard | undefined => {
  return personaCards.find(persona => persona.id === personaId);
};

/**
 * Enforce card limits (3-8 total cards)
 */
export const enforceLimits = (personas: PersonaCard[], targetCount: number): PersonaCard[] => {
  const minCards = 3;
  const maxCards = 8;

  // Remove duplicates
  const uniquePersonas = personas.filter(
    (persona, index, self) => index === self.findIndex(p => p.id === persona.id)
  );

  // If we have too few, add medium-risk personas until minimum is reached
  if (uniquePersonas.length < minCards) {
    const additionalPersonas = fillToMinimum(uniquePersonas, minCards);
    return additionalPersonas.slice(0, Math.min(maxCards, targetCount));
  }

  // If we have too many, trim to target (respecting max)
  const finalCount = Math.min(uniquePersonas.length, maxCards, targetCount);
  return uniquePersonas.slice(0, finalCount);
};

/**
 * Fill to minimum cards by adding medium-risk personas
 */
export const fillToMinimum = (
  currentPersonas: PersonaCard[],
  minRequired: number
): PersonaCard[] => {
  if (currentPersonas.length >= minRequired) {
    return currentPersonas;
  }

  const currentIds = new Set(currentPersonas.map(p => p.id));
  const additionalPersonas: PersonaCard[] = [];

  // Look for medium-risk personas not already selected
  for (const [archetypeId, vulnerabilities] of Object.entries(personaMapping)) {
    if (archetypeId === 'selectionAlgorithm') continue;

    const archVulns = vulnerabilities;
    const mediumRiskPersonas = archVulns.highRiskPersonas.filter(
      risk => risk.riskLevel === 'medium' && !currentIds.has(risk.personaId)
    );

    for (const risk of mediumRiskPersonas) {
      if (currentPersonas.length + additionalPersonas.length >= minRequired) break;

      const persona = findPersonaById(risk.personaId);
      if (persona && !currentIds.has(persona.id)) {
        additionalPersonas.push(persona);
        currentIds.add(persona.id);
      }
    }

    if (currentPersonas.length + additionalPersonas.length >= minRequired) break;
  }

  return [...currentPersonas, ...additionalPersonas];
};

// ==========================================================================
// PERSONA ANALYSIS & INSIGHTS
// ==========================================================================

/**
 * Analyze selected personas to provide insights
 */
export const analyzePersonaSelection = (
  selection: PersonaSelection
): {
  riskDistribution: { high: number; medium: number; low: number };
  dominantManipulationTactics: string[];
  vulnerabilityPatterns: string[];
  educationalInsights: string[];
} => {
  const riskDistribution = { high: 0, medium: 0, low: 0 };
  const allTactics = new Set<string>();
  const vulnerabilityPatterns = new Set<string>();

  // Analyze each selected persona
  selection.selectedPersonas.forEach(persona => {
    // Get risk level for this persona
    const riskLevel = getPersonaRiskLevel(persona.id, selection.primaryArchetype.archetype.id);
    if (riskLevel) {
      riskDistribution[riskLevel]++;
    }

    // Collect manipulation tactics
    persona.psychologicalTactics.forEach(tactic => allTactics.add(tactic));

    // Collect vulnerability patterns
    persona.vulnerableArchetypes.forEach(archetype => vulnerabilityPatterns.add(archetype));
  });

  // Generate educational insights
  const educationalInsights = generateEducationalInsights(
    selection,
    riskDistribution,
    Array.from(allTactics)
  );

  return {
    riskDistribution,
    dominantManipulationTactics: Array.from(allTactics).slice(0, 5), // Top 5 tactics
    vulnerabilityPatterns: Array.from(vulnerabilityPatterns),
    educationalInsights,
  };
};

/**
 * Get risk level for a specific persona relative to an archetype
 */
export const getPersonaRiskLevel = (
  personaId: string,
  archetypeId: string
): 'high' | 'medium' | 'low' | null => {
  const vulnerabilities = getArchetypeVulnerabilities(archetypeId);
  if (!vulnerabilities) return null;

  const risk = vulnerabilities.highRiskPersonas.find(r => r.personaId === personaId);
  return risk ? risk.riskLevel : null;
};

/**
 * Generate educational insights about the persona selection
 */
export const generateEducationalInsights = (
  selection: PersonaSelection,
  riskDistribution: { high: number; medium: number; low: number },
  tactics: string[]
): string[] => {
  const insights: string[] = [];

  // Risk distribution insights
  if (riskDistribution.high > riskDistribution.medium + riskDistribution.low) {
    insights.push(
      'Your personality profile shows vulnerability to high-manipulation tactics. Awareness is your best defense.'
    );
  } else if (riskDistribution.medium > 0) {
    insights.push(
      'You show balanced vulnerability patterns. Stay alert to subtle manipulation tactics.'
    );
  }

  // Confidence gap insights
  if (selection.confidenceGap > 20) {
    insights.push(
      `Your ${selection.primaryArchetype.archetype.name} traits are very pronounced, making specific manipulation patterns more predictable.`
    );
  } else if (selection.confidenceGap < 10) {
    insights.push(
      'Your blended personality traits create varied vulnerability patterns across different manipulation styles.'
    );
  }

  // Tactic-specific insights
  if (tactics.includes('Strategic vulnerability displays')) {
    insights.push(
      "Be cautious of partners who seem to have 'perfect' emotional problems that only you can solve."
    );
  }

  if (tactics.includes('Emotional overwhelming')) {
    insights.push(
      'Watch for relationships that feel intensely emotional very quickly - genuine connection builds gradually.'
    );
  }

  if (tactics.includes('Dependency cultivation')) {
    insights.push(
      'Healthy relationships involve mutual support, not one person becoming completely dependent on the other.'
    );
  }

  // General educational insight
  insights.push(
    'Remember: These are educational patterns, not predictions. Healthy relationships respect boundaries and grow mutually.'
  );

  return insights.slice(0, 4); // Limit to 4 key insights
};

// ==========================================================================
// VALIDATION & TESTING
// ==========================================================================

/**
 * Validate persona selection algorithm setup
 */
export const validatePersonaSelectionSetup = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check that all referenced personas exist
  Object.entries(personaMapping).forEach(([archetypeId, vulnerabilities]) => {
    if (archetypeId === 'selectionAlgorithm') return;

    const archVulns = vulnerabilities;
    archVulns.highRiskPersonas.forEach(risk => {
      const persona = findPersonaById(risk.personaId);
      if (!persona) {
        errors.push(
          `Persona ${risk.personaId} referenced in ${archetypeId} vulnerabilities but not found in persona cards`
        );
      }
    });
  });

  // Check that persona cards reference valid archetypes
  personaCards.forEach(persona => {
    persona.vulnerableArchetypes.forEach(archetypeId => {
      const vulnerabilities = getArchetypeVulnerabilities(archetypeId);
      if (!vulnerabilities) {
        warnings.push(
          `Persona ${persona.id} references archetype ${archetypeId} but no vulnerability mapping found`
        );
      }
    });
  });

  // Validate selection algorithm parameters
  const algorithm = personaMapping.selectionAlgorithm;
  if (!algorithm.confidenceGapCalculation) {
    errors.push('Missing confidence gap calculation configuration');
  }

  // Check card limits
  Object.values(algorithm.confidenceGapCalculation).forEach((config: any) => {
    if (config.selection) {
      const total =
        config.selection.primaryArchetypePersonas + config.selection.secondaryArchetypePersonas;
      if (total < 3 || total > 8) {
        warnings.push(
          `Selection configuration may produce ${total} cards, outside recommended 3-8 range`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Test persona selection with sample data
 */
export const testPersonaSelectionAlgorithm = () => {
  // Mock archetype matches for testing
  const mockMatches: ArchetypeMatch[] = [
    {
      archetype: { id: 'caregiver', name: 'The Caregiver' } as any,
      distance: 2.5,
      confidence: 85,
      rank: 1,
    },
    {
      archetype: { id: 'dreamer', name: 'The Dreamer' } as any,
      distance: 4.2,
      confidence: 65,
      rank: 2,
    },
  ];

  const testCases = [
    { gapType: 'largeGap' as const, gap: 25 },
    { gapType: 'mediumGap' as const, gap: 15 },
    { gapType: 'smallGap' as const, gap: 5 },
  ];

  testCases.forEach(testCase => {
    console.log(`\nTesting ${testCase.gapType} (gap: ${testCase.gap}):`);
    try {
      const selection = selectPersonasForUser(mockMatches, testCase.gap, testCase.gapType);
      console.log(`  Selected ${selection.selectedPersonas.length} personas:`);
      selection.selectedPersonas.forEach(persona => {
        console.log(`    - ${persona.persona} (${persona.title})`);
      });

      const analysis = analyzePersonaSelection(selection);
      console.log(
        `  Risk distribution: H:${analysis.riskDistribution.high} M:${analysis.riskDistribution.medium} L:${analysis.riskDistribution.low}`
      );
    } catch (error) {
      console.error(`  Error: ${error}`);
    }
  });
};

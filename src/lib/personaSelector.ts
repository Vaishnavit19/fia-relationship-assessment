// lib/personaSelector.ts
// ==========================================================================
// PERSONA SELECTION ENGINE - UPDATED FOR STORE COMPATIBILITY
// ==========================================================================

import { personaMapping, personaCards } from './data';
import { ArchetypeMatch, PersonaCard, ExtendedUserAnswer } from './types';

// ==========================================================================
// UPDATED TYPES FOR COMPATIBILITY
// ==========================================================================

export interface PersonaSelection {
  selectedPersonas: (PersonaCard & { riskLevel: 'high' | 'medium' | 'low' })[];
  selectionReason: 'large_gap' | 'medium_gap' | 'small_gap';
  confidenceGap: number;
  primaryArchetype: string;
  secondaryArchetype?: string;
}

export interface PersonaRisk {
  personaId: string;
  riskLevel: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
}

export interface PersonaSelectionAnalysis {
  totalPersonasSelected: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  dominantManipulationTypes: string[];
  vulnerabilityThemes: string[];
}

// ==========================================================================
// CORE PERSONA SELECTION ALGORITHM (UPDATED)
// ==========================================================================

/**
 * Main persona selection function - Updated for store compatibility
 * Handles both old and new gap type formats
 */
export const selectPersonasForUser = (
  topArchetypes: ArchetypeMatch[],
  confidenceGap: number,
  gapType: 'large_gap' | 'medium_gap' | 'small_gap'
): PersonaSelection => {
  console.log('=== PERSONA SELECTION DEBUG ===');
  console.log('Input topArchetypes:', topArchetypes?.length);
  console.log('Input confidenceGap:', confidenceGap);
  console.log('Input gapType:', gapType);

  if (!topArchetypes || topArchetypes.length === 0) {
    console.error('❌ No top archetypes provided');
    return {
      selectedPersonas: [],
      selectionReason: 'small_gap',
      confidenceGap: 0,
      primaryArchetype: 'Unknown',
    };
  }

  const primaryArchetype = topArchetypes[0];
  const secondaryArchetype = topArchetypes[1];

  console.log('Primary archetype:', primaryArchetype?.archetype?.name);
  console.log('Primary archetype ID:', primaryArchetype?.archetype?.id);
  console.log('Secondary archetype:', secondaryArchetype?.archetype?.name);

  // Normalize gap type format
  const normalizedGapType = normalizeGapType(gapType);
  console.log('Normalized gap type:', normalizedGapType);

  // Get distribution rules based on confidence gap
  const distribution = getPersonaDistribution(normalizedGapType);
  console.log('Distribution rules:', distribution);

  // Get vulnerability data for primary archetype
  console.log('Getting vulnerabilities for primary archetype...');
  const primaryVulnerabilities = getArchetypeVulnerabilities(primaryArchetype.archetype.id);
  console.log('Primary vulnerabilities found:', primaryVulnerabilities.length);

  const secondaryVulnerabilities = secondaryArchetype
    ? getArchetypeVulnerabilities(secondaryArchetype.archetype.id)
    : [];
  console.log('Secondary vulnerabilities found:', secondaryVulnerabilities.length);

  // Select personas using weighted hybrid algorithm
  console.log('Selecting personas with weighted algorithm...');
  const selectedPersonas = selectPersonasUsingWeightedAlgorithm(
    primaryVulnerabilities,
    secondaryVulnerabilities,
    distribution,
    confidenceGap
  );

  console.log('Selected personas after algorithm:', selectedPersonas.length);

  // Ensure we have valid personas
  if (selectedPersonas.length === 0) {
    console.warn('⚠️ No personas selected, using fallback');
    return generateFallbackPersonaSelection(primaryArchetype, confidenceGap, normalizedGapType);
  }

  const result = {
    selectedPersonas,
    selectionReason: normalizedGapType,
    confidenceGap,
    primaryArchetype: primaryArchetype.archetype.name,
    secondaryArchetype: secondaryArchetype?.archetype.name,
  };

  console.log('Final persona selection result:', {
    selectedPersonas: result.selectedPersonas.length,
    primaryArchetype: result.primaryArchetype,
    selectionReason: result.selectionReason,
  });

  return result;
};

/**
 * Analyze persona selection for insights
 */
export const analyzePersonaSelection = (selection: PersonaSelection): PersonaSelectionAnalysis => {
  const { selectedPersonas } = selection;

  const riskDistribution = {
    high: selectedPersonas.filter(p => p.riskLevel === 'high').length,
    medium: selectedPersonas.filter(p => p.riskLevel === 'medium').length,
    low: selectedPersonas.filter(p => p.riskLevel === 'low').length,
  };

  const manipulationTypes = selectedPersonas.flatMap(p => p.manipulatorTypes);
  const dominantManipulationTypes = [...new Set(manipulationTypes)];

  const vulnerabilityThemes = selectedPersonas.map(p => {
    if (p.persona.includes('Guilt')) return 'Guilt-based manipulation';
    if (p.persona.includes('Victim')) return 'Victim manipulation';
    if (p.persona.includes('Boundary')) return 'Boundary violations';
    if (p.persona.includes('Status')) return 'Status exploitation';
    if (p.persona.includes('Love')) return 'Love bombing';
    return 'General manipulation';
  });

  return {
    totalPersonasSelected: selectedPersonas.length,
    riskDistribution,
    dominantManipulationTypes,
    vulnerabilityThemes: [...new Set(vulnerabilityThemes)],
  };
};

// ==========================================================================
// COMPATIBILITY UTILITY FUNCTIONS
// ==========================================================================

/**
 * Normalize gap type format to handle both old and new formats
 */
const normalizeGapType = (
  gapType: 'largeGap' | 'mediumGap' | 'smallGap' | 'large_gap' | 'medium_gap' | 'small_gap'
): 'large_gap' | 'medium_gap' | 'small_gap' => {
  const mapping = {
    largeGap: 'large_gap' as const,
    mediumGap: 'medium_gap' as const,
    smallGap: 'small_gap' as const,
    large_gap: 'large_gap' as const,
    medium_gap: 'medium_gap' as const,
    small_gap: 'small_gap' as const,
  };

  return mapping[gapType] || 'small_gap';
};

/**
 * Get persona distribution rules based on confidence gap
 */
const getPersonaDistribution = (
  gapType: 'large_gap' | 'medium_gap' | 'small_gap'
): {
  totalPersonas: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
} => {
  switch (gapType) {
    case 'large_gap':
      return { totalPersonas: 3, highRisk: 2, mediumRisk: 1, lowRisk: 0 };
    case 'medium_gap':
      return { totalPersonas: 4, highRisk: 2, mediumRisk: 2, lowRisk: 0 };
    case 'small_gap':
      return { totalPersonas: 5, highRisk: 2, mediumRisk: 2, lowRisk: 1 };
    default:
      return { totalPersonas: 3, highRisk: 1, mediumRisk: 1, lowRisk: 1 };
  }
};

/**
 * Calculate vulnerability score based on risk level and number of exploited traits
 */
const calculateVulnerabilityScore = (riskLevel: string, traitsCount: number): number => {
  const baseScores = {
    high: 80,
    medium: 60,
    low: 40,
  };

  const baseScore = baseScores[riskLevel] || 50;

  // Add bonus for more exploited traits (up to 20 points)
  const traitsBonus = Math.min(traitsCount * 5, 20);

  return Math.min(100, baseScore + traitsBonus);
};

/**
 * Get vulnerability data for an archetype - FIXED VERSION
 * Converts JSON mapping data to PersonaRisk objects with vulnerability scores
 */
const getArchetypeVulnerabilities = (archetypeId: string): PersonaRisk[] => {
  console.log('Getting vulnerabilities for archetype:', archetypeId);

  // Try to get from persona mapping data
  const mapping = personaMapping[archetypeId];

  if (mapping) {
    const vulnerabilities: PersonaRisk[] = [];

    // Convert highRiskPersonas with vulnerability scores
    if (mapping.highRiskPersonas) {
      mapping.highRiskPersonas.forEach(persona => {
        vulnerabilities.push({
          personaId: persona.personaId,
          riskLevel: 'high',
          vulnerabilityScore: calculateVulnerabilityScore(
            'high',
            persona.exploitedTraits?.length || 0
          ),
        });
      });
    }

    // Convert mediumRiskPersonas with vulnerability scores
    if (mapping.mediumRiskPersonas) {
      mapping.mediumRiskPersonas.forEach(persona => {
        vulnerabilities.push({
          personaId: persona.personaId,
          riskLevel: 'medium',
          vulnerabilityScore: calculateVulnerabilityScore(
            'medium',
            persona.exploitedTraits?.length || 0
          ),
        });
      });
    }

    // Convert lowRiskPersonas with vulnerability scores
    if (mapping.lowRiskPersonas) {
      mapping.lowRiskPersonas.forEach(persona => {
        vulnerabilities.push({
          personaId: persona.personaId,
          riskLevel: 'low',
          vulnerabilityScore: calculateVulnerabilityScore(
            'low',
            persona.exploitedTraits?.length || 0
          ),
        });
      });
    }

    console.log(
      `Found ${vulnerabilities.length} vulnerabilities for ${archetypeId}:`,
      vulnerabilities
    );
    return vulnerabilities;
  }

  console.warn(`No mapping found for archetype: ${archetypeId}. Using fallback.`);
  // Fallback: create generic vulnerabilities
  return generateGenericVulnerabilities(archetypeId);
};

/**
 * Select personas using weighted hybrid algorithm
 */
const selectPersonasUsingWeightedAlgorithm = (
  primaryVulnerabilities: PersonaRisk[],
  secondaryVulnerabilities: PersonaRisk[],
  distribution: { totalPersonas: number; highRisk: number; mediumRisk: number; lowRisk: number },
  confidenceGap: number
): (PersonaCard & { riskLevel: 'high' | 'medium' | 'low' })[] => {
  console.log('=== WEIGHTED ALGORITHM DEBUG ===');
  console.log('Primary vulnerabilities:', primaryVulnerabilities.length);
  console.log('Secondary vulnerabilities:', secondaryVulnerabilities.length);
  console.log('Distribution:', distribution);

  const selectedPersonas: (PersonaCard & { riskLevel: 'high' | 'medium' | 'low' })[] = [];

  // Combine and sort vulnerabilities by risk level
  const allVulnerabilities = [...primaryVulnerabilities, ...secondaryVulnerabilities];
  console.log('Total vulnerabilities:', allVulnerabilities.length);

  const highRiskVulns = allVulnerabilities.filter(v => v.riskLevel === 'high');
  const mediumRiskVulns = allVulnerabilities.filter(v => v.riskLevel === 'medium');
  const lowRiskVulns = allVulnerabilities.filter(v => v.riskLevel === 'low');

  console.log('Risk distribution:', {
    high: highRiskVulns.length,
    medium: mediumRiskVulns.length,
    low: lowRiskVulns.length,
  });

  // Select high-risk personas
  console.log('Selecting high-risk personas...');
  const highRiskSelected = selectPersonasByRisk(highRiskVulns, distribution.highRisk, 'high');
  console.log('High-risk selected:', highRiskSelected.length);
  selectedPersonas.push(...highRiskSelected);

  // Select medium-risk personas
  console.log('Selecting medium-risk personas...');
  const mediumRiskSelected = selectPersonasByRisk(
    mediumRiskVulns,
    distribution.mediumRisk,
    'medium'
  );
  console.log('Medium-risk selected:', mediumRiskSelected.length);
  selectedPersonas.push(...mediumRiskSelected);

  // Select low-risk personas
  console.log('Selecting low-risk personas...');
  const lowRiskSelected = selectPersonasByRisk(lowRiskVulns, distribution.lowRisk, 'low');
  console.log('Low-risk selected:', lowRiskSelected.length);
  selectedPersonas.push(...lowRiskSelected);

  // Remove duplicates by persona ID
  const uniquePersonas = selectedPersonas.filter(
    (persona, index, array) => array.findIndex(p => p.id === persona.id) === index
  );

  console.log('Unique personas after deduplication:', uniquePersonas.length);

  const finalSelection = uniquePersonas.slice(0, distribution.totalPersonas);
  console.log('Final selection after limiting:', finalSelection.length);

  return finalSelection;
};

/**
 * Select personas by risk level
 */
const selectPersonasByRisk = (
  vulnerabilities: PersonaRisk[],
  count: number,
  riskLevel: 'high' | 'medium' | 'low'
): (PersonaCard & { riskLevel: 'high' | 'medium' | 'low' })[] => {
  console.log(
    `Selecting ${count} ${riskLevel}-risk personas from ${vulnerabilities.length} vulnerabilities`
  );

  const selected: (PersonaCard & { riskLevel: 'high' | 'medium' | 'low' })[] = [];

  // Sort by vulnerability score (descending)
  const sortedVulns = vulnerabilities.sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);

  for (let i = 0; i < Math.min(count, sortedVulns.length); i++) {
    const vuln = sortedVulns[i];
    console.log(`Looking for persona: ${vuln.personaId}`);

    const persona = getPersonaById(vuln.personaId);

    if (persona) {
      console.log(`✅ Found persona: ${persona.persona}`);
      selected.push({
        ...persona,
        riskLevel,
      });
    } else {
      console.warn(`❌ Persona not found: ${vuln.personaId}`);
    }
  }

  console.log(`Selected ${selected.length} ${riskLevel}-risk personas`);
  return selected;
};

/**
 * Get persona by ID from imported data
 */
const getPersonaById = (personaId: string): PersonaCard | null => {
  const persona = personaCards.find(p => p.id === personaId);

  if (!persona) {
    console.warn(`Persona not found: ${personaId}`);
    return null;
  }

  return persona;
};

/**
 * Generate generic vulnerabilities for archetype
 */
const generateGenericVulnerabilities = (archetypeId: string): PersonaRisk[] => {
  // Create generic persona risks based on archetype
  const genericPersonaIds = personaCards.slice(0, 5).map(p => p.id);

  return genericPersonaIds.map(personaId => ({
    personaId,
    riskLevel: 'medium' as const,
    vulnerabilityScore: 50,
  }));
};

/**
 * Generate fallback persona selection
 */
const generateFallbackPersonaSelection = (
  primaryArchetype: ArchetypeMatch,
  confidenceGap: number,
  gapType: 'large_gap' | 'medium_gap' | 'small_gap'
): PersonaSelection => {
  // Select first few personas as fallback
  const fallbackPersonas = personaCards.slice(0, 3).map(persona => ({
    ...persona,
    riskLevel: 'medium' as const,
  }));

  return {
    selectedPersonas: fallbackPersonas,
    selectionReason: gapType,
    confidenceGap,
    primaryArchetype: primaryArchetype.archetype.name,
  };
};

// ==========================================================================
// VALIDATION FUNCTIONS
// ==========================================================================

/**
 * Validate persona selection setup
 */
export const validatePersonaSelectionSetup = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if persona cards are available
  if (!personaCards || personaCards.length === 0) {
    errors.push('No persona cards available');
  }

  // Check if persona mapping is available
  if (!personaMapping || Object.keys(personaMapping).length === 0) {
    errors.push('No persona mapping available');
  }

  // Validate persona card structure
  personaCards.forEach((persona, index) => {
    if (!persona.id) {
      errors.push(`Persona ${index}: Missing ID`);
    }
    if (!persona.persona) {
      errors.push(`Persona ${index}: Missing persona name`);
    }
    if (!persona.psychologicalTactics || persona.psychologicalTactics.length === 0) {
      warnings.push(`Persona ${persona.id}: No psychological tactics defined`);
    }
  });

  // Validate persona mapping structure
  Object.entries(personaMapping).forEach(([archetypeId, mapping]) => {
    if (!mapping.highRiskPersonas && !mapping.mediumRiskPersonas && !mapping.lowRiskPersonas) {
      warnings.push(`Archetype ${archetypeId}: No risk personas defined`);
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
export const testPersonaSelection = (): {
  isWorking: boolean;
  testResults: Record<string, unknown>;
  errors: string[];
} => {
  const errors: string[] = [];
  const testResults: Record<string, unknown> = {};

  try {
    // Test with sample archetype matches
    const sampleMatches: ArchetypeMatch[] = [
      {
        archetype: { id: 'peacemaker', name: 'Peacemaker' } as any,
        distance: 1.5,
        confidence: 85,
        rank: 1,
      },
      {
        archetype: { id: 'caregiver', name: 'Caregiver' } as any,
        distance: 2.1,
        confidence: 72,
        rank: 2,
      },
    ];

    // Test different gap types
    const largeGapResult = selectPersonasForUser(sampleMatches, 25, 'large_gap');
    const mediumGapResult = selectPersonasForUser(sampleMatches, 15, 'medium_gap');
    const smallGapResult = selectPersonasForUser(sampleMatches, 5, 'small_gap');

    testResults.largeGap = {
      selected: largeGapResult.selectedPersonas.length,
      primary: largeGapResult.primaryArchetype,
    };
    testResults.mediumGap = {
      selected: mediumGapResult.selectedPersonas.length,
      primary: mediumGapResult.primaryArchetype,
    };
    testResults.smallGap = {
      selected: smallGapResult.selectedPersonas.length,
      primary: smallGapResult.primaryArchetype,
    };

    // Test analysis
    const analysis = analyzePersonaSelection(largeGapResult);
    testResults.analysis = {
      totalSelected: analysis.totalPersonasSelected,
      riskDistribution: analysis.riskDistribution,
    };

    return {
      isWorking: true,
      testResults,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);

    return {
      isWorking: false,
      testResults,
      errors,
    };
  }
};

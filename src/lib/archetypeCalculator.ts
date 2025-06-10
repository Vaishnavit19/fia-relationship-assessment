// lib/archetypeCalculator.ts - FIXED VERSION
// ==========================================================================
// FILE 3: MATHEMATICAL PROXIMITY ARCHETYPE CALCULATOR - WITH ERROR HANDLING
// ==========================================================================

import { archetypeScoringProfiles, extendedArchetypes } from './data';
import {
  ScoreData,
  ArchetypeScoringProfile,
  ExtendedArchetype,
  ArchetypeMatch,
  ArchetypeResults,
} from './types';

// ==========================================================================
// CORE MATHEMATICAL FUNCTIONS
// ==========================================================================

/**
 * Calculate Euclidean distance between user scores and archetype target scores
 * Formula: sqrt((user_logical - target_logical)² + (user_emotional - target_emotional)² + (user_exploratory - target_exploratory)²)
 */
export const calculateEuclideanDistance = (
  userScores: ScoreData,
  targetScores: ScoreData
): number => {
  const logicalDiff = userScores.logical - targetScores.logical;
  const emotionalDiff = userScores.emotional - targetScores.emotional;
  const exploratoryDiff = userScores.exploratory - targetScores.exploratory;

  return Math.sqrt(
    Math.pow(logicalDiff, 2) + Math.pow(emotionalDiff, 2) + Math.pow(exploratoryDiff, 2)
  );
};

/**
 * Convert distance to confidence percentage
 * Formula: 100 - (distance * confidence_multiplier)
 * Constrained between minConfidence and maxConfidence
 */
export const calculateConfidenceFromDistance = (
  distance: number,
  confidenceMultiplier = 5,
  minConfidence = 30,
  maxConfidence = 95
): number => {
  const rawConfidence = 100 - distance * confidenceMultiplier;
  return Math.round(Math.max(minConfidence, Math.min(maxConfidence, rawConfidence)));
};

/**
 * Determine if two distances are considered "tied" (within threshold)
 */
export const areDistancesTied = (distance1: number, distance2: number, threshold = 1): boolean => {
  return Math.abs(distance1 - distance2) <= threshold;
};

// ==========================================================================
// ARCHETYPE MATCHING ENGINE
// ==========================================================================

/**
 * Calculate distance and confidence for a single archetype
 */
export const calculateArchetypeMatch = (
  userScores: ScoreData,
  scoringProfile: ArchetypeScoringProfile
): { distance: number; confidence: number } => {
  const distance = calculateEuclideanDistance(userScores, scoringProfile.targetScores);
  const confidence = calculateConfidenceFromDistance(distance);

  return { distance, confidence };
};

/**
 * Find archetype by ID from extended archetypes data
 */
export const findExtendedArchetypeById = (archetypeId: string): ExtendedArchetype | undefined => {
  return extendedArchetypes.find(archetype => archetype.id === archetypeId);
};

/**
 * Calculate matches for all archetypes and return sorted results
 */
export const calculateAllArchetypeMatches = (userScores: ScoreData): ArchetypeMatch[] => {
  const matches: ArchetypeMatch[] = [];

  // Calculate distance and confidence for each archetype
  archetypeScoringProfiles.forEach((profile, index) => {
    const { distance, confidence } = calculateArchetypeMatch(userScores, profile);
    const archetype = findExtendedArchetypeById(profile.archetypeId);

    if (archetype) {
      matches.push({
        archetype,
        distance,
        confidence,
        rank: 0, // Will be set after sorting
      });
    } else {
      console.warn(`Archetype not found for ID: ${profile.archetypeId}`);
    }
  });

  // Sort by distance (ascending - smaller distance = better match)
  matches.sort((a, b) => a.distance - b.distance);

  // Assign ranks, handling ties
  let currentRank = 1;
  matches.forEach((match, index) => {
    if (index > 0) {
      const previousMatch = matches[index - 1];
      if (!areDistancesTied(match.distance, previousMatch.distance)) {
        currentRank = index + 1;
      }
    }
    match.rank = currentRank;
  });

  return matches;
};

/**
 * Get top matches (3-5 based on proximity and ties)
 */
export const getTopArchetypeMatches = (
  matches: ArchetypeMatch[],
  maxResults = 5
): ArchetypeMatch[] => {
  // GUARD CLAUSE: Handle empty or undefined matches
  if (!matches || matches.length === 0) {
    console.warn('getTopArchetypeMatches: No matches provided');
    return [];
  }

  // Always include at least top 3
  const minResults = 3;
  const topMatches = matches.slice(0, Math.max(minResults, Math.min(maxResults, matches.length)));

  // If we're at the boundary and there are ties, include all tied matches
  if (topMatches.length < matches.length) {
    const lastIncludedDistance = topMatches[topMatches.length - 1].distance;
    const nextMatch = matches[topMatches.length];

    // If the next match has the same distance (tie), include it and any others with same distance
    if (areDistancesTied(lastIncludedDistance, nextMatch.distance)) {
      for (let i = topMatches.length; i < matches.length; i++) {
        if (areDistancesTied(lastIncludedDistance, matches[i].distance)) {
          topMatches.push(matches[i]);
        } else {
          break;
        }
      }
    }
  }

  return topMatches.slice(0, maxResults); // Still respect max limit
};

/**
 * Generate complete archetype results with error handling
 */
export const generateArchetypeResults = (userScores: ScoreData): ArchetypeResults => {
  // GUARD CLAUSE: Validate input scores
  if (
    !userScores ||
    typeof userScores.logical !== 'number' ||
    typeof userScores.emotional !== 'number' ||
    typeof userScores.exploratory !== 'number'
  ) {
    console.error('generateArchetypeResults: Invalid user scores provided');
    return createFallbackArchetypeResults();
  }

  try {
    const allMatches = calculateAllArchetypeMatches(userScores);
    const topMatches = getTopArchetypeMatches(allMatches);

    return {
      userScores,
      matches: allMatches,
      topMatches,
    };
  } catch (error) {
    console.error('generateArchetypeResults: Error calculating matches', error);
    return createFallbackArchetypeResults();
  }
};

/**
 * Create fallback archetype results when calculation fails
 */
const createFallbackArchetypeResults = (): ArchetypeResults => {
  const fallbackScores: ScoreData = { logical: 1, emotional: 1, exploratory: 1 };

  return {
    userScores: fallbackScores,
    matches: [],
    topMatches: [],
  };
};

// ==========================================================================
// CONFIDENCE GAP ANALYSIS (for Phase 2 - Persona Selection) - FIXED
// ==========================================================================

/**
 * Calculate confidence gap between top archetype and second archetype
 * Used for persona selection algorithm in Phase 2
 * FIXED: Added comprehensive guard clauses
 */
export const calculateConfidenceGap = (
  topMatches: ArchetypeMatch[]
): {
  gap: number;
  gapType: 'largeGap' | 'mediumGap' | 'smallGap';
  primaryArchetype: string;
  secondaryArchetype?: string;
} => {
  console.log('=== CONFIDENCE GAP CALCULATION ===');
  console.log('Input topMatches:', topMatches?.length);

  if (!topMatches || topMatches.length === 0) {
    console.error('No top matches provided to calculateConfidenceGap');
    return {
      gap: 0,
      gapType: 'smallGap',
      primaryArchetype: 'Unknown',
    };
  }

  const primary = topMatches[0];
  const secondary = topMatches[1];

  console.log('Primary match:', {
    name: primary?.archetype?.name,
    confidence: primary?.confidence,
  });
  console.log('Secondary match:', {
    name: secondary?.archetype?.name,
    confidence: secondary?.confidence,
  });

  if (!primary?.confidence || typeof primary.confidence !== 'number') {
    console.error('Invalid primary confidence:', primary?.confidence);
    return {
      gap: 0,
      gapType: 'smallGap',
      primaryArchetype: primary?.archetype?.name || 'Unknown',
    };
  }

  // If no secondary match, gap is the primary confidence itself
  const secondaryConfidence = secondary?.confidence || 0;
  const gap = primary.confidence - secondaryConfidence;

  console.log('Calculated gap:', gap);

  let gapType: 'largeGap' | 'mediumGap' | 'smallGap';

  if (gap > 20) {
    gapType = 'largeGap';
  } else if (gap > 10) {
    gapType = 'mediumGap';
  } else {
    gapType = 'smallGap';
  }

  console.log('Gap type:', gapType);

  const result = {
    gap,
    gapType,
    primaryArchetype: primary.archetype.name,
    secondaryArchetype: secondary?.archetype?.name,
  };

  console.log('Confidence gap result:', result);
  return result;
};

// ==========================================================================
// ANALYTICS AND DEBUGGING
// ==========================================================================

/**
 * Get detailed analysis of user scores vs archetype profiles
 */
export const getDetailedScoreAnalysis = (userScores: ScoreData) => {
  // GUARD CLAUSE: Validate input
  if (!userScores) {
    console.error('getDetailedScoreAnalysis: userScores is undefined');
    return [];
  }

  const analysis = archetypeScoringProfiles.map(profile => {
    const { distance, confidence } = calculateArchetypeMatch(userScores, profile);

    return {
      archetypeId: profile.archetypeId,
      name: profile.name,
      distance,
      confidence,
      targetScores: profile.targetScores,
      scoreDifferences: {
        logical: userScores.logical - profile.targetScores.logical,
        emotional: userScores.emotional - profile.targetScores.emotional,
        exploratory: userScores.exploratory - profile.targetScores.exploratory,
      },
      dominantDimension: profile.dominantDimension,
    };
  });

  return analysis.sort((a, b) => a.distance - b.distance);
};

/**
 * Validate archetype calculation data integrity
 */
export const validateArchetypeCalculations = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if required data is loaded
  if (!archetypeScoringProfiles || archetypeScoringProfiles.length === 0) {
    errors.push('Archetype scoring profiles not loaded');
  }

  if (!extendedArchetypes || extendedArchetypes.length === 0) {
    errors.push('Extended archetypes not loaded');
  }

  // Validate each scoring profile
  archetypeScoringProfiles.forEach(profile => {
    if (!profile.archetypeId) {
      errors.push(`Scoring profile missing archetype ID`);
    }

    if (!profile.targetScores) {
      errors.push(`Scoring profile ${profile.archetypeId}: Missing target scores`);
    }

    // Validate percentages add up to ~100%
    const totalCalculated =
      profile.targetScores.logical +
      profile.targetScores.emotional +
      profile.targetScores.exploratory;

    const calculatedLogicalPct = (profile.targetScores.logical / totalCalculated) * 100;
    const calculatedEmotionalPct = (profile.targetScores.emotional / totalCalculated) * 100;
    const calculatedExploratoryPct = (profile.targetScores.exploratory / totalCalculated) * 100;

    if (Math.abs(calculatedLogicalPct - profile.percentages.logical) > 1) {
      warnings.push(`Scoring profile ${profile.archetypeId}: logical percentage may be incorrect`);
    }
    if (Math.abs(calculatedEmotionalPct - profile.percentages.emotional) > 1) {
      warnings.push(
        `Scoring profile ${profile.archetypeId}: emotional percentage may be incorrect`
      );
    }
    if (Math.abs(calculatedExploratoryPct - profile.percentages.exploratory) > 1) {
      warnings.push(
        `Scoring profile ${profile.archetypeId}: exploratory percentage may be incorrect`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ==========================================================================
// TESTING UTILITIES
// ==========================================================================

/**
 * Test the calculation system with sample data
 */
export const testArchetypeCalculations = () => {
  const testScores: ScoreData[] = [
    { logical: 10, emotional: 2, exploratory: 3 }, // Should match Intellectual
    { logical: 3, emotional: 10, exploratory: 2 }, // Should match Caregiver
    { logical: 3, emotional: 5, exploratory: 10 }, // Should match Explorer
    { logical: 7, emotional: 6, exploratory: 5 }, // Should match Leader
  ];

  testScores.forEach((scores, index) => {
    console.log(`\nTest ${index + 1} - Scores:`, scores);
    const results = generateArchetypeResults(scores);
    console.log('Top 3 matches:');
    results.topMatches.slice(0, 3).forEach((match, i) => {
      console.log(
        `  ${i + 1}. ${match.archetype.name}: ${match.confidence}% (distance: ${match.distance.toFixed(2)})`
      );
    });
  });
};

// lib/archetypeCalculator.ts
// ==========================================================================
// FILE 3: MATHEMATICAL PROXIMITY ARCHETYPE CALCULATOR
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
  // Always include at least top 3
  const minResults = 3;
  const topMatches = matches.slice(0, Math.max(minResults, maxResults));

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
 * Generate complete archetype results
 */
export const generateArchetypeResults = (userScores: ScoreData): ArchetypeResults => {
  const allMatches = calculateAllArchetypeMatches(userScores);
  const topMatches = getTopArchetypeMatches(allMatches);

  return {
    userScores,
    matches: allMatches,
    topMatches,
  };
};

// ==========================================================================
// CONFIDENCE GAP ANALYSIS (for Phase 2 - Persona Selection)
// ==========================================================================

/**
 * Calculate confidence gap between top archetype and second archetype
 * Used for persona selection algorithm in Phase 2
 */
export const calculateConfidenceGap = (
  matches: ArchetypeMatch[]
): {
  gap: number;
  gapType: 'largeGap' | 'mediumGap' | 'smallGap';
  primaryArchetype: ArchetypeMatch;
  secondaryArchetype?: ArchetypeMatch;
} => {
  if (matches.length < 2) {
    return {
      gap: 0,
      gapType: 'smallGap',
      primaryArchetype: matches[0],
    };
  }

  const primary = matches[0];
  const secondary = matches[1];
  const gap = primary.confidence - secondary.confidence;

  let gapType: 'largeGap' | 'mediumGap' | 'smallGap';

  if (gap > 20) {
    gapType = 'largeGap';
  } else if (gap > 10) {
    gapType = 'mediumGap';
  } else {
    gapType = 'smallGap';
  }

  return {
    gap,
    gapType,
    primaryArchetype: primary,
    secondaryArchetype: secondary,
  };
};

// ==========================================================================
// ANALYTICS AND DEBUGGING
// ==========================================================================

/**
 * Get detailed analysis of user scores vs archetype profiles
 */
export const getDetailedScoreAnalysis = (userScores: ScoreData) => {
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
 * Validate archetype calculation setup
 */
export const validateArchetypeCalculationSetup = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if all scoring profiles have corresponding archetypes
  archetypeScoringProfiles.forEach(profile => {
    const archetype = findExtendedArchetypeById(profile.archetypeId);
    if (!archetype) {
      errors.push(
        `Scoring profile exists for ${profile.archetypeId} but no corresponding archetype found`
      );
    }
  });

  // Check if all archetypes have scoring profiles
  extendedArchetypes.forEach(archetype => {
    const profile = archetypeScoringProfiles.find(p => p.archetypeId === archetype.id);
    if (!profile) {
      warnings.push(`Archetype ${archetype.id} exists but no scoring profile found`);
    }
  });

  // Validate scoring profile data integrity
  archetypeScoringProfiles.forEach(profile => {
    const calculatedTotal =
      profile.targetScores.logical +
      profile.targetScores.emotional +
      profile.targetScores.exploratory;
    if (Math.abs(calculatedTotal - profile.totalScore) > 0.1) {
      errors.push(
        `Scoring profile ${profile.archetypeId}: totalScore (${profile.totalScore}) doesn't match sum of dimensions (${calculatedTotal})`
      );
    }

    // Check percentages
    const calculatedLogicalPct = (profile.targetScores.logical / profile.totalScore) * 100;
    const calculatedEmotionalPct = (profile.targetScores.emotional / profile.totalScore) * 100;
    const calculatedExploratoryPct = (profile.targetScores.exploratory / profile.totalScore) * 100;

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

// lib/personaEducator.ts
// ==========================================================================
// FILE 4: PERSONA EDUCATION ENGINE - RED FLAG RECOGNITION SYSTEM
// ==========================================================================

import { personaCards } from './data';
import { PersonaCard, PersonaSelection, ArchetypeMatch } from './types';

// ==========================================================================
// EDUCATIONAL CONTENT GENERATION
// ==========================================================================

/**
 * Generate comprehensive educational content for selected personas
 */
export const generateEducationalContent = (
  selection: PersonaSelection
): {
  overviewMessage: string;
  personaEducation: PersonaEducationContent[];
  keyRedFlags: string[];
  protectionStrategies: string[];
  confidenceMessage: string;
} => {
  const personaEducation = selection.selectedPersonas.map(persona =>
    generatePersonaEducationContent(persona, selection)
  );

  const keyRedFlags = extractKeyRedFlags(selection.selectedPersonas);
  const protectionStrategies = generateProtectionStrategies(selection);

  return {
    overviewMessage: generateOverviewMessage(selection),
    personaEducation,
    keyRedFlags,
    protectionStrategies,
    confidenceMessage: generateConfidenceMessage(selection),
  };
};

/**
 * Generate persona-specific educational content
 */
export const generatePersonaEducationContent = (
  persona: PersonaCard,
  selection: PersonaSelection
): PersonaEducationContent => {
  return {
    persona,
    riskLevel: determinePersonaRiskLevel(persona, selection),
    educationalSections: {
      recognitionSigns: generateRecognitionSigns(persona),
      psychologyExplained: generatePsychologyExplanation(persona),
      realWorldExamples: generateRealWorldExamples(persona),
      protectionTips: generatePersonaProtectionTips(persona),
    },
    interactiveElements: {
      popCultureConnections: persona.characters,
      relatable: persona.why,
      realityCheck: persona.plotTwist,
      blindSpotAwareness: persona.blindSpot,
      memorablePhrase: persona.punchline,
    },
  };
};

/**
 * Generate overview message based on selection pattern
 */
export const generateOverviewMessage = (selection: PersonaSelection): string => {
  const personaCount = selection.selectedPersonas.length;
  const primaryArchetype = selection.primaryArchetype.archetype.name;

  let message = `Based on your ${primaryArchetype} personality profile, we've identified ${personaCount} manipulation patterns you should be aware of. `;

  switch (selection.selectionReason) {
    case 'largeGap':
      message += `Your personality traits are quite pronounced, making certain manipulation tactics more predictable. This focused awareness can be your strength.`;
      break;
    case 'mediumGap':
      message += `You show a blend of personality traits, creating varied vulnerability patterns. This diversity requires broader awareness but also provides natural resilience.`;
      break;
    case 'smallGap':
      message += `Your balanced personality creates complex vulnerability patterns across multiple manipulation styles. This requires comprehensive awareness but also offers multiple paths to recognition.`;
      break;
  }

  return message;
};

/**
 * Generate confidence message based on archetype matching
 */
export const generateConfidenceMessage = (selection: PersonaSelection): string => {
  const confidence = selection.primaryArchetype.confidence;

  if (confidence >= 80) {
    return `We're highly confident (${confidence}%) in this analysis. These patterns are likely very relevant to your relationship dynamics.`;
  } else if (confidence >= 60) {
    return `We're moderately confident (${confidence}%) in this analysis. These patterns provide good general awareness for your personality type.`;
  } else {
    return `This analysis has moderate confidence (${confidence}%). Consider it as general relationship awareness rather than specific personal predictions.`;
  }
};

// ==========================================================================
// RED FLAG RECOGNITION SYSTEM
// ==========================================================================

/**
 * Extract key red flags from selected personas
 */
export const extractKeyRedFlags = (personas: PersonaCard[]): string[] => {
  const redFlags = new Set<string>();

  personas.forEach(persona => {
    // Extract red flags from psychological tactics
    persona.psychologicalTactics.forEach(tactic => {
      const flag = convertTacticToRedFlag(tactic);
      if (flag) redFlags.add(flag);
    });

    // Extract red flags from manipulator types
    persona.manipulatorTypes.forEach(type => {
      const flag = convertManipulatorTypeToRedFlag(type);
      if (flag) redFlags.add(flag);
    });
  });

  return Array.from(redFlags).slice(0, 8); // Top 8 red flags
};

/**
 * Convert psychological tactic to red flag warning
 */
export const convertTacticToRedFlag = (tactic: string): string | null => {
  const tacticRedFlags: Record<string, string> = {
    'Strategic vulnerability displays':
      '🚩 Partner shares "perfect" problems that only you can solve',
    'Emotional complexity as bait': '🚩 Relationship feels like solving an emotional puzzle',
    'Dramatic intensity to hook empathy': '🚩 Everything feels like a crisis or emergency',
    'Passive-aggressive undermining': '🚩 Constant subtle criticisms disguised as "help"',
    'Subtle emotional manipulation':
      '🚩 You feel confused about your own feelings after conversations',
    'Kindness as strategic weapon': '🚩 Nice gestures followed by guilt-tripping',
    'Emotional overwhelming': '🚩 Relationship intensity escalates extremely quickly',
    'Dependency as control': '🚩 Partner becomes completely dependent on you for everything',
    'Anxiety disguised as devotion': '🚩 "Love" feels more like panic or desperation',
    'Chaos as emotional bait': '🚩 Drama and instability presented as "passion"',
    'Brokenness as attraction': "🚩 Partner's problems become your identity project",
    'Self-destruction as manipulation': '🚩 Threats of self-harm to control your behavior',
    'Seduction as primary strategy': '🚩 Relationship moves to physical intimacy unusually fast',
    'Charm used for conquest': '🚩 You feel like a trophy to be won rather than a person',
    'Romance without commitment': '🚩 Grand romantic gestures but no concrete future plans',
    'False future promises': '🚩 Elaborate plans that never materialize into action',
    'Fantasy creation without follow-through': '🚩 Talks about "someday" but avoids "when"',
    'Hope manipulation': '🚩 Keeps you waiting with vague promises of change',
  };

  return tacticRedFlags[tactic] || null;
};

/**
 * Convert manipulator type to red flag warning
 */
export const convertManipulatorTypeToRedFlag = (type: string): string | null => {
  const typeRedFlags: Record<string, string> = {
    'Emotional Predator / Puppet Master':
      '🚩 Seems to know exactly what to say to get emotional reactions',
    'The Charismatic': '🚩 Unusually charming but charm feels calculated or "on"',
    'The Seducer':
      '🚩 Makes you feel special but similar stories about other "special" people emerge',
    'The Water Torturer': '🚩 Constantly questioning your perceptions and memory',
    'The Subtle Saboteur': '🚩 Your confidence decreases after spending time together',
    'The Nitpicker': '🚩 Nothing you do ever seems quite good enough',
    'The Clinger': '🚩 Panic or anger when you spend time with other people',
    'The Demand Man': '🚩 Your needs become less important than theirs',
    'The Parental Seeker': '🚩 You feel more like a parent than a partner',
    'The Addict': '🚩 Your relationship revolves around their "recovery" journey',
    'The Perpetual Victim': '🚩 Everyone in their life has supposedly wronged them',
    'The Player': "🚩 Stories about their romantic past don't quite add up",
    'The Rake':
      '🚩 Relationship feels like being swept into their adventure rather than building something together',
    'The Future Faker': '🚩 Big promises about the future but no concrete steps toward them',
    'The Ideal Lover': '🚩 Seems too good to be true and mirrors your interests perfectly',
    'The Self-Obsessed': '🚩 Conversations always circle back to them',
    'Master of Everything': '🚩 Never admits fault or apologizes genuinely',
    'The Drill Sergeant':
      '🚩 Relationship feels like boot camp with constant "improvement" demands',
  };

  return typeRedFlags[type] || null;
};

// ==========================================================================
// PROTECTION STRATEGIES
// ==========================================================================

/**
 * Generate protection strategies based on selected personas
 */
export const generateProtectionStrategies = (selection: PersonaSelection): string[] => {
  const strategies = new Set<string>();

  // Primary archetype-based strategies
  const primaryStrategies = getArchetypeProtectionStrategies(selection.primaryArchetype);
  primaryStrategies.forEach(strategy => strategies.add(strategy));

  // Persona-specific strategies
  selection.selectedPersonas.forEach(persona => {
    const personaStrategies = getPersonaProtectionStrategies(persona);
    personaStrategies.forEach(strategy => strategies.add(strategy));
  });

  // Confidence-based strategies
  const confidenceStrategies = getConfidenceBasedStrategies(selection);
  confidenceStrategies.forEach(strategy => strategies.add(strategy));

  return Array.from(strategies).slice(0, 6); // Top 6 strategies
};

/**
 * Get protection strategies for specific archetype
 */
export const getArchetypeProtectionStrategies = (archetype: ArchetypeMatch): string[] => {
  const strategies: Record<string, string[]> = {
    caregiver: [
      'Set clear boundaries about what help you can realistically provide',
      'Ask yourself: "Am I helping them grow or enabling dependency?"',
      "Trust your instincts if someone's problems seem designed to hook your empathy",
    ],
    dreamer: [
      'Distinguish between shared dreams and one person doing all the dreaming',
      'Look for partners who support your vision rather than hijack it',
      'Watch for people who use your idealism to manipulate your emotions',
    ],
    intellectual: [
      'Remember that emotional intelligence matters as much as intellectual connection',
      'Be wary of partners who use intellectual debates to avoid emotional intimacy',
      "Don't let someone's complexity blind you to their treatment of you",
    ],
    peacemaker: [
      'Practice saying no and expressing disagreement in low-stakes situations',
      'Remember that healthy relationships include conflict resolution, not conflict avoidance',
      "Your desire for harmony shouldn't come at the expense of your boundaries",
    ],
    explorer: [
      'Distinguish between exciting adventure and manufactured drama',
      'Ensure your partner adds to your adventures rather than becoming one',
      'Be cautious of people who confuse unpredictability with passion',
    ],
    achiever: [
      'Look for partners who support your goals rather than compete with them',
      'Be cautious of people who use your ambition to manipulate your choices',
      'Success in relationships requires emotional intelligence, not just achievement',
    ],
    leader: [
      'Healthy relationships are partnerships, not power struggles',
      'Be wary of partners who either submit completely or constantly challenge your authority',
      'Look for someone who complements your leadership rather than competes with it',
    ],
    rebel: [
      'Ensure your partner appreciates your authenticity rather than trying to tame it',
      'Be cautious of people who use your non-conformity to isolate you from support systems',
      'Rebellion should be principled, not reactive to manipulation',
    ],
  };

  return strategies[archetype.archetype.id] || [];
};

/**
 * Get protection strategies for specific persona
 */
export const getPersonaProtectionStrategies = (persona: PersonaCard): string[] => {
  // Generate strategies based on persona's tactics and blind spots
  const strategies: string[] = [];

  // Strategy based on blind spot
  if (persona.blindSpot.includes('healing')) {
    strategies.push('You cannot fix another person - they must want to change themselves');
  }

  if (persona.blindSpot.includes('devotion')) {
    strategies.push('Love and anxiety are different emotions - healthy love feels peaceful');
  }

  if (persona.blindSpot.includes('passion')) {
    strategies.push('Real passion builds over time - instant intensity is often manipulation');
  }

  if (persona.blindSpot.includes('safety')) {
    strategies.push(
      'Control and protection are different - one builds trust, the other destroys it'
    );
  }

  return strategies;
};

/**
 * Get protection strategies based on confidence level
 */
export const getConfidenceBasedStrategies = (selection: PersonaSelection): string[] => {
  const confidence = selection.primaryArchetype.confidence;

  if (confidence >= 80) {
    return [
      'These patterns are likely very relevant - pay special attention to these red flags',
      'Consider sharing this information with trusted friends who can help you spot patterns',
    ];
  } else if (confidence >= 60) {
    return [
      'Use this as general awareness rather than specific predictions',
      "Trust your instincts even if something isn't on this list",
    ];
  } else {
    return [
      'Consider this broad relationship education rather than personal predictions',
      'Your personality may be complex - consider retaking for more specific insights',
    ];
  }
};

// ==========================================================================
// DETAILED EDUCATION CONTENT
// ==========================================================================

/**
 * Generate recognition signs for a persona
 */
export const generateRecognitionSigns = (persona: PersonaCard): string[] => {
  const signs: string[] = [];

  // Base signs on psychological tactics
  persona.psychologicalTactics.forEach(tactic => {
    const sign = convertTacticToRecognitionSign(tactic);
    if (sign) signs.push(sign);
  });

  // Add persona-specific signs
  signs.push(`Watch for: ${persona.why.replace('You', 'They make you feel like')}`);
  signs.push(`Reality check: ${persona.plotTwist}`);

  return signs.slice(0, 4); // Top 4 recognition signs
};

/**
 * Convert tactic to recognition sign
 */
export const convertTacticToRecognitionSign = (tactic: string): string | null => {
  const tacticSigns: Record<string, string> = {
    'Strategic vulnerability displays':
      'They share deeply personal problems unusually early in the relationship',
    'Emotional complexity as bait': 'You find yourself constantly trying to "figure them out"',
    'Dramatic intensity to hook empathy':
      'Every conversation feels emotionally charged or crisis-focused',
    'Emotional overwhelming': 'The relationship escalates emotionally much faster than normal',
    'Dependency as control': 'They quickly become unable to function without your constant support',
    'Chaos as emotional bait': 'Their life drama becomes the center of your relationship',
    'Seduction as primary strategy':
      'Physical and romantic intensity overshadows getting to know each other',
    'False future promises': 'They make elaborate future plans but avoid discussing concrete steps',
  };

  return tacticSigns[tactic] || null;
};

/**
 * Generate psychology explanation for persona
 */
export const generatePsychologyExplanation = (persona: PersonaCard): string => {
  return `${persona.persona} types use ${persona.manipulatorTypes[0]} tactics because they've learned that ${persona.psychologicalTactics[0].toLowerCase()} gets them what they want from relationships. They're not necessarily aware they're being manipulative - this pattern often develops as a survival mechanism.`;
};

/**
 * Generate real-world examples
 */
export const generateRealWorldExamples = (persona: PersonaCard): string[] => {
  const examples = [
    `Like ${persona.characters[0]}, they might seem charming and complex at first`,
    `The relationship pattern: ${persona.why}`,
    `What actually happens: ${persona.plotTwist}`,
    `Your blind spot: ${persona.blindSpot}`,
  ];

  return examples;
};

/**
 * Generate persona-specific protection tips
 */
export const generatePersonaProtectionTips = (persona: PersonaCard): string[] => {
  const tips = getPersonaProtectionStrategies(persona);

  // Add persona-specific tip based on punchline
  tips.push(`Remember: ${persona.punchline}`);

  return tips;
};

// ==========================================================================
// TYPES FOR EDUCATIONAL CONTENT
// ==========================================================================

export interface PersonaEducationContent {
  persona: PersonaCard;
  riskLevel: 'high' | 'medium' | 'low';
  educationalSections: {
    recognitionSigns: string[];
    psychologyExplained: string;
    realWorldExamples: string[];
    protectionTips: string[];
  };
  interactiveElements: {
    popCultureConnections: string[];
    relatable: string;
    realityCheck: string;
    blindSpotAwareness: string;
    memorablePhrase: string;
  };
}

/**
 * Determine persona risk level for educational display
 */
export const determinePersonaRiskLevel = (
  persona: PersonaCard,
  selection: PersonaSelection
): 'high' | 'medium' | 'low' => {
  // This would integrate with the persona selection risk analysis
  // For now, default to medium as educational content
  return 'medium';
};

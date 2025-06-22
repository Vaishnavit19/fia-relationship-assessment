import useEnhancedAssessmentStore, { EnhancedAssessmentStore } from './store';

const generateAnalysisPromptFromStore = () => {
  const storeState = useEnhancedAssessmentStore.getState();
  return generateAnalysisPrompt(storeState);
};

// Robust programmatic prompt generator that handles all scenarios
const generateAnalysisPrompt = (state: EnhancedAssessmentStore) => {
  const {
    userData,
    answers,
    scores,
    archetypeResults,
    vulnerabilityAssessment,
    startTime,
    lastActivityTime,
  } = state;

  // === SAFE DATA EXTRACTION WITH FALLBACKS ===

  // User info
  const userName = userData?.name || 'User';
  const answersCount = answers?.length || 0;

  // Scoring calculations
  const logicalScore = scores?.logical || 0;
  const emotionalScore = scores?.emotional || 0;
  const exploratoryScore = scores?.exploratory || 0;
  const totalScore = logicalScore + emotionalScore + exploratoryScore;

  // Avoid division by zero
  const logicalPct = totalScore > 0 ? Math.round((logicalScore / totalScore) * 100) : 0;
  const emotionalPct = totalScore > 0 ? Math.round((emotionalScore / totalScore) * 100) : 0;
  const exploratoryPct = totalScore > 0 ? Math.round((exploratoryScore / totalScore) * 100) : 0;

  // Duration calculation
  const durationMs =
    lastActivityTime && startTime ? new Date(lastActivityTime) - new Date(startTime) : null;
  const duration = durationMs
    ? durationMs < 60000
      ? `${Math.round(durationMs / 1000)} seconds`
      : `${Math.round(durationMs / 60000)} minutes`
    : 'unknown duration';

  // Scoring dominance - handle ties and edge cases
  const maxScore = Math.max(logicalScore, emotionalScore, exploratoryScore);
  const dominantCategory =
    maxScore === exploratoryScore
      ? 'exploratory'
      : maxScore === logicalScore
        ? 'logical'
        : 'emotional';

  const secondHighest =
    [logicalScore, emotionalScore, exploratoryScore]
      .filter(score => score !== maxScore)
      .sort((a, b) => b - a)[0] || 1; // Avoid division by zero

  const dominanceRatio = maxScore > 0 ? (maxScore / Math.max(secondHighest, 1)).toFixed(1) : '1.0';

  // Archetype results
  const primaryMatch = archetypeResults?.topMatches?.[0];
  const secondaryMatch = archetypeResults?.topMatches?.[1];

  const primaryArchetype = primaryMatch?.archetype?.name || 'Not determined';
  const primaryConfidence = primaryMatch?.confidence || 0;
  const primaryDistance = primaryMatch?.distance?.toFixed(2) || 'N/A';

  const secondaryArchetype = secondaryMatch?.archetype?.name || 'Not determined';
  const secondaryConfidence = secondaryMatch?.confidence || 0;
  const secondaryDistance = secondaryMatch?.distance?.toFixed(2) || 'N/A';

  // Confidence gap analysis
  const confidenceGap = primaryConfidence - secondaryConfidence;
  const gapDescription =
    confidenceGap < 5
      ? 'slight preference'
      : confidenceGap < 15
        ? 'clear preference'
        : 'strong preference';

  // Vulnerability assessment
  const riskLevel = vulnerabilityAssessment?.riskProfile?.overallRiskLevel || 'not assessed';
  const riskScore = vulnerabilityAssessment?.riskProfile?.riskScore || 0;
  const selectedPersonas = vulnerabilityAssessment?.personaSelection?.selectedPersonas || [];
  const totalPersonas = selectedPersonas.length;

  // Risk distribution
  const riskDistribution = vulnerabilityAssessment?.selectionAnalysis?.riskDistribution || {};
  const highRiskCount = riskDistribution.high ?? 0;
  const mediumRiskCount = riskDistribution.medium ?? 0;
  const lowRiskCount = riskDistribution.low ?? 0;

  // Get persona names by risk level
  const highRiskPersonas = selectedPersonas
    .filter(p => p.riskLevel === 'high')
    .map(p => p.persona || 'Unknown')
    .slice(0, 3); // Limit to prevent overly long lists

  const mediumRiskPersonas = selectedPersonas
    .filter(p => p.riskLevel === 'medium')
    .map(p => p.persona || 'Unknown')
    .slice(0, 3);

  const lowRiskPersonas = selectedPersonas
    .filter(p => p.riskLevel === 'low')
    .map(p => p.persona || 'Unknown')
    .slice(0, 3);

  // === ADAPTIVE CONTENT GENERATION ===

  // Handle different scoring patterns for task instructions
  const dominantScoreInfo = `${dominantCategory} score ${dominantCategory === 'exploratory' ? exploratoryPct : dominantCategory === 'logical' ? logicalPct : emotionalPct}%`;

  // Adaptive vulnerability mention based on what's available
  let vulnerabilityMention = '';
  if (highRiskCount > 0) {
    vulnerabilityMention = `Specifically mention ${highRiskPersonas.slice(0, 2).join(' and ')} as high-risk types they should recognize`;
  } else if (mediumRiskCount > 0) {
    vulnerabilityMention = `Mention ${mediumRiskPersonas.slice(0, 2).join(' and ')} as key manipulation patterns to recognize`;
  } else if (totalPersonas > 0) {
    vulnerabilityMention = `Reference the ${totalPersonas} manipulation pattern${totalPersonas === 1 ? '' : 's'} identified for their awareness`;
  } else {
    vulnerabilityMention = `Focus on general manipulation awareness and protection strategies`;
  }

  // Adaptive archetype combination description
  const archetypeCombination = secondaryMatch
    ? `${primaryArchetype}-${secondaryArchetype} combination`
    : `${primaryArchetype} profile`;

  // Generate the complete prompt
  return `## Context
You are an expert relationship psychologist analyzing user behavior from a travel-scenario assessment. Explain WHY the user got their results based on their response patterns.

## User's Response Data

### User Information
- **Name**: ${userName}
- **Total Scenarios Completed**: ${answersCount} scenarios

### Scoring Patterns
- **Logical choices**: ${logicalScore} points (${logicalPct}% of total)
- **Emotional choices**: ${emotionalScore} points (${emotionalPct}% of total)
- **Exploratory choices**: ${exploratoryScore} points (${exploratoryPct}% of total)
- **Decision speed**: ${duration} completion time
- **Scoring dominance**: ${dominantCategory.charAt(0).toUpperCase() + dominantCategory.slice(1)} score ${dominanceRatio}x higher than other categories

### Assessment Results
- **Primary Match**: ${primaryArchetype} (${primaryConfidence}% confidence, ${primaryDistance} distance score)
- **Secondary Match**: ${secondaryArchetype} (${secondaryConfidence}% confidence, ${secondaryDistance} distance score)
- **Confidence Gap**: ${confidenceGap}-point gap between top matches suggests ${gapDescription} for primary archetype
- **Risk Level**: ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} (${riskScore}/100 risk score)
- **Vulnerability Patterns**: ${totalPersonas} manipulation pattern${totalPersonas === 1 ? '' : 's'} identified${
    highRiskCount > 0
      ? `
- **High-Risk Vulnerabilities**: ${highRiskPersonas.join(', ')}`
      : ''
  }${
    mediumRiskCount > 0
      ? `
- **Medium-Risk Vulnerabilities**: ${mediumRiskPersonas.join(', ')}`
      : ''
  }${
    lowRiskCount > 0
      ? `
- **Low-Risk Vulnerabilities**: ${lowRiskPersonas.join(', ')}`
      : ''
  }

## Task
Create exactly 3 concise sections analyzing the user's results:

**Personalized Result Interpretation (60-80 words)**
- Start with "Based on your response patterns..."
- Explain WHY they got ${primaryArchetype} result using their ${dominantScoreInfo}
- Reference their ${duration} completion and ${confidenceGap}-point confidence gap over ${secondaryArchetype}

**Vulnerability Pattern Analysis (60-80 words)**
- Start with "Your ${dominantCategory} preferences create..."
- Explain HOW their ${dominantScoreInfo} pattern creates vulnerabilities
- ${vulnerabilityMention}

**Relationship Insights (30-40 words)**
- Start with "In relationships, this means..."
- Connect their ${archetypeCombination} to partnership dynamics
- Provide practical compatibility advice emphasizing their ${dominantCategory} nature

## Requirements
- Use their name (${userName}) and specific data points
- Analytical but warm tone
- Total length: 150-200 words

---

**Generate the 3-section analysis now using only the data provided.**`;
};

// Example usage and testing function
const testPromptGeneration = () => {
  // Test with different scenarios
  const scenarios = [
    {
      name: 'High Explorer',
      state: {
        userData: { name: 'Alex' },
        answers: [{}, {}, {}, {}, {}, {}, {}, {}],
        scores: { logical: 1, emotional: 2, exploratory: 13 },
        archetypeResults: {
          topMatches: [
            { archetype: { name: 'The Explorer' }, confidence: 85, distance: 3.2, rank: 1 },
            { archetype: { name: 'The Rebel' }, confidence: 60, distance: 7.8, rank: 2 },
          ],
        },
        vulnerabilityAssessment: {
          riskProfile: { overallRiskLevel: 'high', riskScore: 85 },
          personaSelection: {
            selectedPersonas: [
              { persona: 'The Puppet Master', riskLevel: 'high' },
              { persona: 'The Rake', riskLevel: 'high' },
              { persona: 'The Charmer', riskLevel: 'medium' },
            ],
          },
          selectionAnalysis: { riskDistribution: { high: 2, medium: 1, low: 0 } },
        },
        startTime: '2025-01-01T10:00:00Z',
        lastActivityTime: '2025-01-01T10:02:30Z',
      },
    },
    {
      name: 'Balanced Logical',
      state: {
        userData: { name: 'Sam' },
        answers: [{}, {}, {}, {}, {}],
        scores: { logical: 8, emotional: 4, exploratory: 3 },
        archetypeResults: {
          topMatches: [
            { archetype: { name: 'The Intellectual' }, confidence: 72, distance: 4.1, rank: 1 },
            { archetype: { name: 'The Achiever' }, confidence: 70, distance: 4.3, rank: 2 },
          ],
        },
        vulnerabilityAssessment: {
          riskProfile: { overallRiskLevel: 'low', riskScore: 25 },
          personaSelection: {
            selectedPersonas: [
              { persona: 'The Subtle Saboteur', riskLevel: 'low' },
              { persona: 'The Perfectionist', riskLevel: 'medium' },
            ],
          },
          selectionAnalysis: { riskDistribution: { high: 0, medium: 1, low: 1 } },
        },
        startTime: '2025-01-01T10:00:00Z',
        lastActivityTime: '2025-01-01T10:00:45Z',
      },
    },
  ];

  scenarios.forEach(scenario => {
    console.log(`\n=== ${scenario.name} Scenario ===`);
    console.log(generateAnalysisPrompt(scenario.state));
    console.log('\n' + '='.repeat(50));
  });
};

const parseAIResponse = (
  aiResponse: string
): {
  personalizedInterpretation: string;
  vulnerabilityAnalysis: string;
  relationshipInsights: string;
} => {
  // Parse the AI response to extract the three sections
  // This depends on your AI response format

  const sections = {
    personalizedInterpretation: '',
    vulnerabilityAnalysis: '',
    relationshipInsights: '',
  };

  console.log('trying to parse', aiResponse);

  // Method 1: If AI returns structured JSON
  try {
    const parsed = JSON.parse(aiResponse);
    if (parsed.personalizedInterpretation) {
      return parsed;
    }
  } catch {
    // Continue with text parsing
    // console.log('there was error in json');
  }

  // Method 2: Parse text response with headers
  const lines = aiResponse.split('\n');
  let currentSection = '';

  console.log('lines are', lines);

  for (const line of lines) {
    console.log('parsing', line);
    // currentSection = '';
    if (line.includes('Personalized Result Interpretation')) {
      currentSection = 'personalizedInterpretation';
      if (line.trim().length < 'Personalized Result Interpretation'.length * 2) {
        continue;
      }
    } else if (line.includes('Vulnerability Pattern Analysis')) {
      currentSection = 'vulnerabilityAnalysis';
      if (line.trim().length < 'Vulnerability Pattern Analysis'.length * 2) {
        continue;
      }
    } else if (line.includes('Relationship Insights')) {
      currentSection = 'relationshipInsights';
      if (line.trim().length < 'Relationship Insights'.length * 2) {
        continue;
      }
    }

    console.log('currentSection', currentSection, line);

    if (currentSection && line.trim()) {
      sections[currentSection as keyof typeof sections] += line.trim() + ' ';
    }
  }

  // Clean up sections
  Object.keys(sections).forEach(key => {
    sections[key as keyof typeof sections] = sections[key as keyof typeof sections].trim();
  });

  console.log('sending back', sections);

  return sections;
};

export { generateAnalysisPromptFromStore, testPromptGeneration, parseAIResponse };

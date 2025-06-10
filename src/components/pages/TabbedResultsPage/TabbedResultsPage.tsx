// src/components/pages/TabbedResultsPage/TabbedResultsPage.tsx
'use client';

import {
  Trophy,
  Shield,
  Heart,
  Users,
  BarChart3,
  AlertTriangle,
  Target,
  TrendingUp,
  Info,
  Download,
  Share2,
  RefreshCw,
  Home,
  ChevronRight,
  Eye,
  Lightbulb,
  Clock,
  CheckCircle,
  Star,
  Award,
  Brain,
  Film,
  BookOpen,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';

import {
  generateArchetypeResults,
  validateArchetypeCalculations,
} from '../../../lib/archetypeCalculator';
import { archetypeScoringProfiles, extendedArchetypes } from '../../../lib/data';
import {
  extractKeyRedFlags,
  generateEducationalContent,
  convertTacticToRedFlag,
  convertManipulatorTypeToRedFlag,
} from '../../../lib/personaEducator';
import {
  formatArchetypeResultsForDisplay,
  generateResultsSummary,
} from '../../../lib/resultsEngine';
import useEnhancedAssessmentStore, {
  useEnhancedAssessmentData,
  useEnhancedAssessmentActions,
  useEnhancedAssessmentResults,
} from '../../../lib/store';
import {
  ArchetypeMatch,
  PersonaCard,
  PersonaEducationContent,
  ExtendedAssessmentResult,
  VulnerabilityAssessment,
} from '../../../lib/types';
import { generateVulnerabilityAssessment } from '../../../lib/vulnerabilityPipeline';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import PageLayout from '../../ui/PageLayout';

import styles from './TabbedResultsPage.module.scss';

export interface TabbedResultsPageProps {
  /** Initial tab to display */
  initialTab?: 'archetypes' | 'vulnerabilities' | 'patterns';
  /** Debug mode for development */
  debug?: boolean;
  /** Show advanced analytics */
  showAnalytics?: boolean;
  /** Custom styling */
  className?: string;
}

type TabType = 'archetypes' | 'vulnerabilities' | 'patterns';

// ==========================================================================
// HELPER FUNCTIONS FOR RED FLAGS AND PROTECTION
// ==========================================================================

const getPersonaRedFlags = (persona: PersonaCard): string[] => {
  const redFlags: string[] = [];

  // Convert psychological tactics to red flags
  persona.psychologicalTactics?.forEach(tactic => {
    const flag = convertTacticToRedFlag(tactic);
    if (flag) redFlags.push(flag);
  });

  // Convert manipulator types to red flags
  persona.manipulatorTypes?.forEach(type => {
    const flag = convertManipulatorTypeToRedFlag(type);
    if (flag) redFlags.push(flag);
  });

  // If no specific flags, create generic ones
  if (redFlags.length === 0) {
    redFlags.push(
      `🚩 Watch for patterns involving ${persona.psychologicalTactics?.[0] || 'manipulation'}`
    );
  }

  return redFlags;
};

const getPersonaProtectionStrategies = (persona: PersonaCard): string[] => {
  const strategies: string[] = [];

  // Generate strategies based on blind spot
  if (persona.blindSpot?.includes('healing')) {
    strategies.push('You cannot fix another person - they must want to change themselves');
  }

  if (persona.blindSpot?.includes('safety') || persona.blindSpot?.includes('control')) {
    strategies.push(
      'Control and protection are different - one builds trust, the other destroys it'
    );
  }

  if (persona.blindSpot?.includes('passion') || persona.blindSpot?.includes('intensity')) {
    strategies.push('Real passion builds over time - instant intensity is often manipulation');
  }

  if (persona.blindSpot?.includes('devotion') || persona.blindSpot?.includes('anxiety')) {
    strategies.push('Love and anxiety are different emotions - healthy love feels peaceful');
  }

  // Add general strategies
  strategies.push('Trust your instincts - if something feels wrong, it probably is');
  strategies.push("Keep your support network strong - don't let anyone isolate you");
  strategies.push("Set clear boundaries about what behavior you will and won't accept");

  return strategies.slice(0, 5); // Limit to 5 strategies
};

export const TabbedResultsPage: React.FC<TabbedResultsPageProps> = ({
  initialTab = 'archetypes',
  debug = false,
  showAnalytics = true,
  className = '',
}) => {
  const router = useRouter();

  // ==========================================================================
  // STORE STATE & COMPUTED VALUES
  // ==========================================================================

  const { isComplete, estimatedProgress, userData, getTotalAnswered, getCurrentQuestion } =
    useEnhancedAssessmentData();

  const { resetAssessment, generateResults } = useEnhancedAssessmentActions();

  const {
    scores,
    answers,
    enhancedUserPath,
    pathAnalytics,
    archetypeResults,
    vulnerabilityAssessment,
    getEnhancedAssessmentResult,
  } = useEnhancedAssessmentResults();

  // Get additional state values directly from store for error handling
  const startTime = useEnhancedAssessmentStore(state => state.startTime);
  const sessionId = useEnhancedAssessmentStore(state => state.sessionId);

  // ==========================================================================
  // LOCAL STATE
  // ==========================================================================

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeMatch | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaCard | null>(null);
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [educationalContent, setEducationalContent] = useState<PersonaEducationContent | null>(
    null
  );

  const formattedResults = useMemo(() => {
    if (!archetypeResults) return null;
    try {
      return formatArchetypeResultsForDisplay(archetypeResults);
    } catch (error) {
      return null;
    }
  }, [archetypeResults]);

  const primaryArchetype = formattedResults?.topMatches?.[0] || null;
  const secondaryArchetype = formattedResults?.topMatches?.[1] || null;

  const selectedPersonas = vulnerabilityAssessment?.personaSelection?.selectedPersonas || [];

  // ==========================================================================
  // SAFE UTILITY FUNCTIONS
  // ==========================================================================

  /**
   * Safe wrapper for generateResultsSummary to handle null archetypeResults
   */
  const safeGenerateResultsSummary = (assessmentResult: any) => {
    if (!assessmentResult) return null;

    try {
      return generateResultsSummary(assessmentResult);
    } catch (error) {
      // Create a basic summary manually if the function fails
      if (assessmentResult.answers && assessmentResult.assessmentDuration !== undefined) {
        const minutes = Math.floor(assessmentResult.assessmentDuration / 60000); // Convert ms to minutes
        const seconds = Math.floor((assessmentResult.assessmentDuration % 60000) / 1000);
        const assessmentTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        return {
          totalQuestions: assessmentResult.answers.length,
          assessmentTime,
          primaryArchetype: primaryArchetype?.archetype.name || 'Unknown',
          confidence: primaryArchetype?.confidence || 0,
        };
      }
      return null;
    }
  };

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const assessmentResult = useMemo(
    () => getEnhancedAssessmentResult(),
    [getEnhancedAssessmentResult]
  );

  const resultsSummary = useMemo(() => {
    return safeGenerateResultsSummary(assessmentResult);
  }, [assessmentResult]);

  // ==========================================================================
  // INITIALIZATION LOGIC
  // ==========================================================================

  useEffect(() => {
    const initializeResults = async () => {
      if (!isComplete) {
        router.push('/assessment');
        return;
      }

      try {
        // Generate results if they don't exist
        if (!archetypeResults && scores) {
          await generateResults();
        }

        // Generate educational content for primary archetype
        if (primaryArchetype && !educationalContent) {
          try {
            const content = generateEducationalContent(primaryArchetype);
            setEducationalContent(content);
          } catch (error) {
            // Silently handle educational content generation errors
          }
        }

        // Vulnerability assessment should be handled by the store during generateResults()
        // No manual generation needed here
      } catch (error) {
        // Handle initialization errors silently
      } finally {
        setIsLoading(false);
      }
    };

    initializeResults();
  }, [
    isComplete,
    router,
    archetypeResults,
    scores,
    generateResults,
    primaryArchetype,
    educationalContent,
    vulnerabilityAssessment,
  ]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleRetakeAssessment = () => {
    // resetAssessment();
    // router.push('/assessment');
    // Chatbot link here
    window.open(
      'https://6848340aa0a2233a0e0a63e9--partner-assessment-tool.netlify.app/',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleGoHome = () => {
    // router.push('/');
    // Feedback form link here
    window.open('https://forms.gle/L6Qc6VcHtYCmBZ2v6', '_blank', 'noopener,noreferrer');
  };

  const handleDownloadResults = async () => {
    if (!assessmentResult) return;

    setIsDownloading(true);
    try {
      // Create a simple text summary for download
      const summary = `
RELATIONSHIP ASSESSMENT RESULTS
===============================

Assessment Completed: ${new Date().toLocaleDateString()}

PRIMARY ARCHETYPE: ${primaryArchetype?.archetype.name || 'Unknown'}
Confidence: ${primaryArchetype?.confidence.toFixed(1) || 'N/A'}%

${primaryArchetype?.archetype.description || ''}

SECONDARY ARCHETYPE: ${secondaryArchetype?.archetype.name || 'Unknown'}
Confidence: ${secondaryArchetype?.confidence.toFixed(1) || 'N/A'}%

${secondaryArchetype?.archetype.description || ''}

SCORES:
- Logical: ${scores?.logical || 'N/A'}
- Emotional: ${scores?.emotional || 'N/A'}
- Exploratory: ${scores?.exploratory || 'N/A'}

Total Questions Answered: ${answers?.length || 0}
      `.trim();

      // Create and download the file
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relationship-assessment-results-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Handle download errors silently
    } finally {
      setIsDownloading(false);
    }
  };

  const handleArchetypeSelect = (archetype: ArchetypeMatch) => {
    setSelectedArchetype(
      selectedArchetype?.archetype.id === archetype.archetype.id ? null : archetype
    );
  };

  const handlePersonaSelect = (persona: PersonaCard) => {
    setSelectedPersona(selectedPersona?.id === persona.id ? null : persona);
  };

  const handleExpandCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  // ==========================================================================
  // RENDER FUNCTIONS
  // ==========================================================================

  const renderLoadingState = () => (
    <div className={styles.loadingContainer}>
      <LoadingSpinner size="lg" />
      <h2>Analyzing Your Results...</h2>
      <p>We're processing your assessment responses and generating personalized insights.</p>
    </div>
  );

  const renderHeader = () => (
    <div className={styles.resultsHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerText}>
          <h1>Your Relationship Assessment Results</h1>
          <p>
            Explore your results across three key areas: personality archetypes, vulnerability
            awareness, and attraction patterns.
            {resultsSummary && (
              <>
                {' '}
                You completed <strong>{resultsSummary.totalQuestions} questions</strong> in{' '}
                <strong>{resultsSummary.assessmentTime}</strong>.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );

  const renderTabNavigation = () => (
    <div className={styles.tabNavigation}>
      <div className={styles.tabList}>
        <button
          className={`${styles.tab} ${activeTab === 'archetypes' ? styles.active : ''}`}
          onClick={() => handleTabChange('archetypes')}
        >
          <Trophy />
          <span>Archetypes</span>
          {formattedResults?.topMatches ? (
            <span className={styles.tabBadge}>{formattedResults.topMatches.length}</span>
          ) : (
            <span className={styles.tabBadge}>...</span>
          )}
        </button>

        <button
          className={`${styles.tab} ${activeTab === 'vulnerabilities' ? styles.active : ''}`}
          onClick={() => handleTabChange('vulnerabilities')}
        >
          <Shield />
          <span>Vulnerabilities</span>
          {selectedPersonas.length > 0 ? (
            <span className={styles.tabBadge}>{selectedPersonas.length}</span>
          ) : archetypeResults ? (
            <span className={styles.tabBadge}>⏳</span>
          ) : (
            <span className={styles.tabBadge}>...</span>
          )}
        </button>

        <button
          className={`${styles.tab} ${activeTab === 'patterns' ? styles.active : ''}`}
          onClick={() => handleTabChange('patterns')}
        >
          <Heart />
          <span>Attraction Patterns</span>
          <span className={styles.tabBadge}>Soon</span>
        </button>
      </div>
    </div>
  );

  const renderArchetypesTab = () => {
    // Check if archetypeResults exists but has wrong structure
    const hasInvalidArchetypeResults = archetypeResults && !archetypeResults.topMatches;
    const hasValidArchetypeResults =
      archetypeResults?.topMatches && archetypeResults.topMatches.length > 0;

    // SUCCESS STATE: Show proper archetype results if available
    if (hasValidArchetypeResults && formattedResults?.topMatches) {
      return (
        <div className={styles.archetypesContent}>
          <div className={styles.archetypesHeader}>
            <h2>Your Personality Archetypes</h2>
            <p>
              Based on your responses, here are your top archetype matches ranked by mathematical
              proximity to your personality profile.
            </p>

            <div className={styles.successNotice}>
              <CheckCircle />
              <span>
                ✅ Results successfully generated! Your primary archetype is{' '}
                <strong>{formattedResults.topMatches[0].archetype.name}</strong>
              </span>
            </div>

            {formattedResults.hasTies && (
              <div className={styles.tiesNotice}>
                <Info />
                <span>Close matches detected - multiple archetypes show similar affinity</span>
              </div>
            )}
          </div>

          <div className={styles.archetypesList}>
            {formattedResults.topMatches.map((match, index) => (
              <Card
                key={match.archetype.id}
                className={`${styles.archetypeCard} ${
                  selectedArchetype?.archetype.id === match.archetype.id ? styles.selected : ''
                }`}
                onClick={() => handleArchetypeSelect(match)}
              >
                <div className={styles.archetypeHeader}>
                  <div className={styles.archetypeRank}>
                    {index === 0 ? (
                      <Trophy className={styles.primaryIcon} />
                    ) : index === 1 ? (
                      <Award className={styles.secondaryIcon} />
                    ) : (
                      <span className={styles.rankNumber}>{index + 1}</span>
                    )}
                  </div>

                  <div className={styles.archetypeInfo}>
                    <h4 className={styles.archetypeName}>{match.archetype.name}</h4>
                    <p className={styles.archetypeTitle}>{match.archetype.title}</p>
                  </div>

                  <div className={styles.confidenceSection}>
                    <div className={styles.confidenceBar}>
                      <div
                        className={styles.confidenceProgress}
                        style={{ width: `${match.confidence}%` }}
                      />
                    </div>
                    <span className={styles.confidenceValue}>{match.confidence}%</span>
                  </div>

                  <ChevronRight className={styles.selectIcon} />

                  {debug && (
                    <div className={styles.debugInfo}>
                      <small>Distance: {match.distance.toFixed(2)}</small>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Archetype Expansion Content */}
          {selectedArchetype && (
            <Card className={styles.detailsCard}>
              <div className={styles.detailsHeader}>
                <div className={styles.archetypeIcon}>
                  <Brain />
                </div>
                <div className={styles.archetypeHeading}>
                  <h2>{selectedArchetype.archetype.name}</h2>
                  <p className={styles.archetypeSubtitle}>{selectedArchetype.archetype.title}</p>
                  <div className={styles.confidenceBadge}>
                    {selectedArchetype.confidence}% Match
                  </div>
                </div>
              </div>

              <div className={styles.archetypeDescription}>
                <p>{selectedArchetype.archetype.description}</p>
              </div>

              <div className={styles.traitsSection}>
                <h4>Key Traits</h4>
                <div className={styles.traitsList}>
                  {selectedArchetype.archetype.traits.map((trait, index) => {
                    // Split trait on " - " to get title and description
                    const [title, description] = trait.split(' - ');
                    return (
                      <div key={index} className={styles.traitItem}>
                        <strong>{title}</strong>
                        {description && <span> - {description}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedArchetype.archetype.vulnerabilities && (
                <div className={styles.vulnerabilitiesPreview}>
                  <h4>Awareness Areas</h4>
                  <p className={styles.vulnerabilityHint}>
                    Understanding these patterns helps you recognize potential relationship
                    dynamics:
                  </p>
                  <div className={styles.vulnerabilitiesList}>
                    {selectedArchetype.archetype.vulnerabilities.slice(0, 4).map((vuln, index) => (
                      <div key={index} className={styles.vulnerabilityItem}>
                        <AlertTriangle className={styles.vulnIcon} />
                        <div>
                          <strong>{vuln.manipulatorType}</strong>
                          <p>{vuln.vulnerability}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('vulnerabilities')}
                    className={styles.seeMoreButton}
                  >
                    See Complete Vulnerability Assessment
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </Card>
          )}

          <Card className={styles.confidenceExplanation}>
            <button
              className={styles.confidenceToggle}
              onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
            >
              <Target className={styles.confidenceIcon} />
              How are confidence scores calculated?
            </button>

            {showConfidenceDetails && (
              <div className={styles.confidenceDetails}>
                <p>
                  Confidence scores are calculated using mathematical proximity analysis. Your
                  responses are compared to each archetype's ideal profile using Euclidean distance
                  calculations across emotional, logical, and exploratory dimensions.
                </p>
                <ul>
                  <li>
                    <strong>Higher scores</strong> indicate closer alignment with that archetype
                  </li>
                  <li>
                    <strong>Close scores</strong> suggest balanced personality traits
                  </li>
                  <li>
                    <strong>Large gaps</strong> indicate strong archetype alignment
                  </li>
                </ul>
              </div>
            )}
          </Card>
        </div>
      );
    }

    // PROCESSING STATE: Show when we have scores but are generating archetypes
    if (scores && !archetypeResults && !hasInvalidArchetypeResults) {
      return (
        <div className={styles.archetypesContent}>
          <Card className={styles.scoresCard}>
            <h3>Your Assessment Scores</h3>
            <div className={styles.scoresSummary}>
              <div className={styles.scoresGrid}>
                <div className={styles.scoreItem}>
                  <Brain />
                  <div>
                    <div className={styles.scoreLabel}>Logical</div>
                    <div className={styles.scoreValue}>{scores.logical}</div>
                  </div>
                </div>
                <div className={styles.scoreItem}>
                  <Heart />
                  <div>
                    <div className={styles.scoreLabel}>Emotional</div>
                    <div className={styles.scoreValue}>{scores.emotional}</div>
                  </div>
                </div>
                <div className={styles.scoreItem}>
                  <Target />
                  <div>
                    <div className={styles.scoreLabel}>Exploratory</div>
                    <div className={styles.scoreValue}>{scores.exploratory}</div>
                  </div>
                </div>
              </div>

              <span className={styles.dominantNote}>
                Your dominant style is{' '}
                <strong>
                  {scores.exploratory > scores.emotional && scores.exploratory > scores.logical
                    ? 'Exploratory'
                    : scores.logical > scores.emotional
                      ? 'Logical'
                      : 'Emotional'}
                </strong>{' '}
                (
                {Math.round(
                  (Math.max(scores.logical, scores.emotional, scores.exploratory) /
                    (scores.logical + scores.emotional + scores.exploratory)) *
                    100
                )}
                %)
              </span>
              {scores.exploratory > 20 && (
                <div className={styles.archetypePrediction}>
                  <Lightbulb />
                  <span>
                    <strong>Predicted Primary Archetype:</strong> The Explorer
                    <br />
                    <small>
                      Your high exploratory score ({scores.exploratory}) strongly suggests
                      adventure-seeking personality
                    </small>
                  </span>
                </div>
              )}
            </div>
          </Card>

          {!archetypeResults && !hasInvalidArchetypeResults && (
            <Card className={styles.processingCard}>
              <LoadingSpinner />
              <h4>Calculating Your Archetype Matches</h4>
              <p>
                We're analyzing your responses to determine your personality archetype matches...
              </p>
            </Card>
          )}
        </div>
      );
    }

    // FALLBACK STATES: Handle various error conditions
    if (hasInvalidArchetypeResults) {
      return (
        <div className={styles.errorState}>
          <AlertTriangle />
          <h3>Results Processing Issue</h3>
          <p>
            Your archetype results were generated but have an unexpected format. This is likely a
            temporary processing issue.
          </p>
          <Button onClick={() => generateResults()}>Regenerate Results</Button>
        </div>
      );
    }

    if (!archetypeResults && scores) {
      return (
        <div className={styles.processingState}>
          <LoadingSpinner />
          <h3>Generating Your Archetype Results</h3>
          <p>We're analyzing your responses to determine your personality archetypes...</p>
        </div>
      );
    }

    return (
      <div className={styles.emptyState}>
        <AlertTriangle />
        <h3>No Archetype Results Available</h3>
        <p>We couldn't generate your archetype results. Please try retaking the assessment.</p>
        <Button onClick={handleRetakeAssessment}>Retake Assessment</Button>
      </div>
    );
  };

  const renderVulnerabilitiesTab = () => {
    // Show processing state if we're generating results
    if (!vulnerabilityAssessment && archetypeResults) {
      return (
        <div className={styles.vulnerabilitiesContent}>
          <div className={styles.vulnerabilitiesHeader}>
            <h2>Vulnerability Assessment</h2>
            <p>Generating your personalized vulnerability awareness profile...</p>
          </div>

          <Card className={styles.processingCard}>
            <LoadingSpinner />
            <h4>Analyzing Your Vulnerability Patterns</h4>
            <p>
              We're selecting the most relevant manipulation patterns based on your archetype
              profile...
            </p>
          </Card>
        </div>
      );
    }

    if (!selectedPersonas || selectedPersonas.length === 0) {
      return (
        <Card className={styles.noDataCard}>
          <Shield />
          <h3>No Vulnerability Assessment Available</h3>
          <p>
            Vulnerability assessment could not be generated.
            {!archetypeResults
              ? ' Archetype results are required first.'
              : ' This may be due to incomplete data processing.'}
          </p>
          {!archetypeResults && (
            <Button onClick={() => setActiveTab('archetypes')}>
              Complete Archetype Analysis First
            </Button>
          )}
        </Card>
      );
    }

    // Generate comprehensive red flags from all personas
    const allRedFlags = extractKeyRedFlags(selectedPersonas);

    return (
      <div className={styles.vulnerabilitiesContent}>
        <div className={styles.vulnerabilitiesHeader}>
          <h2>Your Vulnerability Profile</h2>
          <p>
            Based on your {primaryArchetype?.archetype.name || 'personality'} profile, we've
            identified {selectedPersonas.length} manipulation patterns you should be aware of.
            Knowledge of these patterns helps you recognize and avoid potentially harmful
            situations.
          </p>
        </div>

        {/* Overview Card with Stats */}
        <Card className={styles.vulnerabilityOverviewCard}>
          <div className={styles.cardHeader}>
            <Shield className={styles.cardIcon} />
            <h3>Assessment Overview</h3>
          </div>

          <div className={styles.overviewContent}>
            <div className={styles.overviewStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{selectedPersonas.length}</span>
                <span className={styles.statLabel}>Risk Patterns</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{allRedFlags.length}</span>
                <span className={styles.statLabel}>Red Flags</span>
              </div>
            </div>

            <div className={styles.overviewMessage}>
              <AlertTriangle className={styles.overviewIcon} />
              <p>
                Your personality shows complex traits that create multiple vulnerability points.
                This comprehensive awareness helps you recognize manipulation across different
                contexts.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Red Flags Summary */}
        <Card className={styles.redFlagsCard}>
          <div className={styles.cardHeader}>
            <AlertTriangle className={styles.cardIcon} />
            <h3>Key Red Flags to Recognize</h3>
          </div>

          <div className={styles.redFlagsList}>
            {allRedFlags.slice(0, 8).map((flag, index) => (
              <div key={index} className={styles.redFlagItem}>
                <AlertTriangle className={styles.flagIcon} />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Individual Persona Cards */}
        <div className={styles.personaCardsGrid}>
          {selectedPersonas.map((persona, index) => {
            const personaRedFlags = getPersonaRedFlags(persona);
            const protectionStrategies = getPersonaProtectionStrategies(persona);

            return (
              <Card
                key={persona.id}
                className={`${styles.personaCard} ${
                  selectedPersona?.id === persona.id ? styles.selected : ''
                }`}
                onClick={() => handlePersonaSelect(persona)}
              >
                <div className={styles.personaHeader}>
                  <div className={styles.personaIcon}>📍</div>
                  <div className={styles.personaTitle}>
                    <h3>{persona.title}</h3>
                    <p className={styles.personaSubtitle}>{persona.persona}</p>
                  </div>
                  <div className={styles.riskLevel}>
                    <span className={`${styles.riskBadge} ${styles.high}`}>HIGH</span>
                  </div>
                </div>

                {/* Pop Culture References */}
                <div className={styles.popCultureSection}>
                  <Film className={styles.sectionIcon} />
                  <div className={styles.popCultureContent}>
                    <strong>Think:</strong>{' '}
                    {persona.characters?.join(', ') || 'Classic manipulation patterns'}
                  </div>
                </div>

                {/* Why It Appeals */}
                <div className={styles.appealSection}>
                  <Heart className={styles.sectionIcon} />
                  <p>
                    <strong>Why it's appealing:</strong>{' '}
                    {persona.why || 'Appeals to your caring nature'}
                  </p>
                </div>

                {/* Expanded Content When Selected */}
                {selectedPersona?.id === persona.id && (
                  <div className={styles.expandedPersonaContent}>
                    {/* Red Flags Section */}
                    <div className={styles.warningSignsSection}>
                      <h4>🚩 Warning Signs</h4>
                      <ul>
                        {personaRedFlags.map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Protection Strategies */}
                    <div className={styles.protectionStrategies}>
                      <h4>🛡️ Protection Strategies</h4>
                      <ul>
                        {protectionStrategies.map((strategy, idx) => (
                          <li key={idx}>{strategy}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Manipulation Tactics */}
                    <div className={styles.tacticsSection}>
                      <h4>🎭 Common Tactics</h4>
                      <ul>
                        {persona.psychologicalTactics?.map((tactic, idx) => (
                          <li key={idx}>{tactic}</li>
                        )) || <li>Uses various psychological manipulation techniques</li>}
                      </ul>
                    </div>

                    {/* Reality Check */}
                    {persona.plotTwist && (
                      <div className={styles.realityCheck}>
                        <h4>💡 The Reality</h4>
                        <p>{persona.plotTwist}</p>
                      </div>
                    )}

                    {/* Blind Spot Warning */}
                    {persona.blindSpot && (
                      <div className={styles.blindSpotWarning}>
                        <h4>⚠️ Your Blind Spot</h4>
                        <p>{persona.blindSpot}</p>
                      </div>
                    )}

                    {/* Memorable Takeaway */}
                    {persona.punchline && (
                      <div className={styles.takeawaySection}>
                        <h4>🎯 Remember This</h4>
                        <p className={styles.punchline}>{persona.punchline}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAttractionPatternsTab = () => {
    return (
      <div className={styles.patternsContent}>
        <Card className={styles.comingSoonCard}>
          <Heart className={styles.comingSoonIcon} />
          <h3>Attraction Patterns Analysis</h3>
          <p>
            This comprehensive analysis of your attraction dynamics and relationship patterns is
            coming soon. It will include insights into your romantic preferences, compatibility
            indicators, and relationship growth opportunities.
          </p>
          <div className={styles.comingSoonFeatures}>
            <div className={styles.feature}>
              <Users />
              <span>Compatibility Analysis</span>
            </div>
            <div className={styles.feature}>
              <TrendingUp />
              <span>Growth Patterns</span>
            </div>
            <div className={styles.feature}>
              <Target />
              <span>Attraction Triggers</span>
            </div>
          </div>
          <div className={styles.comingSoonActions}>
            <Button variant="outline" onClick={() => setActiveTab('archetypes')}>
              Explore Archetypes
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderActionButtons = () => (
    <div className={styles.actionButtons}>
      <div className={styles.primaryActions}>
        {assessmentResult && (
          <Button variant="primary" onClick={handleDownloadResults} disabled={isDownloading}>
            {isDownloading ? <LoadingSpinner size="sm" /> : <Download />}
            Download Results
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={() => {
            // Implement share functionality
            if (navigator.share) {
              navigator.share({
                title: 'My Relationship Assessment Results',
                text: 'I just completed a comprehensive relationship assessment!',
                url: window.location.href,
              });
            }
          }}
        >
          <Share2 />
          Share Results
        </Button>
      </div>

      <div className={styles.secondaryActions}>
        <Button variant="cta" onClick={handleRetakeAssessment}>
          {/* <RefreshCw /> */}
          Go to Chatbot
        </Button>

        <Button variant="cta" onClick={handleGoHome}>
          {/* <Home /> */}
          Feedback Form
        </Button>
      </div>
    </div>
  );

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (isLoading) {
    return (
      <PageLayout maxWidth="xl" centered>
        {renderLoadingState()}
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl" className={className}>
      <div className={styles.tabbedResultsContainer}>
        {renderHeader()}
        {renderTabNavigation()}

        <div className={styles.tabContent}>
          {activeTab === 'archetypes' && renderArchetypesTab()}
          {activeTab === 'vulnerabilities' && renderVulnerabilitiesTab()}
          {activeTab === 'patterns' && renderAttractionPatternsTab()}
        </div>

        {renderActionButtons()}
      </div>
    </PageLayout>
  );
};

export default TabbedResultsPage;

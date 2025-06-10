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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { generateEducationalContent } from '../../../lib/personaEducator';
import { formatArchetypeResultsForDisplay } from '../../../lib/resultsEngine';
import {
  useEnhancedAssessmentData,
  useEnhancedAssessmentActions,
  useEnhancedAssessmentResults,
} from '../../../lib/store';
import { ArchetypeMatch, PersonaCard, PersonaEducationContent } from '../../../lib/types';
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

  const { isComplete, estimatedProgress, totalAnswered, userData } = useEnhancedAssessmentData();

  const { resetAssessment } = useEnhancedAssessmentActions();

  const {
    scores,
    answers,
    enhancedUserPath,
    pathAnalytics,
    archetypeResults,
    vulnerabilityAssessment,
    getEnhancedAssessmentResult,
  } = useEnhancedAssessmentResults();

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
  const [educationalContent, setEducationalContent] = useState<any>(null);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const formattedResults = archetypeResults
    ? formatArchetypeResultsForDisplay(archetypeResults)
    : null;

  const assessmentResult = getEnhancedAssessmentResult();

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  useEffect(() => {
    const checkAssessmentData = () => {
      // Check if assessment is complete AND has actual data
      if (!isComplete) {
        console.log('Assessment not complete, redirecting to assessment');
        router.replace('/assessment');
        return;
      }

      // Check if we have the necessary data
      if (!answers || answers.length === 0) {
        console.log('No assessment answers found, redirecting to assessment');
        router.replace('/assessment');
        return;
      }

      // Check if we have results data
      if (!archetypeResults && !scores) {
        console.log('No results data available, redirecting to assessment');
        router.replace('/assessment');
        return;
      }

      // If we get here, we have valid data
      setIsLoading(false);
    };

    // Add a small delay to ensure store is hydrated
    const timer = setTimeout(checkAssessmentData, 100);
    return () => clearTimeout(timer);
  }, [isComplete, answers, archetypeResults, scores, router]);

  // Generate educational content when vulnerability assessment is available
  useEffect(() => {
    if (vulnerabilityAssessment?.personaSelection?.selectedPersonas?.length) {
      const content = generateEducationalContent(vulnerabilityAssessment.personaSelection);
      setEducationalContent(content);
    }
  }, [vulnerabilityAssessment]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedArchetype(null);
    setSelectedPersona(null);
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

  const toggleCardExpansion = (cardId: string) => {
    handleExpandCard(cardId);
  };

  const handleDownloadResults = async () => {
    setIsDownloading(true);
    try {
      // Create downloadable content
      const resultsData = {
        userData,
        archetypeResults: formattedResults,
        vulnerabilityAssessment,
        pathAnalytics,
        timestamp: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(resultsData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fia-assessment-results-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading results:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Relationship Assessment Results',
        text: `I discovered my relationship archetype through this comprehensive assessment!`,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRetakeAssessment = () => {
    resetAssessment();
    router.push('/assessment');
  };

  // ==========================================================================
  // RENDER METHODS
  // ==========================================================================

  const renderLoadingState = () => (
    <div className={styles.loadingContainer}>
      <Card className={styles.loadingCard}>
        <div className={styles.loadingContent}>
          <LoadingSpinner size="lg" />
          <h2>Processing Your Results...</h2>
          <p>Loading your comprehensive results...</p>
          <div className={styles.loadingDetails}>
            <div className={styles.progressItem}>
              <Trophy />
              <span>Determining archetype matches</span>
            </div>
            <div className={styles.progressItem}>
              <Shield />
              <span>Assessing vulnerability patterns</span>
            </div>
            <div className={styles.progressItem}>
              <Heart />
              <span>Generating attraction insights</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderHeader = () => (
    <div className={styles.resultsHeader}>
      <div className={styles.headerContent}>
        <h1>Your Comprehensive Relationship Assessment</h1>
        <p>
          Hello <strong>{userData?.name || 'there'}</strong>! Explore your results across three key
          areas: personality archetypes, vulnerability awareness, and attraction patterns.
        </p>
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
          {formattedResults?.topMatches?.length && (
            <span className={styles.tabBadge}>{formattedResults.topMatches.length}</span>
          )}
        </button>

        <button
          className={`${styles.tab} ${activeTab === 'vulnerabilities' ? styles.active : ''}`}
          onClick={() => handleTabChange('vulnerabilities')}
        >
          <Shield />
          <span>Vulnerabilities</span>
          {vulnerabilityAssessment?.personaSelection?.selectedPersonas?.length && (
            <span className={styles.tabBadge}>
              {vulnerabilityAssessment.personaSelection.selectedPersonas.length}
            </span>
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
    if (!formattedResults?.topMatches || formattedResults.topMatches.length === 0) {
      return (
        <Card className={styles.noDataCard}>
          <AlertTriangle />
          <h3>No Archetype Results Available</h3>
          <p>Unable to calculate archetype matches. Please retake the assessment.</p>
          <Button onClick={handleRetakeAssessment}>Retake Assessment</Button>
        </Card>
      );
    }

    const topArchetype = formattedResults.topMatches[0];

    return (
      <div className={styles.archetypesContent}>
        <Card className={styles.topArchetypeCard}>
          <div className={styles.topArchetypeContent}>
            <div className={styles.archetypeIcon}>
              <Trophy />
            </div>
            <div className={styles.archetypeInfo}>
              <h2>Your Primary Archetype</h2>
              <h3>{topArchetype.archetype.name}</h3>
              <p>{topArchetype.archetype.description}</p>
              <div className={styles.confidenceScore}>
                <span className={styles.scoreLabel}>Confidence:</span>
                <span className={styles.scoreValue}>{topArchetype.confidence}%</span>
              </div>
            </div>
          </div>
        </Card>

        <div className={styles.allArchetypesSection}>
          <h3>All Archetype Matches</h3>
          <div className={styles.archetypesGrid}>
            {formattedResults.topMatches.map((archetype, index) => (
              <Card
                key={archetype.archetype.id}
                className={`${styles.archetypeCard} ${
                  selectedArchetype?.archetype.id === archetype.archetype.id ? styles.selected : ''
                }`}
                onClick={() => handleArchetypeSelect(archetype)}
              >
                <div className={styles.archetypeRank}>#{index + 1}</div>
                <h4>{archetype.archetype.name}</h4>
                <p>{archetype.archetype.shortDescription || archetype.archetype.description}</p>
                <div className={styles.archetypeScore}>
                  <div className={styles.scoreBar}>
                    <div
                      className={styles.scoreFill}
                      style={{ width: `${archetype.confidence}%` }}
                    />
                  </div>
                  <span>{archetype.confidence}%</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedArchetype && (
          <Card className={styles.archetypeDetails}>
            <h4>{selectedArchetype.archetype.name} - Detailed Insights</h4>
            <p>{selectedArchetype.archetype.description}</p>
            <div className={styles.detailsGrid}>
              <div>
                <h5>Strengths</h5>
                <ul>
                  {selectedArchetype.archetype.strengths?.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  )) || <li>No specific strengths defined</li>}
                </ul>
              </div>
              <div>
                <h5>Growth Areas</h5>
                <ul>
                  {selectedArchetype.archetype.challenges?.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  )) || <li>No specific challenges defined</li>}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderVulnerabilitiesTab = () => {
    if (!educationalContent?.personaEducation?.length) {
      return (
        <Card className={styles.noDataCard}>
          <Shield />
          <h3>Vulnerability Assessment Unavailable</h3>
          <p>Vulnerability patterns could not be determined from your responses.</p>
          <Button onClick={handleRetakeAssessment}>Retake Assessment</Button>
        </Card>
      );
    }

    return (
      <div className={styles.vulnerabilitiesContent}>
        <Card className={styles.vulnerabilityIntro}>
          <div className={styles.introHeader}>
            <Shield />
            <div>
              <h2>Vulnerability Awareness</h2>
              <p>
                Based on your archetype profile, here are{' '}
                {educationalContent.personaEducation.length} personality types you should be
                particularly aware of in relationships.
              </p>
            </div>
          </div>
        </Card>

        <div className={styles.personaCardsGrid}>
          {educationalContent.personaEducation.map((personaEd: any) => (
            <Card
              key={personaEd.persona.id}
              className={`${styles.personaCard} ${
                selectedPersona?.id === personaEd.persona.id ? styles.selected : ''
              } ${styles[personaEd.riskLevel]}`}
              onClick={() => handlePersonaSelect(personaEd.persona)}
            >
              <div className={styles.personaHeader}>
                <h4>{personaEd.persona.persona}</h4>
                <div className={`${styles.riskBadge} ${styles[personaEd.riskLevel]}`}>
                  {personaEd.riskLevel.toUpperCase()}
                </div>
              </div>
              <p>{personaEd.persona.why}</p>
              <div className={styles.personaActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    handleExpandCard(personaEd.persona.id);
                  }}
                >
                  <Eye />
                  {expandedCards.has(personaEd.persona.id) ? 'Hide Details' : 'View Details'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {selectedPersona && (
          <Card className={styles.personaDetails}>
            {(() => {
              const personaEd = educationalContent.personaEducation.find(
                (ed: any) => ed.persona.id === selectedPersona.id
              );

              if (!personaEd) return null;

              return (
                <>
                  <h3>
                    {personaEd.persona.persona} - {personaEd.persona.title}
                  </h3>
                  <div className={styles.personaAnalysis}>
                    <div className={styles.analysisSection}>
                      <h4>🎭 Character Examples</h4>
                      <p>{personaEd.persona.characters.join(', ')}</p>
                    </div>
                    <div className={styles.analysisSection}>
                      <h4>💭 Why You're Drawn to Them</h4>
                      <p>{personaEd.persona.why}</p>
                    </div>
                    <div className={styles.analysisSection}>
                      <h4>🔍 The Reality Check</h4>
                      <p>{personaEd.persona.plotTwist}</p>
                    </div>
                    <div className={styles.analysisSection}>
                      <h4>🎯 Your Blind Spot</h4>
                      <p>{personaEd.persona.blindSpot}</p>
                    </div>
                    <div className={styles.analysisSection}>
                      <h4>💡 Remember This</h4>
                      <p>{personaEd.persona.punchline}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </Card>
        )}
      </div>
    );
  };

  const renderAttractionPatternsTab = () => (
    <div className={styles.attractionPatternsContent}>
      <Card className={styles.comingSoonCard}>
        <div className={styles.comingSoonContent}>
          <Target className={styles.comingSoonIcon} />
          <h2>Attraction Patterns</h2>
          <p>
            Coming soon! This section will analyze your attraction patterns and provide insights
            into relationship compatibility.
          </p>
          <div className={styles.comingSoonFeatures}>
            <div className={styles.featureItem}>
              <Users />
              <span>Compatibility Insights</span>
            </div>
            <div className={styles.featureItem}>
              <TrendingUp />
              <span>Relationship Patterns</span>
            </div>
            <div className={styles.featureItem}>
              <Target />
              <span>Personal Growth Areas</span>
            </div>
          </div>
          <div className={styles.comingSoonActions}>
            <Button variant="outline" disabled>
              <BarChart3 />
              View Patterns (Coming Soon)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderActionButtons = () => (
    <div className={styles.actionsSection}>
      <div className={styles.primaryActions}>
        {activeTab === 'archetypes' && (
          <Button
            variant="cta"
            size="lg"
            onClick={() => handleTabChange('vulnerabilities')}
            className={styles.continueButton}
          >
            Continue to Vulnerability Assessment
            <ChevronRight />
          </Button>
        )}

        {activeTab === 'vulnerabilities' && (
          // <Button
          //   variant="cta"
          //   size="lg"
          //   onClick={() => handleTabChange('patterns')}
          //   className={styles.continueButton}
          // >
          //   Continue to Attraction Patterns
          //   <ChevronRight />
          // </Button>
          <Button
            variant="cta"
            size="lg"
            onClick={() => router.push('/vulnerabilities')}
            className={styles.continueButton}
          >
            View Detailed Vulnerability Analysis
            <ChevronRight />
          </Button>
        )}

        {activeTab === 'patterns' && (
          <Button
            variant="cta"
            size="lg"
            onClick={() => router.push('/')}
            className={styles.continueButton}
          >
            Complete Assessment
            <Home />
          </Button>
        )}
      </div>

      <div className={styles.secondaryActions}>
        <Button
          variant="outline"
          onClick={handleDownloadResults}
          loading={isDownloading}
          disabled={isDownloading}
        >
          <Download />
          Download Complete Results
        </Button>

        <Button variant="outline" onClick={handleShareResults}>
          <Share2 />
          Share Results
        </Button>

        <Button variant="secondary" onClick={handleRetakeAssessment}>
          <RefreshCw />
          Retake Assessment
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

        {debug && showAnalytics && assessmentResult && (
          <Card className={styles.debugCard}>
            <h4>Debug Information</h4>
            <div className={styles.debugInfo}>
              <p>
                <strong>Assessment Duration:</strong> {assessmentResult.assessmentDuration}ms
              </p>
              <p>
                <strong>Total Answers:</strong> {assessmentResult.answers?.length || 0}
              </p>
              <p>
                <strong>Session ID:</strong> {assessmentResult.sessionId}
              </p>
              <p>
                <strong>Path Analytics:</strong>{' '}
                {assessmentResult.pathAnalytics ? 'Available' : 'Not Available'}
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default TabbedResultsPage;

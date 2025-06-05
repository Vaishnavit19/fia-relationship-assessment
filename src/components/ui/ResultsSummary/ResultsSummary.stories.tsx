// src/components/ui/ResultsSummary/ResultsSummary.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';

import { ResultsSummary } from './ResultsSummary';

// Sample data based on your assessment structure
const sampleUser = {
  name: 'Alex',
  email: 'alex@example.com',
};

const heartfeltArchetype = {
  id: 'heartfelt',
  name: 'The Heartfelt Companion',
  title: 'Connection-Focused Partner',
  description: 'You prioritize emotional connection and togetherness above all else. Your partner\'s happiness is your happiness, and you create deep bonds through shared experiences.',
  traits: [
    'Puts partner\'s feelings first',
    'Values shared experiences over individual adventures',
    'Creates emotional safety and connection',
    'Sacrifices personal preferences for relationship harmony',
    'Thrives on intimate moments and deep conversations'
  ],
  icon: '💝',
  color: '#87ceeb',
  gradient: 'linear-gradient(135deg, #87ceeb 0%, #98d8e8 100%)'
};

const strategicArchetype = {
  id: 'strategic',
  name: 'The Strategic Navigator',
  title: 'Logic-Driven Planner',
  description: 'You approach relationships and travel with careful planning and practical thinking. You create well-organized adventures through efficient decision-making.',
  traits: [
    'Makes decisions based on logic and efficiency',
    'Plans ahead to avoid problems',
    'Values practical solutions over emotional responses',
    'Creates structure and organization in relationships',
    'Focuses on long-term benefits and outcomes'
  ],
  icon: '🧠',
  color: '#667eea',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
};

const spontaneousArchetype = {
  id: 'spontaneous',
  name: 'The Spontaneous Explorer',
  title: 'Adventure-Seeking Spirit',
  description: 'You embrace the unexpected and thrive on new experiences. You bring excitement to relationships through your adventurous approach to life.',
  traits: [
    'Embraces spontaneity and new experiences',
    'Comfortable with uncertainty and change',
    'Values personal freedom and independence',
    'Brings excitement and adventure to relationships',
    'Thrives on exploring the unknown'
  ],
  icon: '🌟',
  color: '#ffb347',
  gradient: 'linear-gradient(135deg, #ffb347 0%, #ffd700 100%)'
};

const allArchetypes = [heartfeltArchetype, strategicArchetype, spontaneousArchetype];

const sampleAnswers = [
  {
    scenarioId: 1,
    selectedOption: {
      letter: 'A',
      text: 'Let\'s pick whatever number of days makes us both feel relaxed and connected.',
      scores: { emotional: 2, logical: 0, exploratory: 0 },
      next: 2
    },
    timestamp: new Date('2024-01-15T14:30:00Z')
  }
];

const meta = {
  title: 'UI/ResultsSummary',
  component: ResultsSummary,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The ResultsSummary component orchestrates the complete assessment results display, combining ArchetypeCard and ScoreChart components with personalized insights and actions.

## Features
- **Celebration Header**: Personalized congratulations with user's primary archetype
- **Primary Archetype Display**: Full ArchetypeCard with detailed information and scoring
- **Score Visualization**: Interactive ScoreChart showing all three relationship dimensions
- **Personal Insights**: AI-generated insights based on user's specific score patterns
- **Secondary Archetypes**: Additional archetype influences with compact displays
- **Action Options**: Share, download, and retake functionality
- **Responsive Design**: Mobile-optimized layout with proper spacing and typography
- **Print Support**: Clean print styles for saving or sharing results

## Usage Context
- Final assessment results page
- PDF/print report generation
- Social sharing and testimonials
- Re-engagement and retake flows
- Personal development insights

## Integration Points
- Connects with Zustand store for results data
- Uses ArchetypeCard and ScoreChart components
- Integrates with sharing and download functionality
- Supports analytics and tracking
- Provides retake and navigation options
        `,
      },
    },
  },
  argTypes: {
    result: {
      description: 'Complete assessment results object',
      control: 'object',
    },
    userData: {
      description: 'User information and preferences',
      control: 'object',
    },
    allArchetypes: {
      description: 'All available relationship archetypes',
      control: 'object',
    },
    showSecondaryArchetypes: {
      description: 'Display secondary archetype influences',
      control: 'boolean',
    },
    showInsights: {
      description: 'Show personalized insights section',
      control: 'boolean',
    },
    showActions: {
      description: 'Display action buttons section',
      control: 'boolean',
    },
    enableSharing: {
      description: 'Enable social sharing functionality',
      control: 'boolean',
    },
    onRetake: {
      description: 'Callback for retaking the assessment',
      action: 'retake',
    },
    onShare: {
      description: 'Callback for sharing results',
      action: 'share',
    },
    onDownload: {
      description: 'Callback for downloading results',
      action: 'download',
    },
  },
  args: {
    userData: sampleUser,
    allArchetypes: allArchetypes,
    showSecondaryArchetypes: true,
    showInsights: true,
    showActions: true,
    enableSharing: true,
    onRetake: fn(),
    onShare: fn(),
    onDownload: fn(),
  },
} satisfies Meta<typeof ResultsSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeartfeltCompanion: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 11,
        logical: 3,
        exploratory: 4,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Results for "The Heartfelt Companion" - someone who prioritizes emotional connection above all else.',
      },
    },
  },
};

export const StrategicNavigator: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 4,
        logical: 10,
        exploratory: 5,
      },
      archetype: strategicArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Results for "The Strategic Navigator" - someone who approaches relationships with careful planning.',
      },
    },
  },
};

export const SpontaneousExplorer: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 5,
        logical: 4,
        exploratory: 11,
      },
      archetype: spontaneousArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Results for "The Spontaneous Explorer" - someone who thrives on adventure and spontaneity.',
      },
    },
  },
};

export const BalancedScores: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 6,
        logical: 6,
        exploratory: 6,
      },
      archetype: heartfeltArchetype, // Defaulting to heartfelt for balanced case
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Rare case of perfectly balanced scores across all relationship dimensions.',
      },
    },
  },
};

export const WithoutSecondaryArchetypes: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 9,
        logical: 2,
        exploratory: 1,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    showSecondaryArchetypes: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Results display without secondary archetypes section for cleaner presentation.',
      },
    },
  },
};

export const WithoutInsights: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 8,
        logical: 6,
        exploratory: 7,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    showInsights: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal results display without personalized insights section.',
      },
    },
  },
};

export const WithoutActions: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 8,
        logical: 6,
        exploratory: 7,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Results display without action buttons, suitable for read-only views or embedded contexts.',
      },
    },
  },
};

export const SharingDisabled: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 8,
        logical: 6,
        exploratory: 7,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    enableSharing: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Results with sharing functionality disabled for privacy-focused implementations.',
      },
    },
  },
};

export const MinimalDisplay: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 8,
        logical: 6,
        exploratory: 7,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    showSecondaryArchetypes: false,
    showInsights: false,
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal results display showing only primary archetype and scores.',
      },
    },
  },
};

export const LowEngagement: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 2,
        logical: 3,
        exploratory: 1,
      },
      archetype: strategicArchetype, // Logical is highest even though low
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    userData: {
      name: 'Jordan',
      email: 'jordan@example.com',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Results for someone with lower overall engagement scores, still discovering their preferences.',
      },
    },
  },
};

export const HighEngagement: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 11,
        logical: 10,
        exploratory: 12,
      },
      archetype: spontaneousArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    userData: {
      name: 'Casey',
      email: 'casey@example.com',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Results for someone with very high engagement across all dimensions.',
      },
    },
  },
};

export const LongName: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 8,
        logical: 6,
        exploratory: 7,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
    userData: {
      name: 'Alexandra Katherine',
      email: 'alexandra.katherine@example.com',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing display with longer names to ensure proper text wrapping.',
      },
    },
  },
};

export const RecentCompletion: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 8,
        logical: 6,
        exploratory: 7,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date(), // Just completed
      answers: sampleAnswers,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Results showing today\'s completion date.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 9,
        logical: 7,
        exploratory: 8,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing responsive layout adjustments.',
      },
    },
  },
};

export const PrintPreview: Story = {
  args: {
    result: {
      totalScores: {
        emotional: 8,
        logical: 6,
        exploratory: 7,
      },
      archetype: heartfeltArchetype,
      completedAt: new Date('2024-01-15T14:45:00Z'),
      answers: sampleAnswers,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Print-optimized view for generating PDF reports or physical copies.',
      },
    },
  },
};
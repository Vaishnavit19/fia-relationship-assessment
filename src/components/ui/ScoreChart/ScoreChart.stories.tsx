// src/components/ui/ScoreChart/ScoreChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ScoreChart } from './ScoreChart';

const meta = {
  title: 'UI/ScoreChart',
  component: ScoreChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The ScoreChart component visualizes user assessment scores across the three relationship dimensions with beautiful animated bars and detailed breakdowns.

## Features
- **Animated Visualization**: Staggered bar animations with smooth entrance effects
- **Three Dimensions**: Emotional (💝), Logical (🧠), and Exploratory (🌟) scoring
- **Color-Coded Design**: Each dimension has its own gradient and color scheme
- **Score Display**: Optional numeric values shown above bars with arrows
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Accessibility**: ARIA labels, keyboard navigation, and high contrast support
- **Size Variants**: Small, medium, and large options for different contexts
- **Animation Control**: Respects reduced motion preferences

## Usage Context
- Assessment results display
- Score comparison and analysis
- Progress tracking visualization
- Educational content about relationship dimensions
- Personal insights and recommendations

## Assessment Integration
Specifically designed for the relationship assessment with:
- Three relationship dimensions (Emotional, Logical, Exploratory)
- Score normalization and percentage calculations
- Integration with archetype determination
- Visual storytelling of user preferences
- Beautiful presentation of complex data
        `,
      },
    },
  },
  argTypes: {
    scores: {
      control: 'object',
      description: 'User assessment scores for all three dimensions',
    },
    maxScore: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Maximum possible score for normalization',
    },
    showValues: {
      control: 'boolean',
      description: 'Display numeric score values above bars',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Chart size variant',
    },
    animationDelay: {
      control: { type: 'range', min: 0, max: 3000, step: 100 },
      description: 'Delay before animation starts (milliseconds)',
    },
    animated: {
      control: 'boolean',
      description: 'Enable entrance animations',
    },
    showFooter: {
      control: 'boolean',
      description: 'Show footer with maximum score information',
    },
  },
  args: {
    scores: {
      emotional: 8,
      logical: 6,
      exploratory: 7,
    },
    maxScore: 12,
    showValues: true,
    size: 'medium',
    animationDelay: 0,
    animated: true,
    showFooter: true,
  },
} satisfies Meta<typeof ScoreChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default score chart showing balanced scores across all three relationship dimensions.',
      },
    },
  },
};

export const HighEmotional: Story = {
  args: {
    scores: {
      emotional: 11,
      logical: 3,
      exploratory: 4,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile of "The Heartfelt Companion" - someone who prioritizes emotional connection above all else.',
      },
    },
  },
};

export const HighLogical: Story = {
  args: {
    scores: {
      emotional: 4,
      logical: 10,
      exploratory: 5,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile of "The Strategic Navigator" - someone who approaches relationships with careful planning and logic.',
      },
    },
  },
};

export const HighExploratory: Story = {
  args: {
    scores: {
      emotional: 5,
      logical: 4,
      exploratory: 11,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile of "The Spontaneous Explorer" - someone who thrives on adventure and spontaneity in relationships.',
      },
    },
  },
};

export const PerfectBalance: Story = {
  args: {
    scores: {
      emotional: 6,
      logical: 6,
      exploratory: 6,
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

export const LowScores: Story = {
  args: {
    scores: {
      emotional: 2,
      logical: 3,
      exploratory: 1,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of someone still discovering their relationship preferences with lower overall engagement.',
      },
    },
  },
};

export const MaxScores: Story = {
  args: {
    scores: {
      emotional: 12,
      logical: 12,
      exploratory: 12,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Theoretical maximum scores across all dimensions (rare in real assessments).',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    size: 'small',
    scores: {
      emotional: 8,
      logical: 6,
      exploratory: 9,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version suitable for sidebars, cards, or summary sections.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    size: 'large',
    scores: {
      emotional: 7,
      logical: 9,
      exploratory: 6,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Large version for prominent display on main results pages.',
      },
    },
  },
};

export const WithoutValues: Story = {
  args: {
    showValues: false,
    scores: {
      emotional: 8,
      logical: 5,
      exploratory: 7,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Clean version focusing on visual proportions without numeric clutter.',
      },
    },
  },
};

export const WithoutFooter: Story = {
  args: {
    showFooter: false,
    scores: {
      emotional: 9,
      logical: 7,
      exploratory: 8,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal version without footer information for compact displays.',
      },
    },
  },
};

export const DelayedAnimation: Story = {
  args: {
    animationDelay: 1500,
    scores: {
      emotional: 9,
      logical: 7,
      exploratory: 8,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Animation starts after 1.5 second delay, useful for sequential page reveals.',
      },
    },
  },
};

export const NoAnimation: Story = {
  args: {
    animated: false,
    scores: {
      emotional: 8,
      logical: 6,
      exploratory: 7,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Static version without animations for users who prefer reduced motion.',
      },
    },
  },
};

export const ArchetypeComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        width: '100%',
        maxWidth: '1200px',
      }}
    >
      <div>
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#87ceeb',
            fontWeight: 600,
          }}
        >
          💝 Heartfelt Companion
        </h4>
        <ScoreChart
          scores={{ emotional: 11, logical: 3, exploratory: 4 }}
          maxScore={12}
          size="small"
          showValues={true}
          showFooter={false}
          animationDelay={0}
        />
      </div>
      <div>
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#667eea',
            fontWeight: 600,
          }}
        >
          🧠 Strategic Navigator
        </h4>
        <ScoreChart
          scores={{ emotional: 4, logical: 10, exploratory: 5 }}
          maxScore={12}
          size="small"
          showValues={true}
          showFooter={false}
          animationDelay={400}
        />
      </div>
      <div>
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#ffb347',
            fontWeight: 600,
          }}
        >
          🌟 Spontaneous Explorer
        </h4>
        <ScoreChart
          scores={{ emotional: 5, logical: 4, exploratory: 11 }}
          maxScore={12}
          size="small"
          showValues={true}
          showFooter={false}
          animationDelay={800}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of all three relationship archetypes with staggered animations.',
      },
    },
  },
};

export const ProgressionStory: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Early Relationship Stage</h4>
        <ScoreChart
          scores={{ emotional: 3, logical: 2, exploratory: 4 }}
          maxScore={12}
          size="medium"
          animationDelay={0}
        />
      </div>
      <div>
        <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Developing Preferences</h4>
        <ScoreChart
          scores={{ emotional: 6, logical: 5, exploratory: 7 }}
          maxScore={12}
          size="medium"
          animationDelay={1000}
        />
      </div>
      <div>
        <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Mature Relationship Style</h4>
        <ScoreChart
          scores={{ emotional: 9, logical: 8, exploratory: 10 }}
          maxScore={12}
          size="medium"
          animationDelay={2000}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showing how relationship preferences might evolve over time with different score patterns.',
      },
    },
  },
};

export const ResponsiveExample: Story = {
  args: {
    scores: {
      emotional: 8,
      logical: 6,
      exploratory: 9,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing responsive design adjustments.',
      },
    },
  },
};

export const HighContrast: Story = {
  args: {
    scores: {
      emotional: 8,
      logical: 6,
      exploratory: 7,
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Demonstration of high contrast mode support for accessibility.',
      },
    },
  },
};
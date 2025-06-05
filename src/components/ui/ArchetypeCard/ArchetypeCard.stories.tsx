// src/components/ui/ArchetypeCard/ArchetypeCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { ArchetypeCard } from './ArchetypeCard';

// Sample archetype data based on your assessment structure
const heartfeltArchetype = {
  id: 'heartfelt',
  name: 'The Heartfelt Companion',
  title: 'Connection-Focused Partner',
  description:
    "You prioritize emotional connection and togetherness above all else. Your partner's happiness is your happiness, and you create deep bonds through shared experiences.",
  traits: [
    "Puts partner's feelings first",
    'Values shared experiences over individual adventures',
    'Creates emotional safety and connection',
    'Sacrifices personal preferences for relationship harmony',
    'Thrives on intimate moments and deep conversations',
  ],
  icon: '💝',
  color: '#87ceeb',
  gradient: 'linear-gradient(135deg, #87ceeb 0%, #98d8e8 100%)',
};

const strategicArchetype = {
  id: 'strategic',
  name: 'The Strategic Navigator',
  title: 'Logic-Driven Planner',
  description:
    'You approach relationships and travel with careful planning and practical thinking. You create well-organized adventures through efficient decision-making.',
  traits: [
    'Makes decisions based on logic and efficiency',
    'Plans ahead to avoid problems',
    'Values practical solutions over emotional responses',
    'Creates structure and organization in relationships',
    'Focuses on long-term benefits and outcomes',
  ],
  icon: '🧠',
  color: '#667eea',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const spontaneousArchetype = {
  id: 'spontaneous',
  name: 'The Spontaneous Explorer',
  title: 'Adventure-Seeking Spirit',
  description:
    'You embrace the unexpected and thrive on new experiences. You bring excitement to relationships through your adventurous approach to life.',
  traits: [
    'Embraces spontaneity and new experiences',
    'Comfortable with uncertainty and change',
    'Values personal freedom and independence',
    'Brings excitement and adventure to relationships',
    'Thrives on exploring the unknown',
  ],
  icon: '🌟',
  color: '#ffb347',
  gradient: 'linear-gradient(135deg, #ffb347 0%, #ffd700 100%)',
};

const meta = {
  title: 'UI/ArchetypeCard',
  component: ArchetypeCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ArchetypeCard component displays relationship archetypes with rich visual styling, trait lists, and scoring information. It's designed to showcase the three relationship types from the assessment results.

## Features
- **Rich Visual Design**: Archetype-specific colors, gradients, and icons
- **Comprehensive Information**: Names, descriptions, and detailed trait lists
- **Score Integration**: Display user scores and percentages for each archetype
- **Primary/Secondary States**: Special styling for user's main archetype results
- **Interactive Options**: Clickable cards with hover effects and actions
- **Multiple Variants**: Default, detailed, compact, and result-specific layouts
- **Responsive Design**: Adapts beautifully across all screen sizes

## Usage Context
- Assessment results display
- Archetype comparison and education
- Relationship type exploration
- Results sharing and explanation
- Educational content about relationship styles

## Assessment Integration
Specifically designed for the relationship assessment with:
- Three distinct archetype types (Heartfelt, Strategic, Spontaneous)
- Score visualization and comparison
- Primary archetype highlighting
- Trait-based explanations
- Beautiful visual differentiation
        `,
      },
    },
  },
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'User score for this archetype (0-12)',
    },
    maxScore: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Maximum possible score',
    },
    isPrimary: {
      control: { type: 'boolean' },
      description: "Whether this is the user's primary archetype",
    },
    isSecondary: {
      control: { type: 'boolean' },
      description: "Whether this is the user's secondary archetype",
    },
    showDetails: {
      control: { type: 'boolean' },
      description: 'Whether to show detailed description',
    },
    showScore: {
      control: { type: 'boolean' },
      description: 'Whether to show score information',
    },
    showTraits: {
      control: { type: 'boolean' },
      description: 'Whether to show traits list',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'detailed', 'compact', 'result'],
      description: 'Visual variant of the card',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the card',
    },
    interactive: {
      control: { type: 'boolean' },
      description: 'Whether the card is clickable',
    },
    showAction: {
      control: { type: 'boolean' },
      description: 'Whether to show action button',
    },
    actionText: {
      control: { type: 'text' },
      description: 'Text for the action button',
    },
    primaryBadge: {
      control: { type: 'text' },
      description: 'Badge text for primary archetype',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Whether to animate the card appearance',
    },
  },
  args: {
    archetype: heartfeltArchetype,
    score: 8,
    maxScore: 12,
    isPrimary: false,
    isSecondary: false,
    showDetails: true,
    showScore: false,
    showTraits: true,
    variant: 'default',
    size: 'medium',
    interactive: false,
    showAction: false,
    actionText: 'Learn More',
    primaryBadge: 'Your Type',
    animated: true,
    onClick: fn(),
    onAction: fn(),
  },
} satisfies Meta<typeof ArchetypeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default archetype card showing the Heartfelt Companion with full details and traits.',
      },
    },
  },
};

export const WithScore: Story = {
  args: {
    showScore: true,
    score: 10,
    maxScore: 12,
  },
  parameters: {
    docs: {
      description: {
        story: "Archetype card with score display showing user's match percentage.",
      },
    },
  },
};

export const PrimaryArchetype: Story = {
  args: {
    isPrimary: true,
    showScore: true,
    score: 11,
    maxScore: 12,
    variant: 'result',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary archetype card with special styling, badge, and high score.',
      },
    },
  },
};

export const SecondaryArchetype: Story = {
  args: {
    archetype: strategicArchetype,
    isSecondary: true,
    showScore: true,
    score: 7,
    maxScore: 12,
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary archetype card with Strategic Navigator styling.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    showAction: true,
    actionText: 'Explore This Type',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive archetype card with click handler and action button.',
      },
    },
  },
};

export const AllArchetypes: Story = {
  args: {
    showScore: true,
    maxScore: 12,
    interactive: true,
  },
  render: args => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
      }}
    >
      <ArchetypeCard
        {...args}
        archetype={heartfeltArchetype}
        score={11}
        isPrimary={true}
        variant="result"
      />
      <ArchetypeCard {...args} archetype={strategicArchetype} score={7} isSecondary={true} />
      <ArchetypeCard {...args} archetype={spontaneousArchetype} score={4} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All three relationship archetypes displayed together with different scores and states.',
      },
    },
  },
};

export const Variants: Story = {
  args: {
    showScore: true,
    score: 8,
    isPrimary: true,
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Default Variant</h4>
        <ArchetypeCard {...args} variant="default" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Detailed Variant</h4>
        <ArchetypeCard {...args} variant="detailed" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Compact Variant</h4>
        <ArchetypeCard {...args} variant="compact" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Result Variant</h4>
        <ArchetypeCard {...args} variant="result" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the archetype card for various contexts.',
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    showScore: true,
    score: 9,
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Small Size</h4>
        <div style={{ maxWidth: '300px' }}>
          <ArchetypeCard {...args} size="small" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Medium Size</h4>
        <div style={{ maxWidth: '400px' }}>
          <ArchetypeCard {...args} size="medium" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Large Size</h4>
        <div style={{ maxWidth: '500px' }}>
          <ArchetypeCard {...args} size="large" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size variants of the archetype card.',
      },
    },
  },
};

export const CompactComparison: Story = {
  args: {
    variant: 'compact',
    showScore: true,
    showTraits: false,
    maxScore: 12,
  },
  render: args => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
      }}
    >
      <ArchetypeCard {...args} archetype={heartfeltArchetype} score={11} isPrimary={true} />
      <ArchetypeCard {...args} archetype={strategicArchetype} score={7} isSecondary={true} />
      <ArchetypeCard {...args} archetype={spontaneousArchetype} score={4} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact comparison view showing all archetypes with scores in a condensed format.',
      },
    },
  },
};

export const ResultsDisplay: Story = {
  args: {
    variant: 'result',
    showScore: true,
    showAction: true,
    actionText: 'Read Full Analysis',
    maxScore: 12,
  },
  render: args => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#2d3748', margin: '0 0 0.5rem 0' }}>Your Assessment Results</h2>
        <p style={{ color: '#718096', margin: 0 }}>
          Discover your relationship archetype based on your travel preferences
        </p>
      </div>

      <ArchetypeCard
        {...args}
        archetype={heartfeltArchetype}
        score={11}
        isPrimary={true}
        primaryBadge="Your Primary Type"
      />

      <ArchetypeCard
        {...args}
        archetype={strategicArchetype}
        score={7}
        isSecondary={true}
        showAction={false}
        animated={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete results display showing primary and secondary archetypes as they would appear in the assessment results.',
      },
    },
  },
};

export const EducationalOverview: Story = {
  args: {
    showScore: false,
    interactive: true,
    showAction: true,
    actionText: 'Learn More',
    variant: 'detailed',
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#2d3748', margin: '0 0 0.5rem 0' }}>Relationship Archetypes</h2>
        <p style={{ color: '#718096', margin: 0 }}>
          Discover the three primary relationship styles and how they approach travel together
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
        }}
      >
        <ArchetypeCard {...args} archetype={heartfeltArchetype} />
        <ArchetypeCard {...args} archetype={strategicArchetype} />
        <ArchetypeCard {...args} archetype={spontaneousArchetype} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Educational overview showing all three archetypes for learning about relationship types.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    showScore: true,
    score: 10,
    isPrimary: true,
    variant: 'result',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view of the archetype card with responsive design.',
      },
    },
  },
};

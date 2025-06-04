// src/components/ui/Card/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Heart, Brain, Star, ChevronRight } from 'lucide-react';

import { Button } from '../Button';

import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Card Component

A versatile card container component designed for the FIA Relationship Assessment with multiple variants, sizes, and interactive states.

## Features
- **Four variants**: Default, Elevated, Interactive, and Outlined
- **Three sizes**: Small, Medium, and Large  
- **Flexible padding**: None, Small, Medium, and Large
- **Interactive states**: Hover, Selected, Disabled
- **Accessibility**: Proper ARIA support and keyboard navigation
- **Assessment-specific**: Special styling for questions, options, and results

## Usage
Perfect for displaying assessment questions, answer options, results cards, and general content containers.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'interactive', 'outlined'],
      description: 'Visual style variant of the card',
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | elevated | interactive | outlined' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the card',
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'small | medium | large' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Internal padding of the card',
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'none | small | medium | large' },
      },
    },
    hover: {
      control: 'boolean',
      description: 'Forces hover state styling',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Shows selected state with accent border',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interactions and reduces opacity',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    children: {
      control: 'text',
      description: 'Card content',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Default: Story = {
  args: {
    children: (
      <div>
        <h3>Default Card</h3>
        <p>This is a default card with standard styling and shadow.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'The default card variant with subtle shadow and clean styling.',
      },
    },
  },
};

export const Elevated: Story = {
  args: {
    children: (
      <div>
        <h3>Elevated Card</h3>
        <p>This card has enhanced shadow and slight lift for prominence.</p>
      </div>
    ),
    variant: 'elevated',
  },
  parameters: {
    docs: {
      description: {
        story: 'Elevated variant with enhanced shadow and transform for drawing attention.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    children: (
      <div>
        <h3>Interactive Card</h3>
        <p>This card can be clicked and shows hover effects.</p>
      </div>
    ),
    variant: 'interactive',
    onClick: () => alert('Card clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive variant that responds to clicks and keyboard navigation with proper accessibility.',
      },
    },
  },
};

export const Outlined: Story = {
  args: {
    children: (
      <div>
        <h3>Outlined Card</h3>
        <p>This card uses a border instead of shadow for definition.</p>
      </div>
    ),
    variant: 'outlined',
  },
  parameters: {
    docs: {
      description: {
        story: 'Outlined variant with border styling instead of shadow for subtle appearance.',
      },
    },
  },
};

// Size Variants
export const Small: Story = {
  args: {
    children: (
      <div>
        <h4>Small Card</h4>
        <p>Compact size for secondary content.</p>
      </div>
    ),
    size: 'small',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size perfect for compact information or secondary content areas.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    children: (
      <div>
        <h3>Medium Card</h3>
        <p>Standard size for most content areas and general use cases.</p>
      </div>
    ),
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size - the default and most commonly used card size.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    children: (
      <div>
        <h2>Large Card</h2>
        <p>Spacious size for prominent content areas and main features.</p>
        <p>Perfect for assessment results or detailed information display.</p>
      </div>
    ),
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size for prominent content like assessment results or detailed information.',
      },
    },
  },
};

// Padding Variants
export const NoPadding: Story = {
  args: {
    children: (
      <div style={{ padding: '20px', background: '#f0f0f0' }}>
        <h3>Custom Content</h3>
        <p>This card has no internal padding, allowing full control over spacing.</p>
      </div>
    ),
    padding: 'none',
  },
  parameters: {
    docs: {
      description: {
        story: 'No padding variant for full control over internal spacing and custom layouts.',
      },
    },
  },
};

// Interactive States
export const Selected: Story = {
  args: {
    children: (
      <div>
        <h3>Selected Card</h3>
        <p>This card shows the selected state with accent border.</p>
      </div>
    ),
    selected: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected state with accent border and background tint for chosen options.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    children: (
      <div>
        <h3>Disabled Card</h3>
        <p>This card is disabled and cannot be interacted with.</p>
      </div>
    ),
    disabled: true,
    variant: 'interactive',
    onClick: () => alert('This should not trigger'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state prevents interaction and shows reduced opacity.',
      },
    },
  },
};

// Assessment-Specific Examples
export const QuestionCard: Story = {
  args: {
    children: (
      <div>
        <h3>Assessment Question</h3>
        <p>You&apos;re planning a trip together. How do you decide on the length of your stay?</p>
      </div>
    ),
    className: 'question-card',
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: '**Assessment Example**: Question card with left accent border for displaying scenarios.',
      },
    },
  },
};

export const OptionCard: Story = {
  args: {
    children: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <strong>A.</strong>
        <span>Let&apos;s pick whatever number of days makes us both feel relaxed and connected.</span>
      </div>
    ),
    variant: 'interactive',
    className: 'option-card',
    onClick: () => alert('Option A selected!'),
  },
  parameters: {
    docs: {
      description: {
        story: '**Assessment Example**: Option card for answer choices with hover and selection states.',
      },
    },
  },
};

export const SelectedOption: Story = {
  args: {
    children: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <strong>B.</strong>
        <span>I&apos;ll run the costs and schedules to choose the most efficient trip length.</span>
      </div>
    ),
    variant: 'interactive',
    selected: true,
    className: 'option-card',
  },
  parameters: {
    docs: {
      description: {
        story: '**Assessment Example**: Selected option showing the chosen answer state.',
      },
    },
  },
};

export const ResultCard: Story = {
  args: {
    children: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💝</div>
        <h2>The Heartfelt Companion</h2>
        <p style={{ marginBottom: '16px', color: '#718096' }}>Connection-Focused Partner</p>
        <p>You prioritize emotional connection and togetherness above all else. Your partner&apos;s happiness is your happiness.</p>
      </div>
    ),
    size: 'large',
    className: 'result-card emotional',
  },
  parameters: {
    docs: {
      description: {
        story: '**Assessment Example**: Results card with archetype information and gradient border.',
      },
    },
  },
};

// Complex Examples
export const CardWithActions: Story = {
  args: {
    children: (
      <div>
        <div className="card-header">
          <h3 className="card-title">Assessment Progress</h3>
          <p className="card-subtitle">Question 3 of 7</p>
        </div>
        <div className="card-content">
          <p>You&apos;re making great progress! Each question helps us understand your relationship style better.</p>
        </div>
        <div className="card-footer">
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="small">Previous</Button>
            <Button variant="primary" size="small" icon={ChevronRight} iconPosition="right">
              Continue
            </Button>
          </div>
        </div>
      </div>
    ),
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex card with header, content, and footer sections including action buttons.',
      },
    },
  },
};

export const ArchetypeShowcase: Story = {
  args: {
    children: 'Demo Card', // Required args for the story
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '800px' }}>
      <Card className="result-card emotional" padding="large">
        <div style={{ textAlign: 'center' }}>
          <Heart size={48} style={{ color: '#87ceeb', marginBottom: '16px' }} />
          <h3>Heartfelt Companion</h3>
          <p style={{ color: '#718096', fontSize: '14px' }}>Emotional Score: 8/12</p>
        </div>
      </Card>
      <Card className="result-card logical" padding="large">
        <div style={{ textAlign: 'center' }}>
          <Brain size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
          <h3>Strategic Navigator</h3>
          <p style={{ color: '#718096', fontSize: '14px' }}>Logical Score: 6/12</p>
        </div>
      </Card>
      <Card className="result-card exploratory" padding="large">
        <div style={{ textAlign: 'center' }}>
          <Star size={48} style={{ color: '#ffb347', marginBottom: '16px' }} />
          <h3>Spontaneous Explorer</h3>
          <p style={{ color: '#718096', fontSize: '14px' }}>Exploratory Score: 4/12</p>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '**Assessment Results**: All three archetype cards showing the complete assessment results layout.',
      },
    },
  },
};
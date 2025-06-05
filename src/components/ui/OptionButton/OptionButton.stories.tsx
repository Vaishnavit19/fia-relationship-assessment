// src/components/ui/OptionButton/OptionButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { Heart, MapPin, Clock, Camera } from 'lucide-react';
import React from 'react';

import { OptionButton } from './OptionButton';

const meta = {
  title: 'UI/OptionButton',
  component: OptionButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The OptionButton component is a specialized button designed for answer options in assessments, forms, and selection interfaces. It provides rich interaction states and visual feedback for user choices.

## Features
- **Flexible Selection Modes**: Radio, checkbox, and highlight selection styles
- **Rich Content**: Supports text, descriptions, letters, and custom icons
- **Assessment Integration**: Special color variants for emotional, logical, and exploratory options
- **Multiple Variants**: Different visual styles for various contexts
- **Accessibility**: Full keyboard navigation and screen reader support
- **Interactive States**: Hover, selected, disabled, and loading states

## Usage Context
- Answer options in assessment questions
- Form selections and preferences
- Multi-choice interfaces
- Survey and questionnaire components
- Settings and configuration options

## Assessment Integration
The component includes special color variants that align with the assessment's scoring dimensions:
- **Emotional**: Light blue styling for heartfelt responses
- **Logical**: Purple styling for strategic responses
- **Exploratory**: Yellow styling for spontaneous responses
        `,
      },
    },
  },
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Main text content of the option',
    },
    letter: {
      control: { type: 'text' },
      description: 'Option identifier (A, B, C, etc.)',
    },
    description: {
      control: { type: 'text' },
      description: 'Optional description or subtitle',
    },
    selected: {
      control: { type: 'boolean' },
      description: 'Whether the option is selected',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the option is disabled',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'card', 'minimal'],
      description: 'Visual variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    selectionStyle: {
      control: { type: 'select' },
      options: ['radio', 'checkbox', 'highlight'],
      description: 'Style of selection indicator',
    },
    color: {
      control: { type: 'select' },
      options: ['default', 'emotional', 'logical', 'exploratory'],
      description: 'Color variant for assessment contexts',
    },
    showIndicator: {
      control: { type: 'boolean' },
      description: 'Whether to show selection indicator',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    text: "Let's pick whatever number of days makes us both feel relaxed and connected.",
    letter: 'A',
    selected: false,
    disabled: false,
    variant: 'default',
    size: 'medium',
    selectionStyle: 'radio',
    color: 'default',
    showIndicator: true,
    loading: false,
    onClick: fn(),
  },
} satisfies Meta<typeof OptionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Basic option button with letter identifier and selection state.',
      },
    },
  },
};

export const Selected: Story = {
  args: {
    selected: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Option button in selected state showing selection indicator and styling.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    text: "I'll run the costs and schedules to choose the most efficient trip length.",
    description: 'Focus on practical planning and budget optimization',
    letter: 'B',
    selected: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Option button with additional description text for more context.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    text: 'Focus on emotional connection',
    icon: <Heart size={20} />,
    selected: true,
    letter: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Option button with custom icon instead of letter identifier.',
      },
    },
  },
};

export const Variants: Story = {
  args: {
    text: 'Travel planning approach',
    description: 'Choose your preferred method',
    letter: 'A',
    selected: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Default</h4>
        <OptionButton {...args} variant="default" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Compact</h4>
        <OptionButton {...args} variant="compact" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Card</h4>
        <OptionButton {...args} variant="card" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Minimal</h4>
        <OptionButton {...args} variant="minimal" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants for various UI contexts and layouts.',
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    text: 'Size demonstration',
    letter: 'A',
    selected: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <OptionButton {...args} size="small" text="Small size option" />
      <OptionButton {...args} size="medium" text="Medium size option" />
      <OptionButton {...args} size="large" text="Large size option" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size variants for various UI scales and contexts.',
      },
    },
  },
};

export const SelectionStyles: Story = {
  args: {
    text: 'Selection style demonstration',
    selected: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Radio Style</h4>
        <OptionButton {...args} selectionStyle="radio" letter="A" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Checkbox Style</h4>
        <OptionButton {...args} selectionStyle="checkbox" letter="B" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Highlight Style</h4>
        <OptionButton {...args} selectionStyle="highlight" letter="C" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different selection indicator styles for various interaction patterns.',
      },
    },
  },
};

export const AssessmentColors: Story = {
  args: {
    selected: true,
    description: 'Assessment-specific color variants',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>💝 Emotional Response</h4>
        <OptionButton 
          {...args} 
          text="Focus on feelings and connection" 
          letter="A" 
          color="emotional"
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>🧠 Logical Response</h4>
        <OptionButton 
          {...args} 
          text="Analyze costs and efficiency" 
          letter="B" 
          color="logical"
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>🌟 Exploratory Response</h4>
        <OptionButton 
          {...args} 
          text="Embrace spontaneity and adventure" 
          letter="C" 
          color="exploratory"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Assessment-specific color variants that align with the three relationship archetypes.',
      },
    },
  },
};

export const AssessmentScenario: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>
        How do you prefer to handle travel delays?
      </h3>
      <OptionButton
        text="I get worried and need reassurance from my partner"
        description="Emotional response focusing on connection and comfort"
        letter="A"
        color="emotional"
        onClick={fn()}
      />
      <OptionButton
        text="I research alternative options and make a plan"
        description="Logical response with practical problem-solving"
        letter="B"
        color="logical"
        onClick={fn()}
      />
      <OptionButton
        text="I see it as an opportunity for unexpected adventures"
        description="Exploratory response embracing spontaneity"
        letter="C"
        color="exploratory"
        selected={true}
        onClick={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete assessment scenario showing how options work together with different color variants.',
      },
    },
  },
};

export const States: Story = {
  args: {
    text: 'Option button states',
    letter: 'A',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Default</h4>
        <OptionButton {...args} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Selected</h4>
        <OptionButton {...args} selected={true} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Disabled</h4>
        <OptionButton {...args} disabled={true} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Loading</h4>
        <OptionButton {...args} loading={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different interactive states of the option button.',
      },
    },
  },
};

export const CustomIcons: Story = {
  args: {
    selected: true,
    showIndicator: false,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <OptionButton 
        {...args} 
        text="Explore the city" 
        icon={<MapPin size={20} />}
      />
      <OptionButton 
        {...args} 
        text="Capture memories" 
        icon={<Camera size={20} />}
      />
      <OptionButton 
        {...args} 
        text="Take your time" 
        icon={<Clock size={20} />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Option buttons with custom icons for visual context and theming.',
      },
    },
  },
};

export const MultipleChoice: Story = {
  args: {},
  render: () => {
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(['B']);
    
    const handleToggle = (letter: string) => {
      setSelectedOptions(prev => 
        prev.includes(letter) 
          ? prev.filter(l => l !== letter)
          : [...prev, letter]
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>
          What factors influence your travel decisions? (Select all that apply)
        </h3>
        <OptionButton
          text="Budget and cost considerations"
          letter="A"
          selectionStyle="checkbox"
          selected={selectedOptions.includes('A')}
          onClick={() => handleToggle('A')}
        />
        <OptionButton
          text="Partner's preferences and happiness"
          letter="B"
          selectionStyle="checkbox"
          selected={selectedOptions.includes('B')}
          onClick={() => handleToggle('B')}
        />
        <OptionButton
          text="Opportunities for new experiences"
          letter="C"
          selectionStyle="checkbox"
          selected={selectedOptions.includes('C')}
          onClick={() => handleToggle('C')}
        />
        <OptionButton
          text="Convenience and ease of planning"
          letter="D"
          selectionStyle="checkbox"
          selected={selectedOptions.includes('D')}
          onClick={() => handleToggle('D')}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive multiple choice selection using checkbox style with state management.',
      },
    },
  },
};
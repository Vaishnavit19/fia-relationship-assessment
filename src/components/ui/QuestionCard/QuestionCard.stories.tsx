// src/components/ui/QuestionCard/QuestionCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { MapPin, Heart, Compass } from 'lucide-react';
import { fn } from 'storybook/test';

import { QuestionCard } from './QuestionCard';

// Sample question data based on your assessment scenarios
const sampleOptions = [
  {
    letter: 'A',
    text: "Let's pick whatever number of days makes us both feel relaxed and connected.",
    description: 'Focus on emotional comfort and togetherness',
  },
  {
    letter: 'B',
    text: "I'll run the costs and schedules to choose the most efficient trip length.",
    description: 'Practical approach with budget and time optimization',
  },
  {
    letter: 'C',
    text: "Let's go as long as our schedules allow—more days means more chances for spontaneous adventures.",
    description: 'Embrace flexibility and spontaneous experiences',
  },
];

const destinationOptions = [
  {
    letter: 'A',
    text: "If London makes you happier, I'm good with it.",
  },
  {
    letter: 'B',
    text: "Cost, flights, and attractions favor Paris—let's choose that.",
  },
  {
    letter: 'C',
    text: "London vibe calls to me—let's chase that spontaneity.",
  },
];

const shortOptions = [
  {
    letter: 'A',
    text: 'Plan everything in advance',
  },
  {
    letter: 'B',
    text: 'Mix of planning and spontaneity',
  },
  {
    letter: 'C',
    text: 'Go with the flow completely',
  },
];

const meta = {
  title: 'UI/QuestionCard',
  component: QuestionCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The QuestionCard component displays individual assessment questions with multiple choice options. It's designed to be the core interface for the assessment flow, providing an engaging and accessible question experience.

## Features
- **Rich Question Display**: Supports question text, descriptions, and custom icons
- **Interactive Options**: Clickable options with hover states and selection feedback
- **Progress Integration**: Shows question numbers and progress information
- **Accessibility**: Full keyboard navigation and screen reader support
- **Flexible Styling**: Multiple variants and customization options
- **Assessment Integration**: Designed for the travel scenario questionnaire

## Usage Context
- Primary component for assessment question display
- Integrates with assessment state management
- Works with ProgressBar for complete assessment UI
- Supports both single and multi-select modes

## Assessment Integration
The component is specifically designed for the relationship assessment with:
- Travel scenario questions and answer options
- Emotional, logical, and exploratory answer tracking
- Question flow progression and navigation
- Integration with scoring system
        `,
      },
    },
  },
  argTypes: {
    question: {
      control: { type: 'text' },
      description: 'The main question text to display',
    },
    description: {
      control: { type: 'text' },
      description: 'Optional description or context for the question',
    },
    selectedOption: {
      control: { type: 'select' },
      options: ['', 'A', 'B', 'C'],
      description: 'Currently selected option letter',
    },
    questionNumber: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Current question number',
    },
    totalQuestions: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Total number of questions',
    },
    showContinue: {
      control: { type: 'boolean' },
      description: 'Whether to show the continue button',
    },
    continueText: {
      control: { type: 'text' },
      description: 'Text for the continue button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the continue button is in loading state',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'bordered'],
      description: 'Visual variant of the card',
    },
    showOptionLetters: {
      control: { type: 'boolean' },
      description: 'Whether to show option letters (A, B, C)',
    },
    multiSelect: {
      control: { type: 'boolean' },
      description: 'Whether options are multi-select',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    question: "You're planning a trip together. How do you decide on the length of your stay?",
    options: sampleOptions,
    selectedOption: '',
    questionNumber: 1,
    totalQuestions: 7,
    showContinue: true,
    continueText: 'Continue',
    loading: false,
    variant: 'default',
    showOptionLetters: true,
    multiSelect: false,
    onOptionSelect: fn(),
    onContinue: fn(),
  },
} satisfies Meta<typeof QuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default question card with travel scenario question and three answer options.',
      },
    },
  },
};

export const WithSelection: Story = {
  args: {
    selectedOption: 'A',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Question card with an option selected, showing the selected state and enabled continue button.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    question: 'Time to choose your destination. What drives your decision?',
    description: 'Consider how you and your partner typically make travel decisions together.',
    options: destinationOptions,
    questionNumber: 2,
    icon: <MapPin size={24} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Question card with additional description text and custom icon for context.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    selectedOption: 'B',
    loading: true,
    continueText: 'Processing...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Question card in loading state after continue button is clicked.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    error: 'Please select an answer before continuing.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Question card displaying an error message when validation fails.',
      },
    },
  },
};

export const Variants: Story = {
  args: {
    question: "What's your approach to travel planning?",
    options: shortOptions,
    selectedOption: 'B',
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Default Variant</h3>
        <QuestionCard {...args} variant="default" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Elevated Variant</h3>
        <QuestionCard {...args} variant="elevated" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Bordered Variant</h3>
        <QuestionCard {...args} variant="bordered" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the question card for various design contexts.',
      },
    },
  },
};

export const AssessmentFlow: Story = {
  args: {
    question:
      'You spot an amazing street artist performing, but your phone battery is at 5%. What do you do?',
    description: 'This is the final question of your assessment.',
    options: [
      {
        letter: 'A',
        text: 'Put phone away and enjoy the moment.',
        description: 'Live in the present and create memories',
      },
      {
        letter: 'B',
        text: 'Take one quick photo, then save battery.',
        description: 'Balance capturing memories with practical needs',
      },
      {
        letter: 'C',
        text: 'Let battery die to capture this.',
        description: 'Prioritize documenting the unique experience',
      },
    ],
    questionNumber: 7,
    totalQuestions: 7,
    selectedOption: 'A',
    continueText: 'Complete Assessment',
    icon: <Heart size={24} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Final question in the assessment flow with complete context and selection.',
      },
    },
  },
};

export const MultiSelect: Story = {
  args: {
    question: 'Which travel preferences apply to you? (Select all that apply)',
    options: [
      {
        letter: 'A',
        text: 'I prefer detailed itineraries',
      },
      {
        letter: 'B',
        text: 'I enjoy spontaneous discoveries',
      },
      {
        letter: 'C',
        text: "I prioritize my partner's happiness",
      },
      {
        letter: 'D',
        text: 'I like to research destinations thoroughly',
      },
    ],
    multiSelect: true,
    selectedOption: 'A',
    showContinue: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select question card allowing multiple answer selections.',
      },
    },
  },
};

export const WithoutLetters: Story = {
  args: {
    question: 'How do you prefer to handle unexpected delays during travel?',
    options: shortOptions,
    showOptionLetters: false,
    selectedOption: 'B',
  },
  parameters: {
    docs: {
      description: {
        story: 'Question card without option letters for a cleaner, more minimal appearance.',
      },
    },
  },
};

export const CustomIcons: Story = {
  args: {
    question: 'What motivates your travel decisions most?',
    options: shortOptions,
    selectedOption: 'C',
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <QuestionCard
        {...args}
        icon={<Heart size={24} />}
        question="What drives your emotional connection to travel?"
      />
      <QuestionCard
        {...args}
        icon={<Compass size={24} />}
        question="How do you navigate new destinations?"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Question cards with different custom icons to match question themes.',
      },
    },
  },
};

export const NoProgress: Story = {
  args: {
    question: "Bonus question: What's your ideal vacation length?",
    options: shortOptions,
    showContinue: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Question card without progress indicators, useful for bonus or standalone questions.',
      },
    },
  },
};

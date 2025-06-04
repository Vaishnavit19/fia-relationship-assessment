import type { Meta, StoryObj } from '@storybook/nextjs';
import { ChevronRight, ArrowLeft, Heart } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'cta'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const CTA: Story = {
  args: {
    children: 'Call to Action',
    variant: 'cta',
  },
};

// Size Stories
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
  },
};

// State Stories
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Icon Stories
export const WithIconLeft: Story = {
  args: {
    children: 'Continue',
    icon: ChevronRight,
    iconPosition: 'left',
  },
};

export const WithIconRight: Story = {
  args: {
    children: 'Go Back',
    icon: ArrowLeft,
    iconPosition: 'right',
    variant: 'secondary',
  },
};

// Assessment Flow Stories
export const StartAssessment: Story = {
  args: {
    children: 'Begin Your Journey',
    variant: 'cta',
    size: 'large',
    icon: Heart,
    iconPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Main CTA button for starting the assessment',
      },
    },
  },
};

export const NextQuestion: Story = {
  args: {
    children: 'Next Question',
    variant: 'primary',
    icon: ChevronRight,
    iconPosition: 'right',
  },
};

export const PreviousQuestion: Story = {
  args: {
    children: 'Previous',
    variant: 'secondary',
    icon: ArrowLeft,
    iconPosition: 'left',
  },
};

// Interactive Stories
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="cta">Call to Action</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants side by side',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};
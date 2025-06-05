// src/components/ui/Avatar/Avatar.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { fn } from 'storybook/test';

import { Avatar, AvatarGroup, AssessmentAvatar } from './Avatar';

// Sample archetype data
const sampleArchetypes = {
  heartfelt: {
    id: 'heartfelt',
    name: 'The Heartfelt Companion',
    icon: '💝',
    gradient: 'linear-gradient(135deg, #87ceeb 0%, #98d8e8 100%)',
  },
  strategic: {
    id: 'strategic',
    name: 'The Strategic Navigator',
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  spontaneous: {
    id: 'spontaneous',
    name: 'The Spontaneous Explorer',
    icon: '🌟',
    gradient: 'linear-gradient(135deg, #ffb347 0%, #ffd700 100%)',
  },
};

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Avatar component provides flexible user representation with support for images, initials, status indicators, and assessment-specific styling. It includes comprehensive accessibility features and multiple variants for different use cases.

## Features
- **Multiple Sources**: Images, initials, icons, or archetype emojis
- **Size Variants**: Small (32px) to XLarge (96px) with responsive scaling
- **Shape Options**: Circle, rounded, or square shapes
- **Color Schemes**: Primary, secondary, success, warning, neutral, and archetype-specific
- **Interactive**: Editable avatars with file upload, clickable profiles
- **Status Indicators**: Online, offline, away, busy states
- **Badges**: Numeric or text badges with multiple variants
- **Loading States**: Spinner animations during uploads or processing

## Assessment Integration
- **AssessmentAvatar**: Specialized component for assessment results
- **Archetype Colors**: Custom gradients matching relationship archetypes
- **Progress Badges**: Show completion percentage or assessment scores
- **Group Support**: Display multiple users with overlapping layout

## Accessibility
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support for interactive avatars
- **Focus Management**: Clear focus indicators and states
- **Alt Text**: Comprehensive image alt text generation
- **High Contrast**: Support for high contrast accessibility modes

## Use Cases
- **User Profiles**: Standard user representation across the app
- **Assessment Results**: Display user's archetype and scores
- **Group Display**: Show multiple participants or partners
- **Upload Interface**: Allow users to change their profile pictures
- **Status Display**: Show online/offline states in real-time features
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'xlarge'],
      description: 'Size of the avatar',
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'rounded', 'square'],
      description: 'Shape of the avatar',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'neutral', 'archetype'],
      description: 'Color scheme for fallback display',
    },
    status: {
      control: { type: 'select' },
      options: [null, 'online', 'offline', 'away', 'busy'],
      description: 'Online status indicator',
    },
    badgeVariant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Badge color variant',
    },
    editable: {
      control: { type: 'boolean' },
      description: 'Whether avatar can be edited/uploaded',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Whether avatar is clickable',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state for uploads or processing',
    },
    showHover: {
      control: { type: 'boolean' },
      description: 'Whether to show hover effects',
    },
    isCurrentUser: {
      control: { type: 'boolean' },
      description: 'Whether this represents the current user',
    },
  },
  args: {
    name: 'Sarah Johnson',
    onAvatarChange: fn(),
    onClick: fn(),
    size: 'large',
    shape: 'circle',
    color: 'neutral',
    editable: false,
    clickable: false,
    isLoading: false,
    showHover: true,
    isCurrentUser: false,
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default avatar with user initials and neutral styling.',
      },
    },
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face',
    alt: 'Profile picture of Sarah Johnson',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar with a profile image loaded from URL.',
      },
    },
  },
};

export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar {...args} size="small" />
      <Avatar {...args} size="medium" />
      <Avatar {...args} size="large" />
      <Avatar {...args} size="xlarge" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available avatar sizes from small to xlarge.',
      },
    },
  },
};

export const Shapes: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    size: 'large',
  },
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="rounded" />
      <Avatar {...args} shape="square" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different avatar shapes: circle, rounded, and square.',
      },
    },
  },
};

export const Colors: Story = {
  args: {
    name: 'User Name',
    size: 'large',
  },
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar {...args} color="primary" />
      <Avatar {...args} color="secondary" />
      <Avatar {...args} color="success" />
      <Avatar {...args} color="warning" />
      <Avatar {...args} color="neutral" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color schemes for avatar fallback backgrounds.',
      },
    },
  },
};

export const WithStatus: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face',
    size: 'large',
  },
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} status="online" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Online</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} status="away" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Away</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} status="busy" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Busy</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar {...args} status="offline" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Offline</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar with different status indicators for online presence.',
      },
    },
  },
};

export const WithBadges: Story = {
  args: {
    name: 'Sarah Johnson',
    size: 'large',
  },
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <Avatar {...args} badge="5" badgeVariant="primary" />
      <Avatar {...args} badge="99+" badgeVariant="error" />
      <Avatar {...args} badge="New" badgeVariant="success" />
      <Avatar {...args} badge="92%" badgeVariant="warning" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with different badge types and variants.',
      },
    },
  },
};

export const Editable: Story = {
  args: {
    editable: true,
    tooltip: 'Click to change your profile picture',
  },
  parameters: {
    docs: {
      description: {
        story: 'Editable avatar with upload functionality (hover to see overlay).',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    editable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar in loading state during upload or processing.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face',
    clickable: true,
    tooltip: 'Click to view profile',
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Clickable avatar with hover effects and tooltip.',
      },
    },
  },
};

export const CurrentUser: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face',
    isCurrentUser: true,
    size: 'large',
    badge: 'You',
    badgeVariant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar representing the current user with special styling.',
      },
    },
  },
};

export const ArchetypeAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar
          name="Sarah"
          color="archetype"
          archetypeGradient={sampleArchetypes.heartfelt.gradient}
          archetypeEmoji={sampleArchetypes.heartfelt.icon}
          size="xlarge"
          badge="92%"
          badgeVariant="success"
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Heartfelt</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar
          name="Michael"
          color="archetype"
          archetypeGradient={sampleArchetypes.strategic.gradient}
          archetypeEmoji={sampleArchetypes.strategic.icon}
          size="xlarge"
          badge="78%"
          badgeVariant="warning"
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Strategic</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar
          name="Alex"
          color="archetype"
          archetypeGradient={sampleArchetypes.spontaneous.gradient}
          archetypeEmoji={sampleArchetypes.spontaneous.icon}
          size="xlarge"
          badge="65%"
          badgeVariant="secondary"
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Spontaneous</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Archetype-specific avatars with custom gradients and emojis representing assessment results.',
      },
    },
  },
};

export const AvatarGroupExample: Story = {
  render: () => {
    const groupAvatars = [
      {
        id: '1',
        name: 'Sarah Johnson',
        src: 'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: '2',
        name: 'Michael Chen',
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: '3',
        name: 'Emma Davis',
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
      { id: '4', name: 'James Wilson', color: 'primary' as const },
      { id: '5', name: 'Lisa Rodriguez', color: 'secondary' as const },
      { id: '6', name: 'David Kim', color: 'success' as const },
      { id: '7', name: 'Anna Thompson', color: 'warning' as const },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Default Group (max 5)</h4>
          <AvatarGroup avatars={groupAvatars} />
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Large Size, Max 3</h4>
          <AvatarGroup avatars={groupAvatars} max={3} size="large" />
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Tight Spacing</h4>
          <AvatarGroup avatars={groupAvatars} spacing="tight" max={4} />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar groups showing multiple users with overlapping layout and excess count.',
      },
    },
  },
};

export const AssessmentAvatarExample: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <AssessmentAvatar
          name="Sarah Johnson"
          src="https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face"
          archetype={sampleArchetypes.heartfelt}
          score={11}
          maxScore={12}
          size="xlarge"
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Completed Assessment</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <AssessmentAvatar
          name="Michael Chen"
          archetype={sampleArchetypes.strategic}
          completionPercentage={65}
          size="xlarge"
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>In Progress (65%)</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <AssessmentAvatar
          name="Emma Davis"
          archetype={sampleArchetypes.spontaneous}
          completionPercentage={100}
          size="xlarge"
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Assessment Complete</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Assessment-specific avatars showing progress and archetype results.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face',
    size: 'large',
    status: 'online',
    badge: '5',
    editable: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized avatar with responsive sizing and touch-friendly interactions.',
      },
    },
  },
};

export const ErrorFallback: Story = {
  args: {
    src: 'https://invalid-url-that-will-fail.jpg',
    name: 'Fallback User',
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar with broken image URL showing fallback to initials.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '2rem',
        textAlign: 'center',
      }}
    >
      <div>
        <Avatar name="Default" size="large" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Default</p>
      </div>

      <div>
        <Avatar
          name="With Image"
          src="https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=150&h=150&fit=crop&crop=face"
          size="large"
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>With Image</p>
      </div>

      <div>
        <Avatar name="Loading" size="large" isLoading={true} />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Loading</p>
      </div>

      <div>
        <Avatar name="Editable" size="large" editable={true} />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Editable</p>
      </div>

      <div>
        <Avatar name="With Status" size="large" status="online" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>With Status</p>
      </div>

      <div>
        <Avatar name="With Badge" size="large" badge="99+" badgeVariant="error" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>With Badge</p>
      </div>

      <div>
        <Avatar
          name="Archetype"
          size="large"
          color="archetype"
          archetypeGradient={sampleArchetypes.heartfelt.gradient}
          archetypeEmoji={sampleArchetypes.heartfelt.icon}
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Archetype</p>
      </div>

      <div>
        <Avatar name="Current User" size="large" isCurrentUser={true} />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Current User</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive overview of all avatar states and variants.',
      },
    },
  },
};

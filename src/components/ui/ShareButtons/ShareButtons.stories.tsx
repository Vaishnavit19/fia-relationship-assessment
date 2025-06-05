// src/components/ui/ShareButtons/ShareButtons.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { fn } from 'storybook/test';

import { ShareButtons, useShareData } from './ShareButtons';

// Sample share data for stories
const sampleShareData = {
  title: 'FIA Relationship Assessment Results',
  text: 'I just discovered my relationship style through travel scenarios! Find out yours too.',
  url: 'https://fia-relationship-assessment.com/results/abc123',
  hashtags: ['RelationshipAssessment', 'FIA', 'TravelScenarios'],
  via: 'FIAAssessment',
};

// const sampleResultData = {
//   archetype: 'heartfelt',
//   archetypeName: 'The Heartfelt Companion',
//   scores: {
//     emotional: 11,
//     logical: 7,
//     exploratory: 4,
//   },
//   totalScore: 11,
//   maxScore: 12,
// };

const meta = {
  title: 'UI/ShareButtons',
  component: ShareButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The ShareButtons component provides comprehensive social sharing functionality for the relationship assessment results. It supports multiple platforms, native device sharing, and includes accessibility features and responsive design.

## Features
- **Multiple Platforms**: Facebook, Twitter, WhatsApp, Email, LinkedIn, and more
- **Native Sharing**: Device-native share API when available
- **Copy Link**: One-click link copying with visual feedback
- **Download**: Optional download functionality for results
- **Responsive**: Adapts layouts for mobile and desktop
- **Accessible**: Full keyboard navigation and screen reader support

## Layout Variants
- **Horizontal**: Traditional row layout with platforms side-by-side
- **Vertical**: Stacked layout for sidebar or narrow spaces
- **Grid**: Card-based grid layout for emphasis
- **Compact**: Icon-only buttons for minimal space usage

## Style Options
- **Default**: Standard button styling with brand colors
- **Minimal**: Clean, minimal styling with subtle borders
- **Card**: Wrapped in a card container for emphasis
- **Floating**: Fixed position overlay for persistent access

## Assessment Integration
Specifically designed for sharing assessment results with:
- Pre-built messages including archetype and scores
- Assessment-specific hashtags and mentions
- Customizable sharing text with user personalization
- Support for both anonymous and named sharing

## Platform Support
- **Facebook**: Post with quote and link
- **Twitter**: Tweet with hashtags and via attribution
- **WhatsApp**: Direct message with formatted text
- **Email**: Pre-filled subject and body
- **LinkedIn**: Professional sharing with summary
- **And more**: Telegram, Reddit, Pinterest support
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'grid', 'compact'],
      description: 'Layout arrangement of share buttons',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the share buttons',
    },
    showLabels: {
      control: { type: 'boolean' },
      description: 'Show text labels on buttons',
    },
    platforms: {
      control: { type: 'check' },
      options: [
        'facebook',
        'twitter',
        'whatsapp',
        'email',
        'linkedin',
        'telegram',
        'reddit',
        'pinterest',
      ],
      description: 'Which platforms to include',
    },
  },
  args: {
    shareData: sampleShareData,
    onDownload: fn(),
    variant: 'default',
    size: 'medium',
    showLabels: true,
    platforms: ['facebook', 'twitter', 'whatsapp', 'email'],
  },
} satisfies Meta<typeof ShareButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default share buttons with horizontal layout and standard platforms.',
      },
    },
  },
};

export const AllPlatforms: Story = {
  args: {
    platforms: ['facebook', 'twitter', 'whatsapp', 'email', 'linkedin'],
    variant: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: 'All supported platforms displayed in a grid layout.',
      },
    },
  },
};

export const Vertical: Story = {
  args: {
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical layout with card styling, perfect for sidebars.',
      },
    },
  },
};

export const Grid: Story = {
  args: {
    variant: 'default',
    size: 'large',
    platforms: ['facebook', 'twitter', 'whatsapp', 'email', 'linkedin'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid layout with larger buttons, ideal for emphasis and clear call-to-action.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    showLabels: false,
    platforms: ['facebook', 'twitter', 'whatsapp', 'email', 'linkedin'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact layout with icon-only buttons for minimal space usage.',
      },
    },
  },
};

export const Minimal: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Minimal styling with subtle borders and clean appearance.',
      },
    },
  },
};

export const WithDownload: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Share buttons with download functionality and custom sharing message.',
      },
    },
  },
};

export const FloatingStyle: Story = {
  args: {
    variant: 'compact',
    showLabels: false,
    platforms: ['facebook', 'twitter', 'whatsapp', 'email'],
  },
  render: args => (
    <div
      style={{
        height: '400px',
        position: 'relative',
        background: 'linear-gradient(135deg, #e8e5ff 0%, #f4f2ff 50%, #faf9ff 100%)',
        borderRadius: '12px',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#2d3748',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Your Assessment Results</h3>
        <p style={{ margin: '0', color: '#718096' }}>
          Scroll down to see the floating share buttons
        </p>
      </div>
      <ShareButtons {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Floating share buttons positioned fixed on the page for persistent access.',
      },
    },
  },
};

// export const AssessmentSpecific: Story = {
//   render: () => (
//     <AssessmentShare
//       resultData={sampleResultData}
//       assessmentUrl="https://fia-relationship-assessment.com/assessment"
//       userName="Sarah"
//       shareButtonProps={{
//         variant: 'grid',
//         style: 'card',
//         showDownload: true,
//         onShareSuccess: fn(),
//         onDownload: fn(),
//       }}
//     />
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story:
//           'Assessment-specific share component with pre-built messaging and result integration.',
//       },
//     },
//   },
// };

// export const CustomMessage: Story = {
//   args: {
//     customMessage:
//       "🎯 Just completed the FIA Relationship Assessment! I'm The Heartfelt Companion with 92% emotional connection. What's your relationship style?",
//     messagePrefix: '✨ Amazing results!',
//     platforms: ['facebook', 'twitter', 'whatsapp', 'email'],
//     variant: 'floating',
//     style: 'card',
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: 'Custom sharing message with prefix and personalized content.',
//       },
//     },
//   },
// };

export const MobileOptimized: Story = {
  args: {
    variant: 'floating',
    size: 'large',
    platforms: ['facebook', 'twitter', 'whatsapp', 'email'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view with touch-friendly button sizes and responsive layout.',
      },
    },
  },
};

// export const WithShareHook: Story = {
//   render: () => {
//     const share = useShareData();

//     return (
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
//         <div style={{ textAlign: 'center' }}>
//           {share.isSharing && <p>Sharing in progress...</p>}
//           {/* {share.lastSharedPlatform && <p style={{ color: '#87ceeb' }}>Successfully shared! ✓</p>} */}
//         </div>

//         <ShareButtons
//           shareData={sampleShareData}
//           platforms={['facebook', 'twitter', 'whatsapp', 'email']}
//           style="card"
//         />
//       </div>
//     );
//   },
//   parameters: {
//     docs: {
//       description: {
//         story: 'Using the useShare hook for advanced share state management and feedback.',
//       },
//     },
//   },
// };

export const InteractionStates: Story = {
  args: {
    platforms: ['facebook', 'twitter', 'whatsapp', 'email'],
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Default State</h4>
        <ShareButtons {...args} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>With All Options</h4>
        <ShareButtons {...args} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Minimal Style</h4>
        <ShareButtons {...args} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different interaction states and styling combinations.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  args: {
    platforms: ['facebook', 'twitter', 'whatsapp', 'email'],
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Accessibility-focused example with proper ARIA labels and keyboard navigation.',
      },
    },
  },
};

export const ResultsPageExample: Story = {
  render: () => (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        background: 'linear-gradient(135deg, #e8e5ff 0%, #f4f2ff 50%, #faf9ff 100%)',
        borderRadius: '24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💝</div>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>The Heartfelt Companion</h2>
        <p style={{ margin: '0 0 1rem 0', color: '#718096' }}>Your relationship archetype</p>
        <div
          style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            display: 'inline-block',
            marginBottom: '2rem',
          }}
        >
          <strong style={{ color: '#87ceeb', fontSize: '1.5rem' }}>92% Match</strong>
        </div>
      </div>

      {/* <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Share Your Results</h3>
        <AssessmentShare
          resultData={sampleResultData}
          assessmentUrl="https://fia-relationship-assessment.com/assessment"
          userName="Sarah"
          shareButtonProps={{
            variant: 'grid',
            style: 'default',
            showDownload: true,
          }}
        />
      </div> */}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete results page example showing how share buttons integrate with assessment results.',
      },
    },
  },
};

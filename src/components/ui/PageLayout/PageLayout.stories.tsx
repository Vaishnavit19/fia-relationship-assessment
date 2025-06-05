// src/components/ui/PageLayout/PageLayout.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';

import { PageLayout } from './PageLayout';

// Sample content for demonstration
const SampleContent = ({ title = "Page Content", description = "This is sample content to demonstrate the page layout." }: { title?: string; description?: string }) => (
  <div style={{ 
    padding: '2rem',
    textAlign: 'center',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    margin: '1rem 0'
  }}>
    <h1 style={{ color: '#2d3748', marginBottom: '1rem' }}>{title}</h1>
    <p style={{ color: '#718096', lineHeight: 1.6 }}>{description}</p>
  </div>
);

const LongContent = () => (
  <div style={{ padding: '2rem 0' }}>
    <SampleContent title="Main Section" description="This is the main content area that demonstrates scrolling behavior." />
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} style={{ 
        padding: '1.5rem',
        margin: '1rem 0',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ color: '#2d3748', margin: '0 0 0.5rem 0' }}>Content Section {i + 1}</h3>
        <p style={{ color: '#718096', margin: 0 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    ))}
  </div>
);

const meta = {
  title: 'UI/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The PageLayout component provides a complete page structure combining Header, Footer, and main content area. It's designed to be the foundational layout for all pages in the assessment application.

## Features
- **Complete Page Structure**: Header + Main Content + Footer in one component
- **Flexible Configuration**: Customize header, footer, and content area independently
- **Responsive Design**: Adapts seamlessly across all screen sizes
- **Multiple Layouts**: Support for different page types (standard, assessment, results)
- **Accessibility**: Proper semantic structure and keyboard navigation
- **Content Constraints**: Various max-width options for optimal reading

## Usage Context
- Used as the base layout for all application pages
- Provides consistent structure and spacing
- Handles fixed header positioning and scroll behavior
- Integrates with assessment state for context-aware headers

## Layout Options
- **Standard**: Full header and footer for general pages
- **Assessment**: Optimized for assessment flow with progress
- **Minimal**: Reduced footer for distraction-free experiences
- **Centered**: For landing pages and focused content
        `,
      },
    },
  },
  argTypes: {
    fixedHeader: {
      control: { type: 'boolean' },
      description: 'Whether to use a fixed header that stays at top during scroll',
    },
    minimalFooter: {
      control: { type: 'boolean' },
      description: 'Whether to show minimal footer with reduced content',
    },
    maxWidth: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Maximum width constraint for content area',
    },
    padded: {
      control: { type: 'boolean' },
      description: 'Whether to add padding to the main content area',
    },
    centered: {
      control: { type: 'boolean' },
      description: 'Whether to center the content vertically and horizontally',
    },
    background: {
      control: { type: 'select' },
      options: ['default', 'light', 'gradient'],
      description: 'Background style for the layout',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    fixedHeader: false,
    minimalFooter: false,
    maxWidth: 'xl',
    padded: true,
    centered: false,
    background: 'default',
    className: '',
  },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <SampleContent title="Default Page Layout" description="This is the standard page layout with header, main content, and footer." />,
  },
  parameters: {
    docs: {
      description: {
        story: 'The default page layout with standard header and footer. Most pages will use this configuration.',
      },
    },
  },
};

export const FixedHeader: Story = {
  args: {
    fixedHeader: true,
    children: <LongContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Page layout with fixed header that stays at the top during scroll. Useful for long content pages.',
      },
    },
  },
};

export const AssessmentLayout: Story = {
  args: {
    fixedHeader: true,
    minimalFooter: true,
    maxWidth: 'lg',
    headerProps: {
      showProgress: true,
      showBackButton: true,
      progressOverride: 45,
      isStartedOverride: true,
    },
    children: (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: '#2d3748', marginBottom: '2rem' }}>Assessment Question</h1>
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(139, 124, 255, 0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>How do you prefer to plan your trips?</h2>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>Choose the option that best describes your approach to travel planning.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Plan everything in advance', 'Mix of planning and spontaneity', 'Go with the flow'].map((option, i) => (
              <button key={i} style={{
                padding: '1rem 1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                background: 'white',
                color: '#2d3748',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Optimized layout for assessment pages with fixed header showing progress, minimal footer, and focused content area.',
      },
    },
  },
};

export const CenteredLayout: Story = {
  args: {
    centered: true,
    maxWidth: 'md',
    children: (
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#2d3748', marginBottom: '1rem', fontSize: '2.5rem' }}>Welcome</h1>
        <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '1.2rem' }}>
          Discover your relationship style through travel scenarios
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 6px 25px rgba(255, 107, 157, 0.3)'
        }}>
          Start Assessment
        </button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Centered layout perfect for landing pages, welcome screens, or focused call-to-action content.',
      },
    },
  },
};

export const MinimalFooter: Story = {
  args: {
    minimalFooter: true,
    children: <SampleContent title="Minimal Footer Layout" description="This layout uses a minimal footer with just copyright and essential information." />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Layout with minimal footer showing only copyright and essential badges. Reduces distractions during focused tasks.',
      },
    },
  },
};

export const MaxWidthVariants: Story = {
  args: {
    children: <SampleContent title="Content Width Demo" description="This demonstrates different content width constraints." />,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', textAlign: 'center' }}>Small Width (640px)</h3>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <PageLayout {...args} maxWidth="sm">
            <SampleContent title="Small Width" description="Ideal for simple forms or focused reading content." />
          </PageLayout>
        </div>
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', textAlign: 'center' }}>Large Width (1024px)</h3>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <PageLayout {...args} maxWidth="lg">
            <SampleContent title="Large Width" description="Great for dashboards or content with multiple columns." />
          </PageLayout>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different content width constraints for various page types and reading experiences.',
      },
    },
  },
};

export const BackgroundVariants: Story = {
  args: {
    children: <SampleContent title="Background Variants" description="Different background styles for various page contexts." />,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', textAlign: 'center' }}>Default Background</h3>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', height: '300px' }}>
          <PageLayout {...args} background="default">
            <SampleContent title="Default" description="Standard gradient background" />
          </PageLayout>
        </div>
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', textAlign: 'center' }}>Light Background</h3>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', height: '300px' }}>
          <PageLayout {...args} background="light">
            <SampleContent title="Light" description="Clean light background for minimal designs" />
          </PageLayout>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different background options to match various page contexts and design needs.',
      },
    },
  },
};
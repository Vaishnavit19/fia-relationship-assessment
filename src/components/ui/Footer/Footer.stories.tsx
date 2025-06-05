// src/components/ui/Footer/Footer.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Footer } from './Footer';

const meta = {
  title: 'UI/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Footer component provides site-wide navigation, contact information, and legal links for the assessment application. It complements the Header and completes the page layout structure.

## Features
- **Comprehensive Navigation**: Links to all major sections and support pages
- **Contact Information**: Direct access to support and contact methods
- **Legal Compliance**: Privacy policy and terms of service links
- **Responsive Design**: Adapts from desktop grid to mobile stack
- **Accessibility**: Full keyboard navigation and screen reader support
- **Flexible Layout**: Can be minimal or full-featured

## Usage Context
- Used on all pages as the primary footer
- Provides secondary navigation and site information
- Maintains consistent branding and contact access
- Complements the Header component for complete page layout
        `,
      },
    },
  },
  argTypes: {
    minimal: {
      control: { type: 'boolean' },
      description: 'Show minimal footer with fewer links and content',
    },
    hideBranding: {
      control: { type: 'boolean' },
      description: 'Hide the assessment branding section',
    },
    copyrightText: {
      control: { type: 'text' },
      description: 'Custom copyright text to override default',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    minimal: false,
    hideBranding: false,
    className: '',
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default footer with full navigation, branding, and contact information.',
      },
    },
  },
};

export const Minimal: Story = {
  args: {
    minimal: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal footer showing only copyright and essential badges. Useful for assessment pages where you want less distraction.',
      },
    },
  },
};

export const WithoutBranding: Story = {
  args: {
    hideBranding: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer without the branding section, focusing only on navigation links and legal information.',
      },
    },
  },
};

export const CustomCopyright: Story = {
  args: {
    copyrightText: '© 2024 Your Company Name. All rights reserved.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with custom copyright text for different branding needs.',
      },
    },
  },
};

export const MinimalWithCustomCopyright: Story = {
  args: {
    minimal: true,
    copyrightText: '© 2024 Custom Assessment Platform',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal footer with custom copyright text - perfect for embedded or white-label scenarios.',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  args: {},
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Desktop View</h3>
        <div style={{ 
          width: '1200px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Footer {...args} />
        </div>
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Tablet View</h3>
        <div style={{ 
          width: '768px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Footer {...args} />
        </div>
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Mobile View</h3>
        <div style={{ 
          width: '375px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Footer {...args} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive behavior across different screen sizes. Note how the layout adapts from grid to stacked columns on smaller screens.',
      },
    },
  },
};

export const AllVariants: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Default Footer</h3>
        <div style={{ 
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Footer />
        </div>
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Without Branding</h3>
        <div style={{ 
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Footer hideBranding={true} />
        </div>
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Minimal Footer</h3>
        <div style={{ 
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Footer minimal={true} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All footer variants displayed together for comparison. Shows the flexibility of the component for different use cases.',
      },
    },
  },
};
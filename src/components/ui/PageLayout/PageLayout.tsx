// src/components/ui/PageLayout/PageLayout.tsx
'use client';

import React from 'react';

import { Footer, FooterProps } from '../Footer';
import { Header, HeaderProps } from '../Header';

import styles from './PageLayout.module.scss';

export interface PageLayoutProps {
  /** Main content to render */
  children: React.ReactNode;
  /** Additional CSS classes for the layout container */
  className?: string;
  /** Header configuration props */
  headerProps?: Partial<HeaderProps>;
  /** Footer configuration props */
  footerProps?: Partial<FooterProps>;
  /** Whether to use a fixed header */
  fixedHeader?: boolean;
  /** Whether to show minimal footer */
  minimalFooter?: boolean;
  /** Maximum width constraint for content */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to add padding to the main content */
  padded?: boolean;
  /** Whether to center the content vertically */
  centered?: boolean;
  /** Custom background for the main content area */
  background?: 'default' | 'light' | 'gradient';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  headerProps = {},
  footerProps = {},
  fixedHeader = false,
  minimalFooter = false,
  maxWidth = 'xl',
  padded = true,
  centered = false,
  background = 'default',
}) => {
  const layoutClasses = [
    styles.layout,
    fixedHeader && styles.layoutFixedHeader,
    centered && styles.layoutCentered,
    background !== 'default' && styles[`background${background.charAt(0).toUpperCase() + background.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mainClasses = [
    styles.main,
    padded && styles.mainPadded,
    centered && styles.mainCentered,
    styles[`maxWidth${maxWidth.charAt(0).toUpperCase() + maxWidth.slice(1)}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={layoutClasses}>
      <Header 
        {...headerProps}
        fixed={fixedHeader}
      />
      
      <main className={mainClasses}>
        {children}
      </main>
      
      <Footer 
        {...footerProps}
        minimal={minimalFooter}
      />
    </div>
  );
};

// Default export for easier importing
export default PageLayout;
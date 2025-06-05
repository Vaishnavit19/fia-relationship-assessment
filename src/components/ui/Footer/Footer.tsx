// src/components/ui/Footer/Footer.tsx
'use client';

import { Heart, Mail, ExternalLink, Shield, FileText } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import styles from './Footer.module.scss';

export interface FooterProps {
  /** Additional CSS classes */
  className?: string;
  /** Show minimal footer (fewer links) */
  minimal?: boolean;
  /** Hide the assessment branding */
  hideBranding?: boolean;
  /** Custom copyright text */
  copyrightText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  minimal = false,
  hideBranding = false,
  copyrightText,
}) => {
  const currentYear = new Date().getFullYear();
  
  const footerClasses = [
    styles.footer,
    minimal && styles.footerMinimal,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <footer className={footerClasses}>
      <div className={styles.container}>
        {!minimal && (
          <>
            {/* Main Footer Content */}
            <div className={styles.mainContent}>
              {/* Branding Section */}
              {!hideBranding && (
                <div className={styles.brandSection}>
                  <div className={styles.logo}>
                    <Heart size={24} className={styles.logoIcon} />
                    <span className={styles.logoText}>FIA Assessment</span>
                  </div>
                  <p className={styles.tagline}>
                    Understanding relationships through travel scenarios
                  </p>
                  <div className={styles.contact}>
                    <Mail size={16} />
                    <span>support@fia-relationship-assessment.com</span>
                  </div>
                </div>
              )}

              {/* Links Section */}
              <div className={styles.linksSection}>
                <div className={styles.linkGroup}>
                  <h3 className={styles.linkGroupTitle}>Assessment</h3>
                  <ul className={styles.linkList}>
                    <li>
                      <Link href="/" className={styles.link}>
                        Take Assessment
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className={styles.link}>
                        How It Works
                      </Link>
                    </li>
                    <li>
                      <Link href="/archetypes" className={styles.link}>
                        Relationship Types
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className={styles.linkGroup}>
                  <h3 className={styles.linkGroupTitle}>Support</h3>
                  <ul className={styles.linkList}>
                    <li>
                      <Link href="/faq" className={styles.link}>
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className={styles.link}>
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="mailto:support@fia-relationship-assessment.com"
                        className={styles.link}
                      >
                        Email Support
                        <ExternalLink size={14} />
                      </a>
                    </li>
                  </ul>
                </div>

                <div className={styles.linkGroup}>
                  <h3 className={styles.linkGroupTitle}>Legal</h3>
                  <ul className={styles.linkList}>
                    <li>
                      <Link href="/privacy" className={styles.link}>
                        <Shield size={14} />
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className={styles.link}>
                        <FileText size={14} />
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={styles.divider} />
          </>
        )}

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            <span>
              {copyrightText ?? `© ${currentYear} FIA. All rights reserved.`}
            </span>
          </div>
          
          {!minimal && (
            <div className={styles.badges}>
              <span className={styles.badge}>
                <Shield size={14} />
                Secure & Private
              </span>
              <span className={styles.badge}>
                <Heart size={14} />
                Made with Care
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

// Default export for easier importing
export default Footer;
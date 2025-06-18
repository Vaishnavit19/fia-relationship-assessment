// src/components/pages/PrivacyPolicy/PrivacyPolicy.tsx
'use client';

import { Shield, Mail, Calendar, Users, Lock, Eye, Download, Globe } from 'lucide-react';
import React from 'react';

import styles from './PrivacyPolicy.module.scss';

export interface PrivacyPolicyProps {
  /** Additional CSS class */
  className?: string;
  /** Show last updated date */
  showLastUpdated?: boolean;
  /** Enable print-friendly version */
  printFriendly?: boolean;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  className = '',
  showLastUpdated = true,
  printFriendly = false,
}) => {
  const containerClasses = [styles.privacyPolicy, printFriendly && styles.printFriendly, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Shield size={32} />
          </div>
          <h1 className={styles.title}>Privacy Policy</h1>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Introduction */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Users size={20} />
              Introduction
            </h2>
            <p className={styles.paragraph}>
              Welcome to FIA Relationship Assessment. We respect your privacy and are committed to
              protecting your personal information. This Privacy Policy explains how we collect,
              use, and safeguard your information when you use our relationship assessment service.
            </p>
          </section>

          {/* Information We Collect */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Eye size={20} />
              Information We Collect
            </h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Information You Provide</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Name</strong>: Required to personalize your assessment experience
                </li>
                <li>
                  <strong>Email Address</strong>: Optional, used only if you choose to receive your
                  results or occasional updates
                </li>
                <li>
                  <strong>Assessment Responses</strong>: Your answers to travel scenarios and
                  relationship questions
                </li>
                <li>
                  <strong>Consent Preferences</strong>: Your choices regarding privacy and
                  communication preferences
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Automatically Collected Information</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Usage Data</strong>: How you interact with our assessment (time spent,
                  pages viewed)
                </li>
                <li>
                  <strong>Device Information</strong>: Browser type, device type, and general
                  location (country/region)
                </li>
                <li>
                  <strong>Technical Data</strong>: IP address, cookies, and similar tracking
                  technologies
                </li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Lock size={20} />
              How We Use Your Information
            </h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Primary Uses</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Assessment Delivery</strong>: To provide your personalized relationship
                  archetype results
                </li>
                <li>
                  <strong>Service Improvement</strong>: To enhance our assessment questions and user
                  experience
                </li>
                <li>
                  <strong>Communication</strong>: To send your results and respond to support
                  requests (only if you provided an email)
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Optional Uses (With Your Consent)</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Educational Content</strong>: Occasional relationship insights and tips
                </li>
                <li>
                  <strong>Service Updates</strong>: Notifications about new features or assessments
                </li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Globe size={20} />
              Data Sharing and Disclosure
            </h2>
            <p className={styles.paragraph}>
              We <strong>do not sell, rent, or trade</strong> your personal information to third
              parties. We may share information only in these limited circumstances:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>With Your Consent</strong>: When you explicitly agree to share your results
              </li>
              <li>
                <strong>Service Providers</strong>: Trusted partners who help us operate our service
                (hosting, analytics)
              </li>
              <li>
                <strong>Legal Requirements</strong>: When required by law or to protect our rights
                and users&apos; safety
              </li>
              <li>
                <strong>Business Transfers</strong>: In the event of a merger or acquisition (with
                the same privacy protections)
              </li>
            </ul>
          </section>

          {/* Assessment Results */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Assessment Results</h2>
            <ul className={styles.list}>
              <li>
                <strong>Confidentiality</strong>: Your individual results are private and
                confidential
              </li>
              <li>
                <strong>Sharing Control</strong>: You control whether and how to share your results
              </li>
              <li>
                <strong>No Professional Advice</strong>: Our assessments are for entertainment and
                self-reflection, not professional relationship counseling
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Security</h2>
            <p className={styles.paragraph}>
              We implement appropriate security measures to protect your information:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Encryption</strong>: Data is encrypted in transit and at rest
              </li>
              <li>
                <strong>Access Controls</strong>: Limited access to personal information on a
                need-to-know basis
              </li>
              <li>
                <strong>Regular Audits</strong>: Ongoing security assessments to identify and
                address vulnerabilities
              </li>
              <li>
                <strong>Secure Hosting</strong>: Industry-standard secure hosting infrastructure
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Rights and Choices</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Data Rights</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Access</strong>: Request a copy of your personal information
                </li>
                <li>
                  <strong>Correction</strong>: Update or correct your information
                </li>
                <li>
                  <strong>Deletion</strong>: Request removal of your personal information
                </li>
                <li>
                  <strong>Portability</strong>: Receive your data in a portable format
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Communication Preferences</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Opt-Out</strong>: Unsubscribe from emails at any time
                </li>
                <li>
                  <strong>Contact Preferences</strong>: Choose how and when we communicate with you
                </li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Retention</h2>
            <ul className={styles.list}>
              <li>
                <strong>Assessment Data</strong>: Retained for service delivery and improvement
              </li>
              <li>
                <strong>Personal Information</strong>: Deleted upon request or after extended
                inactivity
              </li>
              <li>
                <strong>Anonymous Data</strong>: May be retained indefinitely for research and
                improvement
              </li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Children&apos;s Privacy</h2>
            <p className={styles.paragraph}>
              Our service is intended for adults aged 18 and older. We do not knowingly collect
              information from individuals under 18. If we discover we have inadvertently collected
              such information, we will delete it promptly.
            </p>
          </section>

          {/* International Users */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>International Users</h2>
            <p className={styles.paragraph}>
              Our service is operated from the United States. By using our service, international
              users consent to the transfer and processing of their information in the United
              States.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
            <p className={styles.paragraph}>
              We may update this Privacy Policy periodically. We will notify users of significant
              changes by:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Website Notice</strong>: Prominent notice on our homepage
              </li>
              <li>
                <strong>Email Notification</strong>: Direct communication to users who provided
                email addresses
              </li>
              <li>
                <strong>Updated Date</strong>: Revision of the &quot;Last Updated&quot; date at the
                top of this policy
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Mail size={20} />
              Contact Information
            </h2>
            <p className={styles.paragraph}>
              For questions about this Privacy Policy or your personal information:
            </p>
            <div className={styles.contact}>
              <p>
                <strong>Email</strong>: support@fia-relationship-assessment.com
              </p>
              <p>
                <strong>Subject Line</strong>: Privacy Policy Inquiry
              </p>
            </div>
            <p className={styles.paragraph}>
              We will respond to privacy-related inquiries within 5 business days.
            </p>
          </section>

          {/* Additional Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Additional Information</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Third-Party Links</h3>
              <p className={styles.paragraph}>
                Our service may contain links to other websites. This Privacy Policy applies only to
                our service. We encourage you to read the privacy policies of any third-party sites
                you visit.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Analytics</h3>
              <p className={styles.paragraph}>
                We use analytics tools to understand how our service is used. These tools may
                collect information about your usage patterns, but we only access aggregated,
                anonymous data.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Accuracy</h3>
              <p className={styles.paragraph}>
                We strive to keep your information accurate and up-to-date. Please contact us if you
                need to update your information or if you notice any inaccuracies.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            This Privacy Policy is designed to be transparent and comprehensive. If you have any
            questions or concerns, please don&apos;t hesitate to contact us.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

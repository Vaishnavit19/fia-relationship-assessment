// src/components/pages/TermsOfService/TermsOfService.tsx
'use client';

import {
  FileText,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Scale,
  Mail,
  Gavel,
} from 'lucide-react';
import React from 'react';

import styles from './TermsOfService.module.scss';

export interface TermsOfServiceProps {
  /** Additional CSS class */
  className?: string;
  /** Show last updated date */
  showLastUpdated?: boolean;
  /** Enable print-friendly version */
  printFriendly?: boolean;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({
  className = '',
  showLastUpdated = true,
  printFriendly = false,
}) => {
  const containerClasses = [styles.termsOfService, printFriendly && styles.printFriendly, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FileText size={32} />
          </div>
          <h1 className={styles.title}>Terms of Service</h1>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Agreement to Terms */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <CheckCircle size={20} />
              Agreement to Terms
            </h2>
            <p className={styles.paragraph}>
              By accessing and using the FIA Relationship Assessment service (&quot;Service&quot;),
              you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not
              agree to these Terms, please do not use our Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Users size={20} />
              Description of Service
            </h2>
            <p className={styles.paragraph}>
              FIA Relationship Assessment is an online platform that provides:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Interactive Assessment</strong>: Travel-scenario-based questions to analyze
                relationship dynamics
              </li>
              <li>
                <strong>Personality Insights</strong>: Three relationship archetypes (Heartfelt
                Companion, Strategic Navigator, Spontaneous Explorer)
              </li>
              <li>
                <strong>Results Sharing</strong>: Optional sharing of assessment results
              </li>
              <li>
                <strong>Educational Content</strong>: Information about relationship styles and
                compatibility
              </li>
            </ul>
          </section>

          {/* Eligibility */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Eligibility and Account Requirements</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Age Requirement</h3>
              <p className={styles.paragraph}>
                You must be at least 18 years old to use this Service. By using our Service, you
                represent that you meet this age requirement.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Account Information</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Accurate Information</strong>: You agree to provide accurate and complete
                  information
                </li>
                <li>
                  <strong>Information Updates</strong>: You will keep your information current and
                  accurate
                </li>
                <li>
                  <strong>Account Security</strong>: You are responsible for maintaining the
                  confidentiality of your account
                </li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Acceptable Use</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                <CheckCircle size={16} />
                Permitted Uses
              </h3>
              <ul className={styles.list}>
                <li>Taking the relationship assessment for personal use</li>
                <li>Sharing your results as desired</li>
                <li>Using insights for personal relationship understanding</li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                <XCircle size={16} />
                Prohibited Uses
              </h3>
              <p className={styles.paragraph}>
                You may <strong>not</strong>:
              </p>
              <ul className={styles.list}>
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to circumvent or manipulate the assessment system</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated tools to access the Service (bots, scrapers, etc.)</li>
                <li>Impersonate others or provide false information</li>
                <li>Upload or transmit malicious code or harmful content</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Intellectual Property Rights</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Our Content</h3>
              <p className={styles.paragraph}>
                All content, features, and functionality of the Service are owned by FIA and are
                protected by:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Copyright</strong>: Original text, questions, algorithms, and design
                </li>
                <li>
                  <strong>Trademarks</strong>: FIA Relationship Assessment name and branding
                </li>
                <li>
                  <strong>Trade Secrets</strong>: Assessment methodology and scoring algorithms
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Your Results</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Your Data</strong>: You retain ownership of your personal information and
                  assessment responses
                </li>
                <li>
                  <strong>Results License</strong>: You receive a non-exclusive license to use and
                  share your assessment results
                </li>
                <li>
                  <strong>Feedback</strong>: Any feedback you provide to us may be used to improve
                  our Service
                </li>
              </ul>
            </div>
          </section>

          {/* Assessment Disclaimer */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={20} />
              Assessment Disclaimer
            </h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Nature of Service</h3>
              <p className={styles.paragraph}>Our relationship assessment is designed for:</p>
              <ul className={styles.list}>
                <li>
                  <strong>Entertainment</strong>: Fun and engaging self-discovery
                </li>
                <li>
                  <strong>Self-Reflection</strong>: Personal insights and understanding
                </li>
                <li>
                  <strong>Educational Purposes</strong>: Learning about relationship dynamics
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Not Professional Advice</h3>
              <p className={styles.paragraph}>
                Our Service is <strong>NOT</strong>:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Medical Advice</strong>: Not a substitute for professional medical
                  consultation
                </li>
                <li>
                  <strong>Therapeutic Services</strong>: Not a replacement for relationship
                  counseling or therapy
                </li>
                <li>
                  <strong>Professional Assessment</strong>: Not a clinical or professional
                  psychological evaluation
                </li>
                <li>
                  <strong>Relationship Counseling</strong>: Not professional relationship advice or
                  guidance
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Accuracy Disclaimer</h3>
              <p className={styles.paragraph}>
                While we strive for accuracy, we make no guarantees about:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Assessment Precision</strong>: Individual results may vary
                </li>
                <li>
                  <strong>Compatibility Predictions</strong>: Results do not guarantee relationship
                  success
                </li>
                <li>
                  <strong>Complete Analysis</strong>: Our assessment covers selected aspects of
                  relationship dynamics
                </li>
              </ul>
            </div>
          </section>

          {/* Service Availability */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Service Availability</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Service Provision</h3>
              <p className={styles.paragraph}>
                We strive to provide uninterrupted Service, but we cannot guarantee:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Continuous Availability</strong>: Service may be temporarily unavailable
                  for maintenance
                </li>
                <li>
                  <strong>Error-Free Operation</strong>: Technical issues may occasionally occur
                </li>
                <li>
                  <strong>Permanent Availability</strong>: We may discontinue the Service with
                  reasonable notice
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Modifications</h3>
              <p className={styles.paragraph}>We reserve the right to:</p>
              <ul className={styles.list}>
                <li>
                  <strong>Update Content</strong>: Modify assessment questions or results
                </li>
                <li>
                  <strong>Add Features</strong>: Introduce new functionality
                </li>
                <li>
                  <strong>Remove Features</strong>: Discontinue certain aspects of the Service
                </li>
                <li>
                  <strong>Technical Changes</strong>: Update our platform and infrastructure
                </li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>User Responsibilities</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Honest Participation</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Truthful Responses</strong>: Provide honest answers for accurate results
                </li>
                <li>
                  <strong>Good Faith Use</strong>: Use the Service as intended
                </li>
                <li>
                  <strong>Respectful Behavior</strong>: Interact respectfully with our platform and
                  team
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Technical Requirements</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Compatible Device</strong>: Use a device capable of accessing our
                  web-based Service
                </li>
                <li>
                  <strong>Internet Connection</strong>: Maintain a stable internet connection
                </li>
                <li>
                  <strong>Supported Browser</strong>: Use a modern, supported web browser
                </li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Scale size={20} />
              Limitation of Liability
            </h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Disclaimer of Warranties</h3>
              <p className={styles.paragraph}>
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without
                warranties of any kind, either express or implied.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Limitation of Damages</h3>
              <p className={styles.paragraph}>
                To the fullest extent permitted by law, FIA shall not be liable for:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Indirect Damages</strong>: Consequential, incidental, or special damages
                </li>
                <li>
                  <strong>Personal Decisions</strong>: Decisions made based on assessment results
                </li>
                <li>
                  <strong>Relationship Outcomes</strong>: Any relationship decisions or consequences
                </li>
                <li>
                  <strong>Technical Issues</strong>: Temporary service interruptions or technical
                  problems
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Maximum Liability</h3>
              <p className={styles.paragraph}>
                Our total liability to you for any claims related to the Service shall not exceed
                the amount you paid for the Service (currently $0).
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Gavel size={20} />
              Dispute Resolution
            </h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Governing Law</h3>
              <p className={styles.paragraph}>
                These Terms are governed by the laws of the United States and the state where FIA is
                located.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Informal Resolution</h3>
              <p className={styles.paragraph}>
                Before pursuing formal legal action, we encourage you to contact us to resolve any
                disputes informally.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Arbitration</h3>
              <p className={styles.paragraph}>
                For disputes that cannot be resolved informally, you agree to resolve disputes
                through binding arbitration rather than in court, except for small claims or
                intellectual property disputes.
              </p>
            </div>
          </section>

          {/* General Provisions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>General Provisions</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Entire Agreement</h3>
              <p className={styles.paragraph}>
                These Terms, together with our Privacy Policy, constitute the entire agreement
                between you and FIA regarding the Service.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Updates to Terms</h3>
              <p className={styles.paragraph}>
                We may modify these Terms periodically. We will provide notice of significant
                changes by:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Website Notice</strong>: Prominent display on our homepage
                </li>
                <li>
                  <strong>Email Notice</strong>: Direct communication to users who provided email
                  addresses
                </li>
                <li>
                  <strong>Continued Use</strong>: Your continued use after changes constitutes
                  acceptance
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Mail size={20} />
              Contact Information
            </h2>
            <p className={styles.paragraph}>For questions about these Terms of Service:</p>
            <div className={styles.contact}>
              <p>
                <strong>Email</strong>: support@fia-relationship-assessment.com
              </p>
              <p>
                <strong>Subject Line</strong>: Terms of Service Inquiry
              </p>
            </div>
            <p className={styles.paragraph}>We will respond to inquiries within 5 business days.</p>
          </section>

          {/* Acknowledgment */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Acknowledgment</h2>
            <p className={styles.paragraph}>
              By using the FIA Relationship Assessment Service, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            These Terms of Service are designed to protect both users and FIA while enabling a
            positive service experience. Please contact us with any questions or concerns.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;

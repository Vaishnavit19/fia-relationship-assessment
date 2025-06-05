// src/components/ui/ShareButtons/ShareButtons.tsx
'use client';

import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  Download,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import React, { useState, useCallback } from 'react';

// import { Button } from '../Button';
import { Card } from '../Card';

import styles from './ShareButtons.module.scss';

console.log('unused', Link2);

export interface ShareData {
  /** Title to share */
  title: string;
  /** Description/text to share */
  text: string;
  /** URL to share */
  url: string;
  /** Hashtags for social platforms */
  hashtags?: string[];
  /** Image URL for rich sharing */
  imageUrl?: string;
}

export interface ShareButtonsProps {
  /** Data to share */
  shareData: ShareData;
  /** Available sharing platforms */
  platforms?: (
    | 'facebook'
    | 'twitter'
    | 'linkedin'
    | 'email'
    | 'whatsapp'
    | 'copy'
    | 'download'
    | 'native'
  )[];
  /** Component variant */
  variant?: 'default' | 'compact' | 'detailed' | 'floating';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Whether to show labels */
  showLabels?: boolean;
  /** Whether to show share count */
  showCount?: boolean;
  /** Custom share count */
  shareCount?: number;
  /** Custom CSS classes */
  className?: string;
  /** Handler for successful shares */
  onShare?: (platform: string) => void;
  /** Handler for share errors */
  onError?: (platform: string, error: Error) => void;
  /** Handler for download action */
  onDownload?: () => void;
  /** Whether download is available */
  allowDownload?: boolean;
  /** Download button text */
  downloadText?: string;
  /** Custom share message prefix */
  messagePrefix?: string;
  /** Whether to animate buttons */
  animated?: boolean;
}

const PLATFORM_CONFIG = {
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877f2',
    getUrl: (data: ShareData) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.text)}`,
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: '#1da1f2',
    getUrl: (data: ShareData) => {
      const hashtags = data.hashtags?.join(',') ?? '';
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}&hashtags=${hashtags}`;
    },
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0077b5',
    getUrl: (data: ShareData) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}&summary=${encodeURIComponent(data.text)}`,
  },
  email: {
    name: 'Email',
    icon: Mail,
    color: '#ea4335',
    getUrl: (data: ShareData) =>
      `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`${data.text}\n\n${data.url}`)}`,
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: '#25d366',
    getUrl: (data: ShareData) =>
      `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`,
  },
};

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  shareData,
  platforms = ['facebook', 'twitter', 'linkedin', 'email', 'copy', 'native'],
  variant = 'default',
  size = 'medium',
  orientation = 'horizontal',
  showLabels = true,
  showCount = false,
  shareCount = 0,
  className = '',
  onShare,
  onError,
  onDownload,
  allowDownload = false,
  downloadText = 'Download Results',
  messagePrefix = '',
  animated = true,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Check if Web Share API is supported
  const isNativeShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  const handlePlatformShare = useCallback(
    async (platform: string) => {
      try {
        setIsSharing(true);

        if (platform === 'native' && isNativeShareSupported) {
          await navigator.share({
            title: shareData.title,
            text: shareData.text,
            url: shareData.url,
          });
        } else if (platform === 'copy') {
          await navigator.clipboard.writeText(shareData.url);
          setCopiedUrl(true);
          setTimeout(() => setCopiedUrl(false), 2000);
        } else if (platform === 'download' && onDownload) {
          onDownload();
        } else if (PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]) {
          const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
          const shareUrl = config.getUrl(shareData);
          window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        }

        if (onShare) {
          onShare(platform);
        }
      } catch (error) {
        console.error(`Failed to share on ${platform}:`, error);
        if (onError) {
          onError(platform, error as Error);
        }
      } finally {
        setIsSharing(false);
      }
    },
    [shareData, onShare, onError, onDownload, isNativeShareSupported]
  );

  const getButtonContent = (platform: string) => {
    const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];

    if (platform === 'native') {
      return {
        icon: Share2,
        label: 'Share',
        color: '#6b7280',
      };
    }

    if (platform === 'copy') {
      return {
        icon: copiedUrl ? Check : Copy,
        label: copiedUrl ? 'Copied!' : 'Copy Link',
        color: copiedUrl ? '#10b981' : '#6b7280',
      };
    }

    if (platform === 'download') {
      return {
        icon: Download,
        label: downloadText,
        color: '#8b5cf6',
      };
    }

    return config
      ? {
          icon: config.icon,
          label: config.name,
          color: config.color,
        }
      : null;
  };

  const containerClasses = [
    styles.shareButtons,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`orientation${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`],
    animated && styles.animated,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card className={containerClasses} variant={variant === 'floating' ? 'elevated' : 'default'}>
      {/* Header */}
      {variant === 'detailed' && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Share2 className={styles.headerIcon} size={20} />
            <h3 className={styles.headerTitle}>Share Your Results</h3>
          </div>
          {showCount && shareCount > 0 && (
            <div className={styles.shareCount}>
              <span className={styles.countNumber}>{shareCount}</span>
              <span className={styles.countLabel}>shares</span>
            </div>
          )}
        </div>
      )}

      {/* Message Prefix */}
      {messagePrefix && variant !== 'compact' && (
        <div className={styles.messagePrefix}>
          <p>{messagePrefix}</p>
        </div>
      )}

      {/* Share Buttons */}
      <div className={styles.buttonsContainer}>
        {/* Native Share (if supported) */}
        {platforms.includes('native') && isNativeShareSupported && (
          <button
            type="button"
            className={`${styles.shareButton} ${styles.nativeButton}`}
            onClick={() => {
              void handlePlatformShare('native');
            }}
            disabled={isSharing}
            aria-label="Share using device's native share menu"
          >
            <div className={styles.buttonIcon}>
              <Share2 size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
            </div>
            {showLabels && variant !== 'compact' && (
              <span className={styles.buttonLabel}>Share</span>
            )}
          </button>
        )}

        {/* Platform Buttons */}
        {platforms
          .filter(p => p !== 'native' && p !== 'download')
          .map(platform => {
            const content = getButtonContent(platform);
            if (!content) return null;

            const IconComponent = content.icon;

            return (
              <button
                key={platform}
                type="button"
                className={`${styles.shareButton} ${styles[`${platform}Button`]}`}
                onClick={() => {
                  void handlePlatformShare(platform);
                }}
                disabled={isSharing}
                style={{ '--platform-color': content.color } as React.CSSProperties}
                aria-label={`Share on ${content.label}`}
              >
                <div className={styles.buttonIcon}>
                  <IconComponent size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
                </div>
                {showLabels && variant !== 'compact' && (
                  <span className={styles.buttonLabel}>{content.label}</span>
                )}
              </button>
            );
          })}

        {/* Download Button */}
        {platforms.includes('download') && allowDownload && (
          <button
            type="button"
            className={`${styles.shareButton} ${styles.downloadButton}`}
            onClick={() => {
              void handlePlatformShare('download');
            }}
            disabled={isSharing}
            aria-label={downloadText}
          >
            <div className={styles.buttonIcon}>
              <Download size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
            </div>
            {showLabels && variant !== 'compact' && (
              <span className={styles.buttonLabel}>{downloadText}</span>
            )}
          </button>
        )}
      </div>

      {/* Footer Message */}
      {variant === 'detailed' && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Help others discover their relationship style by sharing this assessment!
          </p>
        </div>
      )}
    </Card>
  );
};

// Convenience hook for generating share data
export const useShareData = (
  title: string,
  text: string,
  url?: string,
  hashtags?: string[]
): ShareData => {
  return {
    title,
    text,
    url: url ?? (typeof window !== 'undefined' ? window.location.href : ''),
    hashtags: hashtags ?? ['RelationshipAssessment', 'LoveLanguage', 'FIA'],
  };
};

// Predefined share templates for assessment results
export const ASSESSMENT_SHARE_TEMPLATES = {
  heartfelt: {
    title: "I'm a Heartfelt Companion!",
    text: "I just discovered my relationship style! I'm a Heartfelt Companion - someone who prioritizes emotional connection and togetherness. What's your relationship archetype?",
    hashtags: ['HeartfeltCompanion', 'RelationshipStyle', 'EmotionalConnection'],
  },
  strategic: {
    title: "I'm a Strategic Navigator!",
    text: "I just discovered my relationship style! I'm a Strategic Navigator - someone who approaches relationships with careful planning and logic. What's your relationship archetype?",
    hashtags: ['StrategicNavigator', 'RelationshipStyle', 'LogicalPlanning'],
  },
  spontaneous: {
    title: "I'm a Spontaneous Explorer!",
    text: "I just discovered my relationship style! I'm a Spontaneous Explorer - someone who embraces unexpected adventures. What's your relationship archetype?",
    hashtags: ['SpontaneousExplorer', 'RelationshipStyle', 'AdventureSeeker'],
  },
};

// Default export for easier importing
export default ShareButtons;

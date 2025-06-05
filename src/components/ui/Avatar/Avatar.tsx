// src/components/ui/Avatar/Avatar.tsx
'use client';

import { User, Camera, Edit3 } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useRef, useCallback } from 'react';

// import { Button } from '../Button';

import styles from './Avatar.module.scss';

export interface AvatarProps {
  /** User's name for fallback initials */
  name?: string;
  /** Avatar image URL */
  src?: string;
  /** Alt text for avatar image */
  alt?: string;
  /** Size of the avatar */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** Shape of the avatar */
  shape?: 'circle' | 'rounded' | 'square';
  /** Color scheme for fallback */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'archetype';
  /** Whether avatar is editable */
  editable?: boolean;
  /** Handler for avatar change */
  onAvatarChange?: (file: File) => void;
  /** Whether avatar is loading */
  isLoading?: boolean;
  /** Online status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy' | null;
  /** Badge content (number or text) */
  badge?: string | number;
  /** Badge variant */
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether avatar is clickable */
  clickable?: boolean;
  /** Custom background gradient for archetype */
  archetypeGradient?: string;
  /** Archetype emoji for fallback */
  archetypeEmoji?: string;
  /** Whether to show hover effects */
  showHover?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Whether avatar represents the current user */
  isCurrentUser?: boolean;
}

const getInitials = (name: string): string => {
  if (!name) return '';

  const names = name.trim().split(/\s+/);
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const getColorClass = (color: string, name?: string): string => {
  if (color === 'archetype') return 'archetype';
  if (color !== 'neutral') return color;

  // Generate consistent color based on name
  if (!name) return 'neutral';

  const colors = ['primary', 'secondary', 'success', 'warning'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  name = '',
  src,
  alt,
  size = 'medium',
  shape = 'circle',
  color = 'neutral',
  editable = false,
  onAvatarChange,
  isLoading = false,
  status = null,
  badge,
  badgeVariant = 'primary',
  className = '',
  onClick,
  clickable = false,
  archetypeGradient,
  archetypeEmoji,
  showHover = true,
  tooltip,
  isCurrentUser = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [uploadHover, setUploadHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSizeInPixels = (size: string): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      case 'xlarge':
        return 96;
      default:
        return 48;
    }
  };

  const initials = getInitials(name);
  const colorClass = getColorClass(color, name);
  const showImage = src && !imageError && !isLoading;
  const isInteractive = clickable || editable || onClick;

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  const handleClick = useCallback(() => {
    if (editable && !isLoading) {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick();
    }
  }, [editable, isLoading, onClick]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && onAvatarChange) {
        onAvatarChange(file);
      }
      // Reset input value to allow same file selection
      event.target.value = '';
    },
    [onAvatarChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        handleClick();
      }
    },
    [isInteractive, handleClick]
  );

  const avatarClasses = [
    styles.avatar,
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`shape${shape.charAt(0).toUpperCase() + shape.slice(1)}`],
    styles[`color${colorClass.charAt(0).toUpperCase() + colorClass.slice(1)}`],
    isInteractive && styles.interactive,
    showHover && isInteractive && styles.hoverable,
    isLoading && styles.loading,
    editable && styles.editable,
    isCurrentUser && styles.currentUser,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const avatarStyle: React.CSSProperties = {
    ...(archetypeGradient && color === 'archetype' ? { background: archetypeGradient } : {}),
  };

  return (
    <div className={styles.avatarContainer}>
      <div
        className={avatarClasses}
        style={avatarStyle}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        aria-label={
          editable
            ? `Change avatar for ${name || 'user'}`
            : clickable
              ? `View profile for ${name || 'user'}`
              : (alt ?? `Avatar for ${name || 'user'}`)
        }
        title={tooltip ?? (editable ? 'Click to change avatar' : undefined)}
        onMouseEnter={() => editable && setUploadHover(true)}
        onMouseLeave={() => editable && setUploadHover(false)}
      >
        {/* Image */}
        {showImage && (
          <Image
            src={src}
            alt={alt ?? `Avatar for ${name}`}
            width={getSizeInPixels(size)}
            height={getSizeInPixels(size)}
            className={styles.image}
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority={size === 'xlarge' || isCurrentUser}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+mtbZdm9dxjm7RQKjzD6wCb4VZLk0s3gYIhiWFzksXhd8HBJGWHPzgNm7k0j2l67CjEfjm9eFQCqHjk9VFfhNjPqh"
          />
        )}

        {/* Fallback Content */}
        {!showImage && (
          <div className={styles.fallback}>
            {isLoading ? (
              <div className={styles.loadingSpinner} />
            ) : archetypeEmoji && color === 'archetype' ? (
              <span className={styles.emoji} role="img" aria-label="Archetype">
                {archetypeEmoji}
              </span>
            ) : initials ? (
              <span className={styles.initials}>{initials}</span>
            ) : (
              <User className={styles.defaultIcon} />
            )}
          </div>
        )}

        {/* Upload Overlay */}
        {editable && (uploadHover || isLoading) && (
          <div className={styles.uploadOverlay}>
            {isLoading ? (
              <div className={styles.uploadSpinner} />
            ) : (
              <Camera className={styles.uploadIcon} />
            )}
          </div>
        )}

        {/* Edit Badge */}
        {editable && !uploadHover && !isLoading && (
          <div className={styles.editBadge}>
            <Edit3 size={12} />
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <div
          className={`${styles.statusIndicator} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}
        >
          <div className={styles.statusDot} />
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div
          className={`${styles.badge} ${styles[`badge${badgeVariant.charAt(0).toUpperCase() + badgeVariant.slice(1)}`]}`}
        >
          {badge}
        </div>
      )}

      {/* File Input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </div>
  );
};

// Avatar Group Component
export interface AvatarGroupProps {
  /** Array of avatar props */
  avatars: (AvatarProps & { id: string })[];
  /** Maximum number of avatars to show */
  max?: number;
  /** Size of all avatars in group */
  size?: AvatarProps['size'];
  /** Shape of all avatars in group */
  shape?: AvatarProps['shape'];
  /** Additional CSS classes */
  className?: string;
  /** Handler for clicking on excess count */
  onShowMore?: () => void;
  /** Custom rendering for excess count */
  renderExcess?: (count: number) => React.ReactNode;
  /** Spacing between avatars */
  spacing?: 'tight' | 'normal' | 'loose';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'medium',
  shape = 'circle',
  className = '',
  onShowMore,
  renderExcess,
  spacing = 'normal',
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const excessCount = Math.max(0, avatars.length - max);

  const groupClasses = [
    styles.avatarGroup,
    styles[`spacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={groupClasses}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={avatar.id}
          className={styles.groupAvatar}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <Avatar {...avatar} size={size} shape={shape} />
        </div>
      ))}

      {excessCount > 0 && (
        <div className={styles.groupAvatar} style={{ zIndex: 0 }}>
          {renderExcess ? (
            renderExcess(excessCount)
          ) : (
            <Avatar
              name={`+${excessCount}`}
              size={size}
              shape={shape}
              color="neutral"
              onClick={onShowMore}
              clickable={!!onShowMore}
              className={styles.excessAvatar}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Assessment-specific avatar with archetype styling
export interface AssessmentAvatarProps
  extends Omit<AvatarProps, 'color' | 'archetypeGradient' | 'archetypeEmoji'> {
  /** Assessment archetype */
  archetype?: {
    id: string;
    name: string;
    icon: string;
    gradient: string;
  };
  /** Assessment completion percentage */
  completionPercentage?: number;
  /** User's assessment score */
  score?: number;
  /** Maximum possible score */
  maxScore?: number;
}

export const AssessmentAvatar: React.FC<AssessmentAvatarProps> = ({
  archetype,
  completionPercentage,
  score,
  maxScore,
  badge,
  ...avatarProps
}) => {
  // Generate badge content based on assessment data
  const getBadgeContent = (): string | number | undefined => {
    if (badge !== undefined) return badge;
    if (score !== undefined && maxScore !== undefined) {
      const percentage = Math.round((score / maxScore) * 100);
      return `${percentage}%`;
    }
    if (completionPercentage !== undefined) {
      return `${completionPercentage}%`;
    }
    return undefined;
  };

  const getBadgeVariant = (): AvatarProps['badgeVariant'] => {
    if (completionPercentage !== undefined) {
      if (completionPercentage === 100) return 'success';
      if (completionPercentage > 50) return 'warning';
      return 'secondary';
    }
    return 'primary';
  };

  return (
    <Avatar
      {...avatarProps}
      color="archetype"
      archetypeGradient={archetype?.gradient}
      archetypeEmoji={archetype?.icon}
      badge={getBadgeContent()}
      badgeVariant={getBadgeVariant()}
      tooltip={
        archetype ? `${avatarProps.name ?? 'User'} - ${archetype.name}` : avatarProps.tooltip
      }
    />
  );
};

// Default export for easier importing
export default Avatar;

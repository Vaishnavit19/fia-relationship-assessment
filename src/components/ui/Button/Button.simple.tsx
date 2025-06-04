// src/components/ui/Button/Button.simple.tsx
// Temporary test version without SCSS modules
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'cta';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export const SimpleButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  // Inline styles for testing
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'Inter, sans-serif',
    textDecoration: 'none',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    borderRadius: '12px',
    fontWeight: 600,
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '18px 40px' : '12px 24px',
    fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
    minHeight: size === 'small' ? '32px' : size === 'large' ? '48px' : '40px',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles: React.CSSProperties = {
    ...(variant === 'primary' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    }),
    ...(variant === 'secondary' && {
      background: '#f7fafc',
      color: '#4a5568',
      border: '2px solid #e2e8f0',
    }),
    ...(variant === 'cta' && {
      background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)',
      color: 'white',
      boxShadow: '0 6px 25px rgba(255, 107, 157, 0.3)',
    }),
  };

  return (
    <button
      type={type}
      style={{ ...baseStyles, ...variantStyles }}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={className}
      {...props}
    >
      {loading && (
        <span style={{ 
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}>
        </span>
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      )}
    </button>
  );
};
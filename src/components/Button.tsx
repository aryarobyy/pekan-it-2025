import React from 'react';

type ButtonProps = {
  text: React.ReactNode;
  /**
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'accent' | 'custom';
  /**
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * @default false
   */
  loading?: boolean;
  /** 
   * @default false
   */
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
  /**
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const MyButton: React.FC<ButtonProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  icon: IconComponent,
  iconPosition = 'left',
  onClick,
  ...rest
}) => {
  const baseStyles = 'font-medium transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-3 text-lg'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5', 
    large: 'w-6 h-6'
  };
  
  const variantStyles = {
    primary: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm focus:ring-blue-300 rounded-md',
    secondary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:ring-blue-300 rounded-md',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:ring-red-300 rounded-md',
    outline: 'bg-transparent hover:bg-blue-50 active:bg-blue-100 text-blue-600 hover:text-blue-700 border-2 border-blue-600 hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-blue-300 rounded-md',
    accent: 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:ring-yellow-300 rounded-full',
    custom: ''
  };
  
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      onClick={onClick}
      type='button'
      disabled={disabled || loading}
      className={buttonClasses}
      {...rest}
    >
      <span className="flex items-center justify-center space-x-2">
        {loading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        
        {!loading && IconComponent && iconPosition === 'left' && (
          <IconComponent className={iconSizes[size]} />
        )}
        
        <span>{text}</span>
        
        {!loading && IconComponent && iconPosition === 'right' && (
          <IconComponent className={iconSizes[size]} />
        )}
      </span>
    </button>
  );
};
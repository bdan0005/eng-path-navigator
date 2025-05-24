// components/Button.jsx
import React from 'react';

const Button = ({
  type = 'primary',
  handleClick = () => {},
  iconSvg = '',
  iconPos = 'left',
  text = 'Button',
  fullWidth = false,
  minHeight = 11,
  fitContainerHeight = false,
  disabled = false,
  children,
}) => {
  const baseStyles = `flex items-center justify-center font-sans rounded-lg px-3 py-2.5 
    md:px-4 md:py-2.5 lg:px-5 lg:py-2.5 transition ease-in-out duration-300`;

  const typeStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-800 border-none',
    secondary: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-none',
    disabled: 'bg-gray-200 text-white cursor-not-allowed border-none',
    error: 'bg-red-600 text-white border-none',
    'no-bg': '',
  };

  const minHeightClass = `min-h-[${minHeight}px]`;
  const fullWidthClass = fullWidth ? 'w-full text-center' : '';
  const heightClass = fitContainerHeight ? 'h-full' : '';

  const iconMargin = text ? (iconPos === 'left' ? 'mr-2' : 'ml-2') : '';

  return (
    <div className="flex justify-center sm:justify-start h-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`${baseStyles} ${typeStyles[type] || ''} ${minHeightClass} ${fullWidthClass} ${heightClass}`}
      >
        {iconSvg && iconPos === 'left' && (
          <span
            className={`max-w-6 ${iconMargin}`}
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
        )}

        {text}

        {iconSvg && iconPos === 'right' && (
          <span
            className={`max-w-6 ${iconMargin}`}
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
        )}

        {children}
      </button>
    </div>
  );
};

export default Button;
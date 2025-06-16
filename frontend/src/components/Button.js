const Button = ({
  type = 'primary',
  handleClick = () => {},
  iconSvg = '',
  iconPos = 'left',
  text = 'Button',
  fitContainerWidth = false,
  minHeight = 11,
  fitContainerHeight = false,
  disabled = false,
  boldText = 'semi',
  textSize = 'text-sm',
  children,
}) => {
  const baseStyles = `flex items-center justify-center font-sans rounded-2xl px-2 py-1
    md:px-4 md:py-1 lg:px-4 lg:py-1 transition ease-in-out duration-300`;

  const typeStyles = {
    'primary': 'bg-blue text-white hover:shadow-md border-blue border-2',
    'secondary': 'text-black hover:drop-shadow-md border-none',
    'tertiary': 'bg-gray text-white hover:shadow-md border-gray border-2',
    'tertiary-bordered': 'text-gray hover:drop-shadow-md border-gray border-2'
  };

  const minHeightClass = `min-h-[${minHeight}px]`;
  const fullWidthClass = fitContainerWidth ? 'w-full text-center' : '';
  const fullHeightClass = fitContainerHeight ? 'h-full' : '';
  const fontWeightClass = boldText === 'semi' ? 'font-semibold' : boldText ? 'font-bold' : 'font-normal';

  const iconMargin = text ? (iconPos === 'left' ? 'mr-2' : 'ml-2') : '';

  return (
    <div className="flex justify-center sm:justify-start h-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`${baseStyles} ${typeStyles[type] || ''} ${minHeightClass} ${fullWidthClass} ${fullHeightClass} ${fontWeightClass} ${textSize}`}
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
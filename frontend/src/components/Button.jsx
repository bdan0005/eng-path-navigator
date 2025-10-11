const Button = ({
  type = "primary",
  handleClick = () => {},
  icon = null,
  iconPos = "left",
  text = "",
  fitContainerWidth = false,
  fitContainerHeight = false,
  disabled = false,
  boldText = "semi",
  textSize = "text-md",
  size = "md", 
  rounded = "full",
  minHeight,
  children,
}) => {
  const hasText = text && text.trim().length > 0;
  const isIconOnly = icon && !hasText;

  const roundedMap = {
    full: "rounded-full",
    "2xl": "rounded-2xl",
    lg: "rounded-lg",
    md: "rounded-md",
    none: "rounded-none",
  };
  const roundedClass = roundedMap[rounded] || roundedMap.full;

  const baseStyles = `inline-flex items-center justify-center font-sans ${roundedClass} transition ease-in-out duration-300`;

  const typeStyles = {
    primary: `
      bg-sky-700 text-white border-2 border-sky-700
      hover:bg-sky-800 hover:border-sky-800
      active:bg-sky-900 active:border-sky-900
      focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `,

    "primary-shadow": `
      bg-sky-700 text-white border-2 border-sky-700 shadow-md
      hover:shadow-lg hover:bg-sky-800 hover:border-sky-800
      active:bg-sky-900 active:border-sky-900
      focus:outline-none focus:ring-2 focus:ring-sky-800
      disabled:opacity-50 disabled:cursor-not-allowed
    `,

    secondary: `
      text-gray-800
      hover:bg-gray-100
      active:bg-gray-200
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `,

    tertiary: `
      bg-gray-800 text-white border-2 border-gray-800
      hover:bg-gray-900 hover:border-gray-900
      active:bg-black active:border-black
      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `,

    "tertiary-bordered": `
      text-gray-800 border-2 border-gray-800
      hover:bg-gray-100
      active:bg-gray-200
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `,

    black: `
      bg-black text-white border-2 border-black
      hover:bg-gray-900
      active:bg-gray-950
      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  };

  const sizeStyles = {
    sm: "px-3 py-1 min-h-[36px]",
    md: "px-3 py-2 min-h-[44px]",
    lg: "px-5 py-3 min-h-[56px]",
  };

  const iconOnlySizeStyles = {
    sm: "px-3 py-1 min-h-[36px]",
    md: "px-4 py-2 min-h-[44px]",
    lg: "px-5 py-3 min-h-[56px]",
  };

  const effectiveSize = isIconOnly
    ? iconOnlySizeStyles[size] || iconOnlySizeStyles.md
    : sizeStyles[size] || sizeStyles.md;

  const fullWidthClass = fitContainerWidth ? "w-full text-center" : "";
  const fullHeightClass = fitContainerHeight ? "h-full" : "";
  const fontWeightClass =
    boldText === "semi" ? "font-semibold" : boldText ? "font-bold" : "font-normal";
  const minHeightClass = minHeight ? `min-h-[${minHeight}px]` : "";

  const iconMargin = hasText ? (iconPos === "left" ? "mr-2" : "ml-2") : "";

  const classNames = [
    baseStyles,
    typeStyles[type] || "",
    effectiveSize,
    minHeightClass,
    fullWidthClass,
    fullHeightClass,
    fontWeightClass,
    textSize,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex justify-center sm:justify-start h-full">
      <button type="button" onClick={handleClick} disabled={disabled} className={classNames}>
        {!hasText && isIconOnly ? (
          // Icon-only button
          <span className="flex items-center justify-center">{icon}</span>
        ) : (
          // Text (with optional icon)
          <>
            {icon && iconPos === "left" && <span className={`flex items-center ${iconMargin}`}>{icon}</span>}
            <span>{text}</span>
            {icon && iconPos === "right" && <span className={`flex items-center ${iconMargin}`}>{icon}</span>}
          </>
        )}
        {children}
      </button>
    </div>
  );
};

export default Button;

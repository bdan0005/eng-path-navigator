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
    primary: "bg-blue text-white hover:shadow-md border-blue border-2",
    "primary-shadow":
      "bg-blue text-white shadow-md transition-shadow hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border-blue border-2",
    secondary: "text-black hover:drop-shadow-md border-none",
    tertiary: "bg-gray text-white hover:shadow-md border-gray border-2",
    "tertiary-bordered": "text-gray hover:drop-shadow-md border-gray border-2",
    black: "bg-black text-white hover:shadow-md border-black border-2",
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

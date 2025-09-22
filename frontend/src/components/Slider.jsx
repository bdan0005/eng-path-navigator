import { useRef, useEffect, useState } from "react";

export default function Slider({
  min = 0,
  max = 10,
  step = 1,
  markers = true,
  value,
  onChange,
}) {
  // Create all values for the slider (step can be 1, 2, etc.)
  const allValues = [];
  for (let i = min; i <= max; i += step) {
    allValues.push(i);
  }

  // Only show ticks at multiples of 10
  const tickValues = allValues.filter((val) => val % 10 === 0);

  // Ref and state for slider width
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const horizontalPadding = 10;

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
    // Update on window resize
    const handleResize = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const percent = (value - min) / (max - min);
  const thumbReach = sliderWidth - 2 * horizontalPadding;
  const leftPx = horizontalPadding + percent * thumbReach;

  return (
    <div className="flex flex-col space-y-2 p-2 items-center w-full">
      {/* Value indicator above slider */}
      <div className="relative w-full mb-2 px-4" ref={sliderRef}>
        <span
          className="absolute -top-4 text-black font-bold pointer-events-none"
          style={{
            left: `${leftPx}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {value}
        </span>
      </div>

      {/* Range slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4"
        list={markers ? "steplist" : undefined}
      />

      {/* Tick values */}
      {markers && (
        <ul className="flex justify-between w-full px-[10px]">
          {tickValues.map((tick) => (
            <li key={tick} className="flex justify-center relative">
              <span className="absolute text-black text-md">{tick}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Tick marks */}
      {markers && (
        <datalist id="steplist">
          {tickValues.map((tick) => (
            <option key={tick} value={tick} />
          ))}
        </datalist>
      )}
    </div>
  );
}
import { useRef, useEffect, useState } from "react";
import { Label } from "flowbite-react";

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
}) {
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const horizontalPadding = 10;

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const percent = (value - min) / (max - min);
  const thumbReach = sliderWidth - 2 * horizontalPadding;
  const leftPx = horizontalPadding + percent * thumbReach;

  return (
    <div className="flex flex-col items-center w-full space-y-3 p-3">
      <div className="relative w-full" ref={sliderRef}>
        <span
          className="absolute -top-3 text-sm font-semibold text-gray-900 dark:text-gray-200 pointer-events-none"
          style={{
            left: `${leftPx}px`,
            transform: "translateX(-50%)",
          }}
        >
          {value}
        </span>
      </div>

      <div className="w-full px-4">
        <Label htmlFor="slider" value="Select value" className="mb-2" />
        <input
          type="range"
          id="slider"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none h-1 rounded-lg outline-none bg-transparent"
        />
      </div>

      <ul className="flex justify-between w-full px-[18px]">
        <li className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{min}</li>
        <li className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{max}</li>
      </ul>

      <style jsx>{`
        input[type="range"]::-webkit-slider-runnable-track {
          background: #1f2937;
          height: 4px;
          border-radius: 2px;
        }

        input[type="range"]::-moz-range-track {
          background: #1f2937;
          height: 4px;
          border-radius: 2px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #1f2937;
          border: 2px solid #1f2937;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -8px;
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #1f2937;
          border: 2px solid #1f2937;
          border-radius: 50%;
          cursor: pointer;
        }

        input[type="range"]::-ms-thumb {
          background: #1f2937;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
}

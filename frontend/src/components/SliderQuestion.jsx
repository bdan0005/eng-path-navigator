import { useState } from "react";
import Slider from "./Slider"; // your existing Slider component

const SliderQuestion = ({ text, options, min = 0, max = 100, step = 1, onChange }) => {
  const [values, setValues] = useState(
    options.reduce((acc, option) => {
      acc[option] = Math.floor((min + max) / 2);
      return acc;
    }, {})
  );

  const handleChange = (option, newValue) => {
    const newValues = { ...values, [option]: newValue };
    setValues(newValues);
    if (onChange) onChange(newValues); 
  };

  return (
    <div className="p-4 w-full">
        <div className="text-3xl font-bold text-black mb-6 text-center">{text}</div>

        <div className="max-w-3xl mx-auto space-y-4">
            {options.map((option) => (
                <div key={option} className="flex items-center space-x-4">
                    {/* Label with fixed width so sliders align */}
                    <span className="flex-shrink-0 w-40 font-semibold">{option}</span>

                    {/* Slider takes remaining space but stays within max width */}
                    <div className="flex-1">
                        <Slider
                        min={min}
                        max={max}
                        step={step}
                        value={values[option]}
                        onChange={(val) => handleChange(option, val)}
                        />
                    </div>
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue text-white font-semibold rounded-full border border-gray-300">
                        {values[option]}
                    </span>
            </div>
        ))}
        </div>
    </div>
    );
};

export default SliderQuestion;
import { useState } from "react";
import Slider from "./Slider"; 

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
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 text-center">
        {text}
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {options.map((option) => (
          <div 
            key={option} 
            className="flex flex-wrap items-center space-x-2 sm:space-x-4"
          >
            <span className="flex-shrink-0 w-24 sm:w-40 font-semibold">
              {option}
            </span>

            <div className="flex-1 min-w-[120px]">
              <Slider
                min={min}
                max={max}
                step={step}
                value={values[option]}
                onChange={(val) => handleChange(option, val)}
              />
            </div>

            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue text-white font-semibold rounded-full border border-gray-300">
              {values[option]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderQuestion;
import { useState, useEffect } from "react";
import Slider from "./Slider"; 

const SliderQuestion = ({ text, options, min = 0, max = 100, step = 1, onChange }) => {
  const [values, setValues] = useState(
    options.reduce((acc, option) => {
      acc[option] = Math.floor((min + max) / 2);
      return acc;
    }, {})
  );

  useEffect(() => {
    if (onChange) onChange(values);
  }, []);

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
            className="flex flex-col p-2 md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4"
          >
            <span className="flex-shrink-0 w-24 sm:w-40 font-semibold text-center md:text-left">
              {option}
            </span>

            <div className="flex-1 min-w-[275px] w-full md:w-auto">
              <Slider
                min={min}
                max={max}
                step={step}
                value={values[option]}
                onChange={(val) => handleChange(option, val)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderQuestion;
import { useState } from "react";

function Slider({
    min,
    max,
    value,
    onChange
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <span>{value}</span>
    </div>
  );
}

export default Slider;
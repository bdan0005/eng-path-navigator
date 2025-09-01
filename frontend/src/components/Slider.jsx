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

  return (
    <div className="flex flex-col space-y-2 p-2 items-center w-full">
      {/* Range slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
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
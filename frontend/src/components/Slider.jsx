export default function Slider({
  min = 0,
  max = 10,
  step = 1,
  markers = true,
  value,
  onChange,
}) {
  // Creating the tick marker values
  const ticks = [];
  for (let i = min; i <= max; i += step) {
    ticks.push(i);
  }

  return (
    <div
      className="flex flex-col space-y-2 p-2 items-center"
      style={{ width: "60vw" }}
    >
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
          {ticks.map((tick) => (
            <li key={tick} className="flex justify-center relative">
              <span className="absolute text-black text-md">{tick}</span>
            </li>
          ))}
        </ul>
      )}
      {/* Tick marks */ }
      {markers && (
        <datalist id="steplist">
          {ticks.map((tick) => (
            <option key={tick} value={tick} />
          ))}
        </datalist>
      )}
    </div>
  );
}

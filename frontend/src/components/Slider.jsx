function Slider({
  min = 0,
  max = 100,
  value,
  width = "600px",
  onChange,
}) {
  return (
    <div className="flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ width: width }}
        onChange={e => onChange(Number(e.target.value))}
      />
      <span className="ml-2 text-black text-base">{value}</span>
    </div>
  );
}

export default Slider;
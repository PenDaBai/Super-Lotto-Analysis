import type { RangeOption } from "../types/dlt";

interface RangeSelectorProps {
  options: RangeOption[];
  activeKey: string;
  customCount: number;
  onChange: (key: string) => void;
  onCustomCount: (count: number) => void;
}

export function RangeSelector({ options, activeKey, customCount, onChange, onCustomCount }: RangeSelectorProps) {
  return (
    <div className="range-selector">
      {options.map((option) => (
        <button
          key={option.key}
          className={activeKey === option.key ? "is-active" : ""}
          type="button"
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
      {activeKey === "custom" && (
        <input
          min={1}
          type="number"
          value={customCount}
          onChange={(event) => onCustomCount(Number(event.target.value))}
          aria-label="自定义期数"
        />
      )}
    </div>
  );
}

import { BACK_RANGE, formatNums, FRONT_RANGE } from "../../domain/numbers";

interface NumberPickPanelProps {
  front: number[];
  back: number[];
  onFront: (value: string) => void;
  onBack: (value: string) => void;
}

export function NumberPickPanel({ front, back, onFront, onBack }: NumberPickPanelProps) {
  return (
    <div className="number-pick-panel">
      <PickGrid title="前区点选" nums={FRONT_RANGE} selected={front} min={5} max={35} tone="front" onChange={onFront} />
      <PickGrid title="后区点选" nums={BACK_RANGE} selected={back} min={2} max={12} tone="back" onChange={onBack} />
    </div>
  );
}

function PickGrid({
  title,
  nums,
  selected,
  min,
  max,
  tone,
  onChange
}: {
  title: string;
  nums: number[];
  selected: number[];
  min: number;
  max: number;
  tone: "front" | "back";
  onChange: (value: string) => void;
}) {
  function toggle(num: number) {
    const next = selected.includes(num) ? selected.filter((item) => item !== num) : [...selected, num].slice(0, max);
    onChange(formatNums(next.sort((a, b) => a - b)));
  }

  return (
    <div className="pick-grid">
      <div className="pick-grid__head">
        <strong>{title}</strong>
        <span>{selected.length} 已选，至少 {min}</span>
      </div>
      <div className="pick-grid__nums">
        {nums.map((num) => (
          <button
            key={num}
            className={selected.includes(num) ? `selected ${tone}` : ""}
            type="button"
            onClick={() => toggle(num)}
          >
            {String(num).padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
}

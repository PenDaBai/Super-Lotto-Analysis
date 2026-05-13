interface NumberBallProps {
  num: number;
  tone?: "front" | "back" | "muted";
}

export function NumberBall({ num, tone = "front" }: NumberBallProps) {
  return <span className={`number-ball number-ball--${tone}`}>{String(num).padStart(2, "0")}</span>;
}

export function NumberBallGroup({ nums, tone }: { nums: number[]; tone?: "front" | "back" | "muted" }) {
  return (
    <span className="number-ball-group">
      {nums.map((num) => <NumberBall key={num} num={num} tone={tone} />)}
    </span>
  );
}

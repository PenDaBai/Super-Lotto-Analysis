import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcMathTexture } from "../calculators/mathTexture";

export function MathTextureCard({ draws }: { draws: DltDraw[] }) {
  const data = calcMathTexture(draws);
  return (
    <StatCard title="数学纹理" subtitle="主要观察前区 01-35：用熵、余数、质数和中心偏移看数学纹路。" accent="#4f46e5">
      <div className="math-portrait">
        <strong>{data.portrait.title}</strong>
        <div>{data.portrait.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="math-guide">
        <Guide label="均匀熵公式" text="p=某号码出现次数/(期数×5)，H=-Σp·log2(p)，得分=H/log2(35)×100。" />
        <Guide label="形态熵公式" text="先把每期变成奇偶/大小/三区指纹，再按指纹频率套熵公式。" />
        <Guide label="尾数熵公式" text="把前区按个位数 0-9 分组，按尾数出现频率套熵公式，得分=H/log2(10)×100。" />
        <Guide label="中心游离" text="每个前区号计算 |号码-18|，再求平均；数值越大，越偏向两端。" />
      </div>
      <div className="math-metrics">
        {data.metrics.map((item) => (
          <div key={item.label} title={item.formula}>
            <span>{item.label} <Help text={item.formula} /></span>
            <b>{item.detail}</b>
            <em>{item.value}分</em>
            <i><mark style={{ width: `${item.value}%` }} /></i>
          </div>
        ))}
      </div>
    </StatCard>
  );
}

function Guide({ label, text }: { label: string; text: string }) {
  return <div><b>{label}</b><span>{text}</span></div>;
}

function Help({ text }: { text: string }) {
  return <i className="math-help" title={text} aria-label={text}>?</i>;
}

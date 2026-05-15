import { Sparkles } from "lucide-react";

const steps = ["观测数据", "校准形态", "洗牌落球", "揭晓签文"];

export function RitualStage({ activeStep, rolling, status, onSkip }: { activeStep: number; rolling: boolean; status: string; onSkip: () => void }) {
  return (
    <section className={`picker-stage ${rolling ? "is-rolling" : ""}`}>
      <div className="picker-stage__content">
        <div className="picker-stage__title">
          <div>
            <h3>选号仪式台</h3>
            <p>分析画像入盘，策略校准后揭晓结果签。</p>
          </div>
          <span className="ritual-status"><Sparkles size={16} />{status}</span>
        </div>
        <div className="ritual-steps">
          {steps.map((step, index) => <span className={index <= activeStep ? "active" : ""} key={step}>{step}</span>)}
        </div>
        <div className="ritual-orbit" aria-hidden="true">
          {[3, 8, 12, 19, 27, 6, 11].map((num) => <span key={num}>{String(num).padStart(2, "0")}</span>)}
        </div>
        {rolling && <button className="ritual-skip" type="button" onClick={onSkip}>跳过动画</button>}
      </div>
    </section>
  );
}

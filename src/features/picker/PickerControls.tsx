import type { ReactNode } from "react";
import type { PickMode, PickPreference, PickStrategy } from "./pickerStrategies";

export interface PickerFormState {
  strategy: PickStrategy;
  range: string;
  mode: PickMode;
  preference: PickPreference;
  count: 1 | 5 | 10;
  frontCount: number;
  backCount: number;
  excludeFront: string;
  excludeBack: string;
  fixedFront: string;
  fixedBack: string;
}

interface PickerControlsProps {
  disabled: boolean;
  state: PickerFormState;
  errors: string[];
  onChange: (patch: Partial<PickerFormState>) => void;
  onGenerate: () => void;
}

export function PickerControls({ disabled, state, errors, onChange, onGenerate }: PickerControlsProps) {
  return (
    <div className="picker-layout">
      <section className="picker-box">
        <h3>选号罗盘</h3>
        <div className="picker-controls">
          <Field label="策略">
            <select value={state.strategy} disabled={disabled} onChange={(e) => onChange({ strategy: e.target.value as PickStrategy })}>
              <option value="compass">综合罗盘</option>
              <option value="balanced">均衡形态</option>
              <option value="hotCold">冷热混元</option>
              <option value="omission">遗漏回响</option>
              <option value="texture">数学纹理</option>
              <option value="calendar">日历呼应</option>
              <option value="random">纯随机</option>
            </select>
          </Field>
          <Field label="区间">
            <select value={state.range} disabled={disabled} onChange={(e) => onChange({ range: e.target.value })}>
              <option value="30">近30期</option>
              <option value="50">近50期</option>
              <option value="100">近100期</option>
              <option value="200">近200期</option>
              <option value="all">全部</option>
            </select>
          </Field>
          <Field label="票型">
            <select value={state.mode} disabled={disabled} onChange={(e) => onChange({ mode: e.target.value as PickMode })}>
              <option value="single">单式</option>
              <option value="compound">复式</option>
            </select>
          </Field>
          <Field label="生成">
            <select value={state.count} disabled={disabled} onChange={(e) => onChange({ count: Number(e.target.value) as 1 | 5 | 10 })}>
              <option value={1}>1 注</option>
              <option value={5}>5 注</option>
              <option value={10}>10 注</option>
            </select>
          </Field>
        </div>
        {state.mode === "compound" && (
          <div className="picker-controls picker-controls--compact">
            <Field label="前区个数"><input type="number" min={6} max={12} value={state.frontCount} disabled={disabled} onChange={(e) => onChange({ frontCount: Number(e.target.value) })} /></Field>
            <Field label="后区个数"><input type="number" min={3} max={6} value={state.backCount} disabled={disabled} onChange={(e) => onChange({ backCount: Number(e.target.value) })} /></Field>
          </div>
        )}
      </section>

      <section className="picker-box">
        <h3>约束设置</h3>
        <div className="picker-controls">
          <Field label="偏好">
            <select value={state.preference} disabled={disabled} onChange={(e) => onChange({ preference: e.target.value as PickPreference })}>
              <option value="auto">自动</option>
              <option value="balance">偏均衡</option>
              <option value="hot">偏热号</option>
              <option value="cold">偏冷号</option>
              <option value="omission">偏遗漏</option>
              <option value="texture">偏数学纹理</option>
            </select>
          </Field>
          <Field label="前区定胆"><input value={state.fixedFront} disabled={disabled} onChange={(e) => onChange({ fixedFront: e.target.value })} placeholder="如 08 19" /></Field>
          <Field label="后区定胆"><input value={state.fixedBack} disabled={disabled} onChange={(e) => onChange({ fixedBack: e.target.value })} placeholder="如 05" /></Field>
          <Field label="前区排除"><input value={state.excludeFront} disabled={disabled} onChange={(e) => onChange({ excludeFront: e.target.value })} placeholder="如 01 02 03" /></Field>
          <Field label="后区排除"><input value={state.excludeBack} disabled={disabled} onChange={(e) => onChange({ excludeBack: e.target.value })} placeholder="如 01 12" /></Field>
        </div>
        {errors.length > 0 && <div className="picker-errors">{errors.map((error) => <span key={error}>{error}</span>)}</div>}
        <button className="ritual-button primary" disabled={disabled || errors.length > 0} type="button" onClick={onGenerate}>启动选号仪式</button>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="picker-field"><span>{label}</span>{children}</label>;
}

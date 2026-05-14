import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcCalendarEcho } from "../calculators/calendarEcho";

export function CalendarEchoCard({ draws }: { draws: DltDraw[] }) {
  const data = calcCalendarEcho(draws);
  return (
    <StatCard title="日历呼应" subtitle="看开奖日期里的月份号、日期号，有没有在当期号码里出现。" accent="#ea580c">
      <div className="calendar-summary">
        <Metric label="月份号呼应" value={pct(data.monthRate)} tip="比如 1 月开奖，前区或后区出现 01，就算月份号呼应。" />
        <Metric label="日期号呼应" value={pct(data.dayRate)} tip="比如 14 号开奖，前区出现 14 就算日期号呼应；后区只支持 01-12。" />
        <Metric label="双呼应" value={pct(data.doubleRate)} tip="同一期里，月份号和日期号都至少出现一次。" />
        <Metric label="后区日期号" value={pct(data.dayBackRate)} tip="只统计 1-12 号开奖，因为后区最大到 12。" />
      </div>

      <strong className="calendar-title">月份号 01-12</strong>
      <div className="calendar-month-grid">
        {data.monthRows.map((item) => (
          <div key={item.month} className={item.front + item.back > 0 ? "active" : ""}>
            <b>{pad(item.month)}月</b>
            <span>前区 {item.front}</span>
            <span>后区 {item.back}</span>
          </div>
        ))}
      </div>

      <div className="calendar-split">
        <div>
          <strong className="calendar-title">日期号 Top</strong>
          <div className="calendar-day-list">
            {data.dayRows.map((item) => (
              <span key={item.day}>
                <b>{pad(item.day)}号</b>
                <em>前区 {item.front}</em>
                <em>后区 {item.back}</em>
              </span>
            ))}
          </div>
        </div>
        <div>
          <strong className="calendar-title">最近呼应</strong>
          <div className="calendar-recent">
            {data.recent.map((item) => (
              <div key={item.issue}>
                <b>{item.issue}</b>
                <span>{item.date}</span>
                <small>{describeHit(item)}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="card-note">这里的“月份号”看开奖月份本身，“日期号”看开奖日这一天；后区日期号只在 01-12 号有可能命中。</p>
    </StatCard>
  );
}

function Metric({ label, value, tip }: { label: string; value: string; tip: string }) {
  return <div className="calendar-metric" title={tip}><span>{label}</span><strong>{value}</strong><em>{tip}</em></div>;
}

function describeHit(item: ReturnType<typeof calcCalendarEcho>["recent"][number]) {
  const parts = [];
  if (item.monthFront) parts.push(`前区月份 ${pad(item.month)}`);
  if (item.monthBack) parts.push(`后区月份 ${pad(item.month)}`);
  if (item.dayFront) parts.push(`前区日期 ${pad(item.day)}`);
  if (item.dayBack) parts.push(`后区日期 ${pad(item.day)}`);
  return parts.join(" / ");
}

function pad(num: number) {
  return String(num).padStart(2, "0");
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accent?: string;
}

export function StatCard({ title, subtitle, children, accent }: StatCardProps) {
  return (
    <section className="stat-card" style={{ "--accent": accent || "#2563eb" } as React.CSSProperties}>
      <div className="stat-card__head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

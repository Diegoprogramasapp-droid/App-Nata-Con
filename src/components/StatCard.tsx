import { Card } from "./Card";

type StatCardProps = {
  label: string;
  value: string; // ex: "00:31.02"
  accentColor?: string;
  size?: "sm" | "lg";
};

export function StatCard({ label, value, accentColor, size = "sm" }: StatCardProps) {
  return (
    <Card accentColor={accentColor} className="text-center">
      <div className="text-[0.68rem] font-semibold text-ink-soft">{label}</div>
      <div
        className={`font-display font-semibold text-ink tabular-nums ${
          size === "lg" ? "text-2xl" : "text-base"
        }`}
      >
        {value}
      </div>
    </Card>
  );
}

type BadgeProps = {
  label: string;
  tone?: "gold" | "neutral" | "danger";
};

const tones = {
  gold: "bg-gold-soft text-[#B87700]",
  neutral: "bg-line text-ink-soft",
  danger: "bg-[#F3DCDC] text-[#C24E4E]",
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`text-[0.62rem] font-bold px-2 py-1 rounded-lg ${tones[tone]}`}>
      {label}
    </span>
  );
}

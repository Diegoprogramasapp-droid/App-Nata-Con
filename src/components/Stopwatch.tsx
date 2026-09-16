type StopwatchProps = {
  value: string; // formato "00:31.02"
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

// Números de tempo sempre em fonte display (Oswald) com tabular-nums,
// pra alinhar os dígitos como num cronômetro real.
export function Stopwatch({ value, size = "md" }: StopwatchProps) {
  return (
    <span className={`font-display font-semibold tabular-nums text-ink ${sizes[size]}`}>
      {value}
    </span>
  );
}

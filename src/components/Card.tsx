import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  accentColor?: string; // ex: "#0090C3" — usa como borda superior (cor do estilo de nado)
};

export function Card({ accentColor, className = "", style, children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-line rounded-xl p-3 ${className}`}
      style={{
        borderTop: accentColor ? `3px solid ${accentColor}` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

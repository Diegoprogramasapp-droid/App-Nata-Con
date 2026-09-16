import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "danger";
};

export function Button({ variant = "solid", className = "", children, ...props }: ButtonProps) {
  const base = "h-11 rounded-xl font-semibold text-sm flex items-center justify-center w-full transition-opacity active:opacity-80";

  const variants: Record<string, string> = {
    solid: "bg-ink text-white",
    ghost: "bg-transparent border-[1.5px] border-ink text-ink",
    danger: "bg-transparent border-[1.5px] border-[#C24E4E] text-[#C24E4E]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

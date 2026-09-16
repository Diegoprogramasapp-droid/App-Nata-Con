import { InputHTMLAttributes } from "react";

export function Field(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-10 rounded-xl bg-white border-[1.5px] border-line px-3 text-sm text-ink placeholder:text-ink-soft w-full outline-none focus:border-crawl ${props.className ?? ""}`}
    />
  );
}

type AvatarProps = {
  src?: string;
  size?: number; // px
};

export function Avatar({ src, size = 46 }: AvatarProps) {
  return (
    <div
      className="rounded-full flex-shrink-0 bg-cover bg-center"
      style={{
        width: size,
        height: size,
        background: src ? `url(${src}) center/cover` : "linear-gradient(135deg, #0090C3, #8B5CF6)",
      }}
    />
  );
}

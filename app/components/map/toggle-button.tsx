export function ToggleButton({
  active,
  children,
  onClick,
  style,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={style}
      className={[
        "rounded-md border px-2 py-1 text-left text-[10px] font-semibold tracking-[0.01em] transition",
        active
          ? "border-[#4a154b] bg-[#4a154b] text-white shadow-sm"
          : "border-[#e6e6e6] bg-[#f9f0ff] text-[#4a154b] hover:border-[#4a154b] hover:bg-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

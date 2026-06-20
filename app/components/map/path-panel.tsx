import { paths, type Path } from "@/lib/map-data";
import { ZoomIcon } from "./icons";
import { ToggleButton } from "./toggle-button";

export function PathPanel({
  onTogglePath,
  onZoomIn,
  onZoomOut,
  selectedPathIds,
}: {
  onTogglePath: (pathId: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  selectedPathIds: string[];
}) {
  return (
    <section className="rounded-xl border border-[#e6e6e6] bg-white/92 p-2.5 shadow-xl backdrop-blur-md">
      <h2 className="text-[11px] font-bold tracking-[0.01em] text-[#4a154b]">
        Paths
      </h2>
      <div className="mt-2 grid gap-1">
        {paths.map((path: Path) => (
          <ToggleButton
            key={path.id}
            active={selectedPathIds.includes(path.id)}
            onClick={() => onTogglePath(path.id)}
            style={
              selectedPathIds.includes(path.id)
                ? {
                    backgroundColor: path.color,
                    borderColor: path.color,
                    color: path.id === "gandalf" ? "#1d1d1d" : undefined,
                  }
                : undefined
            }
          >
            {path.name}
          </ToggleButton>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e6e6e6] bg-[#f9f0ff] text-[#4a154b] transition hover:border-[#4a154b]"
        >
          <ZoomIcon direction="in" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e6e6e6] bg-[#f9f0ff] text-[#4a154b] transition hover:border-[#4a154b]"
        >
          <ZoomIcon direction="out" />
        </button>
      </div>
    </section>
  );
}

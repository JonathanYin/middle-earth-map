import type { Path, Place, StoryEvent } from "@/lib/map-data";
import { mapHeight, mapWidth, toMapPoint } from "./geometry";
import type { SelectedItem, ViewState } from "./types";

export function MapStage({
  filteredEvents,
  filteredPlaces,
  labelScale,
  markerScale,
  onSelect,
  placesById,
  view,
  visiblePaths,
}: {
  filteredEvents: StoryEvent[];
  filteredPlaces: Place[];
  labelScale: number;
  markerScale: number;
  onSelect: (selected: SelectedItem) => void;
  placesById: Map<string, Place>;
  view: ViewState;
  visiblePaths: Path[];
}) {
  return (
    <div
      className="absolute left-0 top-0 origin-top-left select-none"
      style={{
        width: mapWidth,
        height: mapHeight,
        transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/map/map.webp"
        alt="Detailed illustrated map of Middle-earth"
        width={mapWidth}
        height={mapHeight}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <svg
        className="absolute inset-0 z-10 h-full w-full overflow-visible"
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        aria-hidden="true"
      >
        {visiblePaths.map((path) => (
          <g key={path.id}>
            <polyline
              points={path.points
                .map((point) => {
                  const mapPoint = toMapPoint(point);
                  return `${mapPoint.x},${mapPoint.y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#1f1306"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="28"
              opacity="0.6"
            />
            <polyline
              points={path.points
                .map((point) => {
                  const mapPoint = toMapPoint(point);
                  return `${mapPoint.x},${mapPoint.y}`;
                })
                .join(" ")}
              fill="none"
              stroke={path.color}
              strokeDasharray="18 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="12"
            />
          </g>
        ))}
      </svg>

      {view.scale >= 0.34 &&
        visiblePaths.map((path) => {
          const labelPoint = toMapPoint(
            path.points[Math.floor(path.points.length / 2)],
          );

          return (
            <button
              key={path.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelect({ kind: "path", item: path });
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stone-950 bg-stone-950/85 px-5 py-2 text-[32px] font-semibold text-white shadow-lg transition hover:z-40 hover:scale-105"
              style={{
                left: labelPoint.x,
                top: labelPoint.y,
                outline: `2px solid ${path.color}`,
                transform: `translate(-50%, -50%) scale(${labelScale})`,
                transformOrigin: "center",
              }}
            >
              {path.name}
            </button>
          );
        })}

      {filteredPlaces.map((place) => {
        const point = toMapPoint(place.coordinate);

        return (
          <button
            key={place.id}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect({ kind: "place", item: place });
            }}
            className="group absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none"
            style={{
              left: point.x,
              top: point.y,
              transform: `translate(-50%, -50%) scale(${markerScale})`,
              transformOrigin: "center",
            }}
            aria-label={`Open ${place.name}`}
          >
            <span className="block h-14 w-14 rounded-full border-[7px] border-stone-950 bg-amber-300 shadow-[0_0_0_12px_rgba(245,158,11,0.26)] transition group-hover:scale-125 group-focus-visible:scale-125" />
            <span className="absolute left-1/2 top-16 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded bg-stone-950/90 px-4 py-2 text-[30px] font-medium text-stone-50 shadow-lg group-hover:block group-focus-visible:block">
              {place.name}
            </span>
          </button>
        );
      })}

      {filteredEvents.map((event) => {
        const place = event.placeId ? placesById.get(event.placeId) : null;
        const coordinate = event.coordinate ?? place?.coordinate;
        if (!coordinate) {
          return null;
        }

        const point = toMapPoint(coordinate);

        return (
          <button
            key={event.id}
            type="button"
            onClick={(pointerEvent) => {
              pointerEvent.stopPropagation();
              onSelect({ kind: "event", item: event });
            }}
            className="group absolute z-30 rounded-sm focus:outline-none"
            style={{
              left: point.x,
              top: point.y,
              transform: `translate(-50%, -50%) scale(${markerScale})`,
              transformOrigin: "center",
            }}
            aria-label={`Open ${event.title}`}
          >
            <span className="block h-12 w-12 rotate-45 rounded-sm border-[6px] border-stone-950 bg-red-500 shadow-[0_0_0_12px_rgba(239,68,68,0.2)] transition group-hover:scale-125 group-focus-visible:scale-125" />
            <span className="absolute left-1/2 top-16 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded bg-stone-950/90 px-4 py-2 text-[30px] font-medium text-stone-50 shadow-lg group-hover:block group-focus-visible:block">
              {event.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

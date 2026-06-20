"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  bookLabels,
  categoryLabels,
  eventTypeLabels,
  events,
  paths,
  places,
  type Book,
  type Coordinate,
  type EventType,
  type Path,
  type Place,
  type PlaceCategory,
  type StoryEvent,
} from "@/lib/map-data";

type SelectedItem =
  | { kind: "place"; item: Place }
  | { kind: "event"; item: StoryEvent }
  | { kind: "path"; item: Path };

type ViewState = {
  scale: number;
  x: number;
  y: number;
};

const placeCategories = Object.keys(categoryLabels) as PlaceCategory[];
const eventTypes = Object.keys(eventTypeLabels) as EventType[];
const books: Book[] = ["hobbit", "lotr"];
const mapWidth = 5000;
const mapHeight = 4344;
const fallbackViewport = { width: 1440, height: 1000 };
const maxZoom = 1;
const buttonZoomStep = 0.05;
const wheelZoomStep = 0.018;

function getFittedScale(width: number, height: number) {
  return Math.min(width / mapWidth, height / mapHeight);
}

function getCenteredView(width: number, height: number): ViewState {
  const scale = getFittedScale(width, height);

  return {
    scale,
    x: (width - mapWidth * scale) / 2,
    y: (height - mapHeight * scale) / 2,
  };
}

function toMapPoint(coordinate: Coordinate) {
  return {
    x: coordinate.x * mapWidth,
    y: coordinate.y * mapHeight,
  };
}

function ToggleButton({
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

function ZoomIcon({ direction }: { direction: "in" | "out" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
      <path d="M8 11h6" />
      {direction === "in" ? <path d="M11 8v6" /> : null}
    </svg>
  );
}

function PanelIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function DetailPanel({
  selected,
  onClose,
}: {
  selected: SelectedItem | null;
  onClose: () => void;
}) {
  if (!selected) {
    return null;
  }

  const title =
    selected.kind === "place"
      ? selected.item.name
      : selected.kind === "event"
        ? selected.item.title
        : selected.item.name;
  const eyebrow =
    selected.kind === "place"
      ? `${categoryLabels[selected.item.category]} • ${selected.item.region}`
      : selected.kind === "event"
        ? `${eventTypeLabels[selected.item.type]} • ${selected.item.chronology}`
        : `${selected.item.quest} • ${bookLabels[selected.item.book]}`;
  const booksForItem =
    selected.kind === "path" ? [selected.item.book] : selected.item.books;

  return (
    <section className="rounded-xl border border-[#e6e6e6] bg-white/95 p-3 text-xs text-[#1d1d1d] shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.01em] text-[#4a154b] capitalize">
            {selected.kind}
          </p>
          <h2 className="mt-1 text-lg font-bold text-[#1d1d1d]">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[#e6e6e6] bg-[#f9f0ff] px-3 py-1 text-xs font-semibold text-[#4a154b] transition hover:border-[#4a154b]"
        >
          Close
        </button>
      </div>
      <p className="mt-2 text-[11px] font-medium tracking-[0.01em] text-[#696969]">
        {eyebrow}
      </p>
      <p className="mt-2 leading-5">{selected.item.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {booksForItem.map((book) => (
          <span
            key={book}
            className="rounded-full border border-[#e6e6e6] bg-[#f4ede4] px-2.5 py-1 text-xs font-semibold text-[#1d1d1d]"
          >
            {bookLabels[book]}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function MiddleEarthMap() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(
    null,
  );
  const [view, setView] = useState<ViewState>(() =>
    getCenteredView(fallbackViewport.width, fallbackViewport.height),
  );
  const [query, setQuery] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Book[]>(books);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [selectedCategories, setSelectedCategories] =
    useState<PlaceCategory[]>(placeCategories);
  const [selectedEventTypes, setSelectedEventTypes] =
    useState<EventType[]>(eventTypes);
  const [selectedPathIds, setSelectedPathIds] = useState<string[]>(
    paths.map((path) => path.id),
  );
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const focusMode = view.scale > 0.55;

  const placesById = useMemo(
    () => new Map(places.map((place) => [place.id, place])),
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPlaces = places.filter((place) => {
    const matchesBook = place.books.some((book) => selectedBooks.includes(book));
    const matchesCategory = selectedCategories.includes(place.category);
    const matchesQuery =
      !normalizedQuery ||
      [place.name, place.region, place.description].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );

    return showPlaces && matchesBook && matchesCategory && matchesQuery;
  });

  const filteredEvents = events.filter((event) => {
    const place = event.placeId ? placesById.get(event.placeId) : null;
    const matchesBook = event.books.some((book) => selectedBooks.includes(book));
    const matchesType = selectedEventTypes.includes(event.type);
    const matchesQuery =
      !normalizedQuery ||
      [event.title, event.chronology, event.description, place?.name ?? ""].some(
        (value) => value.toLowerCase().includes(normalizedQuery),
      );

    return showEvents && matchesBook && matchesType && matchesQuery;
  });

  const visiblePaths = paths.filter(
    (path) =>
      selectedPathIds.includes(path.id) && selectedBooks.includes(path.book),
  );
  const markerScale = view.scale > 0.48 ? 0.48 / view.scale : 1;
  const labelScale = view.scale > 0.38 ? 0.38 / view.scale : 1;

  function getViewportSize() {
    const viewport = viewportRef.current;

    return {
      width: viewport?.clientWidth || fallbackViewport.width,
      height: viewport?.clientHeight || fallbackViewport.height,
    };
  }

  function clampViewToSize(
    nextView: ViewState,
    width: number,
    height: number,
  ): ViewState {
    const scale = Math.min(
      maxZoom,
      Math.max(getFittedScale(width, height), nextView.scale),
    );
    const scaledWidth = mapWidth * scale;
    const scaledHeight = mapHeight * scale;
    const minX = Math.min(0, width - scaledWidth);
    const maxX = Math.max(0, width - scaledWidth);
    const minY = Math.min(0, height - scaledHeight);
    const maxY = Math.max(0, height - scaledHeight);

    return {
      scale,
      x:
        scaledWidth <= width
          ? (width - scaledWidth) / 2
          : Math.min(maxX, Math.max(minX, nextView.x)),
      y:
        scaledHeight <= height
          ? (height - scaledHeight) / 2
          : Math.min(maxY, Math.max(minY, nextView.y)),
    };
  }

  function clampView(nextView: ViewState): ViewState {
    const { width, height } = getViewportSize();
    return clampViewToSize(nextView, width, height);
  }

  useEffect(() => {
    const syncViewToViewport = () => {
      const width = viewportRef.current?.clientWidth || fallbackViewport.width;
      const height = viewportRef.current?.clientHeight || fallbackViewport.height;

      window.requestAnimationFrame(() => {
        setView((current) => clampViewToSize(current, width, height));
      });
    };

    syncViewToViewport();
    window.requestAnimationFrame(() => {
      if (window.innerWidth >= 640) {
        setLeftPanelOpen(true);
        setRightPanelOpen(true);
      }
    });
    window.addEventListener("resize", syncViewToViewport);

    return () => {
      window.removeEventListener("resize", syncViewToViewport);
    };
  }, []);

  function toggleValue<T>(value: T, values: T[], setValues: (next: T[]) => void) {
    if (values.includes(value)) {
      setValues(values.filter((candidate) => candidate !== value));
    } else {
      setValues([...values, value]);
    }
  }

  function resetView() {
    const { width, height } = getViewportSize();
    setView(getCenteredView(width, height));
  }

  function zoomBy(delta: number, origin?: { x: number; y: number }) {
    setView((current) =>
      {
        const { width, height } = getViewportSize();
        const zoomOrigin = origin ?? { x: width / 2, y: height / 2 };
        const nextScale = current.scale + delta;
        const mapX = (zoomOrigin.x - current.x) / current.scale;
        const mapY = (zoomOrigin.y - current.y) / current.scale;

        return clampView({
          scale: nextScale,
          x: zoomOrigin.x - mapX * nextScale,
          y: zoomOrigin.y - mapY * nextScale,
        });
      },
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4ede4] text-[#1d1d1d]">
      <div
        ref={viewportRef}
        className="absolute inset-0 cursor-grab overflow-hidden active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onWheel={(event) => {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          zoomBy(event.deltaY > 0 ? -wheelZoomStep : wheelZoomStep, {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
        onPointerDown={(event) => {
          dragRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== event.pointerId) {
            return;
          }

          const dx = event.clientX - drag.x;
          const dy = event.clientY - drag.y;
          dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
          setView((current) =>
            clampView({
              ...current,
              x: current.x + dx,
              y: current.y + dy,
            }),
          );
        }}
        onPointerUp={(event) => {
          if (dragRef.current?.pointerId === event.pointerId) {
            dragRef.current = null;
          }
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
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
            className="absolute inset-0 h-full w-full overflow-visible"
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

          {view.scale >= 0.34 && visiblePaths.map((path) => {
            const labelPoint = toMapPoint(
              path.points[Math.floor(path.points.length / 2)],
            );
            return (
              <button
                key={path.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected({ kind: "path", item: path });
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stone-950 bg-stone-950/85 px-5 py-2 text-[32px] font-semibold text-white shadow-lg transition hover:scale-105"
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
                  setSelected({ kind: "place", item: place });
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none"
                style={{
                  left: point.x,
                  top: point.y,
                  transform: `translate(-50%, -50%) scale(${markerScale})`,
                  transformOrigin: "center",
                }}
                aria-label={`Open ${place.name}`}
              >
                <span className="block h-14 w-14 rounded-full border-[7px] border-stone-950 bg-amber-300 shadow-[0_0_0_12px_rgba(245,158,11,0.26)] transition group-hover:scale-125 group-focus-visible:scale-125" />
                <span className="absolute left-1/2 top-16 hidden -translate-x-1/2 whitespace-nowrap rounded bg-stone-950/90 px-4 py-2 text-[30px] font-medium text-stone-50 shadow-lg group-hover:block group-focus-visible:block">
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
                  setSelected({ kind: "event", item: event });
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm border-[6px] border-stone-950 bg-red-500 shadow-[0_0_0_12px_rgba(239,68,68,0.2)] transition hover:scale-125 focus:outline-none focus-visible:scale-125"
                style={{
                  left: point.x,
                  top: point.y,
                  transform: `translate(-50%, -50%) rotate(45deg) scale(${markerScale})`,
                  transformOrigin: "center",
                }}
                aria-label={`Open ${event.title}`}
              >
                <span className="block h-12 w-12" />
                <span className="absolute left-1/2 top-14 hidden -translate-x-1/2 -rotate-45 whitespace-nowrap rounded bg-stone-950/90 px-4 py-2 text-[30px] font-medium text-stone-50 shadow-lg group-hover:block group-focus-visible:block">
                  {event.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        aria-label={leftPanelOpen ? "Collapse map filters" : "Expand map filters"}
        title={leftPanelOpen ? "Collapse filters" : "Expand filters"}
        onClick={() => setLeftPanelOpen((current) => !current)}
        className="absolute left-2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] bg-white text-[#4a154b] shadow-xl transition hover:border-[#4a154b] sm:left-3 sm:top-3"
      >
        <PanelIcon direction={leftPanelOpen ? "left" : "right"} />
      </button>

      <aside
        className={[
          "absolute left-0 top-0 z-10 flex max-h-[34dvh] w-full flex-col gap-1.5 overflow-y-auto overscroll-contain p-2 pt-12 transition duration-200 sm:max-h-[calc(100dvh-1.5rem)] sm:w-[272px] sm:p-2.5 sm:pt-14",
          leftPanelOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0",
        ].join(" ")}
        style={{ touchAction: "pan-y" }}
        onWheel={(event) => event.stopPropagation()}
      >
        <section className="rounded-xl border border-[#e6e6e6] bg-white/92 p-2.5 shadow-xl backdrop-blur-md">
          <p className="text-[10px] font-bold tracking-[0.01em] text-[#4a154b]">
            Third Age Atlas
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1d1d1d]">
            Middle-earth Map
          </h1>
          {focusMode ? null : (
            <p className="mt-1.5 text-[11px] leading-4 text-[#696969]">
              Follow the Quest for Erebor and the Quest of the Ring.
            </p>
          )}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search places and events"
            className="mt-2 w-full rounded-md border border-[#e6e6e6] bg-white px-2.5 py-1.5 text-xs text-[#1d1d1d] outline-none transition placeholder:text-[#696969] focus:border-[#4a154b]"
          />
        </section>

        <section className="rounded-xl border border-[#e6e6e6] bg-white/92 p-2.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[11px] font-bold tracking-[0.01em] text-[#4a154b]">
              Layers
            </h2>
            <button
              type="button"
              onClick={resetView}
              className="rounded-full border border-[#e6e6e6] bg-[#f9f0ff] px-3 py-1 text-[11px] font-bold text-[#4a154b] transition hover:border-[#4a154b]"
            >
              Reset view
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1">
            {books.map((book) => (
              <ToggleButton
                key={book}
                active={selectedBooks.includes(book)}
                onClick={() => toggleValue(book, selectedBooks, setSelectedBooks)}
              >
                {bookLabels[book]}
              </ToggleButton>
            ))}
            <ToggleButton
              active={showPlaces}
              onClick={() => setShowPlaces((current) => !current)}
            >
              Places
            </ToggleButton>
            <ToggleButton
              active={showEvents}
              onClick={() => setShowEvents((current) => !current)}
            >
              Events
            </ToggleButton>
          </div>

          <h3 className="mt-3 text-[10px] font-bold tracking-[0.01em] text-[#696969]">
            Place groups
          </h3>
          <div className="mt-1.5 grid grid-cols-2 gap-1">
            {placeCategories.map((category) => (
              <ToggleButton
                key={category}
                active={selectedCategories.includes(category)}
                onClick={() =>
                  toggleValue(category, selectedCategories, setSelectedCategories)
                }
              >
                {categoryLabels[category]}
              </ToggleButton>
            ))}
          </div>

          <h3 className="mt-3 text-[10px] font-bold tracking-[0.01em] text-[#696969]">
            Event types
          </h3>
          <div className="mt-1.5 grid grid-cols-2 gap-1">
            {eventTypes.map((type) => (
              <ToggleButton
                key={type}
                active={selectedEventTypes.includes(type)}
                onClick={() =>
                  toggleValue(type, selectedEventTypes, setSelectedEventTypes)
                }
              >
                {eventTypeLabels[type]}
              </ToggleButton>
            ))}
          </div>
        </section>
      </aside>

      <button
        type="button"
        aria-label={rightPanelOpen ? "Collapse map legend" : "Expand map legend"}
        title={rightPanelOpen ? "Collapse legend" : "Expand legend"}
        onClick={() => setRightPanelOpen((current) => !current)}
        className="absolute bottom-2 right-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] bg-white text-[#4a154b] shadow-xl transition hover:border-[#4a154b] sm:bottom-3 sm:right-3"
      >
        <PanelIcon direction={rightPanelOpen ? "right" : "left"} />
      </button>

      <section
        className={[
          "absolute bottom-0 right-0 z-10 flex max-h-[38dvh] w-full flex-col gap-1.5 overflow-y-auto overscroll-contain p-2 pb-12 transition duration-200 sm:bottom-3 sm:right-3 sm:max-h-[52dvh] sm:w-[292px] sm:p-0 sm:pb-12",
          rightPanelOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0",
        ].join(" ")}
        style={{ touchAction: "pan-y" }}
        onWheel={(event) => event.stopPropagation()}
      >
        <section className="rounded-xl border border-[#e6e6e6] bg-white/92 p-2.5 shadow-xl backdrop-blur-md">
          <h2 className="text-[11px] font-bold tracking-[0.01em] text-[#4a154b]">
            Paths
          </h2>
          <div className="mt-2 grid gap-1">
            {paths.map((path) => (
              <ToggleButton
                key={path.id}
                active={selectedPathIds.includes(path.id)}
                onClick={() => toggleValue(path.id, selectedPathIds, setSelectedPathIds)}
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
              onClick={() => zoomBy(buttonZoomStep)}
              aria-label="Zoom in"
              title="Zoom in"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e6e6e6] bg-[#f9f0ff] text-[#4a154b] transition hover:border-[#4a154b]"
            >
              <ZoomIcon direction="in" />
            </button>
            <button
              type="button"
              onClick={() => zoomBy(-buttonZoomStep)}
              aria-label="Zoom out"
              title="Zoom out"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e6e6e6] bg-[#f9f0ff] text-[#4a154b] transition hover:border-[#4a154b]"
            >
              <ZoomIcon direction="out" />
            </button>
          </div>
        </section>

        <DetailPanel selected={selected} onClose={() => setSelected(null)} />

      </section>
    </main>
  );
}

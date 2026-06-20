"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  events,
  paths,
  places,
  type Book,
  type EventType,
  type PlaceCategory,
} from "@/lib/map-data";
import { DetailPanel } from "./map/detail-panel";
import { filterEvents, filterPlaces } from "./map/filtering";
import { FilterPanel } from "./map/filter-panel";
import {
  buttonZoomStep,
  fallbackViewport,
  getCenteredView,
  getFittedScale,
  mapHeight,
  mapWidth,
  maxZoom,
  wheelZoomStep,
} from "./map/geometry";
import { PanelIcon } from "./map/icons";
import { MapStage } from "./map/map-stage";
import { PathPanel } from "./map/path-panel";
import type { SelectedItem, ViewState } from "./map/types";

const placeCategories = Object.keys({
  hobbits: true,
  elves: true,
  dwarves: true,
  humans: true,
  evil: true,
  wild: true,
}) as PlaceCategory[];
const eventTypes = Object.keys({
  quest: true,
  battle: true,
  encounter: true,
  council: true,
}) as EventType[];
const books: Book[] = ["hobbit", "lotr"];

function toggleValue<T>(value: T, values: T[]) {
  if (values.includes(value)) {
    return values.filter((candidate) => candidate !== value);
  }

  return [...values, value];
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
  const markerScale = view.scale > 0.48 ? 0.48 / view.scale : 1;
  const labelScale = view.scale > 0.38 ? 0.38 / view.scale : 1;

  const placesById = useMemo(
    () => new Map(places.map((place) => [place.id, place])),
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPlaces = filterPlaces({
    normalizedQuery,
    places,
    selectedBooks,
    selectedCategories,
    showPlaces,
  });

  const filteredEvents = filterEvents({
    events,
    normalizedQuery,
    placesById,
    selectedBooks,
    selectedEventTypes,
    showEvents,
  });

  const visiblePaths = paths.filter(
    (path) =>
      selectedPathIds.includes(path.id) && selectedBooks.includes(path.book),
  );

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

  function resetView() {
    const { width, height } = getViewportSize();
    setView(getCenteredView(width, height));
  }

  function zoomBy(delta: number, origin?: { x: number; y: number }) {
    setView((current) => {
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
    });
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
        <MapStage
          filteredEvents={filteredEvents}
          filteredPlaces={filteredPlaces}
          labelScale={labelScale}
          markerScale={markerScale}
          onSelect={setSelected}
          placesById={placesById}
          view={view}
          visiblePaths={visiblePaths}
        />
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
        <FilterPanel
          books={books}
          eventTypes={eventTypes}
          focusMode={focusMode}
          onResetView={resetView}
          onToggleBook={(book) =>
            setSelectedBooks((current) => toggleValue(book, current))
          }
          onToggleCategory={(category) =>
            setSelectedCategories((current) => toggleValue(category, current))
          }
          onToggleEventType={(type) =>
            setSelectedEventTypes((current) => toggleValue(type, current))
          }
          placeCategories={placeCategories}
          query={query}
          selectedBooks={selectedBooks}
          selectedCategories={selectedCategories}
          selectedEventTypes={selectedEventTypes}
          setQuery={setQuery}
          setShowEvents={setShowEvents}
          setShowPlaces={setShowPlaces}
          showEvents={showEvents}
          showPlaces={showPlaces}
        />
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
        <PathPanel
          onTogglePath={(pathId) =>
            setSelectedPathIds((current) => toggleValue(pathId, current))
          }
          onZoomIn={() => zoomBy(buttonZoomStep)}
          onZoomOut={() => zoomBy(-buttonZoomStep)}
          selectedPathIds={selectedPathIds}
        />
        <DetailPanel selected={selected} onClose={() => setSelected(null)} />
      </section>
    </main>
  );
}

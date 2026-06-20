import {
  bookLabels,
  categoryLabels,
  eventTypeLabels,
  type Book,
  type EventType,
  type PlaceCategory,
} from "@/lib/map-data";
import { ToggleButton } from "./toggle-button";

export function FilterPanel({
  books,
  eventTypes,
  focusMode,
  onResetView,
  onToggleBook,
  onToggleCategory,
  onToggleEventType,
  query,
  selectedBooks,
  selectedCategories,
  selectedEventTypes,
  showEvents,
  showPlaces,
  placeCategories,
  setQuery,
  setShowEvents,
  setShowPlaces,
}: {
  books: Book[];
  eventTypes: EventType[];
  focusMode: boolean;
  onResetView: () => void;
  onToggleBook: (book: Book) => void;
  onToggleCategory: (category: PlaceCategory) => void;
  onToggleEventType: (type: EventType) => void;
  query: string;
  selectedBooks: Book[];
  selectedCategories: PlaceCategory[];
  selectedEventTypes: EventType[];
  showEvents: boolean;
  showPlaces: boolean;
  placeCategories: PlaceCategory[];
  setQuery: (query: string) => void;
  setShowEvents: (show: boolean) => void;
  setShowPlaces: (show: boolean) => void;
}) {
  return (
    <>
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
            onClick={onResetView}
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
              onClick={() => onToggleBook(book)}
            >
              {bookLabels[book]}
            </ToggleButton>
          ))}
          <ToggleButton
            active={showPlaces}
            onClick={() => setShowPlaces(!showPlaces)}
          >
            Places
          </ToggleButton>
          <ToggleButton
            active={showEvents}
            onClick={() => setShowEvents(!showEvents)}
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
              onClick={() => onToggleCategory(category)}
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
              onClick={() => onToggleEventType(type)}
            >
              {eventTypeLabels[type]}
            </ToggleButton>
          ))}
        </div>
      </section>
    </>
  );
}

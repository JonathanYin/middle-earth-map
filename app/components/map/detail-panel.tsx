import {
  bookLabels,
  categoryLabels,
  eventTypeLabels,
} from "@/lib/map-data";
import type { SelectedItem } from "./types";

export function DetailPanel({
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

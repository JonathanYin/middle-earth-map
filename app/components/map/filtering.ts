import type { Book, EventType, PlaceCategory, Place, StoryEvent } from "@/lib/map-data";

export function filterPlaces({
  normalizedQuery,
  places,
  selectedBooks,
  selectedCategories,
  showPlaces,
}: {
  normalizedQuery: string;
  places: Place[];
  selectedBooks: Book[];
  selectedCategories: PlaceCategory[];
  showPlaces: boolean;
}) {
  return places.filter((place) => {
    const matchesBook = place.books.some((book) => selectedBooks.includes(book));
    const matchesCategory = selectedCategories.includes(place.category);
    const matchesQuery =
      !normalizedQuery ||
      [place.name, place.region, place.description].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );

    return showPlaces && matchesBook && matchesCategory && matchesQuery;
  });
}

export function filterEvents({
  events,
  normalizedQuery,
  placesById,
  selectedBooks,
  selectedEventTypes,
  showEvents,
}: {
  events: StoryEvent[];
  normalizedQuery: string;
  placesById: Map<string, Place>;
  selectedBooks: Book[];
  selectedEventTypes: EventType[];
  showEvents: boolean;
}) {
  return events.filter((event) => {
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
}

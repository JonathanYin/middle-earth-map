import type { Path, Place, StoryEvent } from "@/lib/map-data";

export type SelectedItem =
  | { kind: "place"; item: Place }
  | { kind: "event"; item: StoryEvent }
  | { kind: "path"; item: Path };

export type ViewState = {
  scale: number;
  x: number;
  y: number;
};

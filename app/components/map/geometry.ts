import type { Coordinate } from "@/lib/map-data";
import type { ViewState } from "./types";

export const mapWidth = 5000;
export const mapHeight = 4344;
export const fallbackViewport = { width: 1440, height: 1000 };
export const maxZoom = 1;
export const buttonZoomStep = 0.05;
export const wheelZoomStep = 0.018;

export function getFittedScale(width: number, height: number) {
  return Math.min(width / mapWidth, height / mapHeight);
}

export function getCenteredView(width: number, height: number): ViewState {
  const scale = getFittedScale(width, height);

  return {
    scale,
    x: (width - mapWidth * scale) / 2,
    y: (height - mapHeight * scale) / 2,
  };
}

export function toMapPoint(coordinate: Coordinate) {
  return {
    x: coordinate.x * mapWidth,
    y: coordinate.y * mapHeight,
  };
}

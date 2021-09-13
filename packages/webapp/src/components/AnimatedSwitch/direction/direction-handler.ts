import { Position } from "../Slider";

export type Direction = {
  from: Position;
  to: Position;
};

export const NEXT_DIRECTION: Direction = {
  from: Position.FROM_RIGHT,
  to: Position.TO_LEFT,
};

export const BACK_DIRECTION: Direction = {
  from: Position.FROM_LEFT,
  to: Position.TO_RIGHT,
};

export const DEFAULT_DIRECTION: Direction = {
  from: Position.FROM_RIGHT,
  to: Position.TO_LEFT,
};

export interface DirectionHandler {
  handle(prev: string, next: string): Direction | false;
}

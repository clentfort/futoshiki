export type Matrix<T> = T[][];

export type Coordinate = `${number},${number}`;
export type Relation = "<" | ">";

export type RelativeConstraint = [`${Coordinate}|${Coordinate}`, Relation];
export type AbsoluteConstraint = [Coordinate, Set<number>];
export type Constraint = AbsoluteConstraint | RelativeConstraint;

export type Solution = Matrix<number>;

export interface Constraints extends Map<Constraint[0], Constraint[1]> {
  get(key: AbsoluteConstraint[0]): AbsoluteConstraint[1] | undefined;
  get(key: RelativeConstraint[0]): RelativeConstraint[1] | undefined;
}

export function isAbsoluteConstraint(
  constraint:
    | Constraint
    | [
        AbsoluteConstraint[0] | RelativeConstraint[0],
        AbsoluteConstraint[1] | RelativeConstraint[1],
      ],
): constraint is AbsoluteConstraint {
  const [key] = constraint;
  return /^\d,\d$/.test(key);
}

export function isRelativeConstraint(
  constraint:
    | Constraint
    | [
        AbsoluteConstraint[0] | RelativeConstraint[0],
        AbsoluteConstraint[1] | RelativeConstraint[1],
      ],
): constraint is RelativeConstraint {
  const [key] = constraint;
  return /^\d,\d\|\d,\d$/.test(key);
}

export function parseCoordinate(coordinate: Coordinate): [number, number] {
  // @ts-expect-error This is a valid coordinate
  return coordinate.split(",").map(Number);
}

export function parseCoordinatePair(
  coordinatePair: `${Coordinate}|${Coordinate}`,
): [[number, number], [number, number]] {
  // @ts-expect-error This is a valid coordinate pair
  return coordinatePair.split("|").map(parseCoordinate);
}

export function formatCoordinate(x: number, y: number): Coordinate {
  return `${x},${y}`;
}

export function formatCoordinatePair(
  a: [number, number],
  b: [number, number],
): `${Coordinate}|${Coordinate}` {
  return `${formatCoordinate(...a)}|${formatCoordinate(...b)}`;
}

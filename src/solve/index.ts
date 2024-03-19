import {
  Constraints,
  isAbsoluteConstraint,
  isRelativeConstraint,
  parseCoordinate,
  parseCoordinatePair,
  Solution,
} from "../types";
import program from "./__generated__/solve_futoshiki";

function createCompound(name: string, args: unknown[]) {
  return { $t: "t", [name]: args };
}

function constraintsToList(constraints: Constraints) {
  return Array.from(constraints).map((constraint) => {
    if (isAbsoluteConstraint(constraint)) {
      const [key, values] = constraint;
      const coordinate = createCompound(",", parseCoordinate(key));
      return createCompound("=", [coordinate, Array.from(values)]);
    }

    if (isRelativeConstraint(constraint)) {
      const [key, relation] = constraint;
      const coordinates = parseCoordinatePair(key).map((coordinates) =>
        createCompound(",", coordinates),
      );

      return createCompound(relation, coordinates);
    }

    throw new Error(`Unknown constraint ${JSON.stringify(constraint)}`);
  });
}

/**
 * Takes an iterator that returns its last value and turns it into an iterator
 * that yields all values
 * @param iteratorWithReturnValue
 * @returns
 */
function yieldReturn<T>(
  iteratorWithReturnValue: IterableIterator<T>,
): IterableIterator<T> {
  return {
    [Symbol.iterator]: () => yieldReturn(iteratorWithReturnValue),
    next: () => {
      const result = iteratorWithReturnValue.next();
      if (result.done === true && result.value !== undefined) {
        return { done: false, value: result.value as T };
      }
      return result;
    },
  };
}

/**
 * Maps the yielded values of an iterator
 * @param iterator
 * @param map
 * @returns
 */
function mapIterator<A, D>(
  iterator: IterableIterator<A>,
  map: (a: A) => D,
): IterableIterator<D> {
  return {
    [Symbol.iterator]: () => mapIterator(iterator, map),
    next: () => {
      const result = iterator.next();
      if (result.done) {
        return result;
      }
      return { done: false, value: map(result.value) };
    },
  };
}

export default async function solve(
  size: number,
  constraints: Constraints,
): Promise<IterableIterator<Solution>> {
  // Argument -q runs the program in quiet mode. No output is printed to the console.
  const { prolog } = await program({ arguments: ["-q"] });

  // @ts-expect-error The type definitions for the prolog object are incomplete.
  const iterator: IterableIterator<{ Solution: Solution }> = prolog.query(
    // Need to assign the solved Grid to the Solution variable so it's available
    // on the result object.
    `solve_futoshiki(Size, Constraints, Solution).`,
    { Constraints: constraintsToList(constraints), Size: size },
  );

  return mapIterator(yieldReturn(iterator), (result) => result.Solution);
}

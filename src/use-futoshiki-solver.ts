import { useEffect, useState } from "react";

import solve from "./solve";
import { Constraints, Solution } from "./types";

export default function useFutoshikiSolver(
  size: number,
  constraints: Constraints,
) {
  const [done, setDone] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    let active = true;
    clearSolutions();

    void solve(size, constraints).then(async (solutions) => {
      while (await awaitAnimationFrame()) {
        const { done, values } = take(random(3, 25), solutions);
        if (!active) {
          return;
        }

        setSolutions((solutions) => [...solutions, ...values]);
        if (done) {
          setDone(true);
          break;
        }
      }
    });
    return () => {
      active = false;
    };
  }, [size, constraints]);

  function clearSolutions() {
    setSolutions([]);
    setDone(false);
  }

  return [done, solutions, clearSolutions] as const;
}

function awaitAnimationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Take the first n values from an iterable.
 * @param n
 * @param iterable
 * @returns
 */
export function take<T>(
  n: number,
  iterable: IterableIterator<T>,
): { done: boolean; values: T[] } {
  const values = [];
  for (let i = 0; i < n; i++) {
    // @TODO: Figure out why this is reported as unsafe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { done, value } = iterable.next();
    if (value) {
      values.push(value);
    }
    if (done) {
      return { done: true, values };
    }
  }
  return { done: false, values };
}

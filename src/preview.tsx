import AbsoluteConstraint from "./absolute-constraint";
import Board from "./board";
import RelativeConstraint from "./relative-constraint";
import {
  type Constraints,
  formatCoordinatePair,
  type Matrix,
  type Solution,
} from "./types";

interface PreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  constraints: Constraints;
  size: number;
  solutions: Solution[];
}

export default function Preview({
  constraints,
  size,
  solutions,
  ...props
}: PreviewProps) {
  if (solutions.length === 0) {
    return null;
  }
  const gathered = gatherSolutions(solutions);
  return (
    <Board {...props} size={size}>
      {({ column, row, style, type }) => {
        if (type === "vertical-constraint") {
          const key = formatCoordinatePair(
            [column / 2, (row - 1) / 2],
            [column / 2, (row + 1) / 2],
          );
          return (
            <RelativeConstraint
              greater="⋁"
              less="⋀"
              style={style}
              value={constraints.get(key)}
            />
          );
        }

        if (type === "horizontal-constraint") {
          const key = formatCoordinatePair(
            [(column - 1) / 2, row / 2],
            [(column + 1) / 2, row / 2],
          );
          return (
            <RelativeConstraint
              greater=">"
              less="<"
              style={style}
              value={constraints.get(key)}
            />
          );
        }

        const x = column / 2;
        const y = row / 2;
        const values = gathered[y][x];
        return <AbsoluteConstraint size={size} style={style} values={values} />;
      }}
    </Board>
  );
}

function gatherSolutions([first, ...rest]: Solution[]): Matrix<Set<number>> {
  const gathered = first.map((row) => {
    return row.map((cell) => {
      return new Set([cell]);
    });
  });

  rest.forEach((solution) => {
    solution.forEach((row, y) => {
      row.forEach((cell, x) => {
        gathered[y][x].add(cell);
      });
    });
  });

  return gathered;
}

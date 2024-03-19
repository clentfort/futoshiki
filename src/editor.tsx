import AbsoluteConstraint from "./absolute-constraint";
import Board from "./board";
import RelativeConstraint from "./relative-constraint";
import {
  type Constraint,
  type Constraints,
  formatCoordinate,
  formatCoordinatePair,
} from "./types";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  constraints: Constraints;
  onConstraintChange: (constraints: Constraints) => void;
  size: number;
}

export default function Editor({
  constraints,
  onConstraintChange,
  size,
  ...props
}: GridProps) {
  function handleConstraintChange(
    key: Constraint[0],
    constraint: "none" | Constraint[1],
  ) {
    let nextConstraints;
    if (
      constraint === "none" ||
      (constraint instanceof Set && constraint.size === 0)
    ) {
      constraints.delete(key);
      nextConstraints = new Map(constraints);
    } else {
      nextConstraints = new Map(constraints.set(key, constraint));
    }

    onConstraintChange(nextConstraints as Constraints);
  }

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
              style={{ ...style, display: "flex", flexDirection: "row" }}
              value={constraints.get(key)}
              onClick={(constraint) => { handleConstraintChange(key, constraint); }}
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
              style={{ ...style, display: "flex", flexDirection: "column" }}
              value={constraints.get(key)}
              onClick={(constraint) => { handleConstraintChange(key, constraint); }}
            />
          );
        }

        const key = formatCoordinate(column / 2, row / 2);
        return (
          <AbsoluteConstraint
            size={size}
            style={style}
            values={constraints.get(key) ?? new Set()}
            onClick={(constraint) => { handleConstraintChange(key, constraint); }}
          />
        );
      }}
    </Board>
  );
}

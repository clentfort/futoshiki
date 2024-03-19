import { Fragment } from "react/jsx-runtime";

type ElementType = "vertical-constraint" | "horizontal-constraint" | "cell";

interface ConstraintProps {
  column: number;
  row: number;
  style: React.CSSProperties;
  type: ElementType;
}

interface GridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: (props: ConstraintProps) => React.ReactNode;
  size: number;
}

const template = (size: number) => `repeat(${size - 1}, 65px 25px) 65px`;

export default function Board({ children, size, style, ...props }: GridProps) {
  return (
    <div
      {...props}
      style={{
        ...style,
        alignItems: "center",
        display: "grid",
        gridTemplateColumns: template(size),
        gridTemplateRows: template(size),
        justifyItems: "center",
      }}
    >
      {Array.from({ length: (2 * size - 1) ** 2 }).map((_, index) => {
        const column = index % (2 * size - 1);
        const row = Math.floor(index / (2 * size - 1));
        const isHorizontalConstraint = column % 2 === 1;
        const isVerticalConstraint = row % 2 === 1;

        if (isVerticalConstraint && isHorizontalConstraint) {
          return null;
        }

        let type: ElementType;
        if (isVerticalConstraint) {
          type = "vertical-constraint";
        } else if (isHorizontalConstraint) {
          type = "horizontal-constraint";
        } else {
          type = "cell";
        }

        const style = {
          gridColumn: `${column + 1} `,
          gridRow: `${row + 1} `,
        };

        return (
          <Fragment key={index}>
            {children({ column, row, style, type })}
          </Fragment>
        );
      })}
    </div>
  );
}

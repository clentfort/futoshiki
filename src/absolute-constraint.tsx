import React from "react";

interface AbsoluteConstraintProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  onClick?: (values: Set<number>) => void;
  size: number;
  values: Set<number>;
}

export default function AbsoluteConstraint({
  onClick,
  ...props
}: AbsoluteConstraintProps) {
  if (onClick === undefined) {
    return <AbsoluteConstraintOutput {...props} />;
  } else {
    return <AbsoluteConstraintInput {...props} onClick={onClick} />;
  }
}

function AbsoluteConstraintOutput({
  size,
  values,
  ...props
}: Omit<AbsoluteConstraintProps, "onClick">) {
  return (
    <Wrapper {...props} size={size} values={Array.from(values)}>
      {(value) => <>{value}</>}
    </Wrapper>
  );
}

function AbsoluteConstraintInput({
  onClick,
  size,
  values,
  ...props
}: AbsoluteConstraintProps & { onClick: (values: Set<number>) => void }) {
  const allValues = Array.from({ length: size }, (_, i) => i + 1);

  function handleClick(value: number) {
    const nextValues = new Set(values);
    if (nextValues.has(value)) {
      nextValues.delete(value);
    } else {
      nextValues.add(value);
    }
    onClick(nextValues);
  }

  return (
    <Wrapper {...props} size={size} values={allValues}>
      {(value) => (
        <span
          style={{ color: values.has(value) ? "black" : "lightgray" }}
          onClick={() => {
            handleClick(value);
          }}
        >
          {value}
        </span>
      )}
    </Wrapper>
  );
}

interface WrapperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: (value: number) => JSX.Element;
  size: number;
  values: number[];
}
function Wrapper({ children, size, style, values, ...props }: WrapperProps) {
  const length = Math.ceil(Math.sqrt(size));
  const gap = length ** 2 / size - 1;
  return (
    <div
      {...props}
      style={{
        ...style,
        alignItems: "center",
        border: "1px solid black",
        display: "grid",
        gridTemplateColumns: `repeat(${length}, 20px)`,
        gridTemplateRows: `repeat(${length}, 20px)`,
        justifyItems: "center",
      }}
    >
      {values.map((value) => {
        const index = value - 1;
        const position = Math.ceil(index * (1 + gap));
        const column = position % length;
        const row = Math.floor(position / length);

        return (
          <div
            key={value}
            style={{ gridColumn: `${column + 1} `, gridRow: `${row + 1} ` }}
          >
            {children(value)}
          </div>
        );
      })}
    </div>
  );
}

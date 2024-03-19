import type { RelativeConstraint as RelativeConstraintType } from "./types";

interface RelativeConstraintProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  greater: JSX.Element | string;
  less: JSX.Element | string;
  onClick?: (constraint: "none" | RelativeConstraintType[1]) => void;
  value?: "none" | RelativeConstraintType[1];
}

export default function RelativeConstraint({
  onClick,
  ...props
}: RelativeConstraintProps) {
  if (onClick === undefined) {
    return <RelativeConstraintOutput {...props} />;
  } else {
    return <RelativeConstraintInput {...props} onClick={onClick} />;
  }
}

function RelativeConstraintOutput({
  greater,
  less,
  value = "none",
  ...props
}: Omit<RelativeConstraintProps, "onClick">) {
  const symbol = { "<": less, ">": greater, none: "" }[value];
  return <div {...props}>{symbol}</div>;
}

function RelativeConstraintInput({
  greater,
  less,
  onClick,
  value,
  ...props
}: RelativeConstraintProps & {
  onClick: (constraint: "none" | RelativeConstraintType[1]) => void;
}) {
  function handleClick(nextValue: RelativeConstraintType[1]) {
    if (value === nextValue) {
      onClick("none");
    } else {
      onClick(nextValue);
    }
  }

  return (
    <div {...props}>
      <div
        style={{ color: value === "<" ? "black" : "lightgray" }}
        onClick={() => {
          handleClick("<");
        }}
      >
        {less}
      </div>
      <div
        style={{ color: value === ">" ? "black" : "lightgray" }}
        onClick={() => {
          handleClick(">");
        }}
      >
        {greater}
      </div>
    </div>
  );
}

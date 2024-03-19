import "./app.css";

import { useEffect, useState } from "react";

import Editor from "./editor";
import Preview from "./preview";
import type { Constraints, Solution } from "./types";
import useFutoshikiSolver from "./use-futoshiki-solver";

export default function App() {
  const [size, setSize] = useState(4);
  const [constraints, setConstraints] = useState<Constraints>(new Map());
  const [selected, setSelected] = useState<Set<Solution> | undefined>();

  const [done, solutions, clearSolutions] = useFutoshikiSolver(
    size,
    constraints,
  );

  useEffect(() => {
    if (solutions.length === 0) {
      setSelected(undefined);
    }
  }, [solutions]);

  const handleSizeChange = (size: number) => {
    clearSolutions();
    setSelected(undefined);
    setConstraints(new Map());
    setSize(size);
  };

  return (
    <>
      <h1>Futoshiki Solver and Generator</h1>
      <main>
        <label style={{ gridArea: "a" }}>
          Size:
          <SizeSelect size={size} onSizeChange={handleSizeChange} />
        </label>
        <Editor
          constraints={constraints}
          size={size}
          style={{ gridArea: "b" }}
          onConstraintChange={setConstraints}
        />
        <label htmlFor="solutions" style={{ gridArea: "c" }}>
          Solutions: {done ? "✅" : "⏳"}
          {solutions.length}
        </label>
        <SolutionSelect
          id="solutions"
          selectedSolutions={selected}
          solutions={solutions}
          style={{ gridArea: "e" }}
          onSelectedSolutionsChange={setSelected}
        />
        <Preview
          constraints={constraints}
          size={size}
          solutions={Array.from(selected ?? solutions)}
          style={{ gridArea: "d" }}
        />
      </main>
    </>
  );
}

interface SizeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onSizeChange: (size: number) => void;
  size: number;
}
function SizeSelect({ onSizeChange, size, ...props }: SizeSelectProps) {
  return (
    <select
      {...props}
      value={size}
      onChange={(event) => { onSizeChange(Number(event.target.value)); }}
    >
      <option value={3}>3x3</option>
      <option value={4}>4x4</option>
      <option value={5}>5x5</option>
      <option value={6}>6x6</option>
      <option value={7}>7x7</option>
    </select>
  );
}

interface SolutionSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onSelectedSolutionsChange: (selected: Set<Solution>) => void;
  selectedSolutions: Set<Solution> | undefined;
  solutions: Solution[];
}
function SolutionSelect({
  onSelectedSolutionsChange,
  selectedSolutions,
  solutions,
  style,
  ...props
}: SolutionSelectProps) {
  return (
    <select
      {...props}
      multiple
      style={{ ...style, display: "block", overflow: "auto" }}
      value={Array.from(selectedSolutions ?? solutions).map(
        (s) => `${solutions.indexOf(s)}`,
      )}
      onChange={(event) => {
        const nextSelected = new Set<Solution>();
        for (const option of event.target.selectedOptions) {
          nextSelected.add(solutions[Number(option.value)]);
        }
        onSelectedSolutionsChange(nextSelected);
      }}
    >
      {solutions.map((_, i) => (
        <option key={i} value={i}>
          {i + 1}
        </option>
      ))}
    </select>
  );
}

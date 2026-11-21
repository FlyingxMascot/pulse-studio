import { usePlan } from "../context/PlanContext.jsx";

// Testing helpers for marking. They are labelled as demo controls on purpose.
export default function DemoControls() {
  const { simulateFailure, setSimulateFailure, seatOverrides, setSeatOverrides } = usePlan();
  const spinIsFull = seatOverrides[5] === 0;

  return (
    <aside className="demo" aria-label="Demo controls">
      <strong>Demo controls (testing only)</strong>
      <label>
        <input type="checkbox" checked={simulateFailure} onChange={(e) => setSimulateFailure(e.target.checked)} />
        Simulate loading failure
      </label>
      <button className="btn btn-secondary" onClick={() => setSeatOverrides(spinIsFull ? {} : { 5: 0 })}>
        {spinIsFull ? "Restore Spin Sprint seats" : "Make Spin Sprint full"}
      </button>
    </aside>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadClasses } from "../api/loadClasses.js";

const PlanContext = createContext(null);
const STORAGE_KEY = "pulse-studio-plan";

// Read the saved plan. Anything that looks wrong is thrown away or repaired,
// because saved data can be old or edited by hand.
function readSavedPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((line) => line && Number.isInteger(line.id))
      .map((line) => ({
        id: line.id,
        spots: Number.isInteger(line.spots) ? line.spots : 1,
        rentMat: line.rentMat === true,
      }));
  } catch {
    return [];
  }
}

export function PlanProvider({ children }) {
  // Class data and its loading state
  const [classes, setClasses] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Demo controls
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [seatOverrides, setSeatOverrides] = useState({}); // { classId: seatsLeft }

  // The user's selection
  const [plan, setPlan] = useState(readSavedPlan);
  const [notice, setNotice] = useState("");
  const [booking, setBooking] = useState(null);

  // Load classes. Runs again when the user presses Retry.
  useEffect(() => {
    let cancelled = false; // cleanup flag so an old request can't update state
    setStatus("loading");

    async function load() {
      try {
        const data = await loadClasses({ shouldFail: simulateFailure });
        if (cancelled) return;
        setClasses(data);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(error.message);
        setStatus("error");
      }
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [attempt, simulateFailure]);

  // Once data is ready, drop saved classes that no longer exist.
  useEffect(() => {
    if (status !== "ready") return;
    const knownIds = classes.map((c) => c.id);
    const stillValid = plan.filter((line) => knownIds.includes(line.id));
    if (stillValid.length !== plan.length) {
      setPlan(stillValid);
      setNotice(`${plan.length - stillValid.length} saved class(es) are no longer offered and were removed from your plan.`);
    }
    // only needs to run when new data arrives
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, classes]);

  // Save the plan every time it changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  // Classes with the demo seat changes applied.
  const currentClasses = useMemo(
    () => classes.map((c) => ({ ...c, seatsLeft: seatOverrides[c.id] ?? c.seatsLeft })),
    [classes, seatOverrides]
  );

  // Plan lines joined with their class data (skips any class we can't find).
  const planLines = useMemo(
    () =>
      plan
        .map((line) => {
          const found = currentClasses.find((c) => c.id === line.id);
          return found ? { ...found, spots: line.spots, rentMat: line.rentMat } : null;
        })
        .filter(Boolean),
    [plan, currentClasses]
  );

  function addToPlan(id) {
    setPlan((prev) => (prev.some((l) => l.id === id) ? prev : [...prev, { id, spots: 1, rentMat: false }]));
    setBooking(null);
  }

  function removeFromPlan(id) {
    setPlan((prev) => prev.filter((l) => l.id !== id));
  }

  function setSpots(id, spots) {
    setPlan((prev) => prev.map((l) => (l.id === id ? { ...l, spots } : l)));
  }

  function toggleMat(id) {
    setPlan((prev) => prev.map((l) => (l.id === id ? { ...l, rentMat: !l.rentMat } : l)));
  }

  // Simulated booking: nothing is sent anywhere.
  function completeBooking(formData, totals) {
    const reference = "PS-" + Math.floor(1000 + Math.random() * 9000);
    setBooking({ reference, nickname: formData.nickname, lines: planLines, totals });
    setPlan([]);
    setNotice("");
  }

  const value = {
    classes: currentClasses,
    status,
    errorMessage,
    retry: () => setAttempt((n) => n + 1),
    plan,
    planLines,
    notice,
    dismissNotice: () => setNotice(""),
    booking,
    addToPlan,
    removeFromPlan,
    setSpots,
    toggleMat,
    completeBooking,
    simulateFailure,
    setSimulateFailure,
    seatOverrides,
    setSeatOverrides,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  return useContext(PlanContext);
}

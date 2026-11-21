import { useSearchParams, Link } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";
import FilterBar from "../components/FilterBar.jsx";
import ClassCard from "../components/ClassCard.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ClassesPage() {
  const { classes, status, errorMessage, retry, plan, addToPlan, removeFromPlan, notice, dismissNotice } = usePlan();

  // Filters live in the URL, e.g. /?type=Yoga&sort=price-asc
  const [params, setParams] = useSearchParams();
  const values = {
    q: params.get("q") || "",
    type: params.get("type") || "",
    level: params.get("level") || "",
    sort: params.get("sort") || "",
  };

  function changeFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  if (status !== "ready") {
    return (
      <>
        <h1>Classes this week</h1>
        <StatusMessage status={status} message={errorMessage} onRetry={retry} />
      </>
    );
  }

  const search = values.q.trim().toLowerCase();
  const matchesSearch = (c) =>
    !search || [c.title, c.instructor, c.day, c.type].some((text) => text.toLowerCase().includes(search));

  const results = classes
    .filter(matchesSearch)
    .filter((c) => !values.type || c.type === values.type)
    .filter((c) => !values.level || c.level === values.level)
    .sort((a, b) => {
      if (values.sort === "price-asc") return a.price - b.price;
      if (values.sort === "price-desc") return b.price - a.price;
      if (values.sort === "seats") return b.seatsLeft - a.seatsLeft;
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.time.localeCompare(b.time);
    });

  // Classes the user picked that the current filters are hiding
  const hiddenInPlan = plan.filter((line) => !results.some((c) => c.id === line.id));
  const inPlan = (id) => plan.some((line) => line.id === id);

  // When nothing matches, suggest other classes that match the search text only
  const alternatives = (search ? classes.filter(matchesSearch) : classes).slice(0, 3);

  return (
    <>
      <h1>Classes this week</h1>
      <p className="muted">Small-group classes at our F-7 studio, Islamabad. Prices are per spot.</p>

      {notice && (
        <p className="panel panel-warn" role="status">
          {notice} <button className="link-button" onClick={dismissNotice}>Dismiss</button>
        </p>
      )}

      <FilterBar values={values} onChange={changeFilter} onClear={() => setParams({}, { replace: true })} />

      {hiddenInPlan.length > 0 && (
        <p className="panel" role="status">
          {hiddenInPlan.length} class{hiddenInPlan.length > 1 ? "es" : ""} in your plan {hiddenInPlan.length > 1 ? "are" : "is"} hidden by these filters.{" "}
          <Link to="/plan">View your plan</Link>
        </p>
      )}

      <p aria-live="polite" className="muted">{results.length} of {classes.length} classes shown</p>

      {classes.length === 0 ? (
        <div className="panel">
          <h2>No classes are scheduled yet</h2>
          <p>The timetable for this week has not been published. Please check back soon.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="panel">
          <h2>No classes match your search</h2>
          <p>Try removing a filter or searching a different word.</p>
          <button className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>Clear all filters</button>
          <h3>Other classes you might like</h3>
          <ul className="grid">
            {alternatives.map((item) => (
              <ClassCard key={item.id} item={item} inPlan={inPlan(item.id)} onAdd={addToPlan} onRemove={removeFromPlan} />
            ))}
          </ul>
        </div>
      ) : (
        <ul className="grid">
          {results.map((item) => (
            <ClassCard key={item.id} item={item} inPlan={inPlan(item.id)} onAdd={addToPlan} onRemove={removeFromPlan} />
          ))}
        </ul>
      )}
    </>
  );
}

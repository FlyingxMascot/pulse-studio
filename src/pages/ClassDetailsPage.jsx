import { useParams, Link } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { MAX_SPOTS_PER_CLASS, MAT_RENTAL_FEE, GROUP_DISCOUNT_FROM, GROUP_DISCOUNT_RATE } from "../rules/bookingRules.js";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const { classes, status, errorMessage, retry, plan, addToPlan, removeFromPlan } = usePlan();

  if (status !== "ready") {
    return <StatusMessage status={status} message={errorMessage} onRetry={retry} />;
  }

  const item = classes.find((c) => c.id === Number(id));

  // Invalid ids get a helpful message, not a blank page
  if (!item) {
    return (
      <div className="panel">
        <h1>We could not find that class</h1>
        <p>There is no class with the id "{id}". It may have been removed.</p>
        <Link className="btn btn-primary" to="/">See all classes</Link>
      </div>
    );
  }

  const inPlan = plan.some((line) => line.id === item.id);
  const isFull = item.seatsLeft <= 0;

  return (
    <article>
      <p><Link to="/">Back to classes</Link></p>
      <h1>{item.title}</h1>
      <p className="muted">{item.type} - {item.level} - {item.day} {item.time} - {item.durationMin} min - with {item.instructor}</p>
      {/* Defensive fallback for missing description */}
      <p>{item.description || "Not provided"}</p>

      <section className="panel" aria-labelledby="price-heading">
        <h2 id="price-heading">Price and rules</h2>
        <ul>
          <li>Rs {item.price.toLocaleString()} per spot</li>
          <li>Mat rental is optional: Rs {MAT_RENTAL_FEE} per spot</li>
          <li>Book 1 to {MAX_SPOTS_PER_CLASS} spots per class</li>
          <li>{GROUP_DISCOUNT_FROM} or more spots in one booking get {GROUP_DISCOUNT_RATE * 100}% off class prices</li>
          {item.level === "advanced" && <li>Intermediate or advanced experience required</li>}
        </ul>
        <p className={isFull ? "status status-bad" : "status"}>{isFull ? "Full" : `${item.seatsLeft} spots left`}</p>
        {/* Defensive fallback for missing conditions */}
        <p>{item.conditions || "Not provided"}</p>
      </section>

      <section aria-labelledby="inc-heading">
        <h2 id="inc-heading">What is included</h2>
        {/* Guard against missing, non-array, or empty includes list */}
        {Array.isArray(item.includes) && item.includes.length > 0 ? (
          <ul>
            {item.includes.map((text, idx) => (
              <li key={text || idx}>{text}</li>
            ))}
          </ul>
        ) : (
          <p>Not provided</p>
        )}
      </section>

      {inPlan ? (
        <div className="card-actions">
          <button className="btn btn-secondary" onClick={() => removeFromPlan(item.id)}>Remove from plan</button>
          <Link className="btn btn-primary" to="/plan">Go to my plan</Link>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => addToPlan(item.id)} disabled={isFull}>
          {isFull ? "Class full" : "Add to plan"}
        </button>
      )}
    </article>
  );
}

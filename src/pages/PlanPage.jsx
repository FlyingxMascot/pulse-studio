import { Link, useNavigate } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";
import BookingForm from "../components/BookingForm.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { checkSpots, calculateTotals, MAX_SPOTS_PER_CLASS, MAT_RENTAL_FEE, GROUP_DISCOUNT_FROM } from "../rules/bookingRules.js";

export default function PlanPage() {
  const { status, errorMessage, retry, planLines, setSpots, toggleMat, removeFromPlan, completeBooking, notice, dismissNotice } = usePlan();
  const navigate = useNavigate();

  if (status !== "ready") {
    return (
      <>
        <h1>My plan</h1>
        <StatusMessage status={status} message={errorMessage} onRetry={retry} />
      </>
    );
  }

  if (planLines.length === 0) {
    return (
      <>
        <h1>My plan</h1>
        {notice && <p className="panel panel-warn" role="status">{notice} <button className="link-button" onClick={dismissNotice}>Dismiss</button></p>}
        <div className="panel">
          <p>You have not added any classes yet.</p>
          <Link className="btn btn-primary" to="/">Browse classes</Link>
        </div>
      </>
    );
  }

  // Check every line against the rules using the current data
  const checks = planLines.map((line) => checkSpots(line.spots, line.seatsLeft));
  const hasProblem = checks.some((c) => !c.ok);
  const totals = calculateTotals(planLines);

  function handleBooking(formData) {
    completeBooking(formData, totals);
    navigate("/confirmation");
  }

  return (
    <>
      <h1>My plan</h1>
      {notice && <p className="panel panel-warn" role="status">{notice} <button className="link-button" onClick={dismissNotice}>Dismiss</button></p>}

      <ul className="plan-list">
        {planLines.map((line, index) => {
          const check = checks[index];
          return (
            <li key={line.id} className="plan-line">
              <div>
                <h2><Link to={`/classes/${line.id}`}>{line.title}</Link></h2>
                <p className="muted">{line.day} {line.time} - {line.durationMin} min - Rs {line.price.toLocaleString()} per spot</p>
                <p className="small">{line.seatsLeft <= 0 ? "Full" : `${line.seatsLeft} spots left`}</p>
              </div>

              <div className="field">
                <label htmlFor={`spots-${line.id}`}>Spots (1 to {MAX_SPOTS_PER_CLASS})</label>
                <input id={`spots-${line.id}`} type="number" value={line.spots}
                  onChange={(e) => setSpots(line.id, Number(e.target.value))}
                  aria-invalid={!check.ok} aria-describedby={!check.ok ? `spots-error-${line.id}` : undefined} />
                {!check.ok && <p id={`spots-error-${line.id}`} className="error">{check.message}</p>}
              </div>

              <label className="check">
                <input type="checkbox" checked={line.rentMat} onChange={() => toggleMat(line.id)} />
                Rent a mat (+Rs {MAT_RENTAL_FEE} per spot)
              </label>

              <button className="btn btn-secondary" onClick={() => removeFromPlan(line.id)}>Remove</button>
            </li>
          );
        })}
      </ul>

      <section className="panel" aria-labelledby="summary-heading">
        <h2 id="summary-heading">Summary</h2>
        <dl className="summary">
          <dt>Total spots</dt><dd>{totals.spots}</dd>
          <dt>Total class time</dt><dd>{totals.minutes} minutes</dd>
          <dt>Classes</dt><dd>Rs {totals.classTotal.toLocaleString()}</dd>
          <dt>Mat rental</dt><dd>Rs {totals.matTotal.toLocaleString()}</dd>
          <dt>Group discount</dt><dd>{totals.discount > 0 ? `- Rs ${totals.discount.toLocaleString()}` : "None"}</dd>
          <dt className="total">Total</dt><dd className="total">Rs {totals.total.toLocaleString()}</dd>
        </dl>
        {totals.spots < GROUP_DISCOUNT_FROM && (
          <p className="small">Add {GROUP_DISCOUNT_FROM - totals.spots} more spot(s) to get 10% off class prices.</p>
        )}
      </section>

      <BookingForm lines={planLines} disabled={hasProblem} onSubmit={handleBooking} />
    </>
  );
}

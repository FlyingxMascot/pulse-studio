import { Link } from "react-router-dom";

// One class in the list. The parent decides what "Add" and "Remove" do.
export default function ClassCard({ item, inPlan, onAdd, onRemove }) {
  const isFull = item.seatsLeft <= 0;
  const seatsText = isFull ? "Full" : item.seatsLeft <= 3 ? `Only ${item.seatsLeft} spots left` : `${item.seatsLeft} spots left`;

  return (
    <li className={`card ${inPlan ? "card-selected" : ""}`}>
      <div className="card-top">
        <span className="tag">{item.type}</span>
        <span className="tag tag-level">{item.level}</span>
        {inPlan && <span className="tag tag-in-plan">In your plan</span>}
      </div>

      <h3><Link to={`/classes/${item.id}`}>{item.title}</Link></h3>
      <p className="muted">{item.day} {item.time} - {item.durationMin} min - with {item.instructor}</p>

      <p className="price">Rs {item.price.toLocaleString()} <span className="muted">per spot</span></p>
      <p className={isFull ? "status status-bad" : item.seatsLeft <= 3 ? "status status-warn" : "status"}>{seatsText}</p>
      {/* Fallback so missing conditions text does not render empty or break */}
      <p className="small">{item.conditions || "Not provided"}</p>

      <div className="card-actions">
        <Link className="btn btn-secondary" to={`/classes/${item.id}`}>Details</Link>
        {inPlan ? (
          <button className="btn btn-secondary" onClick={() => onRemove(item.id)}>Remove from plan</button>
        ) : (
          <button className="btn btn-primary" onClick={() => onAdd(item.id)} disabled={isFull}>
            {isFull ? "Class full" : "Add to plan"}
          </button>
        )}
      </div>
    </li>
  );
}

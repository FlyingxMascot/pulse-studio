import { Link } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";

export default function ConfirmationPage() {
  const { booking } = usePlan();

  // Someone opening /confirmation directly (or after a refresh) has no booking
  if (!booking) {
    return (
      <div className="panel">
        <h1>No recent booking</h1>
        <p>Your confirmation is only shown right after you book.</p>
        <Link className="btn btn-primary" to="/">Browse classes</Link>
      </div>
    );
  }

  return (
    <section>
      <h1>Booking confirmed (simulated)</h1>
      <p className="panel panel-success" role="status">
        Success: thanks {booking.nickname}. Your reference is <strong>{booking.reference}</strong>. No payment was taken.
      </p>
      <ul>
        {booking.lines.map((line) => (
          <li key={line.id}>{line.title} - {line.day} {line.time} - {line.spots} spot(s){line.rentMat ? ", mat rental" : ""}</li>
        ))}
      </ul>
      <p>Total: <strong>Rs {booking.totals.total.toLocaleString()}</strong> for {booking.totals.spots} spot(s).</p>
      <Link className="btn btn-primary" to="/">Book more classes</Link>
    </section>
  );
}

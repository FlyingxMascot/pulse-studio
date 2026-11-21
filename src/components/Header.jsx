import { NavLink, Link } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";

export default function Header() {
  const { plan } = usePlan();

  return (
    <header className="site-header">
      <Link to="/" className="brand">Pulse Studio</Link>
      <nav aria-label="Main">
        <NavLink to="/" end>Classes</NavLink>
        <NavLink to="/plan">My plan ({plan.length})</NavLink>
      </nav>
    </header>
  );
}

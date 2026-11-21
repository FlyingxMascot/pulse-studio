import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="panel">
      <h1>Page not found</h1>
      <p>That address does not exist on our site.</p>
      <Link className="btn btn-primary" to="/">Go to classes</Link>
    </div>
  );
}

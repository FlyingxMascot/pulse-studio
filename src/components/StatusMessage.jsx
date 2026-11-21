// Small helper used for loading and error screens.
export default function StatusMessage({ status, message, onRetry }) {
  if (status === "loading") {
    return <p role="status" className="panel">Loading classes...</p>;
  }
  return (
    <div role="alert" className="panel panel-error">
      <p><strong>Something went wrong.</strong> {message}</p>
      <button className="btn btn-primary" onClick={onRetry}>Try again</button>
    </div>
  );
}

// Controlled inputs. The values come from the URL (via the parent), so filters survive
// opening a class and pressing Back.
export default function FilterBar({ values, onChange, onClear }) {
  return (
    <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="q">Search</label>
        <input id="q" type="search" placeholder="Class, instructor or day" value={values.q} onChange={(e) => onChange("q", e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="type">Type</label>
        <select id="type" value={values.type} onChange={(e) => onChange("type", e.target.value)}>
          <option value="">All types</option>
          <option>Yoga</option>
          <option>Strength</option>
          <option>Cardio</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="level">Level</label>
        <select id="level" value={values.level} onChange={(e) => onChange("level", e.target.value)}>
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={values.sort} onChange={(e) => onChange("sort", e.target.value)}>
          <option value="">Week order</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="seats">Most spots left</option>
        </select>
      </div>
      <button type="button" className="btn btn-secondary" onClick={onClear}>Clear filters</button>
    </form>
  );
}

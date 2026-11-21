import { useState } from "react";
import { checkEligibility } from "../rules/bookingRules.js";

const emptyForm = { nickname: "", experience: "", notes: "", waiver: false };

// Returns an object like { nickname: "message" }. Empty object = form is valid.
function validate(form, lines) {
  const errors = {};
  const nickname = form.nickname.trim();

  if (nickname.length < 2 || nickname.length > 20) {
    errors.nickname = "Enter a nickname between 2 and 20 characters.";
  }
  if (!form.experience) {
    errors.experience = "Choose your experience level.";
  } else {
    // Rule 2: eligibility for advanced classes
    const blocked = lines.find((line) => !checkEligibility(line.level, form.experience).ok);
    if (blocked) {
      errors.experience = `"${blocked.title}" is an advanced class. ${checkEligibility(blocked.level, form.experience).message}`;
    }
  }
  if (form.notes.length > 120) {
    errors.notes = `Notes can be 120 characters at most (you have ${form.notes.length}).`;
  }
  if (!form.waiver) {
    errors.waiver = "Please accept the health note to continue.";
  }
  return errors;
}

export default function BookingForm({ lines, disabled, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // copy the old form, change one field (never edit state directly)
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form, lines);
    setErrors(found);
    if (Object.keys(found).length === 0 && !disabled) {
      onSubmit(form);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="form-heading">
      <h2 id="form-heading">Your details</h2>
      <p className="muted">This is a simulated booking. No payment is taken and nothing is sent. Please do not enter personal information.</p>

      <div className="field">
        <label htmlFor="nickname">Nickname (shown to the instructor)</label>
        <input id="nickname" name="nickname" value={form.nickname} onChange={handleChange}
          aria-invalid={Boolean(errors.nickname)} aria-describedby={errors.nickname ? "nickname-error" : undefined} />
        {errors.nickname && <p id="nickname-error" className="error">{errors.nickname}</p>}
      </div>

      <div className="field">
        <label htmlFor="experience">Experience level</label>
        <select id="experience" name="experience" value={form.experience} onChange={handleChange}
          aria-invalid={Boolean(errors.experience)} aria-describedby={errors.experience ? "experience-error" : undefined}>
          <option value="">Choose one</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {errors.experience && <p id="experience-error" className="error">{errors.experience}</p>}
      </div>

      <div className="field">
        <label htmlFor="notes">Notes for the coach (optional)</label>
        <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange}
          aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : undefined} />
        {errors.notes && <p id="notes-error" className="error">{errors.notes}</p>}
      </div>

      <div className="field">
        <label className="check">
          <input type="checkbox" name="waiver" checked={form.waiver} onChange={handleChange}
            aria-describedby={errors.waiver ? "waiver-error" : undefined} />
          I am fit to exercise and will tell the coach about any injury.
        </label>
        {errors.waiver && <p id="waiver-error" className="error">{errors.waiver}</p>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={disabled}>Confirm booking (simulated)</button>
      {disabled && <p className="error">Fix the problems in your plan above before confirming.</p>}
    </form>
  );
}

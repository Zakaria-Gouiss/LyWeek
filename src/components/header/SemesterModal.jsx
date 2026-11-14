import { useState, useEffect } from "react";

function SemesterModal({ semester, onClose, onSave }) {
  const [name, setName] = useState(semester?.name ?? "");
  const [startDate, setStartDate] = useState(semester?.startDate ?? "");
  const [endDate, setEndDate] = useState(semester?.endDate ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(semester?.name ?? "");
    setStartDate(semester?.startDate ?? "");
    setEndDate(semester?.endDate ?? "");
  }, [semester]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const updatedSemester = {
      ...semester,
      name,
      startDate,
      endDate,
    };

    try {
      await onSave(updatedSemester);
    } catch (saveError) {
      setError(saveError.message || "Failed to save semester");
    }
  }

  return (
    <div className="assignment-modal-overlay">
      <div
        className="assignment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="semester-title"
      >
        <div className="assignment-modal-header">
          <h2 id="semester-title" className="assignment-modal-title">
            Edit Semester
          </h2>
          <button
            type="button"
            className="modal-close"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="semester-name">Semester Name</label>
            <input
              id="semester-name"
              name="semester-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="semester-start-date">Start Date</label>
            <input
              id="semester-start-date"
              name="semester-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          {error && (
            <p className="settings-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="semester-end-date">End Date</label>
            <input
              id="semester-end-date"
              name="semester-end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="modal-submit">
              Save Semester
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SemesterModal;

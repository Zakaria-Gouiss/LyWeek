import { useState, useEffect } from "react";

function SemesterModal({ semester, onClose, onSave }) {
  const [startDate, setStartDate] = useState(semester?.startDate ?? "");
  const [endDate, setEndDate] = useState(semester?.endDate ?? "");

  useEffect(() => {
    setStartDate(semester?.startDate ?? "");
    setEndDate(semester?.endDate ?? "");
  }, [semester]);

  function handleSubmit(event) {
    event.preventDefault();

    const updatedSemester = {
      ...semester,
      startDate,
      endDate,
    };

    onSave(updatedSemester);
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
            <label htmlFor="semester-start-date">Start Date</label>
            <input
              id="semester-start-date"
              name="semester-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

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

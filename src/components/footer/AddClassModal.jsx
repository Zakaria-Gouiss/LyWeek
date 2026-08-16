import { useState } from "react";

function AddClassModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [professor, setProfessor] = useState("");
  const [courseHours, setCourseHours] = useState("");
  const [officeHours, setOfficeHours] = useState("");
  const [oneNoteUrl, setOneNoteUrl] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const newClass = {
      id: Date.now(),
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      onenoteUrl: oneNoteUrl,
    };

    onAdd(newClass);
  }
  return (
    <div className="assignment-modal-overlay">
      <div
        className="assignment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-class-title"
      >
        <div className="assignment-modal-header">
          <h2 id="add-class-title" className="assignment-modal-title">
            Create Class
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
            <label htmlFor="class-name">Name</label>
            <input
              id="class-name"
              name="class-name"
              type="text"
              value={name}
              placeholder="Enter class name"
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class-code">Course Code</label>
            <input
              id="class-code"
              name="class-code"
              type="text"
              value={courseCode}
              onChange={(event) => setCourseCode(event.target.value)}
              placeholder="Enter course code"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class-professor">Professor</label>
            <input
              id="class-professor"
              name="class-professor"
              type="text"
              value={professor}
              onChange={(event) => setProfessor(event.target.value)}
              placeholder="Enter professor name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class-hours">Course Hours</label>
            <input
              id="class-hours"
              name="class-hours"
              type="text"
              value={courseHours}
              onChange={(event) => setCourseHours(event.target.value)}
              placeholder="Example: MTWRF, 1:00 PM - 2:00 PM"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class-office-hours">Office Hours</label>
            <input
              id="class-office-hours"
              name="class-office-hours"
              type="text"
              placeholder="Example: MTWRF, 1:00 PM - 2:00 PM"
              value={officeHours}
              onChange={(event) => setOfficeHours(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class-onenote-url">Link a OneNote notebook</label>
            <input
              id="class-onenote-url"
              name="class-onenote-url"
              type="url"
              placeholder="https://..."
              value={oneNoteUrl}
              onChange={(event) => setOneNoteUrl(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="modal-submit">
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClassModal;

import { useState, useEffect } from "react";

function EditClassModal({ course, onClose, onSave, onDelete }) {
  const [name, setName] = useState(course?.name ?? "");
  const [courseCode, setCourseCode] = useState(course?.courseCode ?? "");
  const [professor, setProfessor] = useState(course?.professor ?? "");
  const [courseHours, setCourseHours] = useState(course?.courseHours ?? "");
  const [officeHours, setOfficeHours] = useState(course?.officeHours ?? "");
  const [onenoteUrl, setOneNoteUrl] = useState(course?.onenoteUrl ?? "");
  const [color, setColor] = useState(course?.color ?? "");

  function normalizeHexColor(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(withHash)
      ? withHash
      : null;
  }

  useEffect(() => {
    setName(course?.name ?? "");
    setCourseCode(course?.courseCode ?? "");
    setProfessor(course?.professor ?? "");
    setCourseHours(course?.courseHours ?? "");
    setOfficeHours(course?.officeHours ?? "");
    setOneNoteUrl(course?.onenoteUrl ?? "");
    setColor(course?.color ?? "");
  }, [course]);

  function handleSubmit(event) {
    event.preventDefault();

    const updatedCourse = {
      ...course,
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      onenoteUrl,
      color: normalizeHexColor(color),
    };

    onSave(updatedCourse);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (confirmed) {
      onDelete(course.id);
    }
  }

  return (
    <div className="assignment-modal-overlay">
      <div
        className="assignment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-class-title"
      >
        <div className="assignment-modal-header">
          <h2 id="edit-class-title" className="assignment-modal-title">
            Edit Class
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
            <label htmlFor="edit-class-name">Name</label>
            <input
              id="edit-class-name"
              name="edit-class-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter class name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-class-code">Course Code</label>
            <input
              id="edit-class-code"
              name="edit-class-code"
              type="text"
              value={courseCode}
              onChange={(event) => setCourseCode(event.target.value)}
              placeholder="Enter course code"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-class-professor">Professor</label>
            <input
              id="edit-class-professor"
              name="edit-class-professor"
              type="text"
              value={professor}
              onChange={(event) => setProfessor(event.target.value)}
              placeholder="Enter professor name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-class-hours">Course Hours</label>
            <input
              id="edit-class-hours"
              name="edit-class-hours"
              type="text"
              value={courseHours}
              onChange={(event) => setCourseHours(event.target.value)}
              placeholder="Example: MTWRF, 1:00 PM - 2:00 PM"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-class-office-hours">Office Hours</label>
            <input
              id="edit-class-office-hours"
              name="edit-class-office-hours"
              type="text"
              value={officeHours}
              onChange={(event) => setOfficeHours(event.target.value)}
              placeholder="Example: MTWRF, 1:00 PM - 2:00 PM"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-class-onenote-url">
              Link a OneNote notebook
            </label>
            <input
              id="edit-class-onenote-url"
              name="edit-class-onenote-url"
              type="url"
              value={onenoteUrl}
              onChange={(event) => setOneNoteUrl(event.target.value)}
              placeholder="Example: onenote:https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-class-color">Add Color</label>
            <input
              id="edit-class-color"
              name="edit-class-color"
              type="text"
              value={color}
              pattern="#?[0-9A-Fa-f]{3,6}"
              onChange={(event) => setColor(event.target.value)}
              placeholder="#3B82F6"
            />
          </div>

          <div className="form-actions modal-actions-split">
            <button type="submit" className="modal-submit">
              Save Changes
            </button>
            <button
              type="button"
              className="modal-delete"
              onClick={handleDelete}
            >
              Delete Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClassModal;

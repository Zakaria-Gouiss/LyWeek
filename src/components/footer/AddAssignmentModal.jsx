import { useState } from "react";

function AddAssignmentModal({ onClose, onAdd, classes }) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const [priority, setPriority] = useState(false);
  const [dueDate, setDueDate] = useState("");
  function handleSubmit(event) {
    event.preventDefault();

    const newAssignment = {
      id: Date.now(),
      classId: Number(classId),
      name,
      priority,
      dueDate,
      completed: false,
    };

    onAdd(newAssignment);
  }
  return (
    <div className="assignment-modal-overlay">
      <div
        className="assignment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-assignment-title"
      >
        <div className="assignment-modal-header">
          <h2 id="add-assignment-title" className="assignment-modal-title">
            Create Assignment
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
            <label htmlFor="assignment-name">Name</label>
            <input
              id="assignment-name"
              name="assignment-name"
              type="text"
              placeholder="Enter assignment name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignment-class">Class</label>
            <select
              id="assignment-class"
              name="assignment-class"
              onChange={(event) => setClassId(event.target.value)}
              required
            >
              <option value="">Select a class</option>

              {classes.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignment-priority">Priority</label>
            <div className="yes-no-group" id="assignment-priority">
              <label className="yes-no-option">
                <input
                  type="radio"
                  name="assignment-priority"
                  value="yes"
                  onChange={(event) => setPriority(true)}
                  required
                />
                <span>Yes</span>
              </label>
              <label className="yes-no-option">
                <input
                  type="radio"
                  name="assignment-priority"
                  value="no"
                  onChange={(event) => setPriority(false)}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignment-duedate">Due Date</label>
            <select
              id="assignment-duedate"
              name="assignment-duedate"
              required
              onChange={(event) => setDueDate(event.target.value)}
            >
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="modal-submit">
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAssignmentModal;

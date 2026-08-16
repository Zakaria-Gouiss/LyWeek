import { useState, useEffect } from "react";

function EditAssignmentModal({
  assignment,
  classes,
  onClose,
  onSave,
  onDelete,
}) {
  const [name, setName] = useState(assignment?.name ?? "");
  const [classId, setClassId] = useState(
    assignment?.classId ? String(assignment.classId) : "",
  );
  const [priority, setPriority] = useState(Boolean(assignment?.priority));
  const [dueDate, setDueDate] = useState(assignment?.dueDate ?? "");

  useEffect(() => {
    setName(assignment?.name ?? "");
    setClassId(assignment?.classId ? String(assignment.classId) : "");
    setPriority(Boolean(assignment?.priority));
    setDueDate(assignment?.dueDate ?? "");
  }, [assignment]);

  function handleSubmit(event) {
    event.preventDefault();

    const updatedAssignment = {
      ...assignment,
      id: assignment.id,
      classId: Number(classId),
      name,
      priority,
      dueDate,
      completed: assignment.completed,
    };

    onSave(updatedAssignment);
  }

  function handleDelete() {
    onDelete(assignment.id);
  }

  return (
    <div className="assignment-modal-overlay">
      <div
        className="assignment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-assignment-title"
      >
        <div className="assignment-modal-header">
          <h2 id="edit-assignment-title" className="assignment-modal-title">
            Edit Assignment
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
            <label htmlFor="edit-assignment-name">Name</label>
            <input
              id="edit-assignment-name"
              name="edit-assignment-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter assignment name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-assignment-class">Class</label>
            <select
              id="edit-assignment-class"
              name="edit-assignment-class"
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
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
            <label htmlFor="edit-assignment-priority">Priority</label>
            <div className="yes-no-group" id="edit-assignment-priority">
              <label className="yes-no-option">
                <input
                  type="radio"
                  name="edit-assignment-priority"
                  checked={priority === true}
                  onChange={() => setPriority(true)}
                />
                <span>Yes</span>
              </label>
              <label className="yes-no-option">
                <input
                  type="radio"
                  name="edit-assignment-priority"
                  checked={priority === false}
                  onChange={() => setPriority(false)}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-assignment-duedate">Due Date</label>
            <select
              id="edit-assignment-duedate"
              name="edit-assignment-duedate"
              value={dueDate}
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

          <div className="form-actions modal-actions-split">
            <button type="submit" className="modal-submit">
              Save Changes
            </button>
            <button
              type="button"
              className="modal-delete"
              onClick={handleDelete}
            >
              Delete Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAssignmentModal;

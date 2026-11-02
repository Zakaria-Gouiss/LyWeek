import { useState } from "react";

function EditAssignmentModal({
  course,
  assignments,
  onClose,
  onSave,
  onDelete,
}) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const selectedAssignment = assignments.find(
    (assignment) => String(assignment.id) === selectedAssignmentId,
  );
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(false);
  const [dueDate, setDueDate] = useState("");

  function handleAssignmentChange(event) {
    const assignmentId = event.target.value;
    const assignment = assignments.find(
      (item) => String(item.id) === assignmentId,
    );

    setSelectedAssignmentId(assignmentId);
    setName(assignment?.name ?? "");
    setPriority(Boolean(assignment?.priority));
    setDueDate(assignment?.dueDate ?? "");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedAssignment) {
      return;
    }

    const updatedAssignment = {
      ...selectedAssignment,
      classId: course.id,
      name,
      priority,
      dueDate,
    };

    onSave(updatedAssignment);
  }

  function handleDelete() {
    if (selectedAssignment) {
      onDelete(selectedAssignment.id);
    }
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
            <label htmlFor="edit-assignment-selection">Select Assignment</label>
            <select
              id="edit-assignment-selection"
              name="edit-assignment-selection"
              value={selectedAssignmentId}
              onChange={handleAssignmentChange}
              required
              disabled={assignments.length === 0}
            >
              <option value="">
                {assignments.length === 0
                  ? "No assignments in this course"
                  : "Select an assignment"}
              </option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`form-group${selectedAssignment ? "" : " is-disabled"}`}
          >
            <label htmlFor="edit-assignment-name">Name</label>
            <input
              id="edit-assignment-name"
              name="edit-assignment-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!selectedAssignment}
              required
            />
          </div>

          <div className="form-group is-disabled">
            <label htmlFor="edit-assignment-class">Class</label>
            <select
              id="edit-assignment-class"
              name="edit-assignment-class"
              value={course.id}
              disabled
            >
              <option value={course.id}>{course.name}</option>
            </select>
          </div>

          <div
            className={`form-group${selectedAssignment ? "" : " is-disabled"}`}
          >
            <label htmlFor="edit-assignment-priority">Priority</label>
            <div className="yes-no-group" id="edit-assignment-priority">
              <label className="yes-no-option">
                <input
                  type="radio"
                  name="edit-assignment-priority"
                  checked={priority === true}
                  disabled={!selectedAssignment}
                  onChange={() => setPriority(true)}
                />
                <span>Yes</span>
              </label>
              <label className="yes-no-option">
                <input
                  type="radio"
                  name="edit-assignment-priority"
                  checked={priority === false}
                  disabled={!selectedAssignment}
                  onChange={() => setPriority(false)}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div
            className={`form-group${selectedAssignment ? "" : " is-disabled"}`}
          >
            <label htmlFor="edit-assignment-duedate">Due Date (optional)</label>
            <select
              id="edit-assignment-duedate"
              name="edit-assignment-duedate"
              value={dueDate}
              disabled={!selectedAssignment}
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
            <button
              type="submit"
              className="modal-submit"
              disabled={!selectedAssignment}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="modal-delete"
              onClick={handleDelete}
              disabled={!selectedAssignment}
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

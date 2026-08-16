function AddAssignmentModal({ onClose }) {
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

        <form className="assignment-form">
          <div className="form-group">
            <label htmlFor="assignment-name">Name</label>
            <input
              id="assignment-name"
              name="assignment-name"
              type="text"
              placeholder="Enter assignment name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignment-class">Class</label>
            <input
              id="assignment-class"
              name="assignment-class"
              type="text"
              placeholder="Enter class name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignment-priority">Priority</label>
            <div className="yes-no-group" id="assignment-priority">
              <label className="yes-no-option">
                <input
                  type="radio"
                  name="assignment-priority"
                  value="yes"
                  required
                />
                <span>Yes</span>
              </label>
              <label className="yes-no-option">
                <input type="radio" name="assignment-priority" value="no" />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignment-duedate">Due Date</label>
            <select id="assignment-duedate" name="assignment-duedate" required>
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

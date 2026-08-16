function AddClassModal({ onClose }) {
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

        <form className="assignment-form">
          <div className="form-group">
            <label htmlFor="class-name">Name</label>
            <input
              id="class-name"
              name="class-name"
              type="text"
              placeholder="Enter class name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class-code">Course Code</label>
            <input
              id="class-code"
              name="class-code"
              type="text"
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

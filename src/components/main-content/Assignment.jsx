import { useState } from "react";

function Assignment({
  name,
  priority,
  dueDate,
  completed: initalCompleted,
  onEdit,
}) {
  const [completed, setCompleted] = useState(initalCompleted);

  return (
    <div className="assignment">
      <div className="assignment-main">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => setCompleted(!completed)}
        />
        {priority && <span className="assignment-priority">★</span>}
        <span className="assignment-name">{name}</span>
        <span className="assignment-due-date">by {dueDate}</span>
      </div>

      <button
        type="button"
        className="assignment-edit-btn"
        aria-label="Edit Assignment"
        onClick={onEdit}
      >
        <i className="fa-solid fa-pencil"></i>
      </button>
    </div>
  );
}

export default Assignment;

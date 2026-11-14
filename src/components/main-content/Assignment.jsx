import "./assignment.css";

function Assignment({
  id,
  name,
  priority,
  dueDate,
  completed,
  onToggle,
  onEdit,
}) {
  return (
    <div className="assignment">
      <div className="assignment-main">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
        />
        {priority && <span className="assignment-priority">★</span>}
        <span className="assignment-name">{name}</span>
        {dueDate && (
          <span className="assignment-due-date">by {dueDate}</span>
        )}
        {onEdit && (
          <button
            type="button"
            className="assignment-edit"
            aria-label={`Edit ${name}`}
            title="Edit assignment"
            onClick={onEdit}
          >
            <i className="fa-solid fa-pencil" aria-hidden="true"></i>
          </button>
        )}
      </div>

    </div>
  );
}

export default Assignment;

function Assignment({
  id,
  name,
  priority,
  dueDate,
  completed,
  onToggle,
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
      </div>

    </div>
  );
}

export default Assignment;

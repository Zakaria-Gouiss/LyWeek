function Assignment({ name, priority, dueDate }) {
  return (
    <div className="assignment">
      <input type="checkbox" />
      {priority && <span>★ </span>}
      <span>{name}</span>
      <span className="assignment-due-date">{dueDate}</span>
    </div>
  );
}
export default Assignment;

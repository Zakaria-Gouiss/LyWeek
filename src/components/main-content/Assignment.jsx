import { useState } from "react";
function Assignment({ name, priority, dueDate, completed: initalCompleted }) {
  const [completed, setCompleted] = useState(initalCompleted);
  console.log("state: ", completed);
  return (
    <div className="assignment">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => setCompleted(!completed)}
      />
      {priority && <span>★ </span>}
      <span>{name}</span>
      <span className="assignment-due-date">by {dueDate}</span>
    </div>
  );
}
export default Assignment;

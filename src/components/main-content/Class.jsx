import Assignment from "./Assignment";

function Class({
  name,
  courseCode,
  professor,
  courseHours,
  officeHours,
  assignments,
}) {
  return (
    <div className="assignment-class">
      <div className="class-header">
        <div className="class-title-row">
          <button type="button" className="class-badge">
            {name}
          </button>
          <span className="class-toggle-box" aria-label="Expand Class 1">
            <i className="fa-solid fa-chevron-right"></i>
          </span>
          <span className="class-toggle-box" aria-label="Collapse Class 1">
            <i className="fa-solid fa-chevron-down"></i>
          </span>
        </div>
        <div className="class-meta">
          <span>{courseCode}</span>
          <span>{professor}</span>
          <span>Course hours: {courseHours}</span>
          <span>Office hours: {officeHours}</span>
        </div>
        {assignments.map((assignment) => (
          <Assignment
            name={assignment.name}
            priority={assignment.priority}
            dueDate={assignment.dueDate}
          />
        ))}
      </div>
    </div>
  );
}

export default Class;

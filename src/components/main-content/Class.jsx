import { useState } from "react";
import Assignment from "./Assignment";

function Class({
  name,
  courseCode,
  professor,
  courseHours,
  officeHours,
  assignments,
}) {
  const [classExpanded, classSetExpanded] = useState(true);
  const [metaExpanded, metaSetExpanded] = useState(false);
  return (
    <div className="assignment-class">
      <div className="class-header">
        <div className="class-title-row">
          <button
            type="button"
            className="class-badge"
            onClick={() => classSetExpanded(!classExpanded)}
          >
            {name}
          </button>
          <button
            className="class-meta-toggle-box"
            aria-label="Expand/Collapse info"
            onClick={() => metaSetExpanded(!metaExpanded)}
          >
            <i
              className={`fa-solid fa-chevron-${metaExpanded ? "down" : "right"}`}
            ></i>
          </button>
        </div>
        {classExpanded && metaExpanded && (
          <div className="class-meta">
            <span>{courseCode}</span>
            <span>{professor}</span>
            <span>Course hours: {courseHours}</span>
            <span>Office hours: {officeHours}</span>
            <button
              type="button"
              className="class-edit-btn"
              aria-label="Edit Class"
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        )}
        {classExpanded &&
          assignments.map((assignment) => (
            <Assignment
              name={assignment.name}
              priority={assignment.priority}
              dueDate={assignment.dueDate}
              completed={assignment.completed}
            />
          ))}
      </div>
    </div>
  );
}

export default Class;

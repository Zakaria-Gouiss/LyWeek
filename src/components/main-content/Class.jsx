import { useState } from "react";
import Assignment from "./Assignment";

function Class({
  id,
  name,
  courseCode,
  professor,
  courseHours,
  officeHours,
  assignments,
  onenoteUrl,
  onEditAssignment,
  onEditClass,
}) {
  function openOneNote() {
    window.location.href = onenoteUrl;
  }

  const [classExpanded, classSetExpanded] = useState(true);
  const [metaExpanded, metaSetExpanded] = useState(false);

  const classAssignments = assignments.filter(
    (assignment) => assignment.classId === id,
  );

  return (
    <div className="assignment-class">
      <div className="class-header">
        <div className="class-title-row">
          <div className="class-title-controls">
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
                className={`fa-solid fa-chevron-${
                  metaExpanded ? "down" : "right"
                }`}
              ></i>
            </button>
          </div>

          <button
            type="button"
            className="class-onenote-btn"
            onClick={openOneNote}
          >
            Open in OneNote
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
              onClick={() =>
                onEditClass({
                  id,
                  name,
                  courseCode,
                  professor,
                  courseHours,
                  officeHours,
                  onenoteUrl,
                })
              }
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        )}

        {classExpanded &&
          classAssignments.map((assignment) => (
            <Assignment
              key={assignment.id}
              name={assignment.name}
              priority={assignment.priority}
              dueDate={assignment.dueDate}
              completed={assignment.completed}
              onEdit={() => onEditAssignment(assignment)}
            />
          ))}
      </div>
    </div>
  );
}

export default Class;

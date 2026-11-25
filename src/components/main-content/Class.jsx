import { useEffect, useRef, useState } from "react";
import "./class.css";
import Assignment from "./Assignment";
import LinksSection from "./LinksSection.jsx";

function Class({
  id,
  name,
  courseCode,
  professor,
  courseHours,
  officeHours,
  assignments,
  links = [],
  onEditAssignments,
  onAddAssignment,
  onEditClass,
  onToggleAssignment,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  color,
}) {
  const badgeColor =
    typeof color === "string" &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)
      ? color
      : "var(--card-color)";
  const [classExpanded, classSetExpanded] = useState(true);
  const [metaExpanded, metaSetExpanded] = useState(false);
  const [courseNameWrapped, setCourseNameWrapped] = useState(false);
  const courseNameRef = useRef(null);
  const classTitleRowRef = useRef(null);

  useEffect(() => {
    const courseName = courseNameRef.current;
    const classTitleRow = classTitleRowRef.current;
    if (!courseName || !classTitleRow) {
      return;
    }

    const updateCourseNameWrapping = () => {
      const hadCompactActions = classTitleRow.classList.contains(
        "class-title-row--compact-actions",
      );
      if (hadCompactActions) {
        classTitleRow.classList.remove("class-title-row--compact-actions");
      }

      const nameRange = document.createRange();
      nameRange.selectNodeContents(courseName);
      const isWrapped = nameRange.getClientRects().length > 1;

      if (hadCompactActions) {
        classTitleRow.classList.add("class-title-row--compact-actions");
      }

      setCourseNameWrapped(isWrapped);
    };

    const resizeObserver = new ResizeObserver(updateCourseNameWrapping);
    resizeObserver.observe(courseName.parentElement);
    resizeObserver.observe(classTitleRow);
    updateCourseNameWrapping();

    return () => resizeObserver.disconnect();
  }, [name]);

  const classAssignments = assignments.filter(
    (assignment) => assignment.classId === id,
  );
  const classLinks = links.filter((link) => link.classId === id);

  return (
    <div className="assignment-class">
      <div className="class-header">
        <div
          ref={classTitleRowRef}
          className={`class-title-row${
            courseNameWrapped ? " class-title-row--compact-actions" : ""
          }`}
        >
          <div className="class-title-controls">
            <button
              type="button"
              className="class-badge"
              style={{
                backgroundColor: badgeColor,
              }}
              onClick={() => classSetExpanded(!classExpanded)}
            >
              <span ref={courseNameRef}>{name}</span>
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

          <div className="course-assignment-actions">
            <button
              type="button"
              className="course-assignment-action"
              aria-label="Edit assignments"
              onClick={() => onEditAssignments(id)}
            >
              <i className="fa-solid fa-pencil" aria-hidden="true"></i>
              <span className="course-assignment-action-label">
                Edit Assignment
              </span>
            </button>
            <button
              type="button"
              className="course-assignment-action"
              aria-label="Add assignment"
              onClick={() => onAddAssignment(id)}
            >
              <i className="fa-solid fa-plus" aria-hidden="true"></i>
              <span className="course-assignment-action-label">
                Add Assignment
              </span>
            </button>
          </div>
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
                  color,
                })
              }
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
        )}

        {classExpanded && metaExpanded && (
          <LinksSection
            classId={id}
            links={classLinks}
            onAddLink={onAddLink}
            onUpdateLink={onUpdateLink}
            onDeleteLink={onDeleteLink}
            collapsible
          />
        )}

        {classExpanded &&
          classAssignments.map((assignment) => (
            <Assignment
              key={assignment.id}
              id={assignment.id}
              name={assignment.name}
              priority={assignment.priority}
              dueDate={assignment.dueDate}
              completed={assignment.completed}
              onToggle={onToggleAssignment}
              onEdit={() => onEditAssignments(id, assignment.id)}
            />
          ))}
      </div>
    </div>
  );
}

export default Class;

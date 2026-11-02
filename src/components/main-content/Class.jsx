import { useEffect, useRef, useState } from "react";
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
  onEditAssignments,
  onAddAssignment,
  onEditClass,
  onToggleAssignment,
  color,
}) {
  const badgeColor =
    typeof color === "string" &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)
      ? color
      : "var(--card-color)";
  function openOneNote() {
    window.location.href = onenoteUrl;
  }

  const [classExpanded, classSetExpanded] = useState(true);
  const [metaExpanded, metaSetExpanded] = useState(false);
  const [courseNameWrapped, setCourseNameWrapped] = useState(false);
  const [oneNoteCompact, setOneNoteCompact] = useState(false);
  const courseNameRef = useRef(null);
  const classTitleRowRef = useRef(null);
  const classTitleControlsRef = useRef(null);
  const oneNoteButtonRef = useRef(null);

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

  useEffect(() => {
    const classTitleRow = classTitleRowRef.current;
    const classTitleControls = classTitleControlsRef.current;
    const oneNoteButton = oneNoteButtonRef.current;
    if (!classTitleRow || !classTitleControls || !oneNoteButton) {
      return;
    }

    const updateOneNoteLayout = () => {
      const hadCompactOneNote = classTitleRow.classList.contains(
        "class-title-row--compact-onenote",
      );
      if (hadCompactOneNote) {
        classTitleRow.classList.remove("class-title-row--compact-onenote");
      }

      const controlsRect = classTitleControls.getBoundingClientRect();
      const oneNoteRect = oneNoteButton.getBoundingClientRect();
      const isOnNextLine = oneNoteRect.top >= controlsRect.bottom - 1;

      if (hadCompactOneNote) {
        classTitleRow.classList.add("class-title-row--compact-onenote");
      }

      setOneNoteCompact(isOnNextLine);
    };

    const resizeObserver = new ResizeObserver(updateOneNoteLayout);
    resizeObserver.observe(classTitleRow);
    resizeObserver.observe(classTitleControls);
    updateOneNoteLayout();

    return () => resizeObserver.disconnect();
  }, []);

  const classAssignments = assignments.filter(
    (assignment) => assignment.classId === id,
  );

  return (
    <div className="assignment-class">
      <div className="class-header">
        <div
          ref={classTitleRowRef}
          className={`class-title-row${
            courseNameWrapped ? " class-title-row--compact-actions" : ""
          }${oneNoteCompact ? " class-title-row--compact-onenote" : ""}`}
        >
          <div ref={classTitleControlsRef} className="class-title-controls">
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

          <button
            ref={oneNoteButtonRef}
            type="button"
            className="class-onenote-btn"
            aria-label="Open in OneNote"
            onClick={openOneNote}
          >
            <i className="fa-solid fa-book" aria-hidden="true"></i>
            <span className="class-onenote-label">
              &nbsp;&nbsp;Open in OneNote
            </span>
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
                  color,
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
              id={assignment.id}
              name={assignment.name}
              priority={assignment.priority}
              dueDate={assignment.dueDate}
              completed={assignment.completed}
              onToggle={onToggleAssignment}
            />
          ))}
      </div>
    </div>
  );
}

export default Class;

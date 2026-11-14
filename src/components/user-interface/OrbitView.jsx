import { useEffect, useRef, useState } from "react";
import AddAssignmentModal from "../footer/AddAssignmentModal.jsx";
import AddClassModal from "../footer/AddClassModal.jsx";
import AddContent from "../footer/AddButton.jsx";
import NoteText from "../footer/NoteText.jsx";
import NotesSavedToast from "../footer/NotesSavedToast.jsx";
import SiteFooter from "../footer/SiteFooter.jsx";
import SettingsButton from "../header/SettingsButton.jsx";
import WeekInfo from "../header/WeekInfo.jsx";
import ThemeToggle from "../header/ThemeToggle.jsx";
import Assignment from "../main-content/Assignment.jsx";
import EditAssignmentModal from "../main-content/EditAssignmentModal.jsx";
import EditClassModal from "../main-content/EditClassModal.jsx";
import LogoWelcome from "../header/LogoWelcome.jsx";
import SettingsModal from "./SettingsModal.jsx";
import "../../index.css";
import "./orbit.css";

function getAssignmentGroups(classList, assignmentList, undated) {
  return classList
    .map((course) => ({
      course,
      assignments: assignmentList.filter(
        (assignment) =>
          assignment.classId === course.id &&
          (undated ? !assignment.dueDate : Boolean(assignment.dueDate)),
      ),
    }))
    .filter((group) => group.assignments.length > 0);
}

function AssignmentGroups({
  groups,
  onEditAssignments,
  onToggleAssignment,
  showCourseName = true,
}) {
  if (groups.length === 0) {
    return (
      <p className="orbit-empty-message">
        No assignments in this section.
      </p>
    );
  }

  return groups.map(({ course, assignments }) => (
    <section className="orbit-assignment-group" key={course.id}>
      {showCourseName && <h3>{course.name}</h3>}
      {assignments.map((assignment) => (
        <Assignment
          key={assignment.id}
          {...assignment}
          onToggle={onToggleAssignment}
          onEdit={() => onEditAssignments(course.id, assignment.id)}
        />
      ))}
    </section>
  ));
}

function OrbitView({
  assignmentClassId,
  assignmentList,
  assignmentModalOpen,
  classList,
  classModalOpen,
  classToEdit,
  darkMode,
  editAssignmentClassId,
  editAssignmentId,
  editAssignmentModalOpen,
  editClassModalOpen,
  handleAddAssignment,
  handleAddClass,
  handleCloseAddAssignment,
  handleDeleteAssignment,
  handleDeleteClass,
  handleEditAssignments,
  handleEditClass,
  handleLogout,
  handleOpenAddAssignment,
  handleSaveAssignment,
  handleSaveClass,
  handleSaveName,
  handleSaveNotes,
  handleSaveSemester,
  handleToggleAssignment,
  notes,
  semester,
  setClassModalOpen,
  setClassToEdit,
  setDarkMode,
  setEditAssignmentClassId,
  setEditAssignmentId,
  setEditAssignmentModalOpen,
  setEditClassModalOpen,
  setNotes,
  setViewingWeek,
  showNotesSavedToast,
  toastMessage,
  user,
  viewingWeek,
  viewMode,
  onViewModeChange,
  isOrbitSupported,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [returnToSettingsAfterClassEdit, setReturnToSettingsAfterClassEdit] =
    useState(false);
  const [forceUndatedAssignment, setForceUndatedAssignment] = useState(false);
  const bubbleScrollRef = useRef(null);
  const bubbleStageRef = useRef(null);
  const [bubbleViewportWidth, setBubbleViewportWidth] = useState(0);

  useEffect(() => {
    if (returnToSettingsAfterClassEdit && !editClassModalOpen) {
      setSettingsModalOpen(true);
      setReturnToSettingsAfterClassEdit(false);
    }
  }, [editClassModalOpen, returnToSettingsAfterClassEdit]);

  useEffect(() => {
    if (
      selectedCourseId !== null &&
      !classList.some((course) => course.id === selectedCourseId)
    ) {
      setSelectedCourseId(null);
    }
  }, [classList, selectedCourseId]);

  useEffect(() => {
    const bubbleScroll = bubbleScrollRef.current;
    if (!bubbleScroll) {
      return;
    }

    function updateBubbleViewportWidth() {
      setBubbleViewportWidth(bubbleScroll.clientWidth);
    }

    updateBubbleViewportWidth();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateBubbleViewportWidth);
      return () =>
        window.removeEventListener("resize", updateBubbleViewportWidth);
    }

    const observer = new ResizeObserver(updateBubbleViewportWidth);
    observer.observe(bubbleScroll);
    return () => observer.disconnect();
  }, []);

  const selectedCourse = classList.find(
    (course) => course.id === selectedCourseId,
  );
  const upcomingGroups = getAssignmentGroups(
    classList,
    assignmentList,
    false,
  );
  const undatedGroups = getAssignmentGroups(classList, assignmentList, true);

  const baseBubbleSize = Math.max(
    72,
    132 - Math.max(0, classList.length - 5) * 2,
  );
  const baseBubbleRadius =
    classList.length <= 1
      ? 0
      : Math.max(
          115,
          (classList.length * (baseBubbleSize + 16)) / (2 * Math.PI),
        );
  const baseBubbleStageSize = Math.max(
    380,
    Math.ceil(baseBubbleRadius * 2 + baseBubbleSize + 48),
  );
  const bubbleScale =
    window.innerWidth < 750 && bubbleViewportWidth > 0
      ? Math.min(1, bubbleViewportWidth / baseBubbleStageSize)
      : 1;
  const bubbleSize = baseBubbleSize * bubbleScale;
  const bubbleRadius = baseBubbleRadius * bubbleScale;
  const bubbleStageSize = Math.floor(baseBubbleStageSize * bubbleScale);
  const courseOrderKey = classList.map((course) => course.id).join("|");

  useEffect(() => {
    const stage = bubbleStageRef.current;
    if (!stage || classList.length < 2) {
      return;
    }

    const driftDistance = Math.min(22 * bubbleScale, bubbleRadius * 0.3);
    const bubbleRadiusOnScreen = bubbleSize / 2;
    const states = Array.from(
      stage.querySelectorAll(".orbit-course-bubble-wrap"),
      (element, index) => {
        const angle =
          classList.length === 1
            ? 0
            : (2 * Math.PI * index) / classList.length - Math.PI / 2;
        const anchorX =
          stage.clientWidth / 2 + Math.cos(angle) * bubbleRadius;
        const anchorY =
          stage.clientHeight / 2 + Math.sin(angle) * bubbleRadius;
        const velocityAngle = Math.random() * 2 * Math.PI;
        const speed = 7 + Math.random() * 4;

        element.style.willChange = "transform";
        return {
          element,
          anchorX,
          anchorY,
          x: anchorX,
          y: anchorY,
          vx: Math.cos(velocityAngle) * speed,
          vy: Math.sin(velocityAngle) * speed,
        };
      },
    );
    let lastTime = null;
    let frameId;

    function updatePositions(timestamp) {
      const delta =
        lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      states.forEach((state) => {
        state.x += state.vx * delta;
        state.y += state.vy * delta;
      });

      for (let first = 0; first < states.length; first += 1) {
        for (let second = first + 1; second < states.length; second += 1) {
          const a = states[first];
          const b = states[second];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.hypot(dx, dy);
          const minDistance = bubbleRadiusOnScreen * 2;

          if (distance >= minDistance) {
            continue;
          }

          const safeDistance = distance || 1;
          const normalX = distance ? dx / safeDistance : 1;
          const normalY = distance ? dy / safeDistance : 0;
          const overlap = minDistance - distance;
          a.x -= normalX * overlap * 0.5;
          a.y -= normalY * overlap * 0.5;
          b.x += normalX * overlap * 0.5;
          b.y += normalY * overlap * 0.5;

          const relativeVelocity =
            (b.vx - a.vx) * normalX + (b.vy - a.vy) * normalY;
          if (relativeVelocity < 0) {
            a.vx += relativeVelocity * normalX;
            a.vy += relativeVelocity * normalY;
            b.vx -= relativeVelocity * normalX;
            b.vy -= relativeVelocity * normalY;
          }
        }
      }

      states.forEach((state) => {
        const offsetX = state.x - state.anchorX;
        const offsetY = state.y - state.anchorY;
        const offsetDistance = Math.hypot(offsetX, offsetY);

        if (offsetDistance > driftDistance) {
          const normalX = offsetX / offsetDistance;
          const normalY = offsetY / offsetDistance;
          const outwardVelocity = state.vx * normalX + state.vy * normalY;
          state.x = state.anchorX + normalX * driftDistance;
          state.y = state.anchorY + normalY * driftDistance;

          if (outwardVelocity > 0) {
            state.vx -= 2 * outwardVelocity * normalX;
            state.vy -= 2 * outwardVelocity * normalY;
          }
        }

        state.element.style.transform =
          `translate(-50%, -50%) translate3d(${state.x - state.anchorX}px, ` +
          `${state.y - state.anchorY}px, 0)`;
      });

      frameId = window.requestAnimationFrame(updatePositions);
    }

    frameId = window.requestAnimationFrame(updatePositions);
    return () => {
      window.cancelAnimationFrame(frameId);
      states.forEach((state) => {
        state.element.style.willChange = "";
        state.element.style.transform = "";
      });
    };
  }, [
    bubbleScale,
    bubbleSize,
    bubbleRadius,
    classList.length,
    courseOrderKey,
  ]);

  function openAddAssignment(classId = null, forceUndated = false) {
    setForceUndatedAssignment(forceUndated);
    handleOpenAddAssignment(classId);
  }

  function handleSelectCourse(courseId) {
    setSelectedCourseId((currentId) =>
      currentId === courseId ? null : courseId,
    );
  }

  function handleOpenOneNote() {
    if (selectedCourse?.onenoteUrl) {
      window.location.href = selectedCourse.onenoteUrl;
    }
  }

  return (
    <main className={`orbit-view${darkMode ? " dark" : ""}`}>
      <header className="orbit-header">
        <div className="orbit-header-brand">
          <LogoWelcome
            userName={user?.name}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            logoClickable={false}
            showSettingsButton={false}
            showThemeButton={false}
          />
        </div>

        <div className="orbit-week">
          {semester && viewingWeek !== null && (
            <WeekInfo
              semesterName={semester.name}
              semesterStartDate={semester.startDate}
              semesterEndDate={semester.endDate}
              week={viewingWeek}
              onPreviousWeek={() => setViewingWeek(viewingWeek - 1)}
              onNextWeek={() => setViewingWeek(viewingWeek + 1)}
            />
          )}
        </div>

        <div className="orbit-header-actions">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <SettingsButton onClick={() => setSettingsModalOpen(true)} />
        </div>
      </header>

      <div
        className={`orbit-workspace${selectedCourse ? " has-selected-course" : ""}`}
      >
        <aside className="orbit-sidebar">
          <section className="orbit-sidebar-section orbit-upcoming">
            <div className="orbit-section-heading">
              <h2>Upcoming Assignments</h2>
              <AddContent
                type="Assignment"
                onClick={() => openAddAssignment()}
              />
            </div>
            <div className="orbit-assignment-scroll">
              <AssignmentGroups
                groups={upcomingGroups}
                onEditAssignments={handleEditAssignments}
                onToggleAssignment={handleToggleAssignment}
              />
            </div>
          </section>

          <section className="orbit-sidebar-section orbit-undated">
            <div className="orbit-section-heading">
              <h2>Undated Assignments</h2>
              <AddContent
                type="Undated Assignment"
                iconOnly
                onClick={() => openAddAssignment(null, true)}
              />
            </div>
            <div className="orbit-assignment-scroll">
              <AssignmentGroups
                groups={undatedGroups}
                onEditAssignments={handleEditAssignments}
                onToggleAssignment={handleToggleAssignment}
                showCourseName={false}
              />
            </div>
          </section>
        </aside>

        <section className="orbit-center">
          <div className="orbit-bubble-scroll" ref={bubbleScrollRef}>
            <div className="orbit-course-heading">
              <h2>Courses</h2>
              <AddContent
                type="Class"
                onClick={() => setClassModalOpen(true)}
              />
            </div>
            <div
              className="orbit-bubble-stage"
              ref={bubbleStageRef}
              style={{
                width: `${bubbleStageSize}px`,
                height: `${bubbleStageSize}px`,
              }}
            >
              {classList.length > 0 ? (
                classList.map((course, index) => {
                  const angle =
                    classList.length === 1
                      ? 0
                      : (2 * Math.PI * index) / classList.length -
                        Math.PI / 2;
                  const x = Math.round(Math.cos(angle) * bubbleRadius);
                  const y = Math.round(Math.sin(angle) * bubbleRadius);
                  const hasCourseColor =
                    typeof course.color === "string" &&
                    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(course.color);
                  const courseColor = hasCourseColor
                    ? course.color
                    : "var(--card-color)";
                  const courseGlow = hasCourseColor
                    ? course.color
                    : "var(--main-blue)";

                  return (
                    <div
                      key={course.id}
                      className={`orbit-course-bubble-wrap${
                        selectedCourseId === course.id ? " is-selected" : ""
                      }`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        width: `${bubbleSize}px`,
                        height: `${bubbleSize}px`,
                        "--course-glow": courseGlow,
                      }}
                    >
                      <button
                        type="button"
                        className="orbit-course-bubble"
                        style={{ backgroundColor: courseColor }}
                        aria-pressed={selectedCourseId === course.id}
                        onClick={() => handleSelectCourse(course.id)}
                        title={course.name}
                      >
                        <span className="orbit-course-bubble-label">
                          {course.name}
                        </span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="orbit-empty-center">
                  Add a class to start your course orbit.
                </p>
              )}
            </div>
          </div>

          <section className="orbit-notes">
            <div className="orbit-section-heading orbit-notes-heading">
              <h2>Notes</h2>
              <button
                type="button"
                className="orbit-clear-notes"
                onClick={() => setNotes("")}
              >
                Clear
              </button>
              <AddContent type="save" onClick={handleSaveNotes} />
            </div>
            <div className="orbit-notes-editor">
              <NoteText notes={notes} setNotes={setNotes} />
            </div>
          </section>
        </section>

        {selectedCourse && (
          <aside className="orbit-course-panel">
            <div className="orbit-panel-heading">
              <h2>{selectedCourse.name}</h2>
              <button
                type="button"
                className="orbit-panel-close"
                aria-label="Close course panel"
                onClick={() => setSelectedCourseId(null)}
              >
                ×
              </button>
            </div>

            <section className="orbit-course-metadata">
              <h3>Course details</h3>
              {selectedCourse.courseCode && (
                <p>
                  <strong>Course code:</strong> {selectedCourse.courseCode}
                </p>
              )}
              {selectedCourse.professor && (
                <p>
                  <strong>Professor:</strong> {selectedCourse.professor}
                </p>
              )}
              {selectedCourse.courseHours && (
                <p>
                  <strong>Course hours:</strong> {selectedCourse.courseHours}
                </p>
              )}
              {selectedCourse.officeHours && (
                <p>
                  <strong>Office hours:</strong> {selectedCourse.officeHours}
                </p>
              )}
              <div className="orbit-course-actions">
                <button
                  type="button"
                  className="orbit-secondary-button"
                  onClick={() => handleEditClass(selectedCourse)}
                >
                  Edit Course
                </button>
                {selectedCourse.onenoteUrl && (
                  <button
                    type="button"
                    className="orbit-secondary-button"
                    onClick={handleOpenOneNote}
                  >
                    Open in OneNote
                  </button>
                )}
              </div>
            </section>

            <section className="orbit-panel-assignments">
              <div className="orbit-section-heading">
                <h3>Assignments</h3>
                <AddContent
                  type="Assignment"
                  onClick={() => openAddAssignment(selectedCourse.id)}
                />
              </div>
              <div className="orbit-panel-assignment-list">
                {assignmentList
                  .filter(
                    (assignment) => assignment.classId === selectedCourse.id,
                  )
                  .map((assignment) => (
                    <Assignment
                      key={assignment.id}
                      {...assignment}
                      onToggle={handleToggleAssignment}
                      onEdit={() =>
                        handleEditAssignments(selectedCourse.id, assignment.id)
                      }
                    />
                  ))}
                {!assignmentList.some(
                  (assignment) => assignment.classId === selectedCourse.id,
                ) && (
                  <p className="orbit-empty-message">
                    No assignments for this course yet.
                  </p>
                )}
              </div>
            </section>
          </aside>
        )}
      </div>

      <NotesSavedToast message={toastMessage} />
      <SiteFooter />

      {assignmentModalOpen && (
        <AddAssignmentModal
          classes={classList}
          initialClassId={assignmentClassId}
          forceUndated={forceUndatedAssignment}
          onClose={handleCloseAddAssignment}
          onAdd={handleAddAssignment}
        />
      )}

      {classModalOpen && (
        <AddClassModal
          onClose={() => setClassModalOpen(false)}
          onAdd={handleAddClass}
        />
      )}

      {editAssignmentModalOpen &&
        classList.some((course) => course.id === editAssignmentClassId) && (
          <EditAssignmentModal
            course={classList.find(
              (course) => course.id === editAssignmentClassId,
            )}
            initialAssignmentId={editAssignmentId}
            assignments={assignmentList.filter(
              (assignment) => assignment.classId === editAssignmentClassId,
            )}
            onSave={handleSaveAssignment}
            onDelete={handleDeleteAssignment}
            onClose={() => {
              setEditAssignmentModalOpen(false);
              setEditAssignmentClassId(null);
              setEditAssignmentId(null);
            }}
          />
        )}

      {editClassModalOpen && classToEdit && (
        <EditClassModal
          course={classToEdit}
          onSave={handleSaveClass}
          onDelete={handleDeleteClass}
          onClose={() => {
            setEditClassModalOpen(false);
            setClassToEdit(null);
          }}
        />
      )}

      {settingsModalOpen && (
        <SettingsModal
          user={user}
          semester={semester}
          classList={classList}
          onClose={() => setSettingsModalOpen(false)}
          onSaveName={handleSaveName}
          onSaveSemester={handleSaveSemester}
          onEditClass={(course) => {
            setReturnToSettingsAfterClassEdit(true);
            setSettingsModalOpen(false);
            handleEditClass(course);
          }}
          onLogout={handleLogout}
          onNotify={showNotesSavedToast}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          isOrbitSupported={isOrbitSupported}
        />
      )}
    </main>
  );
}

export default OrbitView;

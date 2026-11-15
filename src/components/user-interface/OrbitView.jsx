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
import LinksSection from "../main-content/LinksSection.jsx";
import EditAssignmentModal from "../main-content/EditAssignmentModal.jsx";
import EditClassModal from "../main-content/EditClassModal.jsx";
import LogoWelcome from "../header/LogoWelcome.jsx";
import SettingsModal from "./SettingsModal.jsx";
import "../../index.css";
import "./orbit.css";

const ELECTRON_ORBIT_SPLIT_KEY = "lyweek-electron-orbit-split";
const MIN_ELECTRON_ASSIGNMENTS_PERCENT = 20;
const MAX_ELECTRON_ASSIGNMENTS_PERCENT = 70;

function getSavedElectronAssignmentsPercent() {
  const savedValue = window.localStorage.getItem(ELECTRON_ORBIT_SPLIT_KEY);
  if (savedValue === null) {
    return 40;
  }

  const percentage = Number(savedValue);
  return Number.isFinite(percentage)
    ? Math.min(
        MAX_ELECTRON_ASSIGNMENTS_PERCENT,
        Math.max(MIN_ELECTRON_ASSIGNMENTS_PERCENT, percentage),
      )
    : 40;
}

function getAssignmentGroups(
  classList,
  assignmentList,
  undated,
  includeUndated = false,
) {
  return classList
    .map((course) => ({
      course,
      assignments: assignmentList.filter(
        (assignment) =>
          assignment.classId === course.id &&
          (undated
            ? !assignment.dueDate
            : includeUndated || Boolean(assignment.dueDate)),
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
  linkList,
  classModalOpen,
  classToEdit,
  darkMode,
  editAssignmentClassId,
  editAssignmentId,
  editAssignmentModalOpen,
  editClassModalOpen,
  handleAddAssignment,
  handleAddClass,
  handleAddLink,
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
  handleUpdateLink,
  handleDeleteLink,
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
  isToastFading,
  user,
  viewingWeek,
  viewMode,
  onViewModeChange,
  isOrbitSupported,
  isElectron,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [electronAssignmentsPercent, setElectronAssignmentsPercent] =
    useState(() =>
      isElectron ? getSavedElectronAssignmentsPercent() : 40,
    );
  const electronAssignmentsPercentRef = useRef(electronAssignmentsPercent);
  const compactViewportRef = useRef(null);
  const [courseDetailsOpen, setCourseDetailsOpen] = useState(
    () => window.innerHeight > 700,
  );
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [returnToSettingsAfterClassEdit, setReturnToSettingsAfterClassEdit] =
    useState(false);
  const [forceUndatedAssignment, setForceUndatedAssignment] = useState(false);
  const orbitWorkspaceRef = useRef(null);
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
    compactViewportRef.current = window.innerHeight <= 700;

    function handleResize() {
      const isCompactViewport = window.innerHeight <= 700;
      if (isCompactViewport !== compactViewportRef.current) {
        compactViewportRef.current = isCompactViewport;
        setCourseDetailsOpen(!isCompactViewport);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    isElectron,
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
  const electronBubbleScale = isElectron ? 0.78 : 1;
  const bubbleScale =
    (window.innerWidth < 750 || isElectron) && bubbleViewportWidth > 0
      ? electronBubbleScale *
        Math.min(
          1,
          bubbleViewportWidth /
            (baseBubbleStageSize * electronBubbleScale),
        )
      : electronBubbleScale;
  const bubbleSize = baseBubbleSize * bubbleScale;
  const bubbleRadius = baseBubbleRadius * bubbleScale;
  const bubbleStageSize = Math.floor(baseBubbleStageSize * bubbleScale);
  const courseOrderKey = classList.map((course) => course.id).join("|");

  useEffect(() => {
    const stage = bubbleStageRef.current;
    if (!stage || classList.length < 2) {
      return;
    }

    const states = Array.from(
      stage.querySelectorAll(".orbit-course-bubble-wrap"),
      (element) => {
        const velocityAngle = Math.random() * 2 * Math.PI;
        const speed = 7 + Math.random() * 4;

        element.style.willChange = "transform";
        return {
          element,
          anchorX: 0,
          anchorY: 0,
          x: 0,
          y: 0,
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
        state.anchorX = state.element.offsetLeft + state.element.offsetWidth / 2;
        state.anchorY = state.element.offsetTop + state.element.offsetHeight / 2;
        state.x += state.vx * delta;
        state.y += state.vy * delta;
      });

      for (let first = 0; first < states.length; first += 1) {
        for (let second = first + 1; second < states.length; second += 1) {
          const a = states[first];
          const b = states[second];
          const dx = b.anchorX + b.x - a.anchorX - a.x;
          const dy = b.anchorY + b.y - a.anchorY - a.y;
          const distance = Math.hypot(dx, dy);
          const minDistance =
            (a.element.offsetWidth + b.element.offsetWidth) / 2;

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
        const driftDistance = Math.min(
          22,
          (state.element.offsetWidth / 2) * 0.3,
        );
        const offsetDistance = Math.hypot(state.x, state.y);

        if (offsetDistance > driftDistance) {
          const normalX = state.x / offsetDistance;
          const normalY = state.y / offsetDistance;
          const outwardVelocity = state.vx * normalX + state.vy * normalY;
          state.x = normalX * driftDistance;
          state.y = normalY * driftDistance;

          if (outwardVelocity > 0) {
            state.vx -= 2 * outwardVelocity * normalX;
            state.vy -= 2 * outwardVelocity * normalY;
          }
        }

        state.element.style.transform =
          `translate(-50%, -50%) translate3d(${state.x}px, ${state.y}px, 0)`;
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

  function setAssignmentsPercent(value, persist = true) {
    const percentage = Math.min(
      MAX_ELECTRON_ASSIGNMENTS_PERCENT,
      Math.max(MIN_ELECTRON_ASSIGNMENTS_PERCENT, value),
    );
    electronAssignmentsPercentRef.current = percentage;
    setElectronAssignmentsPercent(percentage);
    if (persist) {
      window.localStorage.setItem(
        ELECTRON_ORBIT_SPLIT_KEY,
        String(percentage),
      );
    }
  }

  function persistAssignmentsPercent() {
    window.localStorage.setItem(
      ELECTRON_ORBIT_SPLIT_KEY,
      String(electronAssignmentsPercentRef.current),
    );
  }

  function handleOrbitResizePointerMove(event) {
    const workspace = orbitWorkspaceRef.current;
    const separator = event.currentTarget;
    if (!workspace || !separator.hasPointerCapture(event.pointerId)) {
      return;
    }

    const isStacked = window.matchMedia("(max-width: 740px)").matches;
    const coursePanel = workspace.querySelector(".orbit-course-panel");
    const coursePanelWidth =
      selectedCourse && !isStacked && coursePanel
        ? coursePanel.getBoundingClientRect().width
        : 0;
    const columnGap = Number.parseFloat(
      window.getComputedStyle(workspace).columnGap,
    );
    const gap = Number.isFinite(columnGap) ? columnGap : 0;
    const columnCount = selectedCourse && !isStacked ? 4 : 3;
    const availableWidth =
      workspace.clientWidth -
      gap * (columnCount - 1) -
      separator.getBoundingClientRect().width -
      coursePanelWidth;
    const assignmentsWidth =
      event.clientX -
      workspace.getBoundingClientRect().left -
      gap -
      separator.getBoundingClientRect().width / 2;

    if (availableWidth > 0) {
      setAssignmentsPercent(
        Math.round((assignmentsWidth / availableWidth) * 100),
        false,
      );
    }
  }

  function handleOrbitResizeKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    setAssignmentsPercent(electronAssignmentsPercent + direction * 2);
  }

  return (
    <main
      className={`orbit-view${darkMode ? " dark" : ""}${
        isElectron ? " electron-view" : ""
      }`}
    >
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
        ref={orbitWorkspaceRef}
        style={
          isElectron
            ? {
                "--electron-assignments-fr": `${electronAssignmentsPercent}fr`,
                "--electron-orbit-fr": `${100 - electronAssignmentsPercent}fr`,
              }
            : undefined
        }
      >
        <aside className="orbit-sidebar">
          <section className="orbit-sidebar-section orbit-upcoming">
            <div className="orbit-section-heading">
              <h2>{isElectron ? "Assignments" : "Upcoming Assignments"}</h2>
              <AddContent
                type="Assignment"
                iconOnly={isElectron}
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

          {!isElectron && (
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
          )}

          {isElectron && (
            <section className="orbit-sidebar-section orbit-notes orbit-sidebar-notes">
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
          )}
        </aside>

        {isElectron && (
          <div
            className="electron-orbit-resizer"
            role="separator"
            aria-label="Resize assignments and orbit panels"
            aria-orientation="vertical"
            aria-valuemin={MIN_ELECTRON_ASSIGNMENTS_PERCENT}
            aria-valuemax={MAX_ELECTRON_ASSIGNMENTS_PERCENT}
            aria-valuenow={electronAssignmentsPercent}
            tabIndex={0}
            onPointerDown={(event) =>
              event.button === 0 &&
              event.currentTarget.setPointerCapture(event.pointerId)
            }
            onPointerMove={handleOrbitResizePointerMove}
            onPointerUp={persistAssignmentsPercent}
            onPointerCancel={persistAssignmentsPercent}
            onKeyDown={handleOrbitResizeKeyDown}
          />
        )}

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

          {!isElectron && (
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
          )}
        </section>

        {selectedCourse && (
          <aside className="orbit-course-panel">
            <div className="orbit-panel-heading">
              <h2 className="orbit-course-name">{selectedCourse.name}</h2>
              <button
                type="button"
                className="orbit-panel-close"
                aria-label="Close course panel"
                onClick={() => setSelectedCourseId(null)}
              >
                ×
              </button>
            </div>

            <details
              className="orbit-course-metadata"
              open={courseDetailsOpen}
              onToggle={(event) =>
                setCourseDetailsOpen(event.currentTarget.open)
              }
            >
              <summary>Course details</summary>
              <div className="orbit-course-metadata-content">
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
                </div>
              </div>
            </details>

            {!isElectron && (
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
                          handleEditAssignments(
                            selectedCourse.id,
                            assignment.id,
                          )
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
            )}

            <LinksSection
              classId={selectedCourse.id}
              links={linkList.filter(
                (link) => link.classId === selectedCourse.id,
              )}
              onAddLink={handleAddLink}
              onUpdateLink={handleUpdateLink}
              onDeleteLink={handleDeleteLink}
            />
          </aside>
        )}
      </div>

      <NotesSavedToast message={toastMessage} isFading={isToastFading} />
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

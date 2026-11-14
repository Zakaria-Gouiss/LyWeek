import { useEffect, useState } from "react";
import AddAssignmentModal from "../footer/AddAssignmentModal.jsx";
import AddClassModal from "../footer/AddClassModal.jsx";
import EditAssignmentModal from "../main-content/EditAssignmentModal.jsx";
import EditClassModal from "../main-content/EditClassModal.jsx";
import Class from "../main-content/Class.jsx";
import LogoWelcome from "../header/LogoWelcome.jsx";
import WeekInfo from "../header/WeekInfo.jsx";
import WeekButton from "../header/WeekButton.jsx";
import AddContent from "../footer/AddButton.jsx";
import NoteText from "../footer/NoteText.jsx";
import SiteFooter from "../footer/SiteFooter.jsx";
import NotesSavedToast from "../footer/NotesSavedToast.jsx";
import SettingsModal from "./SettingsModal.jsx";
import "../../index.css";

function ClassicView({
  assignmentClassId,
  assignmentList,
  assignmentModalOpen,
  classList,
  classModalOpen,
  classToEdit,
  darkMode,
  editAssignmentClassId,
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
  toastMessage,
  setClassModalOpen,
  setClassToEdit,
  setDarkMode,
  setEditAssignmentClassId,
  setEditAssignmentModalOpen,
  setEditClassModalOpen,
  setNotes,
  setViewingWeek,
  showNotesSavedToast,
  user,
  viewingWeek,
}) {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [returnToSettingsAfterClassEdit, setReturnToSettingsAfterClassEdit] =
    useState(false);

  useEffect(() => {
    if (returnToSettingsAfterClassEdit && !editClassModalOpen) {
      setSettingsModalOpen(true);
      setReturnToSettingsAfterClassEdit(false);
    }
  }, [editClassModalOpen, returnToSettingsAfterClassEdit]);

  return (
    <>
      <main className={darkMode ? "dark" : ""}>
        <nav className="header">
          <LogoWelcome
            userName={user?.name}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onOpenSettings={() => setSettingsModalOpen(true)}
          />
          <section className="week-and-nav">
            {semester && viewingWeek !== null && (
              <WeekInfo
                semesterName={semester.name}
                semesterStartDate={semester.startDate}
                semesterEndDate={semester.endDate}
                week={viewingWeek}
              />
            )}
          </section>
          <div className="week-nav">
            <WeekButton
              position="left"
              onClick={() => setViewingWeek(viewingWeek - 1)}
            />
            <WeekButton
              position="right"
              onClick={() => setViewingWeek(viewingWeek + 1)}
            />
          </div>
        </nav>
        <nav className="main-content">
          {classList.map((course) => (
            <Class
              key={course.id}
              {...course}
              assignments={assignmentList}
              onEditClass={handleEditClass}
              onEditAssignments={handleEditAssignments}
              onAddAssignment={handleOpenAddAssignment}
              onToggleAssignment={handleToggleAssignment}
            />
          ))}
        </nav>
        <nav className="footer">
          <section className="add-content">
            <AddContent
              type="Assignment"
              onClick={() => handleOpenAddAssignment()}
            />
            <AddContent type="Class" onClick={() => setClassModalOpen(true)} />
          </section>
          <section className="misc-notes">
            <NoteText notes={notes} setNotes={setNotes} />

            <AddContent type="save" onClick={handleSaveNotes} />
          </section>
        </nav>
        <NotesSavedToast message={toastMessage} />
        {assignmentModalOpen && (
          <AddAssignmentModal
            classes={classList}
            initialClassId={assignmentClassId}
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
              assignments={assignmentList.filter(
                (assignment) => assignment.classId === editAssignmentClassId,
              )}
              onSave={handleSaveAssignment}
              onDelete={handleDeleteAssignment}
              onClose={() => {
                setEditAssignmentModalOpen(false);
                setEditAssignmentClassId(null);
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
          />
        )}
        <SiteFooter />
      </main>
    </>
  );
}
export default ClassicView;

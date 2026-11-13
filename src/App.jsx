import useAppController from "./hooks/useAppController.js";
import "./index.css";
import Class from "./components/main-content/Class.jsx";
import LogoWelcome from "./components/header/LogoWelcome.jsx";
import WeekInfo from "./components/header/WeekInfo.jsx";
import WeekButton from "./components/header/WeekButton.jsx";
import AddContent from "./components/footer/AddButton.jsx";
import NoteText from "./components/footer/NoteText.jsx";
import SiteFooter from "./components/footer/SiteFooter.jsx";
import AddAssignmentModal from "./components/footer/AddAssignmentModal.jsx";
import AddClassModal from "./components/footer/AddClassModal.jsx";
import EditAssignmentModal from "./components/main-content/EditAssignmentModal.jsx";
import EditClassModal from "./components/main-content/EditClassModal.jsx";
import SemesterModal from "./components/header/SemesterModal.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import RegisterPage from "./components/auth/RegisterPage.jsx";

function App() {
  const {
    assignmentClassId,
    assignmentList,
    assignmentModalOpen,
    authError,
    authLoading,
    authView,
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
    handleLogin,
    handleLogout,
    handleOpenAddAssignment,
    handleRegister,
    handleSaveAssignment,
    handleSaveClass,
    handleSaveNotes,
    handleSaveSemester,
    handleToggleAssignment,
    isAuthenticated,
    notes,
    semester,
    semesterModalOpen,
    setAuthError,
    setAuthView,
    setClassModalOpen,
    setClassToEdit,
    setDarkMode,
    setEditAssignmentClassId,
    setEditAssignmentModalOpen,
    setEditClassModalOpen,
    setNotes,
    setSemesterModalOpen,
    setViewingWeek,
    user,
    viewingWeek,
  } = useAppController();
  if (authLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return (
      <main className={darkMode ? "dark" : ""}>
        {authView === "login" ? (
          <LoginPage
            onLogin={handleLogin}
            loading={authLoading}
            error={authError}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onSwitchToRegister={() => {
              setAuthError("");
              setAuthView("register");
            }}
          />
        ) : (
          <RegisterPage
            onRegister={handleRegister}
            loading={authLoading}
            error={authError}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onSwitchToLogin={() => {
              setAuthError("");
              setAuthView("login");
            }}
          />
        )}
        <SiteFooter />
      </main>
    );
  }

  return (
    <>
      <main className={darkMode ? "dark" : ""}>
        <nav className="header">
          <LogoWelcome
            userName={user?.name}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
          />
          <section className="week-and-nav">
            {semester && viewingWeek !== null && (
              <WeekInfo
                semesterName={semester.name}
                semesterStartDate={semester.startDate}
                semesterEndDate={semester.endDate}
                week={viewingWeek}
                onEditSemester={() => setSemesterModalOpen(true)}
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

        {semesterModalOpen && semester && (
          <SemesterModal
            semester={semester}
            onClose={() => setSemesterModalOpen(false)}
            onSave={handleSaveSemester}
          />
        )}
        <SiteFooter />
      </main>
    </>
  );
}

export default App;

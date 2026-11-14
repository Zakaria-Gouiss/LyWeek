import useAppController from "./hooks/useAppController.js";
import "./index.css";
import SiteFooter from "./components/footer/SiteFooter.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import RegisterPage from "./components/auth/RegisterPage.jsx";
import ClassicView from "./components/user-interface/ClassicView.jsx";

function App() {
  const controller = useAppController();
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
  } = controller;
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

  return <ClassicView {...controller} />;
}

export default App;

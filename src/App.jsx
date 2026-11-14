import { useEffect, useState } from "react";
import useAppController from "./hooks/useAppController.js";
import "./index.css";
import SiteFooter from "./components/footer/SiteFooter.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import RegisterPage from "./components/auth/RegisterPage.jsx";
import ClassicView from "./components/user-interface/ClassicView.jsx";
import OrbitView from "./components/user-interface/OrbitView.jsx";

const VIEW_MODE_STORAGE_KEY = "lyweek-view-mode";

function App() {
  const controller = useAppController();
  const [viewMode, setViewMode] = useState(() =>
    localStorage.getItem(VIEW_MODE_STORAGE_KEY) === "orbit"
      ? "orbit"
      : "classic",
  );
  const [isOrbitSupported, setIsOrbitSupported] = useState(
    () => window.innerWidth >= 450,
  );

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    function handleResize() {
      setIsOrbitSupported(window.innerWidth >= 450);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    handleSaveName,
    handleSaveNotes,
    handleSaveSemester,
    handleToggleAssignment,
    isAuthenticated,
    notes,
    semester,
    setAuthError,
    setAuthView,
    setClassModalOpen,
    setClassToEdit,
    setDarkMode,
    setEditAssignmentClassId,
    setEditAssignmentModalOpen,
    setEditClassModalOpen,
    setNotes,
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

  const viewProps = {
    ...controller,
    handleSaveName,
    viewMode: isOrbitSupported ? viewMode : "classic",
    isOrbitSupported,
    onViewModeChange: setViewMode,
  };

  return isOrbitSupported && viewMode === "orbit" ? (
    <OrbitView {...viewProps} />
  ) : (
    <ClassicView {...viewProps} />
  );
}

export default App;

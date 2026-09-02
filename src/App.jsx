import { useState, useEffect } from "react";

import lyLight from "./assets/lyweek-light.jpg";
import lyDark from "./assets/lyweek-dark.jpg";
import "./index.css";
import Assignment from "./components/main-content/Assignment.jsx";
import Class from "./components/main-content/Class.jsx";
import LogoWelcome from "./components/header/LogoWelcome.jsx";
import WeekInfo from "./components/header/WeekInfo.jsx";
import WeekButton from "./components/header/WeekButton.jsx";
import AddContent from "./components/footer/AddButton.jsx";
import NoteText from "./components/footer/NoteText.jsx";
import { getSemesterWeek, getWeekInfo } from "./utils/dateUtils.js";
import AddAssignmentModal from "./components/footer/AddAssignmentModal.jsx";
import AddClassModal from "./components/footer/AddClassModal.jsx";
import EditAssignmentModal from "./components/main-content/EditAssignmentModal.jsx";
import EditClassModal from "./components/main-content/EditClassModal.jsx";
import SemesterModal from "./components/header/SemesterModal.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import RegisterPage from "./components/auth/RegisterPage.jsx";

// API imports
import {
  checkAuthentication,
  login,
  register,
  logout,
} from "./utils/api/auth.js";
import { getSemesters, updateSemester } from "./utils/api/semesters.js";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from "./utils/api/classes.js";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "./utils/api/assignments.js";
import { getNotes, updateNotes } from "./utils/api/notes.js";

function App() {
  const [viewingWeek, setViewingWeek] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authView, setAuthView] = useState("login");
  const [user, setUser] = useState(null);

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editAssignmentModalOpen, setEditAssignmentModalOpen] = useState(false);
  const [editClassModalOpen, setEditClassModalOpen] = useState(false);
  const [semesterModalOpen, setSemesterModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [classToEdit, setClassToEdit] = useState(null);
  const [assignmentList, setAssignmentList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [notes, setNotes] = useState("");
  const [semester, setSemester] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");

    return savedMode === null ? true : savedMode === "true";
  });
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  useEffect(() => {
    async function setupAuth() {
      try {
        const user = await checkAuthentication();
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    setupAuth();
  }, []);

  async function handleLogin(loginData) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const user = await login(loginData.email, loginData.password);
      setUser(user);
      setIsAuthenticated(true);
      setAuthView("login");
    } catch (error) {
      setAuthError(error.message || "Login failed");
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(registerData) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const user = await register(registerData);
      console.log("REGISTERED USER:", user);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(error.message || "Registration failed");
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function fetchInitialData() {
      try {
        const [semesterData, classesData, assignmentsData, notesData] =
          await Promise.all([
            getSemesters(),
            getClasses(),
            getAssignments(),
            getNotes(),
          ]);

        console.log("SEMESTER DATA:", semesterData);
        setSemester(semesterData);

        const currentWeek = getSemesterWeek(semesterData.startDate, new Date());

        console.log("CURRENT WEEK:", currentWeek);
        setViewingWeek(currentWeek);
        setClassList(classesData);
        setAssignmentList(assignmentsData);
        setNotes(notesData[0]?.content || "");
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    }

    fetchInitialData();
  }, [isAuthenticated]);

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      setSemester(null);
      setClassList([]);
      setAssignmentList([]);
      setNotes("");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }
  async function handleAddAssignment(newAssignment) {
    try {
      const savedAssignment = await createAssignment(newAssignment);
      setAssignmentList((currentAssignments) => [
        ...currentAssignments,
        savedAssignment,
      ]);
      setAssignmentModalOpen(false);
    } catch (error) {
      console.error("Failed to add assignment:", error);
    }
  }
  async function handleSaveNotes() {
    try {
      const savedNotes = await updateNotes(notes);
      setNotes(savedNotes.content);
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  }
  async function handleAddClass(newClass) {
    try {
      const savedClass = await createClass(newClass);
      setClassList((currentClasses) => [...currentClasses, savedClass]);
      setClassModalOpen(false);
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  }

  function handleEditAssignment(assignment) {
    setAssignmentToEdit(assignment);
    setEditAssignmentModalOpen(true);
  }

  async function handleSaveAssignment(updatedAssignment) {
    try {
      const savedAssignment = await updateAssignment(
        updatedAssignment.id,
        updatedAssignment,
      );

      setAssignmentList((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment.id === savedAssignment.id ? savedAssignment : assignment,
        ),
      );

      setEditAssignmentModalOpen(false);
      setAssignmentToEdit(null);
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  }

  async function handleDeleteAssignment(assignmentId) {
    try {
      await deleteAssignment(assignmentId);
      setAssignmentList((currentAssignments) =>
        currentAssignments.filter(
          (assignment) => assignment.id !== assignmentId,
        ),
      );
      setEditAssignmentModalOpen(false);
      setAssignmentToEdit(null);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  }

  function handleEditClass(course) {
    setClassToEdit(course);
    setEditClassModalOpen(true);
  }

  async function handleToggleAssignment(assignmentId) {
    // Visually check the box first
    setAssignmentList((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, completed: true }
          : assignment,
      ),
    );

    // Wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 390));

    // Then delete it
    await handleDeleteAssignment(assignmentId);
  }

  async function handleSaveClass(updatedClass) {
    try {
      const savedClass = await updateClass(updatedClass.id, updatedClass);
      setClassList((currentClasses) =>
        currentClasses.map((course) =>
          course.id === savedClass.id ? savedClass : course,
        ),
      );
      setEditClassModalOpen(false);
      setClassToEdit(null);
    } catch (error) {
      console.error("Failed to update class:", error);
    }
  }

  async function handleDeleteClass(classId) {
    try {
      await deleteClass(classId);
      setClassList((currentClasses) =>
        currentClasses.filter((course) => course.id !== classId),
      );
      setAssignmentList((currentAssignments) =>
        currentAssignments.filter(
          (assignment) => assignment.classId !== classId,
        ),
      );
      setEditClassModalOpen(false);
      setClassToEdit(null);
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  }

  async function handleSaveSemester(updatedSemester) {
    try {
      const savedSemester = await updateSemester(
        updatedSemester.id ?? 1,
        updatedSemester,
      );
      setSemester(savedSemester);
      const nextWeek = getSemesterWeek(savedSemester.startDate, new Date());
      setViewingWeek(nextWeek);
    } catch (error) {
      console.error("Failed to update semester:", error);
      setSemester(updatedSemester);
      const nextWeek = getSemesterWeek(updatedSemester.startDate, new Date());
      setViewingWeek(nextWeek);
    } finally {
      setSemesterModalOpen(false);
    }
  }
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
              onEditAssignment={handleEditAssignment}
              onToggleAssignment={handleToggleAssignment}
            />
          ))}
        </nav>
        <nav className="footer">
          <section className="add-content">
            <AddContent
              type="Assignment"
              onClick={() => setAssignmentModalOpen(true)}
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
            onClose={() => setAssignmentModalOpen(false)}
            onAdd={handleAddAssignment}
          />
        )}

        {classModalOpen && (
          <AddClassModal
            onClose={() => setClassModalOpen(false)}
            onAdd={handleAddClass}
          />
        )}

        {editAssignmentModalOpen && assignmentToEdit && (
          <EditAssignmentModal
            assignment={assignmentToEdit}
            classes={classList}
            onSave={handleSaveAssignment}
            onDelete={handleDeleteAssignment}
            onClose={() => {
              setEditAssignmentModalOpen(false);
              setAssignmentToEdit(null);
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
      </main>
    </>
  );
}

export default App;

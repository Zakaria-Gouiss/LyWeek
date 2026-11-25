import { useState, useEffect } from "react";
import NotesSavedToast from "./components/footer/NotesSavedToast.jsx";
import NotesHeading from "./components/footer/NotesHeading.jsx";
import useNotesSavedToast from "./hooks/useNotesSavedToast.js";

import "./index.css";
import "./electron.css";
import Assignment from "./components/main-content/Assignment.jsx";
import Class from "./components/main-content/Class.jsx";
import LogoWelcome from "./components/header/LogoWelcome.jsx";
import AddContent from "./components/footer/AddButton.jsx";
import NoteText from "./components/footer/NoteText.jsx";
import AddAssignmentModal from "./components/footer/AddAssignmentModal.jsx";
import AddClassModal from "./components/footer/AddClassModal.jsx";
import EditAssignmentModal from "./components/main-content/EditAssignmentModal.jsx";
import EditClassModal from "./components/main-content/EditClassModal.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import RegisterPage from "./components/auth/RegisterPage.jsx";

// API imports
import {
  checkAuthentication,
  login,
  register,
  logout,
} from "./utils/api/auth.js";

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

import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
} from "./utils/api/links.js";

import { getNotes, updateNotes } from "./utils/api/notes.js";

function ElectronApp() {
  const { toastMessage, isToastFading, showNotesSavedToast } =
    useNotesSavedToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authView, setAuthView] = useState("login");
  const [user, setUser] = useState(null);

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editAssignmentModalOpen, setEditAssignmentModalOpen] = useState(false);
  const [editClassModalOpen, setEditClassModalOpen] = useState(false);

  const [assignmentClassId, setAssignmentClassId] = useState(null);
  const [editAssignmentClassId, setEditAssignmentClassId] = useState(null);
  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [classToEdit, setClassToEdit] = useState(null);

  const [assignmentList, setAssignmentList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [linkList, setLinkList] = useState([]);
  const [notes, setNotes] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null ? true : savedMode === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Check authentication
  useEffect(() => {
    async function setupAuth() {
      try {
        const authenticatedUser = await checkAuthentication();

        if (authenticatedUser) {
          setUser(authenticatedUser);
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

  // Load application data
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function fetchInitialData() {
      try {
        const [classesData, assignmentsData, linksData, notesData] =
          await Promise.all([
            getClasses(),
            getAssignments(),
            getLinks(),
            getNotes(),
          ]);

        setClassList(classesData);
        setLinkList(linksData);
        setAssignmentList(
          assignmentsData.filter((assignment) => !assignment.completed),
        );
        setNotes(notesData[0]?.content || "");
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    }

    fetchInitialData();
  }, [isAuthenticated]);

  async function handleLogin(loginData) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const authenticatedUser = await login(
        loginData.email,
        loginData.password,
      );

      setUser(authenticatedUser);
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
      const authenticatedUser = await register(registerData);

      setUser(authenticatedUser);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(error.message || "Registration failed");
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();

      setUser(null);
      setIsAuthenticated(false);
      setClassList([]);
      setAssignmentList([]);
      setLinkList([]);
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
      setAssignmentClassId(null);
    } catch (error) {
      console.error("Failed to add assignment:", error);
    }
  }

  function handleOpenAddAssignment(classId = null) {
    setAssignmentClassId(classId);
    setAssignmentModalOpen(true);
  }

  function handleCloseAddAssignment() {
    setAssignmentModalOpen(false);
    setAssignmentClassId(null);
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

  async function handleAddLink(newLink) {
    try {
      const savedLink = await createLink(newLink);
      setLinkList((currentLinks) => [...currentLinks, savedLink]);
    } catch (error) {
      console.error("Failed to add link:", error);
      throw error;
    }
  }

  async function handleUpdateLink(linkId, updatedLink) {
    try {
      const savedLink = await updateLink(linkId, updatedLink);
      setLinkList((currentLinks) =>
        currentLinks.map((link) =>
          link.id === savedLink.id ? savedLink : link,
        ),
      );
    } catch (error) {
      console.error("Failed to update link:", error);
      throw error;
    }
  }

  async function handleDeleteLink(linkId) {
    try {
      await deleteLink(linkId);
      setLinkList((currentLinks) =>
        currentLinks.filter((link) => link.id !== linkId),
      );
    } catch (error) {
      console.error("Failed to delete link:", error);
      throw error;
    }
  }

  async function handleSaveNotes() {
    try {
      const savedNotes = await updateNotes(notes);
      setNotes(savedNotes.content);
      showNotesSavedToast("Notes successfully saved!");
    } catch (error) {
      console.error("Failed to save notes:", error);
      showNotesSavedToast("Failed to save notes");
    }
  }

  function handleEditAssignments(classId, assignmentId = null) {
    setEditAssignmentClassId(classId);
    setEditAssignmentId(assignmentId);
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
      setEditAssignmentClassId(null);
      setEditAssignmentId(null);
    } catch (error) {
      console.error("Failed to update assignment:", error);
      throw error;
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
      setEditAssignmentClassId(null);
      setEditAssignmentId(null);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  }

  async function handleToggleAssignment(assignmentId) {
    const assignment = assignmentList.find(
      (currentAssignment) => currentAssignment.id === assignmentId,
    );
    if (!assignment || assignment.completed) {
      return;
    }

    const completedAssignment = { ...assignment, completed: true };
    setAssignmentList((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === assignmentId
          ? completedAssignment
          : assignment,
      ),
    );

    try {
      const savedAssignment = await updateAssignment(
        assignmentId,
        completedAssignment,
      );
      setAssignmentList((currentAssignments) =>
        currentAssignments.map((currentAssignment) =>
          currentAssignment.id === assignmentId
            ? savedAssignment
            : currentAssignment,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 390));
      setAssignmentList((currentAssignments) =>
        currentAssignments.filter(
          (currentAssignment) => currentAssignment.id !== assignmentId,
        ),
      );
    } catch (error) {
      setAssignmentList((currentAssignments) =>
        currentAssignments.map((currentAssignment) =>
          currentAssignment.id === assignmentId
            ? assignment
            : currentAssignment,
        ),
      );
      console.error("Failed to complete assignment:", error);
    }
  }

  function handleEditClass(course) {
    setClassToEdit(course);
    setEditClassModalOpen(true);
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
      setLinkList((currentLinks) =>
        currentLinks.filter((link) => link.classId !== classId),
      );

      setEditClassModalOpen(false);
      setClassToEdit(null);
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  }

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <main className={`electron-app ${darkMode ? "dark" : ""}`}>
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
    <main className={`electron-app ${darkMode ? "dark" : ""}`}>
      <nav className="electron-header">
        <div className="electron-header-content">
          <LogoWelcome
            userName={user?.name}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
          />
        </div>
      </nav>

      <nav className="electron-main-content">
        {classList.map((course) => (
          <Class
            key={course.id}
            {...course}
            assignments={assignmentList}
            links={linkList}
            onEditClass={handleEditClass}
            onEditAssignments={handleEditAssignments}
            onAddAssignment={handleOpenAddAssignment}
            onToggleAssignment={handleToggleAssignment}
            onAddLink={handleAddLink}
            onUpdateLink={handleUpdateLink}
            onDeleteLink={handleDeleteLink}
          />
        ))}
      </nav>

      <nav className="electron-footer">
        <section className="electron-add-content">
          <AddContent
            type="Assignment"
            onClick={() => handleOpenAddAssignment()}
          />

          <AddContent type="Class" onClick={() => setClassModalOpen(true)} />
        </section>

        <section className="electron-notes">
          <NotesHeading />
          <div className="electron-notes-editor">
            <NoteText
              notes={notes}
              setNotes={setNotes}
              onSave={handleSaveNotes}
            />
            <AddContent type="save" onClick={handleSaveNotes} />
          </div>
        </section>
      </nav>
      <NotesSavedToast message={toastMessage} isFading={isToastFading} />

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
    </main>
  );
}

export default ElectronApp;

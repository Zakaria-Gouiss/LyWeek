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
    async function checkAuthentication() {
      try {
        const response = await fetch("http://localhost:5000/api/me", {
          credentials: "include",
        });

        if (response.ok) {
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

    checkAuthentication();
  }, []);

  async function handleLogin(loginData) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data);
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
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setUser(data);
      setIsAuthenticated(true);
      setAuthView("login");
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

    fetch("http://localhost:5000/api/semesters", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("SEMESTER DATA:", data);

        setSemester(data);

        const currentWeek = getSemesterWeek(
          new Date(data.startDate),
          new Date(),
        );

        console.log("CURRENT WEEK:", currentWeek);

        setViewingWeek(currentWeek);
      })
      .catch((error) => {
        console.error("Failed to fetch semester:", error);
      });
    fetch("http://localhost:5000/api/classes", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setClassList(data);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
      });

    fetch("http://localhost:5000/api/assignments", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setAssignmentList(data);
      })
      .catch((error) => {
        console.error("Failed to fetch assignments:", error);
      });

    fetch("http://localhost:5000/api/notes", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes(data[0]?.content || "");
      })
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
      });
  }, [isAuthenticated]);

  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

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
      const response = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) {
        throw new Error("Failed to add assignment");
      }

      const savedAssignment = await response.json();

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
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notes");
      }

      const savedNotes = await response.json();

      setNotes(savedNotes.content);
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  }
  async function handleAddClass(newClass) {
    try {
      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newClass),
      });

      if (!response.ok) {
        throw new Error("Failed to add class");
      }

      const savedClass = await response.json();

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
      const response = await fetch(
        `http://localhost:5000/api/assignments/${updatedAssignment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedAssignment),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update assignment");
      }

      const savedAssignment = await response.json();

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
      const response = await fetch(
        `http://localhost:5000/api/assignments/${assignmentId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
      }

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
  async function handleToggleAssignment(assignmentId, completed) {
    try {
      const assignment = assignmentList.find(
        (assignment) => assignment.id === assignmentId,
      );

      const response = await fetch(
        `http://localhost:5000/api/assignments/${assignmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...assignment,
            completed,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update assignment");
      }

      const updatedAssignment = await response.json();

      setAssignmentList((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment.id === updatedAssignment.id
            ? updatedAssignment
            : assignment,
        ),
      );
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  }

  async function handleSaveClass(updatedClass) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/classes/${updatedClass.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedClass),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update class");
      }

      const savedClass = await response.json();

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
      const response = await fetch(
        `http://localhost:5000/api/classes/${classId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

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
      const response = await fetch(
        `http://localhost:5000/api/semesters/${updatedSemester.id ?? 1}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedSemester),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update semester");
      }

      const savedSemester = await response.json();
      setSemester(savedSemester);
      const nextWeek = getSemesterWeek(
        new Date(savedSemester.startDate),
        new Date(),
      );
      setViewingWeek(nextWeek);
    } catch (error) {
      console.error("Failed to update semester:", error);
      setSemester(updatedSemester);
      const nextWeek = getSemesterWeek(
        new Date(updatedSemester.startDate),
        new Date(),
      );
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

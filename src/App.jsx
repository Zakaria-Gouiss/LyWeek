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

function App() {
  const [viewingWeek, setViewingWeek] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editAssignmentModalOpen, setEditAssignmentModalOpen] = useState(false);
  const [editClassModalOpen, setEditClassModalOpen] = useState(false);
  const [semesterModalOpen, setSemesterModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [classToEdit, setClassToEdit] = useState(null);
  const [assignmentList, setAssignmentList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [notes, setNotes] = useState([]);
  const [semester, setSemester] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/semesters")
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
    fetch("http://localhost:5000/api/classes")
      .then((response) => response.json())
      .then((data) => {
        setClassList(data);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
      });

    fetch("http://localhost:5000/api/assignments")
      .then((response) => response.json())
      .then((data) => {
        setAssignmentList(data);
      })
      .catch((error) => {
        console.error("Failed to fetch assignments:", error);
      });

    fetch("http://localhost:5000/api/notes")
      .then((response) => response.json())
      .then((data) => {
        setNotes(data.content);
      })
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
      });
  }, []);

  async function handleAddAssignment(newAssignment) {
    try {
      const response = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <>
      <main className={darkMode ? "dark" : ""}>
        <nav className="header">
          <LogoWelcome
            userName="Zakaria"
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <section className="week-and-nav">
            {semester && viewingWeek !== null && (
              <WeekInfo
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

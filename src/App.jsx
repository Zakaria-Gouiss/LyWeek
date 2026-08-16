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
import { assignments, semester } from "./data/fakeData.js";
import { getSemesterWeek, getWeekInfo } from "./utils/dateUtils.js";
import AddAssignmentModal from "./components/footer/AddAssignmentModal.jsx";
import AddClassModal from "./components/footer/AddClassModal.jsx";
import EditAssignmentModal from "./components/main-content/EditAssignmentModal.jsx";
import EditClassModal from "./components/main-content/EditClassModal.jsx";

function App() {
  const currentWeek = getSemesterWeek(new Date(semester.startDate), new Date());

  const [viewingWeek, setViewingWeek] = useState(currentWeek);
  const [darkMode, setDarkMode] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editAssignmentModalOpen, setEditAssignmentModalOpen] = useState(false);
  const [editClassModalOpen, setEditClassModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [classToEdit, setClassToEdit] = useState(null);
  const [assignmentList, setAssignmentList] = useState(assignments);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/classes")
      .then((response) => response.json())
      .then((data) => {
        setClassList(data);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
      });
  }, []);

  function handleAddAssignment(newAssignment) {
    setAssignmentList((currentAssignments) => [
      ...currentAssignments,
      newAssignment,
    ]);

    setAssignmentModalOpen(false);
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

  function handleSaveAssignment(updatedAssignment) {
    setAssignmentList((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment,
      ),
    );

    setEditAssignmentModalOpen(false);
    setAssignmentToEdit(null);
  }

  function handleDeleteAssignment(assignmentId) {
    setAssignmentList((currentAssignments) =>
      currentAssignments.filter((assignment) => assignment.id !== assignmentId),
    );

    setEditAssignmentModalOpen(false);
    setAssignmentToEdit(null);
  }

  function handleEditClass(course) {
    setClassToEdit(course);
    setEditClassModalOpen(true);
  }

  function handleSaveClass(updatedClass) {
    setClassList((currentClasses) =>
      currentClasses.map((course) =>
        course.id === updatedClass.id ? updatedClass : course,
      ),
    );

    setEditClassModalOpen(false);
    setClassToEdit(null);
  }

  function handleDeleteClass(classId) {
    setClassList((currentClasses) =>
      currentClasses.filter((course) => course.id !== classId),
    );
    setAssignmentList((currentAssignments) =>
      currentAssignments.filter((assignment) => assignment.classId !== classId),
    );

    setEditClassModalOpen(false);
    setClassToEdit(null);
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
            <WeekInfo
              semesterStartDate={semester.startDate}
              semesterEndDate={semester.endDate}
              week={viewingWeek}
            />
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
          </section>
        </nav>
        <nav className="main-content">
          {classList.map((course) => (
            <Class key={course.id} {...course} assignments={assignmentList} />
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
            <NoteText />
            <AddContent type="save" />
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
      </main>
    </>
  );
}

export default App;

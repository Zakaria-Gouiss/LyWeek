import { useState } from "react";

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
import { classes, assignments, semester } from "./data/fakeData.js";
import { getSemesterWeek, getWeekInfo } from "./utils/dateUtils.js";
import AddAssignmentModal from "./components/footer/AddAssignmentModal.jsx";
import AddClassModal from "./components/footer/AddClassModal.jsx";

function App() {
  const currentWeek = getSemesterWeek(new Date(semester.startDate), new Date());

  const [viewingWeek, setViewingWeek] = useState(currentWeek);
  const [darkMode, setDarkMode] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [assignmentList, setAssignmentList] = useState(assignments);

  function handleAddAssignment(newAssignment) {
    setAssignmentList((currentAssignments) => [
      ...currentAssignments,
      newAssignment,
    ]);

    setAssignmentModalOpen(false);
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
          {classes.map((course) => (
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
            classes={classes}
            onClose={() => setAssignmentModalOpen(false)}
            onAdd={handleAddAssignment}
          />
        )}
        {classModalOpen && (
          <AddClassModal onClose={() => setClassModalOpen(false)} />
        )}
      </main>
    </>
  );
}

export default App;

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

function App() {
  const currentWeek = getSemesterWeek(new Date(semester.startDate), new Date());
  const [viewingWeek, setViewingWeek] = useState(currentWeek);
  const [darkMode, setDarkMode] = useState(false);

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
            <Class
              key={course.id}
              name={course.name}
              courseCode={course.courseCode}
              professor={course.professor}
              courseHours={course.courseHours}
              officeHours={course.officeHours}
              assignments={assignments.filter(
                (assignment) => assignment.classId === course.id,
              )}
              onenoteUrl={course.onenoteUrl}
            />
          ))}
        </nav>
        <nav className="footer">
          <section className="add-content">
            <AddContent type="Assignment" />
            <AddContent type="Class" />
          </section>
          <section className="misc-notes">
            <NoteText />
            <AddContent type="save" />
          </section>
        </nav>
      </main>
    </>
  );
}

export default App;

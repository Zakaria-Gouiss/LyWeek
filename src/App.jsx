import { useState } from 'react'

import lyLight from './assets/lyweek-light.jpg'
import lyDark from './assets/lyweek-dark.jpg'
import './index.css'
import Assignment from './components/main-content/Assignment.jsx'
import Class from './components/main-content/Class.jsx'
import LogoWelcome from './components/header/LogoWelcome.jsx'
import WeekInfo from './components/header/WeekInfo.jsx'
import WeekButton from './components/header/WeekButton.jsx'
import AddContent from './components/footer/AddButton.jsx'
import NoteText from './components/footer/NoteText.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <nav className="header">
          <section className="logo-and-welcome">
            <LogoWelcome userName="Zakaria" />
          </section>
          <section className="week-and-nav">
            <WeekInfo semesterStartDate="08-24" semesterEndDate="12-05" />
            <div className="week-nav">
              <WeekButton position="left" />
              <WeekButton position="right" />
            </div>
          </section>
        </nav>
        <nav className="main-content">
          <Class name="Class 1" courseCode="CS101" professor="Dr. Smith" courseHours="MWF, 10:00 AM - 11:00 AM" officeHours="TR, 11:00 AM - 12:00 PM" />
          <Class name="Class 2" courseCode="CS102" professor="Dr. Johnson" courseHours="TR, 2:00 PM - 3:00 PM" officeHours="F, 1:00 PM - 2:00 PM" />
          <Class name="Class 3" courseCode="CS103" professor="Dr. Williams" courseHours="MWF, 1:00 PM - 2:00 PM" officeHours="TR, 2:00 PM - 3:00 PM" />
          <Class name="Class 4" courseCode="CS104" professor="Dr. Brown" courseHours="TR, 10:00 AM - 11:00 AM" officeHours="M, 2:00 PM - 3:00 PM" />
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
  )
}

export default App

import { useState } from 'react'

import lyLight from './assets/lyweek-light.jpg'
import lyDark from './assets/lyweek-dark.jpg'
import './index.css'
import Assignment from './components/main-content/Assignment.jsx'
import Class from './components/main-content/Class.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <nav className="header">
          <section className="logo-and-welcome">
            <a href="#">
              <img className="logo" src={lyLight} alt="LyWeek logo" />
            </a>
            <h2 className="welcome">Welcome back, Zakaria</h2>
          </section>

          <section className="week-and-nav">
            <div className="week-heading">
              <span className="week-text">
                Semester Week <span className="week-number">1</span>
              </span>
              <p id="week-date">Mon Aug 1 -&gt; Sun Aug 7</p>
            </div>

            <div className="week-nav">
              <button className="prev-week">
                <i className="fa-solid fa-circle-left"></i>
                <span>Previous week</span>
              </button>
              <button className="next-week">
                <span>Next week</span>
                <i className="fa-solid fa-circle-right"></i>
              </button>
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
            <button className="add-assignment">
              <i className="fa-solid fa-plus"></i>
              <span>Add Assignment</span>
            </button>

            <button className="add-class">
              <i className="fa-solid fa-plus"></i>
              <span>Add Class</span>
            </button>
          </section>

          <section className="misc-notes">
            <textarea
              className="notes-input"
              placeholder="Write any miscellaneous notes here..."
            ></textarea>

            <button className="save-notes">
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Save</span>
            </button>
          </section>
        </nav>
      </main>
    </>
  )
}

export default App

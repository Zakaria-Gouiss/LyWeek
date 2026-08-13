import { useState } from 'react'

import lyLight from './assets/lyweek-light.jpg'
import lyDark from './assets/lyweek-dark.jpg'
import './App.css'


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
          <div className="assignment-class">
            <div className="class-header">
              <div className="class-title-row">
                <button type="button" className="class-badge">Class 1</button>
                <span className="class-toggle-box" aria-label="Expand Class 1"><i className="fa-solid fa-chevron-right"></i></span>
                <span className="class-toggle-box" aria-label="Collapse Class 1"><i className="fa-solid fa-chevron-down"></i></span>
              </div>
              <div className="class-meta">
                <span>CS 101</span>
                <span>Prof. Rivera</span>
                <span>Course hours: (MTWRF, 12-3)</span>
                <span>Office hours: (TR, 9-10)</span>
              </div>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Complete assignment 1</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Study for quiz</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Read chapter 2</span>
            </div>
          </div>

          <div className="assignment-class">
            <div className="class-header">
              <div className="class-title-row">
                <button type="button" className="class-badge">Class 2</button>
                <span className="class-toggle-box" aria-label="Expand Class 2"><i className="fa-solid fa-chevron-right"></i></span>
                <span className="class-toggle-box" aria-label="Collapse Class 2"><i className="fa-solid fa-chevron-down"></i></span>
              </div>
              <div className="class-meta">
                <span>ENG 205</span>
                <span>Prof. Nguyen</span>
                <span>Course hours: (MWF, 9-11)</span>
                <span>Office hours: (TR, 1-2)</span>
              </div>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Complete lab report</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Submit homework</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Review lecture notes</span>
            </div>
          </div>

          <div className="assignment-class">
            <div className="class-header">
              <div className="class-title-row">
                <button type="button" className="class-badge">Class 3</button>
                <span className="class-toggle-box" aria-label="Expand Class 3"><i className="fa-solid fa-chevron-right"></i></span>
                <span className="class-toggle-box" aria-label="Collapse Class 3"><i className="fa-solid fa-chevron-down"></i></span>
              </div>
              <div className="class-meta">
                <span>MTH 210</span>
                <span>Prof. Alvarez</span>
                <span>Course hours: (TR, 10-12)</span>
                <span>Office hours: (MF, 11-12)</span>
              </div>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Finish project</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Complete reading</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Prepare for exam</span>
            </div>
          </div>

          <div className="assignment-class">
            <div className="class-header">
              <div className="class-title-row">
                <button type="button" className="class-badge">Class 4</button>
                <span className="class-toggle-box" aria-label="Expand Class 4"><i className="fa-solid fa-chevron-right"></i></span>
                <span className="class-toggle-box" aria-label="Collapse Class 4"><i className="fa-solid fa-chevron-down"></i></span>
              </div>
              <div className="class-meta">
                <span>PSY 150</span>
                <span>Prof. Stewart</span>
                <span>Course hours: (MTW, 1-2)</span>
                <span>Office hours: (R, 10-11)</span>
              </div>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Complete discussion post</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Finish worksheet</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Review study guide</span>
            </div>
          </div>

          <div className="assignment-class">
            <div className="class-header">
              <div className="class-title-row">
                <button type="button" className="class-badge">Class 5</button>
                <span className="class-toggle-box" aria-label="Expand Class 5"><i className="fa-solid fa-chevron-right"></i></span>
                <span className="class-toggle-box" aria-label="Collapse Class 5"><i className="fa-solid fa-chevron-down"></i></span>
              </div>
              <div className="class-meta">
                <span>ART 110</span>
                <span>Prof. Lopez</span>
                <span>Course hours: (MWF, 2-4)</span>
                <span>Office hours: (RF, 12-1)</span>
              </div>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Complete homework</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Study vocabulary</span>
            </div>
            <div className="assignment">
               <input type="checkbox" />
              <span>Submit assignment</span>
            </div>
          </div>
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

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
            <h3>Class 1</h3>
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
            <h3>Class 2</h3>
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
            <h3>Class 3</h3>
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
            <h3>Class 4</h3>
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
            <h3>Class 5</h3>
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

import Assignment from './Assignment';

function Class({name, courseCode, professor, courseHours, officeHours}) {
    return (
       <div className="assignment-class">
            <div className="class-header">
              <div className="class-title-row">
                <button type="button" className="class-badge">{name}</button>
                <span id="class-toggle-box" aria-label="Expand Class 1"><i className="fa-solid fa-chevron-right"></i></span>
                <span id="class-toggle-box" aria-label="Collapse Class 1"><i className="fa-solid fa-chevron-down"></i></span>
              </div>
              <div className="class-meta">
                <span>{courseCode}</span>
                <span>{professor}</span>
                <span>Course hours: {courseHours}</span>
                <span>Office hours: {officeHours}</span>
              </div>
              <Assignment name="Complete assignment 1" priority={true} dueDate="Tuesday" />
              <Assignment name="Study for quiz" dueDate="Friday" priority={false} />
              <Assignment name="Read chapter 2" dueDate="Wednesday" priority={false} />
            </div>
          </div>
    );
}

export default Class;
import { getWeekInfo } from "../../utils/dateUtils";

function WeekInfo({
  semesterName,
  semesterStartDate,
  semesterEndDate,
  week,
  onEditSemester,
}) {
  const { weekNumber, weekStart, weekEnd } = getWeekInfo(
    semesterStartDate,
    week,
  );

  return (
    <div className="week-heading">
      <div className="week-title-row">
        <span className="week-text">
          {semesterName} Week <span className="week-number">{weekNumber}</span>
        </span>
        <button
          type="button"
          className="week-edit-btn"
          aria-label="Edit semester"
          onClick={onEditSemester}
        >
          <i className="fa-solid fa-pencil"></i>
        </button>
      </div>

      <p id="week-date">
        {weekStart.toDateString()} -&gt; {weekEnd.toDateString()}
      </p>
    </div>
  );
}

export default WeekInfo;

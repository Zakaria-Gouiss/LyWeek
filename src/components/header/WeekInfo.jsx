import { getWeekInfo } from "../../utils/dateUtils";

function WeekInfo({ semesterStartDate, semesterEndDate, week }) {
  const { weekNumber, weekStart, weekEnd } = getWeekInfo(
    semesterStartDate,
    week,
  );

  return (
    <div className="week-heading">
      <span className="week-text">
        Semester Week <span className="week-number">{weekNumber}</span>
      </span>

      <p id="week-date">
        {weekStart.toDateString()} -&gt; {weekEnd.toDateString()}
      </p>
    </div>
  );
}

export default WeekInfo;

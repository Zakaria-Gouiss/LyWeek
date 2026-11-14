import "./header.css";
import { getWeekInfo } from "../../utils/dateUtils";
import WeekButton from "./WeekButton.jsx";

function WeekInfo({
  semesterName,
  semesterStartDate,
  semesterEndDate,
  week,
  onPreviousWeek,
  onNextWeek,
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
      </div>

      {onPreviousWeek && onNextWeek ? (
        <div className="week-date-row">
          <WeekButton position="left" onClick={onPreviousWeek} />
          <p id="week-date">
            {weekStart.toDateString()} -&gt; {weekEnd.toDateString()}
          </p>
          <WeekButton position="right" onClick={onNextWeek} />
        </div>
      ) : (
        <p id="week-date">
          {weekStart.toDateString()} -&gt; {weekEnd.toDateString()}
        </p>
      )}
    </div>
  );
}

export default WeekInfo;

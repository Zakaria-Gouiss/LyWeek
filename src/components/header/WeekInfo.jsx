function WeekInfo({semesterStartDate, semesterEndDate}) {
    /* semesterStartDate and semesterEndDate will be used to 
    calculate the date range for the week number and days. Todo later 
    */
   const weekNumber = 1; // This will be dynamically calculated based on the current date and semester start date
  return (
     <div className="week-heading">
        <span className="week-text">
            Semester Week <span className="week-number">{weekNumber}</span>
        </span>
        <p id="week-date">Mon Aug 1 -&gt; Sun Aug 7</p> {/* This will be dynamically generated based on the week number and semester start/end dates */}
    </div>
  );
}
export default WeekInfo;
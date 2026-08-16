export function getSemesterWeek(startDate, currentDate) { 
    const difference = currentDate.getTime() - startDate.getTime(); 
    const days = Math.floor( difference / (1000 * 60 * 60 * 24) ); 
    return Math.floor(days / 7) + 1; 
}
export function getWeekInfo(semesterStartDate, weekNumber) {
    const [year, month, day] = semesterStartDate
        .split("-")
        .map(Number);

    const weekStart = new Date(year, month - 1, day);

    weekStart.setDate(
        weekStart.getDate() + (weekNumber - 1) * 7
    );

    const weekEnd = new Date(weekStart);

    weekEnd.setDate(
        weekEnd.getDate() + 6
    );

    return {
        weekNumber,
        weekStart,
        weekEnd
    };
}
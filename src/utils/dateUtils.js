function parseLocalDate(date) {
  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  return new Date(date);
}

export function getSemesterWeek(startDate, currentDate) {
  const start = parseLocalDate(startDate);
  const current = parseLocalDate(currentDate);

  // Normalize semester start to Monday
  const day = start.getDay(); // Sunday = 0, Monday = 1, etc.
  const daysToMonday = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + daysToMonday);

  const difference = current.getTime() - start.getTime();
  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24),
  );

  return Math.floor(days / 7) + 1;
}

export function getWeekInfo(semesterStartDate, weekNumber) {
  const weekStart = parseLocalDate(semesterStartDate);

  // Normalize semester start to Monday
  const day = weekStart.getDay();
  const daysToMonday = day === 0 ? -6 : 1 - day;

  weekStart.setDate(
    weekStart.getDate() + daysToMonday,
  );

  // Move to requested week
  weekStart.setDate(
    weekStart.getDate() + (weekNumber - 1) * 7,
  );

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return {
    weekNumber,
    weekStart,
    weekEnd,
  };
}
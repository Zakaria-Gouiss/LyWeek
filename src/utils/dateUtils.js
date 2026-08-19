function parseLocalDate(date) {
  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(date);
}

function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay();

  const daysToMonday = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + daysToMonday);

  return monday;
}

export function getSemesterWeek(startDate, currentDate) {
  const semesterStart = getMonday(parseLocalDate(startDate));
  const current = getMonday(parseLocalDate(currentDate));

  const difference =
    current.getTime() - semesterStart.getTime();

  const days = Math.round(
    difference / (1000 * 60 * 60 * 24),
  );

  return Math.floor(days / 7) + 1;
}

export function getWeekInfo(semesterStartDate, weekNumber) {
  const semesterStart = getMonday(
    parseLocalDate(semesterStartDate),
  );

  const weekStart = new Date(semesterStart);

  weekStart.setDate(
    weekStart.getDate() + (weekNumber - 1) * 7,
  );

  const weekEnd = new Date(weekStart);

  weekEnd.setDate(
    weekEnd.getDate() + 6,
  );

  return {
    weekNumber,
    weekStart,
    weekEnd,
  };
}
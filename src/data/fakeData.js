export const classes = [
    {
        id: 1,
        name: "Intro to Python",
        courseCode: "CS101",
        professor: "Dr. Smith",
        courseHours: "MWF, 10:00 AM - 11:00 AM",
        officeHours: "TR, 11:00 AM - 12:00 PM",
    },
    {
        id: 2,
        name: "Calculus I",
        courseCode: "MAT101",
        professor: "Dr. Johnson",
        courseHours: "TR, 2:00 PM - 3:00 PM",
        officeHours: "F, 1:00 PM - 2:00 PM",
    },
    {
        id: 3,
        name: "Geology Lab",
        courseCode: "GLG 210",
        professor: "Dr. Williams",
        courseHours: "MWF, 1:00 PM - 2:00 PM",
        officeHours: "TR, 2:00 AM - 3:00 PM",
    },
    {
        id: 4,
        name: "Theatre Practicum",
        courseCode: "ART390",
        professor: "Dr. Brown",
        courseHours: "TR, 10:00 AM - 11:00 AM",
        officeHours: "M, 2:00 PM - 3:00 PM",
    },
];

export const assignments = [
    {
        id: 1,
        classId: 1,
        name: "Complete essay 1",
        priority: true,
        dueDate: "Tuesday",
    },
    {
        id: 2,
        classId: 1,
        name: "Study for quiz",
        priority: false,
        dueDate: "Friday",
    },
    {
        id: 3,
        classId: 2,
        name: "Read chapter 3",
        priority: false,
        dueDate: "Wednesday",
    },
    {
        id: 4,
        classId: 3,
        name: "Finish worksheet",
        priority: true,
        dueDate: "Monday",
    },
    {
        id: 5,
        classId: 4,
        name: "Exam 1",
        priority: true,
        dueDate: "Thursday",
    },

];

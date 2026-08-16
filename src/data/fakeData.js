export const classes = [
    {
        id: 1,
        name: "Intro to Python",
        courseCode: "CS101",
        professor: "Dr. Smith",
        courseHours: "MWF, 10:00 AM - 11:00 AM",
        officeHours: "TR, 11:00 AM - 12:00 PM",
        onenoteUrl: "onenote:https://mymailnku-my.sharepoint.com/personal/gouissz1_mymail_nku_edu/Documents/Artificial%20Intelligence/",
    },
    {
        id: 2,
        name: "Calculus I",
        courseCode: "MAT101",
        professor: "Dr. Johnson",
        courseHours: "TR, 2:00 PM - 3:00 PM",
        officeHours: "F, 1:00 PM - 2:00 PM",
        onenoteUrl: "onenote:https://mymailnku-my.sharepoint.com/personal/gouissz1_mymail_nku_edu/Documents/Artificial%20Intelligence/",
    },
    {
        id: 3,
        name: "Geology Lab",
        courseCode: "GLG 210",
        professor: "Dr. Williams",
        courseHours: "MWF, 1:00 PM - 2:00 PM",
        officeHours: "TR, 2:00 AM - 3:00 PM",
        onenoteUrl: "onenote:https://mymailnku-my.sharepoint.com/personal/gouissz1_mymail_nku_edu/Documents/Artificial%20Intelligence/",
    },
    {
        id: 4,
        name: "Theatre Practicum",
        courseCode: "ART390",
        professor: "Dr. Brown",
        courseHours: "TR, 10:00 AM - 11:00 AM",
        officeHours: "M, 2:00 PM - 3:00 PM",
        onenoteUrl: "onenote:https://mymailnku-my.sharepoint.com/personal/gouissz1_mymail_nku_edu/Documents/Artificial%20Intelligence/",
    },
];

export const assignments = [
    {
        id: 1,
        classId: 1,
        name: "Complete essay 1",
        priority: true,
        dueDate: "Tuesday",
        completed: false,
    },
    {
        id: 2,
        classId: 1,
        name: "Study for quiz",
        priority: false,
        dueDate: "Friday",
        completed: false,
    },
    {
        id: 3,
        classId: 2,
        name: "Read chapter 3",
        priority: false,
        dueDate: "Wednesday",
        completed: false,
    },
    {
        id: 4,
        classId: 3,
        name: "Finish worksheet",
        priority: true,
        dueDate: "Monday",
        completed: true,
    },
    {
        id: 5,
        classId: 4,
        name: "Exam 1",
        priority: true,
        dueDate: "Thursday",
        completed: false,
    },

];
export const semester = {
    startDate: "2026-08-24",
    endDate: "2026-12-11"
};
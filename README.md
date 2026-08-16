# LyWeek

## This is the repository for LyWeek, a custom weekly planner and task manager designed for students

## LyWeek is planned to be used as follows:

- Main window has a top bar with an introduction and the current week you are on, with buttons to navigate previous/next week's info
- From then, the remaining window will be the main content
- It will be split into classes (intended as school courses)
  - Class collapsable metadata in the header will have course name, course code, professor, times, and course office hours
  - Classes will also be color coded which will be consistent across Google Calendar, Microsoft OneNote, and Canvas
  - Classes will also have an option for a OneNote link to open that respective notebook
- Each class has a toggle to view assignments
  - Assignments will be listed as bullet points
  - Some might have an star similar to "\*" for high priority work
  - Assignment metadata includes the name, class, yes/no buttons for priority, and a specific day it is due
- The bottom portion of the window will feature a small bar for creating classes, assignments, and inputing notes section for miscellaneous things

## LyWeek's tech stack for the coming year is planned as follows:

- The front end will be built as a web app
  - HTML and CSS will be briefly used as the skeleton of how it should look
  - But React will be the main framework used as I want to learn it
  - React is used and it will be built on top of JavaScript
  - Packaged with Vite
- The back end is also web based as follows
  - ExpressJS
  - PostgreSQL
  - API calls with CRUD design
  - Seed script for auto populating the development database

## More info is below:

- The semester takes the users current time to generate a week range and the current week number is based in respect to the semester start date
- Modals that add/modify/delete classes and assignments are automatically linked to the database to ensure consistent data

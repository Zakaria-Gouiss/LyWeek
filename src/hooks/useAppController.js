import { useEffect, useState } from "react";
import {
  checkAuthentication,
  login,
  logout,
  register,
  updateUserName,
} from "../utils/api/auth.js";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from "../utils/api/assignments.js";
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../utils/api/classes.js";
import { getNotes, updateNotes } from "../utils/api/notes.js";
import { getSemesters, updateSemester } from "../utils/api/semesters.js";
import { getSemesterWeek } from "../utils/dateUtils.js";
import useNotesSavedToast from "./useNotesSavedToast.js";

export default function useAppController() {
  const { toastMessage, showNotesSavedToast } = useNotesSavedToast();
  const [viewingWeek, setViewingWeek] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authView, setAuthView] = useState("login");
  const [user, setUser] = useState(null);

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editAssignmentModalOpen, setEditAssignmentModalOpen] = useState(false);
  const [editClassModalOpen, setEditClassModalOpen] = useState(false);
  const [assignmentClassId, setAssignmentClassId] = useState(null);
  const [editAssignmentClassId, setEditAssignmentClassId] = useState(null);
  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [classToEdit, setClassToEdit] = useState(null);
  const [assignmentList, setAssignmentList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [notes, setNotes] = useState("");
  const [semester, setSemester] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null ? true : savedMode === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    async function setupAuth() {
      try {
        const authenticatedUser = await checkAuthentication();
        if (authenticatedUser) {
          setUser(authenticatedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    setupAuth();
  }, []);

  async function handleLogin(loginData) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const authenticatedUser = await login(
        loginData.email,
        loginData.password,
      );
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      setAuthView("login");
    } catch (error) {
      setAuthError(error.message || "Login failed");
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(registerData) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const authenticatedUser = await register(registerData);
      console.log("REGISTERED USER:", authenticatedUser);
      setUser(authenticatedUser);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(error.message || "Registration failed");
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function fetchInitialData() {
      try {
        const [semesterData, classesData, assignmentsData, notesData] =
          await Promise.all([
            getSemesters(),
            getClasses(),
            getAssignments(),
            getNotes(),
          ]);

        console.log("SEMESTER DATA:", semesterData);
        setSemester(semesterData);

        const currentWeek = getSemesterWeek(semesterData.startDate, new Date());

        console.log("CURRENT WEEK:", currentWeek);
        setViewingWeek(currentWeek);
        setClassList(classesData);
        setAssignmentList(
          assignmentsData.filter((assignment) => !assignment.completed),
        );
        setNotes(notesData[0]?.content || "");
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    }

    fetchInitialData();
  }, [isAuthenticated]);

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      setSemester(null);
      setClassList([]);
      setAssignmentList([]);
      setNotes("");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }

  async function handleSaveName(name) {
    try {
      const updatedUser = await updateUserName(name);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update name:", error);
      throw error;
    }
  }

  async function handleAddAssignment(newAssignment) {
    try {
      const savedAssignment = await createAssignment(newAssignment);
      setAssignmentList((currentAssignments) => [
        ...currentAssignments,
        savedAssignment,
      ]);
      setAssignmentModalOpen(false);
      setAssignmentClassId(null);
    } catch (error) {
      console.error("Failed to add assignment:", error);
    }
  }

  function handleOpenAddAssignment(classId = null) {
    setAssignmentClassId(classId);
    setAssignmentModalOpen(true);
  }

  function handleCloseAddAssignment() {
    setAssignmentModalOpen(false);
    setAssignmentClassId(null);
  }

  async function handleSaveNotes() {
    try {
      const savedNotes = await updateNotes(notes);
      setNotes(savedNotes.content);
      showNotesSavedToast("Notes successfully saved!");
    } catch (error) {
      console.error("Failed to save notes:", error);
      showNotesSavedToast("Failed to save notes");
    }
  }

  async function handleAddClass(newClass) {
    try {
      const savedClass = await createClass(newClass);
      setClassList((currentClasses) => [...currentClasses, savedClass]);
      setClassModalOpen(false);
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  }

  function handleEditAssignments(classId, assignmentId = null) {
    setEditAssignmentClassId(classId);
    setEditAssignmentId(assignmentId);
    setEditAssignmentModalOpen(true);
  }

  async function handleSaveAssignment(updatedAssignment) {
    try {
      const savedAssignment = await updateAssignment(
        updatedAssignment.id,
        updatedAssignment,
      );

      setAssignmentList((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment.id === savedAssignment.id ? savedAssignment : assignment,
        ),
      );

      setEditAssignmentModalOpen(false);
      setEditAssignmentClassId(null);
      setEditAssignmentId(null);
    } catch (error) {
      console.error("Failed to update assignment:", error);
      throw error;
    }
  }

  async function handleDeleteAssignment(assignmentId) {
    try {
      await deleteAssignment(assignmentId);
      setAssignmentList((currentAssignments) =>
        currentAssignments.filter(
          (assignment) => assignment.id !== assignmentId,
        ),
      );
      setEditAssignmentModalOpen(false);
      setEditAssignmentClassId(null);
      setEditAssignmentId(null);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  }

  function handleEditClass(course) {
    setClassToEdit(course);
    setEditClassModalOpen(true);
  }

  async function handleToggleAssignment(assignmentId) {
    const assignment = assignmentList.find(
      (currentAssignment) => currentAssignment.id === assignmentId,
    );
    if (!assignment || assignment.completed) {
      return;
    }

    const completedAssignment = { ...assignment, completed: true };
    setAssignmentList((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === assignmentId
          ? completedAssignment
          : assignment,
      ),
    );

    try {
      const savedAssignment = await updateAssignment(
        assignmentId,
        completedAssignment,
      );
      setAssignmentList((currentAssignments) =>
        currentAssignments.map((currentAssignment) =>
          currentAssignment.id === assignmentId
            ? savedAssignment
            : currentAssignment,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 390));
      setAssignmentList((currentAssignments) =>
        currentAssignments.filter(
          (currentAssignment) => currentAssignment.id !== assignmentId,
        ),
      );
    } catch (error) {
      setAssignmentList((currentAssignments) =>
        currentAssignments.map((currentAssignment) =>
          currentAssignment.id === assignmentId
            ? assignment
            : currentAssignment,
        ),
      );
      console.error("Failed to complete assignment:", error);
    }
  }

  async function handleSaveClass(updatedClass) {
    try {
      const savedClass = await updateClass(updatedClass.id, updatedClass);
      setClassList((currentClasses) =>
        currentClasses.map((course) =>
          course.id === savedClass.id ? savedClass : course,
        ),
      );
      setEditClassModalOpen(false);
      setClassToEdit(null);
    } catch (error) {
      console.error("Failed to update class:", error);
    }
  }

  async function handleDeleteClass(classId) {
    try {
      await deleteClass(classId);
      setClassList((currentClasses) =>
        currentClasses.filter((course) => course.id !== classId),
      );
      setAssignmentList((currentAssignments) =>
        currentAssignments.filter(
          (assignment) => assignment.classId !== classId,
        ),
      );
      setEditClassModalOpen(false);
      setClassToEdit(null);
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  }

  async function handleSaveSemester(updatedSemester) {
    try {
      const savedSemester = await updateSemester(
        updatedSemester.id ?? 1,
        updatedSemester,
      );
      setSemester(savedSemester);
      const nextWeek = getSemesterWeek(savedSemester.startDate, new Date());
      setViewingWeek(nextWeek);
    } catch (error) {
      console.error("Failed to update semester:", error);
      throw error;
    }
  }

  return {
    toastMessage,
    assignmentClassId,
    assignmentList,
    assignmentModalOpen,
    authError,
    authLoading,
    authView,
    classList,
    classModalOpen,
    classToEdit,
    darkMode,
    editAssignmentClassId,
    editAssignmentId,
    editAssignmentModalOpen,
    editClassModalOpen,
    handleAddAssignment,
    handleAddClass,
    handleCloseAddAssignment,
    handleDeleteAssignment,
    handleDeleteClass,
    handleEditAssignments,
    handleEditClass,
    handleLogin,
    handleLogout,
    handleOpenAddAssignment,
    handleRegister,
    handleSaveAssignment,
    handleSaveClass,
    handleSaveNotes,
    handleSaveName,
    handleSaveSemester,
    handleToggleAssignment,
    isAuthenticated,
    notes,
    semester,
    setAuthError,
    setAuthView,
    setClassModalOpen,
    setClassToEdit,
    setDarkMode,
    setEditAssignmentClassId,
    setEditAssignmentId,
    setEditAssignmentModalOpen,
    setEditClassModalOpen,
    setNotes,
    setViewingWeek,
    showNotesSavedToast,
    user,
    viewingWeek,
  };
}

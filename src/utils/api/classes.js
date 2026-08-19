const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";

export async function getClasses() {
  const response = await fetch(`${API_URL}${API_PREFIX}/classes`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }

  return response.json();
}

export async function createClass(classData) {
  const response = await fetch(`${API_URL}${API_PREFIX}/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    throw new Error("Failed to add class");
  }

  return response.json();
}

export async function updateClass(classId, updatedClass) {
  const response = await fetch(`${API_URL}${API_PREFIX}/classes/${classId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedClass),
  });

  if (!response.ok) {
    throw new Error("Failed to update class");
  }

  return response.json();
}

export async function deleteClass(classId) {
  const response = await fetch(`${API_URL}${API_PREFIX}/classes/${classId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete class");
  }

  return response.json();
}

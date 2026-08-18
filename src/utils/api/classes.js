const API_URL = "http://localhost:5000/api";

export async function getClasses() {
  const response = await fetch(`${API_URL}/classes`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }

  return response.json();
}

export async function createClass(classData) {
  const response = await fetch(`${API_URL}/classes`, {
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
  const response = await fetch(`${API_URL}/classes/${classId}`, {
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
  const response = await fetch(`${API_URL}/classes/${classId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete class");
  }

  return response.json();
}

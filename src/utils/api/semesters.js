const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";

export async function getSemesters() {
  const response = await fetch(`${API_URL}${API_PREFIX}/semesters`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch semesters");
  }

  return response.json();
}

export async function updateSemester(semesterId, updatedSemester) {
  const response = await fetch(`${API_URL}${API_PREFIX}/semesters/${semesterId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedSemester),
  });

  if (!response.ok) {
    throw new Error("Failed to update semester");
  }

  return response.json();
}

export async function createSemester(semesterData) {
  const response = await fetch(`${API_URL}${API_PREFIX}/semesters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(semesterData),
  });

  if (!response.ok) {
    throw new Error("Failed to create semester");
  }

  return response.json();
}

export async function deleteSemester(semesterId) {
  const response = await fetch(`${API_URL}${API_PREFIX}/semesters/${semesterId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete semester");
  }

  return response.json();
}

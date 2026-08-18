const API_URL = "http://localhost:5000/api";

export async function getSemesters() {
  const response = await fetch(`${API_URL}/semesters`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch semesters");
  }

  return response.json();
}

export async function updateSemester(semesterId, updatedSemester) {
  const response = await fetch(`${API_URL}/semesters/${semesterId}`, {
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
  const response = await fetch(`${API_URL}/semesters`, {
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
  const response = await fetch(`${API_URL}/semesters/${semesterId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete semester");
  }

  return response.json();
}

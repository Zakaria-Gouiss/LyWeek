const API_URL = import.meta.env.VITE_API_URL;;

export async function getAssignments() {
  const response = await fetch(`${API_URL}/assignments`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch assignments");
  }

  return response.json();
}

export async function createAssignment(assignmentData) {
  const response = await fetch(`${API_URL}/assignments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(assignmentData),
  });

  if (!response.ok) {
    throw new Error("Failed to add assignment");
  }

  return response.json();
}

export async function updateAssignment(assignmentId, updatedAssignment) {
  const response = await fetch(`${API_URL}/assignments/${assignmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedAssignment),
  });

  if (!response.ok) {
    throw new Error("Failed to update assignment");
  }

  return response.json();
}

export async function deleteAssignment(assignmentId) {
  const response = await fetch(`${API_URL}/assignments/${assignmentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete assignment");
  }

  return response.json();
}

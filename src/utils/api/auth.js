const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";

export async function checkAuthentication() {
  try {
   const response = await fetch(`${API_URL}${API_PREFIX}/me`, {
  credentials: "include",
});

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Failed to check authentication:", error);
    return null;
  }
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}${API_PREFIX}/login`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function register(registerData) {
 const response = await fetch(`${API_URL}${API_PREFIX}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      semesterName: registerData.semesterName,
      semesterStartDate: registerData.semesterStartDate,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

export async function logout() {
  const response = await fetch(`${API_URL}${API_PREFIX}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }

  return response.json();
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API functions
export async function register(body: {
  username: string;
  email: string;
  password: string;
  role?: "student" | "instructor";
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function login(body: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function getProfile() {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function updateProfile(body: any) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

// Courses API functions
export async function fetchCourses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, value.toString());
    });
  }

  const response = await fetch(`${API_URL}/courses?${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}

export async function getCourseById(id: string) {
  const response = await fetch(`${API_URL}/courses/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }
  return response.json();
}

// Enrollment API functions
export async function enrollCourse(courseId: string) {
  const response = await fetch(`${API_URL}/enrollments/${courseId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getEnrollments() {
  const response = await fetch(`${API_URL}/enrollments`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function updateProgress(enrollmentId: string, progress: {
  progress: number;
  currentLessonIndex?: number;
  completedLessons?: string[];
}) {
  const response = await fetch(`${API_URL}/enrollments/${enrollmentId}/progress`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(progress),
  });
  return response.json();
}

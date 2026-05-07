"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCourses } from "@/lib/api";

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  instructor: {
    _id: string;
    username: string;
  };
  price: number;
  discountedPrice?: number;
  thumbnail: string;
  level: string;
  rating?: number;
  enrollments?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data.courses || []);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <main className="page-section">
        <div className="container">
          <h1 className="page-title">Courses</h1>
          <p>Loading courses...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-section">
        <div className="container">
          <h1 className="page-title">Courses</h1>
          <p style={{ color: "#dc2626" }}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-section">
      <div className="container">
        <h1 className="page-title">Courses</h1>
        <p className="page-subtitle">
          Browse available courses, filter by category, and learn more about each
          curriculum.
        </p>

        {courses.length === 0 ? (
          <div className="card">
            <p>No courses available yet. {user?.role === "instructor" && "Create your first course!"}</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {courses.map((course) => (
              <article key={course._id} className="card">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem"
                  }}
                />
                <h3 style={{ marginBottom: "0.5rem" }}>{course.title}</h3>
                {course.subtitle && (
                  <p style={{ color: "#666", marginBottom: "0.5rem" }}>{course.subtitle}</p>
                )}
                <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
                  By {course.instructor.username} • {course.category} • {course.level}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {course.discountedPrice ? (
                      <>
                        <span style={{ textDecoration: "line-through", color: "#666", marginRight: "0.5rem" }}>
                          ${course.price}
                        </span>
                        <span style={{ fontWeight: "bold", color: "#2563eb" }}>
                          ${course.discountedPrice}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontWeight: "bold" }}>${course.price}</span>
                    )}
                  </div>
                  <Link href={`/courses/${course._id}`} className="button" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                    View Course
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {user?.role === "instructor" && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/courses/create" className="button">
              Create New Course
            </Link>
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </main>
  );
}

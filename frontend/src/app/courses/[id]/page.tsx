"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getCourseById, enrollCourse } from "@/lib/api";

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  subcategory?: string;
  instructor: {
    _id: string;
    username: string;
    profile?: {
      fullName?: string;
      bio?: string;
    };
  };
  price: number;
  discountedPrice?: number;
  thumbnail: string;
  promoVideo?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  targetAudience?: string[];
  level: string;
  language: string;
  rating?: number;
  reviews?: any[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        setError("Failed to load course");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    if (!user) return;

    setEnrolling(true);
    try {
      await enrollCourse(courseId);
      // Could show success message or redirect to enrolled courses
      alert("Successfully enrolled in the course!");
    } catch (err) {
      console.error("Failed to enroll:", err);
      alert("Failed to enroll in the course. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <main className="page-section">
        <div className="container">
          <p>Loading course...</p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="page-section">
        <div className="container">
          <h1 className="page-title">Course Not Found</h1>
          <p>{error || "The requested course could not be found."}</p>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/courses">← Back to courses</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-section">
      <div className="container">
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/courses">← Back to courses</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          <div>
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "1rem",
                marginBottom: "1.5rem"
              }}
            />

            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{course.title}</h1>
            {course.subtitle && (
              <p style={{ fontSize: "1.25rem", color: "#666", marginBottom: "1rem" }}>
                {course.subtitle}
              </p>
            )}

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <span className="badge">{course.category}</span>
              <span className="badge">{course.level}</span>
              <span className="badge">{course.language}</span>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ marginBottom: "1rem" }}>About this course</h2>
              <p style={{ lineHeight: "1.7" }}>{course.description}</p>
            </div>

            {course.learningObjectives && course.learningObjectives.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ marginBottom: "1rem" }}>What you'll learn</h2>
                <ul style={{ paddingLeft: "1.5rem" }}>
                  {course.learningObjectives.map((objective, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}

            {course.prerequisites && course.prerequisites.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ marginBottom: "1rem" }}>Prerequisites</h2>
                <ul style={{ paddingLeft: "1.5rem" }}>
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            {course.targetAudience && course.targetAudience.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ marginBottom: "1rem" }}>Who this course is for</h2>
                <ul style={{ paddingLeft: "1.5rem" }}>
                  {course.targetAudience.map((audience, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>{audience}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ position: "sticky", top: "2rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {course.discountedPrice ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#666", marginRight: "0.5rem" }}>
                        ${course.price}
                      </span>
                      <span style={{ color: "#2563eb" }}>
                        ${course.discountedPrice}
                      </span>
                    </>
                  ) : (
                    <span>${course.price}</span>
                  )}
                </div>
                {course.discountedPrice && (
                  <div style={{ color: "#059669", fontWeight: "500" }}>
                    Save ${(course.price - course.discountedPrice).toFixed(2)}
                  </div>
                )}
              </div>

              {user ? (
                user._id === course.instructor._id ? (
                  <button className="button" style={{ width: "100%" }}>
                    Edit Course
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="button"
                    style={{ width: "100%" }}
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                )
              ) : (
                <Link href="/auth/login" className="button" style={{ width: "100%", textAlign: "center" }}>
                  Login to Enroll
                </Link>
              )}

              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
                <h3 style={{ marginBottom: "0.5rem" }}>Instructor</h3>
                <p style={{ fontWeight: "500" }}>
                  {course.instructor.profile?.fullName || course.instructor.username}
                </p>
                {course.instructor.profile?.bio && (
                  <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}>
                    {course.instructor.profile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
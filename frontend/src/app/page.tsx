"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.css";

export default function Home() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className="container" style={{ textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.badge}>Learning Platform</p>
          <h1>Build and learn from online courses with LearnPlat</h1>
          <p className={styles.description}>
            A modern Next.js frontend for course discovery, enrollment, reviews,
            and user profile management.
          </p>
          <div className={styles.actions}>
            {user ? (
              <>
                <Link className={styles.primary} href="/courses">
                  Explore courses
                </Link>
                <Link className={styles.secondary} href="/profile">
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="button-secondary"
                  style={{ marginLeft: "1rem" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className={styles.primary} href="/courses">
                  Explore courses
                </Link>
                <Link className={styles.secondary} href="/auth/login">
                  Login
                </Link>
              </>
            )}
          </div>
          {user && (
            <p style={{ marginTop: "1rem", color: "#475569" }}>
              Welcome back, {user.username}! ({user.role})
            </p>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <article>
          <h2>Courses</h2>
          <p>Browse the catalog, filter by category, and view course details.</p>
        </article>
        <article>
          <h2>Auth</h2>
          <p>Register, login, and manage user profile securely with JWT.</p>
        </article>
        <article>
          <h2>Enrollment</h2>
          <p>Enroll in courses and track your progress in one place.</p>
        </article>
      </section>
    </main>
  );
}

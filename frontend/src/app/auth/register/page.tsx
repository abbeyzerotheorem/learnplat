"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "instructor",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return; // Could add error state for password mismatch
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      router.push("/courses");
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-section">
      <div className="container" style={{ maxWidth: "400px" }}>
        <h1 className="page-title">Register</h1>
        <p className="page-subtitle">
          Create a new instructor or student account for LearnPlat.
        </p>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="username" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="role" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  backgroundColor: "white",
                }}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Confirm your password"
              />
            </div>

            {formData.password !== formData.confirmPassword && formData.confirmPassword && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.5rem",
                color: "#dc2626",
                fontSize: "0.875rem"
              }}>
                Passwords do not match
              </div>
            )}

            {error && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.5rem",
                color: "#dc2626",
                fontSize: "0.875rem"
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || formData.password !== formData.confirmPassword}
              className="button"
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                opacity: (isSubmitting || formData.password !== formData.confirmPassword) ? 0.7 : 1,
                cursor: (isSubmitting || formData.password !== formData.confirmPassword) ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/auth/login">Already have an account? Login</Link>
        </div>
      </div>
    </main>
  );
}

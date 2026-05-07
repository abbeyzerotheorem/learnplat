"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
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
        <h1 className="page-title">Login</h1>
        <p className="page-subtitle">
          Use your email and password to access your LearnPlat account.
        </p>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Your password"
              />
            </div>

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
              disabled={isSubmitting}
              className="button"
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/auth/register">Create an account</Link>
        </div>
      </div>
    </main>
  );
}

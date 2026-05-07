import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="page-section">
      <div className="container">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">
          Manage your user profile, view enrolled courses, and update account details.
        </p>

        <div className="card">
          <p>Profile management and protected routes will be added here.</p>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </main>
  );
}

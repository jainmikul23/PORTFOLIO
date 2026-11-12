import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404 - Page Not Found</h1>
      <p style={{ color: "#9C9A92", marginBottom: "1.5rem" }}>
        The system path you requested does not exist.
      </p>
      <Link href="/" style={{ color: "#E0A458", textDecoration: "underline" }}>
        Return to Home
      </Link>
    </main>
  );
}

"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime errors
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  return (
    <main style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#E8553D" }}>
        An unexpected error occurred
      </h2>
      <p style={{ color: "#9C9A92", marginBottom: "1.5rem" }}>
        {error.message || "Something went wrong."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: "0.75rem 1.5rem",
          background: "#E0A458",
          color: "#0A0D11",
          border: "none",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </main>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#090A0E",
          color: "#F4F5F8",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "480px", padding: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              color: "#FF633D",
              marginBottom: "1rem",
              fontWeight: 700,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#9A9EAA",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            An unexpected error occurred during page rendering. You can try to
            recover by reloading or returning home.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                background: "#FF633D",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "9999px",
                padding: "0.75rem 1.5rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <Link
              href="/"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#F4F5F8",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "9999px",
                padding: "0.75rem 1.5rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}


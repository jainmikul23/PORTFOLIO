import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Mikul Jain | Full Stack Engineer",
  description:
    "Personal portfolio of Mikul Jain - Full Stack Engineer specializing in reliable web systems, systems design, and databases.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

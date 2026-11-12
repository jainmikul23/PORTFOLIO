import type { Metadata } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mikul Jain | Product-Minded Full Stack Developer",
  description:
    "Personal portfolio of Mikul Jain - Product-Minded Full Stack Developer specializing in reliable web systems, systems design, and AI integration.",
  keywords: [
    "Mikul Jain",
    "Full Stack Developer",
    "Product Engineer",
    "AITR Indore",
    "Next.js",
    "React",
    "Three.js",
    "HealthDost",
    "Civic Issue System",
  ],
  authors: [{ name: "Mikul Jain" }],
  creator: "Mikul Jain",
  metadataBase: new URL("https://mikuljain.dev"),
  openGraph: {
    title: "Mikul Jain | Product-Minded Full Stack Developer",
    description:
      "I don't just write code. I turn ideas into experiences. Explore flagship systems, architecture case studies, and engineering philosophy.",
    url: "https://mikuljain.dev",
    siteName: "Mikul Jain Portfolio",
    images: [
      {
        url: "/mikul-jain.jpg",
        width: 1024,
        height: 1014,
        alt: "Mikul Jain - Product-Minded Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mikul Jain | Product-Minded Full Stack Developer",
    description:
      "Full Stack Developer combining product thinking, resilient system design, and modern web craft.",
    images: ["/mikul-jain.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "Pg12xxCwxKSdyMJoogu5Qs1qPjNXdlERCoBC2VJlAcw",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="Pg12xxCwxKSdyMJoogu5Qs1qPjNXdlERCoBC2VJlAcw"
        />
        {/* Preload hero LCP image for fastest paint */}
        <link
          rel="preload"
          as="image"
          href="/mikul-jain.jpg"
          type="image/jpeg"
          fetchPriority="high"
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

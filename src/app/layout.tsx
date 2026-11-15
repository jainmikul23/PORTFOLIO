import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600"],
});

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Mikul Jain | Product-Minded Full Stack Developer & Systems Architect",
    template: "%s | Mikul Jain",
  },
  description:
    "Official portfolio of Mikul Jain - Full Stack Developer and Computer Science Engineer (AITR Indore). Building distributed systems, AI workflows, Next.js applications, and 60 FPS interactive web experiences.",
  keywords: [
    "Mikul Jain",
    "Mikul Jain Portfolio",
    "Mikul Jain AITR",
    "Mikul Jain Indore",
    "Mikul Jain Developer",
    "Mikul Jain Full Stack Developer",
    "Mikul Jain Software Engineer",
    "Product-Minded Full Stack Developer",
    "Systems Architect Mikul Jain",
    "HealthDost Mikul Jain",
    "Civic Issue System Mikul Jain",
    "Banking Management System Mikul Jain",
    "Online Examination System Mikul Jain",
    "AITR Indore",
    "Acropolis Institute of Technology and Research",
    "Acropolis Institute Indore Computer Science",
    "RGPV Computer Science Engineer",
    "Next.js Developer India",
    "Three.js Developer Indore",
    "WebGL Creative Developer",
    "Full Stack Web Developer India",
    "AI Integration Specialist",
    "Gemini 2.5 Flash HealthDost",
    "Distributed Systems Architect Indore",
    "MERN Stack Developer Indore",
    "Python Django Developer Indore",
    "Top Engineering Students AITR",
    "HackDay 2nd Position Winner Google ACM",
    "Mikul Jain GitHub",
    "Mikul Jain LinkedIn",
    "Hire Full Stack Developer",
    "Best Portfolio Website 2026",
  ],
  other: {
    "llms-txt": "/llms.txt",
    "ai-summary":
      "Mikul Jain is a Product-Minded Full Stack Developer & Systems Architect from Indore (AITR). Specializing in Next.js 15, TypeScript, WebGL 2, distributed systems, and AI workflows.",
  },
  authors: [{ name: "Mikul Jain", url: "https://mikuljain.vercel.app" }],
  creator: "Mikul Jain",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mikuljain.vercel.app"),
  alternates: {
    canonical: "https://mikuljain.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Mikul Jain | Product-Minded Full Stack Developer & Systems Architect",
    description:
      "I don't just write code. I turn ideas into experiences. Explore flagship systems, architecture case studies, and engineering philosophy.",
    url: "https://mikuljain.vercel.app",
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
      data-theme="light"
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-FOUC Theme Initialization (defaults to light mode) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("portfolio-theme");var t=(s==="dark"||s==="light")?s:"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})()`,
          }}
        />

        {/* Google Search Console Verification Meta */}
        <meta
          name="google-site-verification"
          content="Pg12xxCwxKSdyMJoogu5Qs1qPjNXdlERCoBC2VJlAcw"
        />

        {/* Preload critical hero frame for instantaneous first frame paint */}
        <link
          rel="preload"
          as="image"
          href="/frames/frame_001.webp"
          type="image/webp"
          fetchPriority="high"
        />

        {/* AI Agent & LLM Ingestion Standards */}
        <link rel="help" href="/llms.txt" type="text/markdown" title="LLMs Summary" />
        <link rel="alternate" href="/llms-full.txt" type="text/markdown" title="LLMs Full Dossier" />

        {/* Search Engine & AI Knowledge Graph Schema (SSR rendered for instant crawler discovery) */}
        <JsonLd />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

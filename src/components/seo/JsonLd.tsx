import React from "react";
import { profile } from "@/content/profile";

export const JsonLd: React.FC = () => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://mikuljain.vercel.app");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.positioning,
    description: profile.supportingIntro,
    url: siteUrl,
    sameAs: [profile.links.linkedin],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: profile.education.college,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Indore",
        addressRegion: "Madhya Pradesh",
        addressCountry: "India",
      },
    },
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "MySQL",
      "Python",
      "Django",
      "Systems Design",
      "Artificial Intelligence",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} — ${profile.positioning}`,
    url: siteUrl,
    description: profile.headline,
    author: {
      "@type": "Person",
      name: profile.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};


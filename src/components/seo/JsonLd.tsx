import React from "react";
import { profile } from "@/content/profile";

export const JsonLd: React.FC = () => {
  const siteUrl = "https://mikuljain.vercel.app";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Mikul Jain",
    givenName: "Mikul",
    familyName: "Jain",
    alternateName: [
      "Mikul Jain Developer",
      "Mikul Jain AITR",
      "Mikul Jain Indore",
      "Mikul Jain Full Stack Developer",
    ],
    jobTitle: "Product-Minded Full Stack Developer & Systems Architect",
    description: profile.supportingIntro,
    url: siteUrl,
    image: `${siteUrl}/mikul-jain.jpg`,
    sameAs: [
      profile.links.linkedin,
      profile.links.github,
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Acropolis Institute of Technology and Research (AITR)",
      url: "https://aitr.ac.in",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Indore",
        addressRegion: "Madhya Pradesh",
        postalCode: "453771",
        addressCountry: "IN",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "India",
    },
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "Python",
      "Django",
      "MySQL",
      "Three.js",
      "WebGL",
      "Systems Architecture",
      "Artificial Intelligence",
      "REST APIs",
      "Computer Science",
    ],
    knowsLanguage: ["English", "Hindi"],
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: "Mikul Jain — Full Stack Developer Portfolio",
    headline: "DESIGNING THE FUTURE. BUILDING THE DIGITAL WORLD.",
    description: "Official portfolio of Mikul Jain - Product-Minded Full Stack Developer specializing in reliable web systems, systems design, and AI integration.",
    mainEntity: {
      "@id": `${siteUrl}/#person`,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Mikul Jain Portfolio",
    alternateName: ["Mikul Jain", "Mikul Jain Full Stack Developer"],
    url: siteUrl,
    inLanguage: "en-US",
    description: "Personal portfolio of Mikul Jain, Product-Minded Full Stack Developer.",
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Flagship Software Engineering Projects by Mikul Jain",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SoftwareApplication",
          name: "HealthDost: Rural AI Healthcare",
          description: "Rural health-tech single-page progressive web app integrating Gemini 2.5 Flash for multimodal medical triage and WebRTC consultation.",
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/projects/healthdost`,
          author: { "@id": `${siteUrl}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "SoftwareApplication",
          name: "Crowdsourced Civic Issue System",
          description: "Municipal grievance pipeline with a 5-stage lifecycle state machine from citizen reporting to administrative verification.",
          applicationCategory: "GovernmentApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/projects/civic-issue-system`,
          author: { "@id": `${siteUrl}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "SoftwareApplication",
          name: "Banking Management System",
          description: "Core relational banking engine with atomic ledger transfers using select_for_update row-level locks and 3D glass card visuals.",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/projects/banking-management-system`,
          author: { "@id": `${siteUrl}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "SoftwareApplication",
          name: "Online Examination System",
          description: "Academic testing platform with formal IEEE SRS documentation, auto-submit countdown timers, and synchronized answer caches.",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/projects/online-examination-system`,
          author: { "@id": `${siteUrl}/#person` },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
};

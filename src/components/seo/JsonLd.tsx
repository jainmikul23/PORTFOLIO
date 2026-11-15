import React from "react";
import { profile } from "@/content/profile";

export const JsonLd: React.FC = () => {
  const siteUrl = "https://mikuljain.vercel.app";

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
          "Mikul Jain Systems Architect",
        ],
        jobTitle: "Product-Minded Full Stack Developer & Systems Architect",
        description:
          "Full Stack Developer and Computer Science student at Acropolis Institute of Technology and Research (AITR Indore, RGPV). Specializing in Next.js 15, TypeScript, WebGL 2, distributed systems, and multimodal AI workflows.",
        url: siteUrl,
        image: `${siteUrl}/mikul-jain.jpg`,
        email: "mikuljain09@gmail.com",
        sameAs: [profile.links.linkedin, profile.links.github],
        alumniOf: {
          "@type": "EducationalOrganization",
          "@id": "https://aitr.ac.in/#organization",
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
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: "Bachelor of Technology in Computer Science & Engineering",
            credentialCategory: "degree",
            recognizedBy: {
              "@type": "EducationalOrganization",
              name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "2nd Position • HackDay Hackathon (Google ACM)",
            credentialCategory: "award",
            recognizedBy: {
              "@type": "Organization",
              name: "AITR ACM Student Chapter & ACM-W (Powered by Google)",
            },
          },
        ],
        knowsAbout: [
          "Next.js 15",
          "React 19",
          "TypeScript",
          "Node.js",
          "Python",
          "Django",
          "MySQL",
          "MongoDB",
          "PostgreSQL",
          "Three.js",
          "WebGL 2",
          "GSAP",
          "Lenis Smooth Scroll",
          "Distributed Systems Architecture",
          "Multimodal Artificial Intelligence",
          "Gemini 2.5 Flash",
          "WebRTC",
          "REST APIs",
          "Docker",
        ],
        knowsLanguage: ["English", "Hindi"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Mikul Jain Portfolio",
        alternateName: [
          "Mikul Jain",
          "Mikul Jain Full Stack Developer",
          "Mikul Jain AITR Indore",
        ],
        url: siteUrl,
        inLanguage: "en-US",
        description:
          "Official portfolio and technical case studies of Mikul Jain - Product-Minded Full Stack Developer & Systems Architect.",
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: "Mikul Jain — Full Stack Developer Portfolio",
        headline: "DESIGNING THE FUTURE. BUILDING THE DIGITAL WORLD.",
        description:
          "Official portfolio of Mikul Jain - Product-Minded Full Stack Developer specializing in reliable web systems, systems design, and AI integration.",
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#projects-list`,
        name: "Flagship Software Engineering Projects by Mikul Jain",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@type": "SoftwareApplication",
              name: "HealthDost: Rural AI Healthcare",
              description:
                "Rural health-tech progressive web app integrating Gemini 2.5 Flash for multimodal medical triage and WebRTC consultation.",
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
              description:
                "Municipal grievance pipeline with a 5-stage lifecycle state machine from citizen reporting to administrative verification.",
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
              description:
                "Core relational banking engine with atomic ledger transfers using select_for_update row-level locks and 3D glass card visuals.",
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
              description:
                "Academic testing platform with formal IEEE SRS documentation, auto-submit countdown timers, and synchronized answer caches.",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              url: `${siteUrl}/projects/online-examination-system`,
              author: { "@id": `${siteUrl}/#person` },
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
    />
  );
};

import { ProfileSchema, type Profile } from "./schema";

export const rawProfile = {
  name: "Mikul Jain",
  positioning: "Product-Minded Full Stack Developer",
  headline: "I don't just write code. I turn ideas into experiences.",
  supportingIntro:
    "I'm Mikul Jain — a Computer Science student and aspiring Full Stack Developer who enjoys exploring technology, solving problems and bringing ideas to life.",
  education: {
    college: "Acropolis Institute of Technology and Research (AITR)",
    degree: "B.Tech in Computer Science & Engineering",
    year: "Third-year engineering student",
    cgpa: "8.15",
    location: "Indore, Madhya Pradesh, India",
  },
  capabilities: [
    {
      id: "product-thinking",
      title: "01 — Product Thinking",
      subtitle: "From Ambiguity to User Value",
      description:
        "I enjoy understanding problems before opening the editor: identifying real user frictions, prioritizing high-impact features, and bridging the gap between business objectives and technical implementation.",
      items: [
        "Problem Identification & User Empathy",
        "Feature Scoping & MVP Prioritization",
        "Information Architecture & Intuitive UX",
        "Connecting Tech Feasibility to Practical Outcomes",
      ],
    },
    {
      id: "fullstack-engineering",
      title: "02 — Full Stack Engineering",
      subtitle: "Robust Systems & Seamless Interfaces",
      description:
        "Building end-to-end applications across the MERN and Python ecosystems with strong emphasis on schema normalization, API contracts, and fluid responsive frontend engineering.",
      items: [
        "React, Next.js & Modern Component Architecture",
        "Node.js, Express & REST API Design",
        "MySQL & MongoDB Relational/Document Storage",
        "ACID Transaction Guarantees & State Synchronization",
      ],
    },
    {
      id: "exploring-tech",
      title: "03 — Exploring Technology",
      subtitle: "AI Integration & Creative Development",
      description:
        "Actively experimenting with Gemini 2.5 Flash, 3D WebGL via Three.js, and modern development tooling to craft interfaces that feel alive and responsive.",
      items: [
        "Multimodal AI Integration (Gemini 2.5 Flash)",
        "3D WebGL Experiences (Three.js & R3F)",
        "Peer-to-Peer WebRTC Media Consultations",
        "Continuous Technical Experimentation",
      ],
    },
  ],
  skills: {
    frontend: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS Modules / SCSS",
      "Three.js",
    ],
    backend: ["Node.js", "Express", "Python", "Django", "REST APIs"],
    database: ["MySQL", "MongoDB", "Relational Modeling", "ACID Compliance"],
    languages: ["JavaScript", "TypeScript", "Python", "C / C++ (Academic)"],
    tools: ["Git & GitHub", "Vite", "VS Code", "Postman", "Linux", "UML Diagramming"],
    aiEmerging: ["Gemini 2.5 Flash API", "WebRTC Video Streams", "OpenStreetMap Overpass API"],
  },
  projects: [
    {
      slug: "healthdost",
      title: "HealthDost: Rural AI Healthcare",
      tagline:
        "Health-tech single-page app engineered for rural India with limited physical healthcare access.",
      problem:
        "In rural regions around Indore, physical doctor access is severely constrained by travel distance and clinic shortages. Patients lack immediate triage and emergency navigation.",
      solution:
        "Engineered a zero-backend progressive web app integrating Gemini 2.5 Flash for multimodal medical analysis, an automated 85% confidence doctor handoff rule, browser-mediated WebRTC video calling, and an emergency hospital locator.",
      myContribution:
        "Architected the complete React + TypeScript application, engineered the 85% AI-to-doctor threshold handoff logic, implemented WebRTC video consultation using localStorage signalling between patient/doctor tabs, and integrated OpenStreetMap Overpass API for SOS hospital alerts.",
      flagship: true,
      stack: ["React", "TypeScript", "Vite", "Gemini 2.5 Flash", "WebRTC", "OpenStreetMap API"],
      role: "Lead Full Stack & AI Integration Engineer",
      impact:
        "Designed for rural Central India with low network overhead and zero server dependency.",
      links: {
        github: "TODO: https://github.com/...",
        live: "TODO: https://...",
      },
      highlights: [
        "Gemini 2.5 Flash medical triage with personalized health scores and vernacular recommendations",
        "Deterministic handoff: Confidence below 85% automatically initiates AI Doctor Chat",
        "WebRTC video consultation with local tab signalling via browser storage events",
        "Overpass API geolocation finder with emergency SOS pre-notification dispatch",
      ],
    },
    {
      slug: "civic-issue-system",
      title: "Crowdsourced Civic Issue Reporting and Resolution System",
      tagline:
        "Municipal grievance pipeline with transparent tracking from citizen reporting to administrative verification.",
      problem:
        "Civic issues (potholes, sanitation, water supply) frequently go unattended due to fragmented complaint systems and zero visibility into municipal assignment or resolution proof.",
      solution:
        "Built a crowdsourced civic reporting system with a strict 5-stage lifecycle (Reported → Verified → Assigned → In Progress → Resolved), connecting citizens with administrative resolution workflows.",
      myContribution:
        "TODO: Contributed to full-stack implementation, authoring formal RGPV UML diagrams (Use Case, DFD Levels 0/1/2, ERD), and designing role-based access for citizens and authorities (Team of 5, July-Dec 2026).",
      flagship: true,
      stack: ["React", "Node.js", "Express", "MySQL", "UML Modeling"],
      role: "Full Stack Engineering Contributor (Team of 5)",
      impact:
        "Designed for municipal accountability across citizen reporting and authority resolution stages.",
      links: {
        github: "TODO: https://github.com/...",
      },
      highlights: [
        "Transparent 5-stage issue resolution state machine",
        "Formal RGPV-standard UML diagrams: Use Case, DFD 0/1/2, and ERD",
        "Role-separated portals for citizen tracking and municipal administration",
        "Timestamped verification logs ensuring accountability",
      ],
    },
    {
      slug: "online-examination-system",
      title: "Online Examination System",
      tagline:
        "Structured assessment platform with formal SRS documentation and synchronized timer engine.",
      problem:
        "Academic testing environments require deterministic timer synchronization, resilient answer caching, and structured multi-section question navigation.",
      solution:
        "Engineered formal IEEE-standard Software Requirements Specification (SRS), comprehensive UML sequence diagrams, and modular React assessment GUI components.",
      myContribution:
        "Authored system specifications, engineered client-side exam timer controls, and built question navigator interfaces with state persistence.",
      flagship: false,
      stack: ["React", "JavaScript", "SRS", "UML Design"],
      role: "System Analyst & Frontend Developer",
      links: {
        github: "TODO: https://github.com/...",
      },
      highlights: [
        "Formal IEEE-format Software Requirements Specification (SRS)",
        "React assessment GUI with auto-submit countdown timers",
        "Modular question navigator supporting multi-section engineering exams",
      ],
    },
    {
      slug: "banking-management-system",
      title: "Banking Management System",
      tagline:
        "Core relational banking engine with atomic ledger transfers and 3D glassmorphic dashboard.",
      problem:
        "Financial systems must guarantee zero balance drift and absolute data consistency under concurrent transfer requests.",
      solution:
        "Developed a Django + MySQL platform implementing strict ACID transaction row-locking (`select_for_update`), account statement generation, and loan schedules.",
      myContribution:
        "Designed the relational MySQL schema, wrote atomic transfer handlers with rollback protection, and integrated a 3D glassmorphism interface.",
      flagship: false,
      stack: ["Python", "Django", "MySQL", "Three.js", "CSS Modules"],
      role: "Backend & Database Architect",
      links: {
        github: "TODO: https://github.com/...",
      },
      highlights: [
        "Atomic database transactions preventing race conditions during ledger transfers",
        "Automated account statement generation with debit/credit balance validations",
        "Three.js 3D glass card visuals integrated into Django server-rendered views",
      ],
    },
  ],
  journey: [
    {
      period: "2023 - Present",
      title: "B.Tech in Computer Science & Engineering",
      organization: "Acropolis Institute of Technology and Research (AITR), Indore",
      category: "Academic Foundation",
      description:
        "Maintaining an 8.15 CGPA while mastering core computer science: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, and Object-Oriented Software Design.",
    },
    {
      period: "July - Dec 2026",
      title: "Civic Issue Reporting System (Minor Project)",
      organization: "AITR Academic Curriculum • Team of 5",
      category: "Collaborative Engineering",
      description:
        "Led architectural modeling and full-stack development of a municipal grievance resolution platform following rigorous RGPV UML standards.",
    },
    {
      period: "2026",
      title: "HealthDost: Rural AI Healthcare Triage",
      organization: "Independent Product Engineering",
      category: "Product Innovation",
      description:
        "Architected and shipped a client-side health application combining Gemini 2.5 Flash medical triage, WebRTC video consultation, and OpenStreetMap hospital routing.",
    },
  ],
  interests: [
    {
      name: "Cricket",
      category: "Sport & Strategy",
      reflection:
        "Strategic field placements and tactical patience under pressure mirror architectural planning in distributed systems.",
    },
    {
      name: "Football",
      category: "High-Paced Collaboration",
      reflection:
        "Fast situational awareness, teamwork, and knowing when to pass or take the shot.",
    },
    {
      name: "Hiking & Rafting",
      category: "Adventures in Nature",
      reflection:
        "Navigating mountain trails and turbulent rapids instills adaptability and calm decision-making when conditions change.",
    },
    {
      name: "Cinema & Reading",
      category: "Storytelling & Perspectives",
      reflection:
        "Analyzing director vision, world-building, and character arcs informs how I approach digital storytelling and UX.",
    },
    {
      name: "Music",
      category: "Focus & Rhythm",
      reflection:
        "The soundtrack to deep flow states during late-night debugging and system architecture design.",
    },
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/mikul-jain-29b6b231a",
    github: "TODO: https://github.com/...",
    email: "TODO: your.email@domain.com",
  },
} as const;

export const profile: Profile = ProfileSchema.parse(rawProfile);

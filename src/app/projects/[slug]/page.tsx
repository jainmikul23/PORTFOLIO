import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { profile } from "@/content/profile";
import { Glass } from "@/components/ui/Glass";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return profile.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = profile.projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Mikul Jain Case Study`,
    description: project.tagline || project.problem,
  };
}

export default async function ProjectCaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = profile.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.caseStudyMain}>
      <div className={styles.container}>
        {/* Navigation Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/#projects" className={styles.backLink}>
            &larr; Back to Systems Portfolio
          </Link>
        </div>

        {/* Hero Header */}
        <header className={styles.header}>
          <div className={styles.badges}>
            {project.flagship && (
              <Chip variant="brass" dot size="sm">
                Flagship Architecture
              </Chip>
            )}
            <Chip variant="default" size="sm">
              {project.role}
            </Chip>
          </div>

          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.tagline}>{project.tagline}</p>

          <div className={styles.metaStrip}>
            <div>
              <span className="label-caps">Engineering Focus</span>
              <p className={styles.metaValue}>{project.role}</p>
            </div>
            <div>
              <span className="label-caps">Core Tech Stack</span>
              <div className={styles.stackChips}>
                {project.stack.map((t) => (
                  <Chip key={t} size="sm" variant="default">
                    {t}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Real World Impact Banner */}
        {project.impact && (
          <Glass variant="panel" className={styles.impactCard} glow="brass">
            <span className="label-caps" style={{ color: "var(--brass)" }}>
              Operational Domain &amp; Impact
            </span>
            <p className={styles.impactBody}>{project.impact}</p>
          </Glass>
        )}

        {/* HealthDost Specific Architecture Breakdown */}
        {slug === "healthdost" && (
          <div className={styles.deepDiveSection}>
            <Glass variant="sheet" className={styles.deepDiveCard}>
              <h2 className={styles.sectionHeading}>System Context &amp; Why Rural India</h2>
              <p className={styles.prose}>
                In rural and tier-3 regions around Indore (Central India), physical access to
                specialized physicians is severely constrained by distance, transportation overhead,
                and local clinic shortages. HealthDost was engineered as a single-page progressive
                application offering fast triage, diagnostic pre-assessments, and instant remote
                consultation with minimal network payloads.
              </p>

              <h3 className={styles.subHeading}>The 85% Diagnostic Confidence Rule</h3>
              <p className={styles.prose}>
                HealthDost integrates <strong>Gemini 2.5 Flash</strong> to analyze patient symptoms
                and health metrics. However, in medical contexts, automated AI evaluations carry
                legal and ethical bounds:
              </p>
              <div className={styles.calloutBox}>
                <strong>Deterministic Handoff Protocol:</strong> If Gemini 2.5 Flash evaluates
                symptom triage confidence below <strong>85%</strong>, the system prohibits automated
                conclusions and automatically initiates an urgent <strong>AI Doctor Chat</strong>{" "}
                session, routing clinical context and symptom vitals directly into the physician
                workflow.
              </div>

              <h3 className={styles.subHeading}>WebRTC Video Signalling via localStorage</h3>
              <p className={styles.prose}>
                To enable video consultation without requiring a dedicated WebSocket server or
                third-party paid signalling servers, HealthDost utilizes browser{" "}
                <code>localStorage</code> event listeners (<code>storage</code> events) as the
                signalling channel to exchange SDP offers, answers, and ICE candidates between open
                patient and doctor browser tabs.
              </p>
              <div className={styles.honestLimitBox}>
                <strong>Engineering Honesty &amp; Architecture Boundary:</strong> This
                implementation functions purely within the same client browser instance across tabs
                for local demonstrations and testing. In a scaled multi-tenant environment, a
                distributed signalling server (e.g. WebSocket / Redis pub-sub) is required.
              </div>

              <h3 className={styles.subHeading}>Patient to Doctor Clinical Workflow</h3>
              <div className={styles.workflowDiagram}>
                <div className={styles.workflowStep}>
                  <span className={styles.stepNum}>01</span>
                  <span className={styles.stepTitle}>Patient Portal</span>
                  <span className={styles.stepDesc}>Symptom input &amp; vitals</span>
                </div>
                <span className={styles.arrow}>&rarr;</span>
                <div className={styles.workflowStep}>
                  <span className={styles.stepNum}>02</span>
                  <span className={styles.stepTitle}>Gemini 2.5 Flash</span>
                  <span className={styles.stepDesc}>Triage &amp; confidence score</span>
                </div>
                <span className={styles.arrow}>&rarr;</span>
                <div className={styles.workflowStep}>
                  <span className={styles.stepNum}>03</span>
                  <span className={styles.stepTitle}>Doctor Review</span>
                  <span className={styles.stepDesc}>Live WebRTC video &amp; notes</span>
                </div>
                <span className={styles.arrow}>&rarr;</span>
                <div className={styles.workflowStep}>
                  <span className={styles.stepNum}>04</span>
                  <span className={styles.stepTitle}>Clinical Report</span>
                  <span className={styles.stepDesc}>Post-call AI summary &amp; SOS</span>
                </div>
              </div>
            </Glass>
          </div>
        )}

        {/* Civic Issue System Specific Breakdown */}
        {slug === "civic-issue-system" && (
          <div className={styles.deepDiveSection}>
            <Glass variant="sheet" className={styles.deepDiveCard}>
              <h2 className={styles.sectionHeading}>Problem Statement &amp; Governance Gap</h2>
              <p className={styles.prose}>
                Municipal issues (potholes, water leaks, waste accumulation) often go unresolved due
                to fragmented grievance tracking, lack of public verification, and zero audit
                accountability. This collaborative system establishes a crowdsourced reporting and
                verification loop.
              </p>

              <h3 className={styles.subHeading}>Issue Lifecycle State Machine</h3>
              <div className={styles.lifecycleRow}>
                <span className={styles.stateChip}>1. Reported</span> &rarr;
                <span className={styles.stateChip}>2. Verified</span> &rarr;
                <span className={styles.stateChip}>3. Assigned</span> &rarr;
                <span className={styles.stateChip}>4. In Progress</span> &rarr;
                <span className={`${styles.stateChip} ${styles.resolvedState}`}>
                  5. Resolved (Sage Proof)
                </span>
              </div>

              <h3 className={styles.subHeading}>Formal RGPV Design Artifacts</h3>
              <p className={styles.prose}>
                The system was architected according to strict academic RGPV standards:
              </p>
              <ul className={styles.diagramList}>
                <li>
                  <strong>Use Case Model:</strong> Citizen reporting, authority dispatching,
                  verification auditing.
                </li>
                <li>
                  <strong>Data Flow Diagrams (DFD):</strong> Level 0 context diagram, Level 1
                  functional decomposition, Level 2 transaction tracking.
                </li>
                <li>
                  <strong>Entity-Relationship Diagram (ERD):</strong> Normalized schema linking
                  citizens, geo-tagged complaints, municipal wards, and resolution proof media.
                </li>
              </ul>

              <div className={styles.calloutBox}>
                <strong>Team Collaboration:</strong> Minor project built within an engineering team
                of 5 (July &ndash; December 2026). My specific shipped modules and deliverables are
                marked as <code>TODO</code> placeholders in <code>profile.ts</code>.
              </div>
            </Glass>
          </div>
        )}

        {/* Key Highlights */}
        <div className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Key Architectural Specifications</h2>
          <div className={styles.highlightsGrid}>
            {project.highlights.map((highlight, idx) => (
              <Glass key={idx} variant="panel" className={styles.highlightCard}>
                <span className={styles.checkIcon}>✓</span>
                <p className={styles.highlightText}>{highlight}</p>
              </Glass>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footerActions}>
          <Button href="/#projects" variant="primary" size="lg">
            &larr; Back to All Systems
          </Button>
          <Button href="/#contact" variant="ghost" size="lg">
            Discuss this Architecture
          </Button>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import styles from "./Playground.module.css";
import { Glass } from "@/components/ui/Glass";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface SystemNode {
  id: string;
  name: string;
  layer: string;
  latency: string;
  tech: string[];
  description: string;
  engineeringNotes: string;
}

const systemNodes: SystemNode[] = [
  {
    id: "browser",
    name: "Client Browser",
    layer: "Presentation Layer",
    latency: "0ms (Origin)",
    tech: ["React 19", "Next.js App Router", "CSS Modules", "WebGL"],
    description:
      "Executes client bundle, hydrates interactive DOM, and manages local state with zero layout shift.",
    engineeringNotes:
      "Employs modern fetch prioritization, streaming SSR, and graceful degradation for devices lacking WebGL.",
  },
  {
    id: "cdn",
    name: "Edge CDN & Shield",
    layer: "Global Edge Network",
    latency: "15ms",
    tech: ["Edge Functions", "HTTP/3", "DDoS Mitigation"],
    description:
      "Terminates TLS connections close to the user, caches immutable static assets and prerendered HTML routes.",
    engineeringNotes:
      "Configured with strict Content Security Policy, HSTS, and cache-control headers (`s-maxage=31536000`).",
  },
  {
    id: "api",
    name: "Application Server",
    layer: "Business Logic",
    latency: "42ms",
    tech: ["Python / Django", "Node.js / Express", "Zod Validation"],
    description:
      "Validates incoming request payloads, enforces business invariants, and coordinates transactional workflows.",
    engineeringNotes:
      "Stateless architecture allowing horizontal scalability, rate-limited via client IP sliding window.",
  },
  {
    id: "cache",
    name: "In-Memory Cache",
    layer: "Transient Store",
    latency: "3ms",
    tech: ["Redis / Upstash", "LRU Eviction"],
    description:
      "Accelerates read-heavy queries, manages rate-limiting token buckets, and caches active session claims.",
    engineeringNotes:
      "Sub-millisecond read access with graceful degradation to database fallback if cache instances cycle.",
  },
  {
    id: "db",
    name: "Relational Database",
    layer: "Source of Truth",
    latency: "28ms",
    tech: ["MySQL", "InnoDB", "ACID Transactions"],
    description:
      "Enforces strict relational integrity, composite index lookups, foreign keys, and atomic ledger transfers.",
    engineeringNotes:
      "Leverages `SELECT ... FOR UPDATE` row locks to prevent race conditions during atomic financial balances.",
  },
];

export const Playground: React.FC = () => {
  const [activeNode, setActiveNode] = useState<SystemNode>(systemNodes[0]!);
  const [simulating, setSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [totalTime, setTotalTime] = useState<number | null>(null);

  const simulateRequest = () => {
    if (simulating) return;
    setSimulating(true);
    setActiveStep(0);
    setTotalTime(null);

    const stepTimings = [0, 400, 900, 1400, 2000];

    stepTimings.forEach((timing, index) => {
      setTimeout(() => {
        setActiveStep(index);
        setActiveNode(systemNodes[index]!);

        if (index === stepTimings.length - 1) {
          setTimeout(() => {
            setSimulating(false);
            setActiveStep(-1);
            setTotalTime(88); // 88ms total roundtrip
          }, 600);
        }
      }, timing);
    });
  };

  return (
    <section id="playground" className={styles.section} aria-label="Architecture Playground">
      <div className={styles.container}>
        <SectionHeading
          label="05 / Interactive Architecture"
          title="Full stack request"
          accentWord="lifecycle simulation."
          subtitle="Explore the structural topologies and latency characteristics of modern production web applications."
        />

        {/* Action Bar */}
        <div className={styles.controlBar}>
          <Button onClick={simulateRequest} disabled={simulating} variant="primary" size="md">
            {simulating ? "Transmitting Packet..." : "Simulate Live HTTP Request"}
          </Button>

          {totalTime && (
            <div className={styles.timingBadge}>
              <span className="label-caps">Total Roundtrip:</span>
              <span className={styles.timingNumber}>{totalTime}ms</span>
              <Chip variant="sage" size="sm">
                Optimal Latency
              </Chip>
            </div>
          )}
        </div>

        {/* Diagram Flow Nodes */}
        <div className={styles.diagramContainer}>
          <div className={styles.nodesRow}>
            {systemNodes.map((node, idx) => {
              const isSelected = activeNode.id === node.id;
              const isPacketHere = activeStep === idx;

              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setActiveNode(node)}
                    className={`${styles.nodeBox} ${isSelected ? styles.nodeSelected : ""} ${isPacketHere ? styles.nodeActivePacket : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${node.name}`}
                  >
                    <span className={styles.nodeLayer}>{node.layer}</span>
                    <h4 className={styles.nodeName}>{node.name}</h4>
                    <span className={styles.nodeLatency}>{node.latency}</span>

                    {isPacketHere && <span className={styles.packetPing} />}
                  </div>

                  {idx < systemNodes.length - 1 && (
                    <div className={styles.connector}>
                      <span
                        className={`${styles.connectorLine} ${activeStep > idx ? styles.lineLit : ""}`}
                      />
                      <span className={styles.connectorArrow}>&rarr;</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active Node Detail Sheet */}
        <Glass variant="sheet" className={styles.detailSheet}>
          <div className={styles.sheetHeader}>
            <div>
              <span className="label-caps">{activeNode.layer}</span>
              <h3 className={styles.sheetTitle}>{activeNode.name}</h3>
            </div>
            <Chip variant="brass" size="sm">
              {activeNode.latency}
            </Chip>
          </div>

          <p className={styles.sheetDesc}>{activeNode.description}</p>

          <div className={styles.techStrip}>
            <span className="label-caps">Technologies Employed:</span>
            <div className={styles.techChips}>
              {activeNode.tech.map((t) => (
                <Chip key={t} size="sm" variant="default">
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          <div className={styles.notesBox}>
            <strong className={styles.notesHeading}>Engineering Rigor &amp; Trade-offs:</strong>
            <p className={styles.notesText}>{activeNode.engineeringNotes}</p>
          </div>
        </Glass>
      </div>
    </section>
  );
};

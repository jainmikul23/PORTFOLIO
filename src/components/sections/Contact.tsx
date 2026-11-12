"use client";

import React, { useState } from "react";
import styles from "./Contact.module.css";
import { profile } from "@/content/profile";
import { Send, Copy, Check, Mail, ShieldCheck } from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot trap check
    if (formData.company) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to dispatch transmission.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", company: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Submission failed. Please reach out directly on LinkedIn.",
      );
    }
  };

  return (
    <section id="contact" className={styles.contactSection} aria-label="Contact Mikul Jain">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className="label-caps">Chapter 08 &bull; Contact</span>
          <h2 className={styles.sectionTitle}>
            Still learning. Still building.{" "}
            <span className={styles.accentText}>Always exploring what&apos;s possible.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Whether you have an opening for a Product-Minded Full Stack Developer, want to discuss the architecture behind HealthDost, or collaborate on systems design — my inbox is open.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Direct Channels Column */}
          <div className={styles.channelsCol}>
            <div className={styles.channelsCard}>
              <h3 className={styles.channelsHeading}>Direct Channels</h3>
              <p className={styles.channelsDesc}>
                Open to full-stack engineering roles, software engineering internships, and product development discussions.
              </p>

              <div className={styles.channelButtons}>
                <button onClick={copyEmail} className={styles.copyBtn}>
                  <Mail size={18} className={styles.channelIcon} />
                  <div className={styles.btnTextWrapper}>
                    <span className={styles.btnLabel}>Email Transmission</span>
                    <span className={styles.btnValue}>{profile.links.email}</span>
                  </div>
                  {copied ? <Check size={18} className={styles.copyCheck} /> : <Copy size={16} />}
                </button>

                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelLink}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.channelIcon}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <div className={styles.btnTextWrapper}>
                    <span className={styles.btnLabel}>Professional Network</span>
                    <span className={styles.btnValue}>linkedin.com/in/mikul-jain-29b6b231a</span>
                  </div>
                  <span className={styles.linkArrow}>&rarr;</span>
                </a>

                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelLink}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.channelIcon}>
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <div className={styles.btnTextWrapper}>
                    <span className={styles.btnLabel}>Code Repositories</span>
                    <span className={styles.btnValue}>github.com/jainmikul23</span>
                  </div>
                  <span className={styles.linkArrow}>&rarr;</span>
                </a>
              </div>

              <div className={styles.privacyNotice}>
                <ShieldCheck size={16} className={styles.shieldIcon} />
                <span>Strict privacy guaranteed &bull; 24-hour turnaround SLA</span>
              </div>
            </div>
          </div>

          {/* Direct Message Form Column */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              {status === "success" ? (
                <div className={styles.successState}>
                  <div className={styles.successCircle}>✓</div>
                  <h4 className={styles.successTitle}>Transmission Received</h4>
                  <p className={styles.successMessage}>
                    Thank you for reaching out. Your transmission payload has been validated and queued. I will respond to your email promptly.
                  </p>
                  <button onClick={() => setStatus("idle")} className={styles.resetBtn}>
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Honeypot anti-spam trap */}
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.inputLabel}>
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className={styles.inputField}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.inputLabel}>
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      className={styles.inputField}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="message" className={styles.inputLabel}>
                      Your Message or Project Brief
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Discussing a full stack role, project collaboration, or architecture breakdown..."
                      className={styles.textareaField}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {status === "error" && (
                    <div className={styles.errorBanner} role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className={styles.submitBtn}
                  >
                    <span>{status === "sending" ? "Encrypting & Transmitting..." : "Send Transmission"}</span>
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

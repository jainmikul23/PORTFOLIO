"use client";

import React, { useState } from "react";
import styles from "./Contact.module.css";
import { profile } from "@/content/profile";
import { Send, Copy, Check, Mail, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";
import { haptic } from "@/lib/haptics";

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
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"resend" | "client_compose">("client_compose");

  const copyEmail = () => {
    haptic.success();
    navigator.clipboard.writeText(profile.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyDraft = () => {
    haptic.success();
    navigator.clipboard.writeText(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const getGmailComposeUrl = () => {
    const subject = formData.name ? `[Portfolio Inquiry] From ${formData.name}` : "Portfolio Inquiry";
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      profile.links.email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getMailtoUrl = () => {
    const subject = formData.name ? `[Portfolio Inquiry] From ${formData.name}` : "Portfolio Inquiry";
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    return `mailto:${profile.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot anti-spam check
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to process message.");
      }

      if (data.method === "resend") {
        setDeliveryMethod("resend");
      } else {
        setDeliveryMethod("client_compose");
        // Trigger mail client draft directly
        const mailto = getMailtoUrl();
        window.location.href = mailto;
      }

      setStatus("success");
      haptic.success();
    } catch (err: unknown) {
      haptic.error();
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to dispatch. Please email directly at mikuljain09@gmail.com."
      );
    }
  };

  return (
    <section id="contact" className={styles.contactSection} aria-label="Contact Mikul Jain">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className="label-caps">Chapter 06 &bull; Direct Contact</span>
          <h2 className={styles.sectionTitle}>
            Let&apos;s build something{" "}
            <span className={styles.accentText}>exceptional together.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Whether you have an opening for a Full Stack Developer, want to discuss systems architecture, or collaborate on high-impact products — my inbox is open.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Direct Channels Column */}
          <div className={styles.channelsCol}>
            <div className={styles.channelsCard}>
              <h3 className={styles.channelsHeading}>Direct Channels</h3>
              <p className={styles.channelsDesc}>
                Open to full-stack engineering roles, software engineering internships, and product architecture discussions.
              </p>

              <div className={styles.channelButtons}>
                {/* 1-Click Copy Email */}
                <button onClick={copyEmail} className={styles.copyBtn} type="button">
                  <Mail size={18} className={styles.channelIcon} />
                  <div className={styles.btnTextWrapper}>
                    <span className={styles.btnLabel}>Copy Direct Email</span>
                    <span className={styles.btnValue}>{profile.links.email}</span>
                  </div>
                  {copied ? <Check size={18} className={styles.copyCheck} /> : <Copy size={16} />}
                </button>

                {/* 1-Click Open in Gmail Web */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.links.email)}&su=${encodeURIComponent("Portfolio Inquiry")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.channelLink}
                >
                  <ExternalLink size={18} className={styles.channelIcon} />
                  <div className={styles.btnTextWrapper}>
                    <span className={styles.btnLabel}>Compose in Gmail</span>
                    <span className={styles.btnValue}>Open web draft to {profile.links.email}</span>
                  </div>
                  <span className={styles.linkArrow}>&rarr;</span>
                </a>

                {/* LinkedIn Profile */}
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
                    <span className={styles.btnLabel}>LinkedIn Profile</span>
                    <span className={styles.btnValue}>linkedin.com/in/mikul-jain-29b6b231a</span>
                  </div>
                  <span className={styles.linkArrow}>&rarr;</span>
                </a>

                {/* GitHub Repositories */}
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
                <span>Verified response within 24 hours &bull; Strict privacy</span>
              </div>
            </div>
          </div>

          {/* Direct Message Form Column */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              {status === "success" ? (
                <div className={styles.successState}>
                  <div className={styles.successCircle}>✓</div>
                  <h4 className={styles.successTitle}>
                    {deliveryMethod === "resend" ? "Message Delivered!" : "Email Draft Ready"}
                  </h4>
                  <p className={styles.successMessage}>
                    {deliveryMethod === "resend"
                      ? `Thank you for reaching out! Your message was delivered directly to Mikul's inbox (${profile.links.email}). You will receive a response within 24 hours.`
                      : `Your message to ${profile.links.email} is prepared. Click below to review and send in your preferred email client:`}
                  </p>

                  <div className={styles.successActions}>
                    <a
                      href={getGmailComposeUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionBtnPrimary}
                    >
                      <ExternalLink size={16} />
                      <span>Open in Gmail Web</span>
                    </a>

                    <a href={getMailtoUrl()} className={styles.actionBtnSecondary}>
                      <Mail size={16} />
                      <span>Open Default Mail App</span>
                    </a>

                    <button onClick={copyDraft} type="button" className={styles.actionBtnSecondary}>
                      {copiedMsg ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedMsg ? "Copied!" : "Copy Message"}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setStatus("idle");
                      setFormData({ name: "", email: "", message: "", company: "" });
                    }}
                    className={styles.resetBtn}
                    type="button"
                  >
                    <RefreshCw size={13} style={{ marginRight: "0.35rem", display: "inline-block", verticalAlign: "middle" }} />
                    Send Another Message
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
                      placeholder="Alex Turner"
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
                      placeholder="alex@company.com"
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
                      placeholder="Discussing an engineering opportunity, systems architecture, or project collaboration..."
                      className={styles.textareaField}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {status === "error" && (
                    <div className={styles.errorBanner} role="alert">
                      {errorMessage}
                      <div style={{ marginTop: "0.5rem" }}>
                        <a
                          href={getGmailComposeUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#ff633d", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                        >
                          Open in Gmail directly <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className={styles.submitBtn}
                  >
                    <span>{status === "sending" ? "Preparing Message..." : "Send Message"}</span>
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

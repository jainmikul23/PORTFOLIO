import { describe, it, expect } from "vitest";
import { profile } from "@/content/profile";
import { ProfileSchema } from "@/content/schema";

describe("Profile & Content Integrity", () => {
  it("validates strictly against the Zod ProfileSchema", () => {
    const parsed = ProfileSchema.safeParse(profile);
    expect(parsed.success).toBe(true);
  });

  it("contains verified authentic student data for Mikul Jain", () => {
    expect(profile.name).toBe("Mikul Jain");
    expect(profile.education.college).toContain("Acropolis Institute of Technology and Research");
    expect(profile.education.cgpa).toBe("8.22");
    expect(profile.education.year).toContain("Third-year");
  });

  it("contains flagship projects with structured highlights", () => {
    const healthDost = profile.projects.find((p) => p.slug === "healthdost");
    expect(healthDost).toBeDefined();
    expect(healthDost?.flagship).toBe(true);
    expect(healthDost?.stack).toContain("Gemini 2.5 Flash");
    expect(healthDost?.stack).toContain("WebRTC");

    const civic = profile.projects.find((p) => p.slug === "civic-issue-system");
    expect(civic).toBeDefined();
    expect(civic?.flagship).toBe(true);
  });

  it("includes authentic HackDay 2nd position achievement with photo asset", () => {
    const hackDay = profile.journey.find((j) => j.title.includes("HackDay"));
    expect(hackDay).toBeDefined();
    expect(hackDay?.title).toContain("2nd Position");
    expect(hackDay?.organization).toContain("AITR ACM Student Chapter");
    expect(hackDay?.image).toBe("/images/mikul-hackathon-award.jpg");
  });

  it("includes authentic CodeSpire 3.0 Top 10 Teams milestone with photo and LinkedIn link", () => {
    const codespire = profile.journey.find((j) => j.title.includes("CodeSpire"));
    expect(codespire).toBeDefined();
    expect(codespire?.title).toContain("Top 10");
    expect(codespire?.organization).toContain("Google Developer Groups");
    expect(codespire?.image).toBe("/images/codespire-top10.jpg");
    expect(codespire?.link).toContain("linkedin.com");
  });

  it("includes authentic Kriyeta 36+hr Hackathon Finalist milestone with photo and LinkedIn link", () => {
    const kriyeta = profile.journey.find((j) => j.title.includes("Kriyeta"));
    expect(kriyeta).toBeDefined();
    expect(kriyeta?.title).toContain("Finalist");
    expect(kriyeta?.organization).toContain("Kriyeta");
    expect(kriyeta?.image).toBe("/images/kriyeta-finalist.jpg");
    expect(kriyeta?.link).toContain("linkedin.com");
  });

  it("includes authentic disciplines outside the code editor", () => {
    const names = profile.interests.map((i) => i.name);
    expect(names).toContain("Cricket");
    expect(names).toContain("Football");
    expect(names).toContain("Hiking & Rafting");
    expect(names).toContain("Cinema & Reading");
    expect(names).toContain("Music");
  });
});


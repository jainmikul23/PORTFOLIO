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
    expect(profile.education.cgpa).toBe("8.15");
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

  it("includes authentic hackathon achievement with photo asset", () => {
    const hackathon = profile.journey.find((j) => j.category === "Hackathon Recognition");
    expect(hackathon).toBeDefined();
    expect(hackathon?.organization).toContain("AITR ACM Student Chapter");
    expect(hackathon?.image).toBe("/images/mikul-hackathon-award.jpg");
  });

  it("includes beyond-the-screen interests with photos", () => {
    const travel = profile.interests.find((i) => i.name === "Travel & Reflection");
    expect(travel).toBeDefined();
    expect(travel?.image).toBe("/images/mikul-pool.jpg");

    const cafe = profile.interests.find((i) => i.name === "Cafes & Creative Conversations");
    expect(cafe).toBeDefined();
    expect(cafe?.image).toBe("/images/mikul-cafe.jpg");
  });
});


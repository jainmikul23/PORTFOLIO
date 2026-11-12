import { z } from "zod";

export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  problem: z.string(),
  solution: z.string(),
  myContribution: z.string(),
  flagship: z.boolean().default(false),
  stack: z.array(z.string()),
  role: z.string(),
  impact: z.string().optional(),
  links: z.object({
    github: z.string().optional(),
    live: z.string().optional(),
  }),
  highlights: z.array(z.string()),
});

export const ProfileSchema = z.object({
  name: z.string(),
  positioning: z.string(),
  headline: z.string(),
  supportingIntro: z.string(),
  education: z.object({
    college: z.string(),
    degree: z.string(),
    year: z.string(),
    cgpa: z.string(),
    location: z.string(),
  }),
  capabilities: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      items: z.array(z.string()),
    }),
  ),
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    languages: z.array(z.string()),
    tools: z.array(z.string()),
    aiEmerging: z.array(z.string()),
  }),
  projects: z.array(ProjectSchema),
  journey: z.array(
    z.object({
      period: z.string(),
      title: z.string(),
      organization: z.string(),
      category: z.string(),
      description: z.string(),
      image: z.string().optional(),
      badge: z.string().optional(),
      link: z.string().optional(),
    }),
  ),
  interests: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      reflection: z.string(),
      image: z.string().optional(),
    }),
  ),
  links: z.object({
    linkedin: z.string().url(),
    github: z.string(),
    email: z.string(),
  }),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;

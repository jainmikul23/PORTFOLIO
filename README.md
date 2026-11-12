# Mikul Jain - Full Stack Engineer Portfolio

Personal portfolio engineered with **Next.js 15 (App Router)**, **TypeScript (strict)**, **Three.js / React Three Fiber**, **GSAP**, and **Apple-grade Glassmorphism**.

Designed to showcase engineering craft, systems thinking, and interactive 3D architecture without generic UI kits or AI clichés.

---

## Quick Start (Run Locally in Under 2 Minutes)

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### 1. Clone & Install
```bash
git clone <repository-url> portfolio-mikul
cd portfolio-mikul
pnpm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your optional Resend API key for the contact form:
```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your_email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live portfolio.

---

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `pnpm dev` | Starts Turbopack development server at `localhost:3000` |
| `build` | `pnpm build` | Production Next.js build with static generation and typechecking |
| `start` | `pnpm start` | Runs the production-optimized Next.js server |
| `lint` | `pnpm lint` | Runs ESLint 9 with strict rules |
| `typecheck` | `pnpm typecheck` | Validates TypeScript with zero implicit any and unchecked index access |
| `format` | `pnpm format` | Formats codebase with Prettier |
| `test` | `pnpm test` | Runs unit tests using Vitest |
| `test:e2e` | `pnpm test:e2e` | Runs Playwright end-to-end and a11y tests |

---

## How to Edit Personal Content

All profile information is centralized in a single source of truth:
👉 [`src/content/profile.ts`](file:///Users/mikuljain09/Desktop/portfolio-mikul/src/content/profile.ts)

1. Open `src/content/profile.ts`.
2. Update the fields marked with `TODO` comments (e.g. email, GitHub link, graduation year).
3. The content is validated by Zod at build time, preventing runtime errors.

---

## How to Add a Project

1. Add your project entry to the `projects` array in `src/content/profile.ts`:
   ```ts
   {
     slug: "my-new-system",
     title: "System Title",
     summary: "Brief 1-sentence synopsis",
     stack: ["Next.js", "PostgreSQL", "Docker"],
     role: "Lead Full Stack Engineer",
     links: { github: "https://github.com/...", live: "https://..." }
   }
   ```
2. Create an MDX case study in `src/content/projects/my-new-system.mdx`.
3. The system will automatically generate the case study page at `/projects/my-new-system` with full SEO metadata.

---

## Deployment

### Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure environment variables (`RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy!

### Docker
Build and run using the multi-stage, non-root Dockerfile:
```bash
docker build -t portfolio-mikul .
docker run -p 3000:3000 --env-file .env.local portfolio-mikul
```

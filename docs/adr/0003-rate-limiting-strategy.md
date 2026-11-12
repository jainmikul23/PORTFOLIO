# ADR 0003: Dual-Tier Rate Limiting Strategy (Upstash Redis + In-Memory Fallback)

## Status
Accepted

## Context
The contact form route handler (`/api/contact`) needs robust abuse prevention and rate limiting (budget: maximum 5 submissions per hour per client IP) to prevent spam and protect Resend email quota. However, developer environments and standalone deployments should function without hard external database dependencies.

## Decision
We implement a **dual-tier rate limiter**:
1. Distributed sliding window using **Upstash Redis** when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present.
2. In-memory LRU sliding window with IP tracking and timestamp pruning as an automatic fallback when Redis credentials are not provided.

## Consequences
- **Positive:**
  - Zero-friction local development without requiring local Redis instances or external service configuration.
  - Production-ready distributed rate-limiting across multi-region serverless instances on Vercel or Docker when credentials are provided.
  - Graceful degradation without application crashes or deployment blockers.
- **Negative:**
  - In-memory rate limiting does not share state across ephemeral serverless invocations if Redis is omitted in production.

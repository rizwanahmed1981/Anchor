---
id: 0001
title: Update project constitution
stage: constitution
date: 2026-01-08
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: ecomw
command: sp.constitution
labels: ["constitution", "governance", "policy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

1. Purpose

This project exists to build a next-generation password and identity manager that prioritizes:

User safety over convenience shortcuts

Long-term trust over short-term growth

Identity management over password storage

The system must function as a security companion, not merely a credential vault.

2. Non-Negotiable Principles

These rules cannot be violated under any circumstance.

2.1 Zero-Knowledge by Design

All sensitive user data must be encrypted client-side.

The system must be architected such that operators cannot access user secrets, even with full database access.

No server-side decryption paths may exist.

If a feature weakens zero-knowledge, it must not be built.

2.2 Identity-First, Not Password-First

Passwords are treated as one credential type among many.

The system must natively support multiple secret and credential types.

Design decisions must assume a future where passwords are deprecated.

2.3 Security Is Proactive

The product must actively reduce user risk.

Passive storage without guidance is insufficient.

The system must analyze usage, exposure, and access patterns to suggest safer actions.

Warnings without remediation guidance are considered incomplete features.

2.4 Explainability Is Mandatory

Security decisions must be explainable in human language.

Users should understand where their data is, when it is decrypted, and how recovery works.

No "magic" security.

If engineers cannot explain it simply, it is not finished.

2.5 Least Privilege Everywhere

Access to secrets must be minimal, scoped, and time-bound where possible.

Sharing must always be intentional and reversible.

Default access must be restrictive, not permissive.

2.6 No Dark UX Patterns

No misleading security messaging.

No artificial lock-in.

No fear-based prompts.

Trust is a product feature.

3. Architectural Constraints

These constraints guide all technical decisions.

Client-first encryption model

Event-based auditability

Deterministic, testable cryptographic flows

Modular secret types

Explicit trust boundaries

Shortcuts that improve speed at the cost of safety are forbidden.

4. Transparency and Accountability

Threat model must be documented and public.

Security incidents must be documented clearly.

Changes affecting security must be communicated.

Silence is considered a failure mode.

5. Target Users (Initial)

Primary:

Developers

Security-conscious individuals

Small technical teams

Secondary:

Families

Non-technical users (after maturity)

The product must never alienate power users to simplify UX.

6. Definition of Success

This project succeeds when:

Users demonstrably reduce credential risk over time

Users understand their security posture

Power users can automate securely without workarounds

Trust is earned through behavior, not claims

## Response snapshot

Updated the project constitution at .specify/memory/constitution.md with the provided principles and governance structure. The new constitution includes six core principles: Zero-Knowledge by Design, Identity-First approach, Proactive Security, Mandatory Explainability, Least Privilege, and No Dark UX Patterns. It also defines Architectural Constraints, Target Users and Success Metrics, and Governance requirements based on your input. The constitution is version 1.0.0, ratified on 2026-01-08.

## Outcome

- ✅ Impact: Project constitution successfully updated with comprehensive security-focused principles
- 🧪 Tests: No tests required for documentation update
- 📁 Files: Updated .specify/memory/constitution.md with new constitution content
- 🔁 Next prompts: Ready to proceed with feature specification based on new constitution
- 🧠 Reflection: The new constitution provides a strong foundation for security-first development

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution update completed successfully
- Graders run and results (PASS/FAIL): N/A for documentation update
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): Begin feature specification aligned with new constitution

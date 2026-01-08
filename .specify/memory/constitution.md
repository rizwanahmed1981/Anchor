<!-- Sync Impact Report:
     Version change: N/A (initial version) → 1.0.0
     Added sections: All principles and sections from user input
     Templates requiring updates: N/A (new constitution)
     Follow-up TODOs: None
-->
# Password Manager Constitution

## Core Principles

### Zero-Knowledge by Design
All sensitive user data must be encrypted client-side. The system must be architected such that operators cannot access user secrets, even with full database access. No server-side decryption paths may exist. If a feature weakens zero-knowledge, it must not be built.

### Identity-First, Not Password-First
Passwords are treated as one credential type among many. The system must natively support multiple secret and credential types. Design decisions must assume a future where passwords are deprecated.

### Security Is Proactive
The product must actively reduce user risk. Passive storage without guidance is insufficient. The system must analyze usage, exposure, and access patterns to suggest safer actions. Warnings without remediation guidance are considered incomplete features.

### Explainability Is Mandatory
Security decisions must be explainable in human language. Users should understand where their data is, when it is decrypted, and how recovery works. No "magic" security. If engineers cannot explain it simply, it is not finished.

### Least Privilege Everywhere
Access to secrets must be minimal, scoped, and time-bound where possible. Sharing must always be intentional and reversible. Default access must be restrictive, not permissive.

### No Dark UX Patterns
No misleading security messaging. No artificial lock-in. No fear-based prompts. Trust is a product feature.

## Architectural Constraints
These constraints guide all technical decisions. Client-first encryption model, Event-based auditability, Deterministic, testable cryptographic flows, Modular secret types, Explicit trust boundaries. Shortcuts that improve speed at the cost of safety are forbidden.

## Target Users and Success Metrics
Primary users: Developers, Security-conscious individuals, Small technical teams. Secondary users: Families, Non-technical users (after maturity). The product must never alienate power users to simplify UX. Success is measured when: Users demonstrably reduce credential risk over time, Users understand their security posture, Power users can automate securely without workarounds, Trust is earned through behavior, not claims.

## Governance
Transparency and Accountability: Threat model must be documented and public. Security incidents must be documented clearly. Changes affecting security must be communicated. Silence is considered a failure mode. Constitution supersedes all other practices. Amendments require documentation, approval, migration plan. All PRs/reviews must verify compliance. Complexity must be justified.

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
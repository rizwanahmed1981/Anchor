# Anchor Password Manager

A next-generation identity and secret management platform with zero-knowledge security, proactive risk detection, and developer automation support.

## Overview

Anchor is designed to be a security companion rather than a passive credential vault. It prioritizes:
- **User safety over convenience shortcuts**
- **Long-term trust over short-term growth**
- **Identity management over password storage**

## Key Features

- **Zero-Knowledge Security**: All sensitive data is encrypted client-side. No plaintext secrets ever leave the user's device.
- **Multi-Secret Support**: Handles passwords, passkeys, API keys, SSH keys, OAuth tokens, and secure notes.
- **Proactive Risk Detection**: Identifies credential reuse, weak credentials, dormant secrets, and overexposed sharing.
- **Explainable Security**: Security decisions are explained in human-readable language with actionable remediation guidance.
- **Developer Automation**: CLI and API access for seamless automation.

## Architecture

The platform implements a client-first encryption model with:
- Client-side encryption using Web Crypto API
- Server-side metadata storage only
- Immutable audit event logs
- Modular secret types support

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Start development server: `npm run dev`

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Project Security Audit & Safety Report

This document outlines the complete production-grade security architecture, threat model, and protective measures implemented in the **Stadium Copilot AI** application. The system has been hardened against vulnerabilities detailed in the **OWASP Top 10**, **OWASP API Security Top 10**, and **OWASP LLM Security (Top 10)** recommendations.

---

## 1. Security Architecture & Threat Model

The application utilizes a secure **Full-Stack (Client-Server)** split, ensuring that all computationally heavy tasks, external API orchestration, and cryptographic secrets are strictly localized inside the Node.js/Express server container.

```
       +-----------------------------------------+
       |           Client (React SPA)            |
       |  - 100% escaped JSX text rendering     |
       |  - Strict Content Security Policy (CSP) |
       +-----------------------------------------+
                            │
              Secure HTTPS  │  /api/chat
              & Rate Limits │  /api/live-info
                            ▼
       +-----------------------------------------+
       |         Server (Node.js/Express)        |
       |  - Helmet HTTP Security Headers         |
       |  - Zod Request Schema Validation        |
       |  - Prompt Injection Defense Filters     |
       |  - Multi-Factor AI Sanitization Layer   |
       |  - Server-Side Gemini API Keys          |
       +-----------------------------------------+
```

### Threat Vectors Mitigated

| Threat Vector | Source | Risk Level | Mitigation Strategy Implemented |
| :--- | :--- | :--- | :--- |
| **API Key Exposure** | OWASP Top 10: A02 | Critical | Server-side environment binding; zero public prefixes; ignored by Git. |
| **Prompt Injection / Jailbreaks** | OWASP LLM: LLM01 | High | Pre-token regex matching & sanitization; strict system instructions. |
| **Cross-Site Scripting (XSS)** | OWASP Top 10: A03 | High | Safe React text rendering, HTML stripping, & output sanitization. |
| **API Denial of Service (DoS)** | OWASP API: API04 | High | Dual-tier IP rate-limiting, strict body payload size constraints. |
| **Sensitive Data Exposure** | OWASP Top 10: A06 | Medium | Redacted logs, generic error responses, hidden system prompts. |
| **Prototype Pollution** | OWASP Top 10: A08 | Medium | Payload object constructor and prototype sanitization. |

---

## 2. Implemented Security Features

### 🔒 2.1. API Key Protection
* **Hidden Server-Side secrets:** All communication with the Google Gemini API uses the `GEMINI_API_KEY` loaded server-side through `dotenv`. No environment variables are prefixed with `VITE_` except safe config URLs.
* **Git Isolation:** `.gitignore` actively excludes `.env` and `.env.*` files. A clear `.env.example` file is provided to guide configuration.

### 🧪 2.2. Robust Input Validation (Zod Schemas)
Every user-facing endpoint uses **Zod schemas** to strictly enforce payload shapes before execution:
* **`UserSetupSchema`:** Validates critical fan parameters including `stadiumId`, `matchId`, `seat` (max length of 50 chars), and strict enum matching for `accessibility` and `transport`.
* **`ChatRequestSchema`:** Sets strict length bounds (1 to 1500 characters) on incoming chatbot queries to prevent buffer or token-exhaustion denial-of-service attempts.

### 🛡️ 2.3. Prompt Injection & Jailbreak Filters (OWASP LLM)
* **Pre-processing Safety Middlewares:** The chat route evaluates client prompts against a compilation of malicious, ignore-guidelines, and instruction-extraction regex expressions.
* **Graceful Rejection:** When malicious instructions are identified (e.g., *"ignore previous instructions"*, *"reveal system prompt"*, or *"dan mode"*), the system terminates the request gracefully with a `400 Bad Request` status, returning an objective, polite safety reminder.

### 🧼 2.4. Output & Input Sanitization
* **HTML & JS Stripping:** Prompt strings are cleaned of raw HTML tags, and any `javascript:` prefix is neutralized.
* **Output Sanitizer:** Before bot replies are sent to the user, an output sanitizer scrubs potential malicious scripts, inline events (`onclick`, `onerror`), and `<iframe>` embeds to guarantee client sandbox security.

### 🚦 2.5. Dual-Tier Rate Limiting
To prevent crawler abuse and denial of service:
* **API Limiter (`/api/live-info`):** Restricts requests to 100 per 15-minute window per IP.
* **Chat Limiter (`/api/chat`):** Restricts heavy AI inference queries to 15 per minute per IP.

### 🌐 2.6. Helmet HTTP Security Headers
* **Content Security Policy (CSP):** Configured strict script/style source bounds. Disallows script execution from foreign domains.
* **Framing Defenses:** Enforces `X-Frame-Options: SAMEORIGIN` to avoid clickjacking.
* **Device Control:** Configured `Permissions-Policy: camera=(), microphone=(), geolocation=()` to protect fan browser contexts.

---

## 3. Safe Logging & Error Handling

* **Stack Trace Masking:** Exception handlers catch errors and log full technical diagnostics *internally* while presenting the client with a generic, friendly fallback message. No stack traces or database configurations are ever exposed to public clients.
* **Log Sanitization:** A secure logging utility scans log messages for sensitive patterns (e.g., API keys, passwords, bearer tokens, or PII like email addresses) and replaces them with `[REDACTED_CONFIDENTIAL_DATA]` before console output.

---

## 4. Authentication & Authorization Readiness

To prepare the codebase for seamless production user authentication, we have integrated a modular security middleware:
* **`requireAuth` Middleware:** Inspects the request header for `Authorization: Bearer <token>`. Validates header format while remaining fallback-safe for preview environments. Can be linked directly to your OAuth/JWT verification service.
* **`enforcePayloadStandards` Middleware:** Evaluates incoming parameters to block Prototype Pollution payloads trying to alter server prototypes.

---

## 5. Remaining Risks & Future Recommendations

1. **Production Token Verification:** Once deployed to production with active user registration, swap the placeholder verification block inside `requireAuth` to point to a production JWT/Identity service (e.g., Firebase Auth or Auth0).
2. **IP Whitelisting on Backend:** For enterprise or dedicated stadium administration tools, implement IP whitelisting or VPN tunnels to isolate system databases.
3. **LLM Temperature Tuning:** Keep the LLM temperature parameters bounded (`< 0.4`) when executing strict FAQ or guideline queries to minimize hallucination risks.

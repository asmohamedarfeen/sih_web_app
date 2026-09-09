# Application Security Architecture & Features Specification

## 1. Executive Summary

The **Personnel Stress & Welfare Monitoring System (PSWMS)** implements defense-grade, multi-layered security controls designed to comply with strict operational readiness and confidentiality standards. The security architecture incorporates a **Zero-Trust Defense-in-Depth** model spanning client-side route guards, API gateways, transport controls, fine-grained Role-Based Access Control (RBAC), Personally Identifiable Information (PII) data masking, anti-tampering cryptographic audit trails, and automated session invalidation.

---

## 2. Security Feature Matrix & Implementation Map

| Security Domain | Feature Description | Implementation Path(s) | Primary Controls |
| :--- | :--- | :--- | :--- |
| **Authentication** | Cryptographic JWT authentication & Bcrypt credential hashing | [`backend/app/security/jwt.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/jwt.py)<br>[`backend/app/security/passwords.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/passwords.py)<br>[`backend/app/dependencies/auth.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/dependencies/auth.py) | HMAC-SHA256, Bcrypt salt, token expiry, active account checks |
| **Authorization (RBAC)** | Role-Based Access Control on API endpoints & routes | [`backend/app/dependencies/auth.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/dependencies/auth.py)<br>[`backend/app/api/dashboard/routes.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/api/dashboard/routes.py) | Dependency injection (`require_roles`), HTTP 403 Forbidden enforcement |
| **Data Privacy & PII** | "Need-to-Know" field redaction & sensitive data masking | [`backend/app/security/sanitization.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/sanitization.py)<br>[`backend/app/api/personnel/routes.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/api/personnel/routes.py) | Masking bank numbers, national IDs, psychiatric notes, and armory serials |
| **Input Sanitization** | Anti-XSS and injection mitigation | [`backend/app/security/sanitization.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/sanitization.py)<br>[`backend/app/api/personnel/routes.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/api/personnel/routes.py) | HTML entity escaping (`html.escape`), null-byte stripping (`\0`) |
| **Audit & Integrity** | Cryptographic audit logging with SHA-256 checksums | [`backend/app/security/audit_logger.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/audit_logger.py)<br>[`backend/app/api/dashboard/routes.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/api/dashboard/routes.py) | Non-repudiation, tamper-evident logs, ISO-8601 UTC timestamps |
| **Abuse Prevention** | Sliding-window client rate limiting | [`backend/app/middleware/rate_limiter.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/middleware/rate_limiter.py)<br>[`backend/app/main.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/main.py) | 120 req/60s threshold, IP throttling, HTTP 429 response |
| **Transport & Headers** | Defense-grade HTTP security headers | [`backend/app/middleware/security_headers.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/middleware/security_headers.py) | HSTS, CSP/Frames (DENY), nosniff, XSS protection, permissions policy |
| **Data Layer** | SQL Injection prevention & session isolation | [`backend/app/database/session.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/database/session.py)<br>[`backend/app/models/user.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/models/user.py) | SQLAlchemy ORM parameterized queries, scoped request lifecycles |
| **Frontend Security** | Client route protection & auto-session purge | [`frontend/src/routes/RoleProtectedRoute.tsx`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/frontend/src/routes/RoleProtectedRoute.tsx)<br>[`frontend/src/services/apiClient.ts`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/frontend/src/services/apiClient.ts) | Token auto-injection, immediate purge on 401, client-side route guards |

---

## 3. Deep Dive into Implemented Security Controls

### 3.1. Authentication & Token Management
* **Password Hashing**: Implemented using Bcrypt with automatic salt generation in [`passwords.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/passwords.py). Plaintext passwords are never stored or logged.
* **JWT Access Tokens**: Issued during login in [`routes.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/api/authentication/routes.py#L29-L66) via [`jwt.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/jwt.py). Tokens are cryptographically signed using HMAC-SHA256 (`HS256`) and encode claims including user subject (`sub`), UID, Force ID, Regimental Number, Role, and expiration timestamp (`exp`).
* **Active Status Verification**: The dependency [`get_current_user`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/dependencies/auth.py#L12-L50) validates token signatures and queries the database to confirm that the user exists and `is_active == True`. Inactive or deactivated accounts are rejected with HTTP 401 Unauthorized.

### 3.2. Role-Based & Object-Level Access Control (RBAC & ABAC)
* **API Role Enforcement**: Implemented as a reusable dependency factory [`require_roles`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/dependencies/auth.py#L69-L78). If an authenticated caller's role is not within the endpoint's allowed list, an HTTP 403 Forbidden exception is raised.
  * Example endpoints protected by RBAC:
    * `/api/v1/dashboard/welfare`: Restricted to `WELFARE_OFFICER`, `MEDICAL_OFFICER`, `ADMIN`, `SUPER_ADMIN`.
    * `/api/v1/dashboard/commander`: Restricted to `COMMANDER`, `DEPT_HEAD`, `ADMIN`, `SUPER_ADMIN`.
    * `/api/v1/dashboard/hr`: Restricted to `HR_OFFICER`, `TRAINING_OFFICER`, `ADMIN`, `SUPER_ADMIN`.
    * `/api/v1/dashboard/admin`: Restricted to `SUPER_ADMIN`, `SYS_ADMIN`, `SECURITY_ADMIN`, `ADMIN`.
* **Object-Level Self-Service Guard**: In [`backend/app/api/personnel/routes.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/api/personnel/routes.py#L65-L70), personnel with the `PERSONNEL` role can strictly view their own dossier; querying another officer's UID immediately returns HTTP 403 Forbidden.

### 3.3. Data Sanitization & "Need-to-Know" PII Redaction
* **PII Masking**: Located in [`backend/app/security/sanitization.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/sanitization.py#L17-L52), `mask_sensitive_pii()` recursively traverses API responses to mask or redact sensitive military and personal data according to the viewer's role:
  * **Financial Information**: Bank account numbers are masked (`XXXX-XXXX-1234`).
  * **National Identification**: Aadhaar numbers and SSNs are masked (`XXXXXXXX1234`).
  * **Personal Contacts**: Private phone numbers are masked (`987XXXX123`).
  * **Medical & Psychiatric Notes**: Redacted to `"[CONFIDENTIAL - MEDICAL / WELFARE ACCESS ONLY]"` for anyone without `WELFARE_OFFICER` or `MEDICAL_OFFICER` roles.
  * **Armory Records**: Weapon serial numbers and butt numbers are redacted to `"[RESTRICTED - COMMAND ACCESS ONLY]"` unless the caller is `COMMANDER`, `ADMIN`, or `SUPER_ADMIN`.
* **Anti-XSS Sanitization**: Input parameters (search queries, unit names, risk levels) are passed through `sanitize_string()` which executes `html.escape()` and removes null bytes (`\0`) to neutralize Cross-Site Scripting (XSS) payloads.

### 3.4. Cryptographic Audit Trail (Non-Repudiation)
* **Audit Logger**: Located in [`backend/app/security/audit_logger.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/security/audit_logger.py).
* **Integrity Signature**: Every sensitive data access record captures:
  * Timestamp (ISO 8601 UTC)
  * User Email, Role, and Unique ID (UID)
  * Target API endpoint and operation action
  * Client remote IP address
  * HTTP status code
* **Tamper Evident**: A canonical JSON string of the log payload is hashed via **SHA-256** and appended as `integrity_sha256` to ensure forensic non-repudiation and detect log tampering.

### 3.5. Anti-Brute Force & Rate Limiting
* **Rate Limiter Middleware**: Located in [`backend/app/middleware/rate_limiter.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/middleware/rate_limiter.py).
* **Sliding Window Tracking**: Enforces a strict threshold of **120 requests per 60 seconds** per client IP host across all data and authentication endpoints.
* **Denial Response**: Exceeded requests are halted with HTTP 429 Too Many Requests, carrying a `Retry-After` header. Critical infrastructure endpoints (`/health`, `/docs`) are monitored with selective exemptions.

### 3.6. HTTP Transport & Hardening Headers
* **Security Headers Middleware**: Implemented in [`backend/app/middleware/security_headers.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/middleware/security_headers.py), injecting protective headers on every response:
  * `X-Frame-Options: DENY`: Blocks Clickjacking by forbidding the application from being loaded in `<iframe>` or `<frame>` elements.
  * `X-Content-Type-Options: nosniff`: Mitigates MIME-sniffing vulnerabilities.
  * `X-XSS-Protection: 1; mode=block`: Activates browser XSS reflection protection.
  * `Strict-Transport-Security: max-age=31536000; includeSubDomains`: Enforces HTTPS for 1 year across all subdomains.
  * `Referrer-Policy: strict-origin-when-cross-origin`: Restricts referrer data leakage across origins.
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Explicitly blocks browser hardware capabilities from unauthorized invocation.
  * `X-Permitted-Cross-Domain-Policies: none`: Disallows cross-domain policy files.

### 3.7. Database & Injection Mitigations
* **SQL Injection Prevention**: Data layer in [`backend/app/database/session.py`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/database/session.py) uses SQLAlchemy ORM with parameterized database queries. No string concatenation or raw SQL queries are permitted.
* **Session Lifecycle**: Database sessions are bound strictly to request scopes using FastAPI dependency generator [`get_db`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/backend/app/database/session.py#L18-L24), guaranteeing immediate closure and cleanup.

### 3.8. Frontend Client-Side Security Architecture
* **Role-Protected Route Guards**:
  * Implemented via [`RoleProtectedRoute.tsx`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/frontend/src/routes/RoleProtectedRoute.tsx).
  * Evaluates authenticated state and user role before rendering dashboard layouts.
  * Unauthorized views automatically redirect users to their assigned role dashboard.
* **Secure API Client & Automatic Session Purge**:
  * Implemented in [`frontend/src/services/apiClient.ts`](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/frontend/src/services/apiClient.ts).
  * **Bearer Token Injection**: Automatically injects current JWT token into request headers.
  * **Automated 401 Session Purge**: Intercepts HTTP 401 Unauthorized errors, instantly clearing `pswms_token` and `pswms_user` from `localStorage` and redirecting callers to `/login`.
  * **Request Timeouts**: Enforces a 10,000 ms timeout to protect client state from hanging connections or Slowloris conditions.
  * **Anti-CSRF Header**: Sends `X-Requested-With: XMLHttpRequest` on all requests.

---

## 4. Verification and Audit Status

* **Static Security Verification**: All modules pass validation with zero TypeScript compile errors and strict PEP 8 type hinting.
* **Defense Deployment Readiness**: Meets requirements for Defense HRMS isolated deployments, containerized on secure internal enclaves.

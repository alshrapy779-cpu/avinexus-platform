# V20.2.1 SECURITY MODEL

V20.2.1 introduces a transition security boundary for new enterprise APIs. The goal is to strengthen authentication and authorization without breaking the preserved V20.2 surface before migration is tested.

## Authentication
Passwords are stored as PBKDF2-SHA512 derived hashes with per-user random salts and 210,000 iterations. Access tokens are HMAC-SHA256 signed, carry expiry and JTI, and are verified against the credential's current `auth_version`. Password changes or disabling a credential therefore invalidate existing sessions. Logout adds the JTI to a revocation store. Five failed password attempts trigger a temporary lock.

Production requires `SPP_AUTH_SECRET` with at least 32 characters. Initial bootstrap credentials are created only when the auth store is empty and bootstrap environment variables are supplied. Credential storage is separated by runtime environment.

## Authorization
Secure V20.2.1 endpoints resolve current permissions dynamically from the enterprise identity and current role definition. Permission denies override allows. Resource scope can restrict by governorate, district, branch, farm or flock. Delegated authority is constrained by permission, date range, optional scope and optional financial limit.

## Migration boundary
V20.2 legacy endpoints are intentionally preserved and some still use the older trusted-header model. They are not described as secure-equivalent to V20.2.1. Migration must be incremental: endpoint → secure authorization → integration test → client migration → legacy trust removal.

## Remaining hardening
MFA, refresh-session strategy, device trust, distributed rate limiting, external secret management, tamper-evident audit storage, malware scanning/object storage for evidence files and production penetration testing remain future work.

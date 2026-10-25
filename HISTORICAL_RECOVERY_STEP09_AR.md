# Historical Recovery Step 09 — Server-backed Office 360 UI

Changes: Office 360 reads workspace and treasury reconciliation from authenticated V20.2.3 API through the existing apiService bearer token/refresh mechanism. Removes previous client-side financial/farm cross-filter fallback. Explicit loading, error, and denied-access states. No financial writes or new ledgers. Customer 360 label retained.

Limitations: office dropdown is based on client-side business units and still requires server-scoped listing; no Windows build/real database persistence/print verification. No production approval.

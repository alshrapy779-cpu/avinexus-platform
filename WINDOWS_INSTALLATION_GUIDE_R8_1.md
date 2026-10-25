# AviNexus Poultry Enterprise — Windows R8.1 Installation & Acceptance

## Installation
Run PowerShell as a normal authorized Windows user inside the extracted project folder:

```powershell
windows\INSTALL_WINDOWS_PLATFORM.ps1
```

The installer requires Node.js 20+, installs dependencies, runs the cumulative R8 baseline verification plus the R8.1 preservation/semantic checks, builds the Vite/esbuild production bundle, and requires `dist\server.cjs` to exist.

## Start

```powershell
windows\START_WINDOWS_PLATFORM.ps1
```

## First visible acceptance path
1. Sign in with an authorized account.
2. Open **مساحة العمل | Workspace**. R8.1 Operational Center is the default landing workspace.
3. Verify Global Search, My Work, Farms & Flocks, Veterinary, Factory, Offices/Customers/Partners, Finance, Reports and Settings.
4. Under **المحافظات والمناطق | Regions & Governorates**, verify configurable regions, purposes and archive-with-history behavior.
5. Under **المواقع والعنابر | Sites & Houses**, verify coordinates, open/semi-open/closed/controlled house data, feed/water infrastructure and monitoring.
6. Under **التجهيزات والمرافق | Equipment & Utilities**, verify drinkers, feeders, heaters, fans, sensors, backup power and maintenance data.
7. Under **AviNexus Intelligence**, test contextual analysis and deterministic calculations. Clinical decisions must escalate to an authorized veterinarian.
8. Under **Disease Alerts**, test Detected → Acknowledged → Investigating → Containment → Clinical Decision → Monitoring → Closed → Post-event Review.
9. Under **Action Closure Audit**, verify critical buttons have permission, context, validation, mutation, destination, handoff, notification, audit and failure behavior.
10. Under **R8.1 Acceptance Matrix**, visibly test each screen dimension rather than marking it complete because it renders.
11. Switch **الإعدادات | Settings** among Arabic, English and bilingual UI modes.
12. Stop and restart the server and confirm records, history, alerts, settings and audit survive.

## Weather provider
The server uses a provider abstraction. R8.1 includes an Open-Meteo adapter with cache and fallback to the latest stored/manual reading. Internet/provider failure must not erase or replace manual/sensor house measurements.

## Protected ownership
- S7: inventory truth
- S12: accounting/GL/AP/AR/Treasury truth
- S11: payroll operational owner
- S14: report execution owner
- S15: governance owner

R8.1 does not create a parallel inventory, accounting or clinical authority.

## Production/test gate
Do not call the release production-complete until target-Windows dependency installation, `npm run verify:r8.1`, production build/startup, role/scope isolation, multi-day operational scenarios, printing, offline queue, AI/weather behavior and restart persistence are visibly accepted.

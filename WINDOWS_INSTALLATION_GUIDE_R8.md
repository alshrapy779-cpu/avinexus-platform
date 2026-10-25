# AviNexus Poultry Enterprise — Windows R8 Factory Closure Installation & Acceptance

## 1. Install
Open PowerShell in the extracted R8 folder and run:

```powershell
windows\INSTALL_WINDOWS_PLATFORM.ps1
```

The installer requires Node.js 20+, installs dependencies, runs `verify:factory-windows-r8`, performs the Vite/esbuild production build and verifies `dist\server.cjs`.

## 2. Start

```powershell
windows\START_WINDOWS_PLATFORM.ps1
```

## 3. Mandatory Factory acceptance
Do not mark Factory complete until these are visibly tested:

### Procurement and receiving
Supplier → PR → quote comparison → PO → truck arrival → weighbridge → GRN → variance/quality → S7 inventory → supplier invoice → 3-way match → S12/AP.

### Production
Starter/Grower/Finisher formula → work order → staging/WIP → actual consumption/output → variance approval → finished goods inventory → provisional cost → final true-up.

### Dispatch and sales
Sales order → credit check → S8 dispatch → S7 issue/transfer → delivery/POD → operational invoice → S12 AR → receipt → customer statement.

### HR/payroll
Employee → contract/assignment → attendance/leave/bonus/deduction/advance → payroll → S12 payable → treasury payment/remittance.

### Transport
Driver/provider → vehicle → zone/rate → trip → load → POD → claim/earning → S11/S12 handoff.

### Reports/printing
Open representative screens from all 15 sections. Test search/filter, history, export snapshot, screen print, frozen reports and accounting/customer documents.

### Persistence
Create representative records, stop the platform, start it again, and confirm records/history remain intact.

## 4. Final gate
Factory may be frozen only when:
- all critical role workflows pass;
- all discovered missing buttons/fields/destinations are corrected;
- permissions are correct;
- reports and printing work;
- data survives restart;
- no Section 7/Section 12 ownership violation exists.

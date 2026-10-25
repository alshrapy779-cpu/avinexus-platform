# AviNexus Poultry Enterprise — Windows R7 Installation & Acceptance

## Identity
- Platform: **AviNexus Poultry Enterprise / أفي نيكسس لإدارة الدواجن**
- Product Owner: **فارع الفارعي**
- Release: **V20.2.9 Windows R7 Customer / Office / Partner Consolidation**
- Reference platform: Windows/Web
- Android: deferred until Windows production closure

## Install on the target Windows control-center machine
1. Extract the R7 ZIP to a permanent folder, e.g. `C:\AviNexus`.
2. Install Node.js 20+ if not already installed.
3. Open PowerShell in the project root.
4. Run:
   `windows\INSTALL_WINDOWS_PLATFORM.ps1`
5. The installer will install dependencies, run the retained Factory/Farm/R7 verification suite, build Vite, bundle the Node server, and fail closed if `dist\server.cjs` is not created.
6. Start with `windows\START_WINDOWS_PLATFORM.ps1`.
7. Verify with `windows\VERIFY_WINDOWS_PLATFORM.ps1`.

## Mandatory visible acceptance
Do not freeze R7 until all of the following are visibly tested on Windows:
- Retail customer registration/login/catalog/order path.
- Guest checkout path where enabled.
- Managed-farm customer relationship with canonical `office_id`.
- Office 360 with manager/responsibilities/warehouse/cost-center context.
- Company/partner 360 with contracts, branches, phones, governorates, price terms and history.
- Feed mill offers: Starter/Grower/Finisher, bag weight, quantity, currency, delivery/transport terms.
- Medicine/vaccine supplier availability and veterinary restrictions.
- Hatchery/chick pricing and branch/location/availability.
- Laboratory service pricing, sample type, turnaround time and linked catalog item where relevant.
- Nearest eligible branch routing by governorate/location, availability and cold-chain requirement.
- Farm requirement -> supplier/branch -> PO -> receiving/GRN -> Section 7 -> invoice -> Section 12.
- Regional markets + marketing office + flock readiness + owner decision + settlement path.
- Chat/voice/media and role handoffs remain available.
- AI remains advisory; veterinarian remains final treatment/vaccine authority.
- Reports, print and history remain visible.
- Restart the server and confirm persisted data remains.
- Permission test each critical role.

## Preservation rule
R7 is cumulative. Factory Production R3 and Farm R4/R5/R6 remain protected. No financial history, inventory history, clinical history, customer history, contract history or price history may be destructively deleted.

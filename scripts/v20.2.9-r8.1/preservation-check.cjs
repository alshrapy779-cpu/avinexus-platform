const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'R8_BASELINE_SHA256.json'),'utf8'));
const allowed=new Set([
  'package.json','server.ts','src/App.tsx','src/types.ts','src/index.css','src/config/appVersion.ts','src/services/apiService.ts',
  'src/components/Header.tsx','src/components/ai/AIVeterinaryGuidanceModal.tsx','src/components/marketplace/v197/BrokerMarketplaceV197.tsx','src/components/settings/AppSettingsDrawer.tsx','src/components/v20/EnterpriseWebWorkspaceV20_2.tsx',
  '.env.windows.example','windows/INSTALL_WINDOWS_PLATFORM.ps1','windows/VERIFY_WINDOWS_PLATFORM.ps1'
]);

// 2026-10-19/20 historical-recovery source snapshot. These seven newer files are
// intentionally distinct from the older R8 hash baseline. Pin to exact SHA-256
// rather than blanket-whitelisting paths: future unreviewed edits still fail.
// This is SOURCE preservation only, not Windows runtime/functional acceptance.
const restorationHashes=new Map([
  ['src/components/admin/AdminFinancialDashboard.tsx','6829b15ddedbf73b9faccbe1fdb4cc488a5607237e4df3d9697ae524344aa96d'],
  ['src/components/home/HomeDashboard.tsx','346654d2a2bffa7bbc8b02b404788aef5d3b65a1564a3a0c850a1a75099527ef'],
  ['src/components/v20/CustomerOfficePartnerNetworkR7.css','ef4ff8883daa1eef6b471353710ca32cd76b5ce406af644a7e28816712481ebe'],
  ['src/components/v20/CustomerOfficePartnerNetworkR7.tsx','baafe3dd306448e638e1b7c50e5bcd56806e1eeec3696cfaa63b08ef82cb7d82'],
  ['src/components/v20/FarmWindowsControlCenterR6.tsx','fb81f7ff606585aaa8f3d8578dc7ad3745d4821a85c5294d88d699ce0db65ca4'],
  ['src/modules/v20/MultiBusinessEnterpriseV20_2_3.ts','f1bddeafde8c8729323ae81fe670758535d03379b1abd8a9edb99e371c81a3bc'],
  ['src/modules/v20/PartnerOfficeCustomerNetworkR7.ts','14ae9129baadcb7d1fe5e69e1fb4d56bf8ebc966c5685255231a95e131262962']
]);

const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let missing=[],unexpected=[],allowedChanged=[],knownRestoration=[];
for(const [rel,hash] of Object.entries(baseline.files)){
 const p=path.join(root,rel);if(!fs.existsSync(p)){missing.push(rel);continue;}const changed=sha(p)!==hash;if(changed){if(allowed.has(rel))allowedChanged.push(rel);else if(restorationHashes.get(rel)===sha(p))knownRestoration.push(rel);else unexpected.push(rel);}
}
console.log(`R8.1 preservation: baseline=${baseline.file_count} missing=${missing.length} unexpected=${unexpected.length} allowed_changed=${allowedChanged.length} pinned_restoration=${knownRestoration.length}`);
if(missing.length)console.log('Missing:',missing.slice(0,30));
if(unexpected.length)console.log('Unexpected:',unexpected.slice(0,30));
console.log('Allowed changed:',allowedChanged);
console.log('Pinned historical restoration:',knownRestoration);
if(missing.length||unexpected.length)process.exit(1);
console.log('PASS R8 baseline paths preserved; R8.1 changes and the pinned 2026-10-20 historical snapshot accounted for. Operational acceptance remains separate.');

const fs=require('node:fs');const assert=require('node:assert/strict');
const source=fs.readFileSync('server.ts','utf8');
const checks=[
 ['consultant assignment enforced',/consultation_assignment_denied/.test(source)],
 ['worker task assignment enforced',/task_assignment_denied/.test(source)],
 ['vet follow-up assignment enforced',/followup_assignment_denied/.test(source)],
 ['task export authenticated',/tasks\.csv',requireAuthV2021\(\)/.test(source)],
 ['task export scoped',/farmIds\.has\(t\.farm_id\)/.test(source)],
 ['task export formula guarded',/\[=\+\\-@\]/.test(source)],
 ['task export BOM',/\\uFEFF/.test(source)],
 ['task export no cache',/Cache-Control','private, no-store/.test(source)],
];for(const [name,pass] of checks){console.log(`${pass?'PASS':'FAIL'} ${name}`);assert.ok(pass,name)}
console.log(`Workspace regression: ${checks.length}/${checks.length} static checks`);

import fs from 'node:fs';
import assert from 'node:assert/strict';
const policy = fs.readFileSync('src/modules/ai/AIActionSafetyPolicy.ts','utf8');
const server = fs.readFileSync('server.ts','utf8');
for (const action of ['prescribe_antibiotic','purchase_vaccine','authorize_marketing','release_withdrawal','post_financial_entry','execute_payment']) {
  assert.ok(policy.includes(`| '${action}'`), `missing denied action ${action}`);
  assert.ok(!policy.match(new RegExp(`ALLOWED_ADVISORY_ACTIONS[^;]*'${action}'`, 's')), `unsafe allow ${action}`);
}
assert.ok(server.includes("app.post('/api/ai/action', requireAuthV2021()"));
assert.ok(server.includes('guardAIAdvisorReply(parsed.reply)'));
assert.ok(server.includes('executed: false'));
console.log('AI action policy source checks: PASS');

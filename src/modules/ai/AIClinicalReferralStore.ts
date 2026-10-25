/** Persistent, append-only clinical referral workflow. No diagnosis, prescription or approval. */
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export type ClinicalReferral = Readonly<{
  id: string; farm_id: string; flock_id?: string; created_by: string;
  created_at: string; summary: string; symptoms: string[];
  status: 'pending_vet_review'; source: 'ai_advisor';
}>;

const MAX_LINE_BYTES = 16000;
export function referralFile(root: string): string { return path.join(root, 'ai-clinical-referrals.jsonl'); }
export function createClinicalReferral(root: string, input: {farm_id:string; flock_id?:string; created_by:string; summary:string; symptoms?:string[]}): ClinicalReferral {
  const summary = String(input.summary || '').trim();
  if (!input.farm_id || !input.created_by || !summary || summary.length > 4000) throw new Error('invalid_referral');
  const symptoms = (input.symptoms || []).filter(x => typeof x === 'string').slice(0, 30).map(x => x.slice(0, 160));
  const record: ClinicalReferral = { id: randomUUID(), farm_id: input.farm_id, ...(input.flock_id ? {flock_id: input.flock_id}: {}), created_by: input.created_by, created_at: new Date().toISOString(), summary, symptoms, status:'pending_vet_review', source:'ai_advisor' };
  fs.mkdirSync(root, {recursive:true});
  const file = referralFile(root);
  const fd = fs.openSync(file, 'a', 0o600);
  try { fs.writeSync(fd, JSON.stringify(record) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  return record;
}
export function listClinicalReferrals(root: string): ClinicalReferral[] {
  const file = referralFile(root);
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  return content.split('\n').filter(Boolean).flatMap(line => {
    if (Buffer.byteLength(line) > MAX_LINE_BYTES) return [];
    try { const r = JSON.parse(line); return r && r.source === 'ai_advisor' && typeof r.farm_id === 'string' ? [r as ClinicalReferral] : []; } catch { return []; }
  });
}

/** Append-only clinical review events; never overwrite the original referral. */
export type ClinicalReferralReview = Readonly<{
  id: string; referral_id: string; farm_id: string; reviewer_id: string;
  created_at: string; decision: 'acknowledged' | 'needs_information' | 'reviewed'; note: string;
}>;
export function reviewFile(root: string): string { return path.join(root, 'ai-clinical-referral-reviews.jsonl'); }
export function appendClinicalReview(root: string, input: {
  referral_id: string; farm_id: string; reviewer_id: string;
  decision: ClinicalReferralReview['decision']; note: string;
}): ClinicalReferralReview {
  if (!['acknowledged', 'needs_information', 'reviewed'].includes(input.decision) ||
      !input.reviewer_id || !input.referral_id || !input.farm_id ||
      typeof input.note !== 'string' || input.note.length > 4000) throw new Error('invalid_review');
  const record: ClinicalReferralReview = { id: randomUUID(), ...input, created_at: new Date().toISOString() };
  fs.mkdirSync(root, {recursive:true});
  const fd = fs.openSync(reviewFile(root), 'a', 0o600);
  try { fs.writeSync(fd, JSON.stringify(record) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  return record;
}
export function listClinicalReviews(root: string, referral_id: string): ClinicalReferralReview[] {
  const file = reviewFile(root);
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).flatMap(line => {
    if (Buffer.byteLength(line) > MAX_LINE_BYTES) return [];
    try { const x = JSON.parse(line); return x.referral_id === referral_id &&
      ['acknowledged','needs_information','reviewed'].includes(x.decision) ? [x as ClinicalReferralReview] : []; }
    catch { return []; }
  });
}

/** Server-side, deterministic boundary for AI-originated actions.
 * Advisory output is never an authorization token or an executable command.
 */
export type AIActionKind =
  | 'analyze' | 'calculate' | 'create_review_task' | 'request_vet_review'
  | 'prescribe_antibiotic' | 'approve_treatment' | 'approve_vaccination'
  | 'purchase_antibiotic' | 'purchase_vaccine' | 'release_withdrawal'
  | 'authorize_slaughter' | 'authorize_marketing' | 'post_financial_entry'
  | 'issue_inventory' | 'execute_payment';

const ALLOWED_ADVISORY_ACTIONS: ReadonlySet<string> = new Set([
  'analyze', 'calculate', 'create_review_task', 'request_vet_review'
]);

export function authorizeAIAction(action: string): { allowed: boolean; reason: string } {
  if (!ALLOWED_ADVISORY_ACTIONS.has(action)) {
    return { allowed: false, reason: 'human_authorization_required' };
  }
  return { allowed: true, reason: 'advisory_only_no_operational_execution' };
}

/** Never treat an LLM reply as a veterinary clearance or marketing authorization. */
export function guardAIAdvisorReply(reply: unknown): string {
  const text = typeof reply === 'string' ? reply.trim() : '';
  if (!text) return 'يرجى تقديم بيانات إضافية لتقييم الحالة وإحالتها إلى المختص عند الحاجة.';
  // A deliberately conservative filter. It is not a substitute for clinical review.
  const unsafeDose = /(?:أموكسيسيلين|إنروفلوكساسين|دوكسيسيكلين|تايلوسين|كولستين|مضاد\s*حيوي).{0,90}(?:\d+(?:[.,]\d+)?\s*(?:مل|مجم|mg|ml|غرام|جم|جرعة))/iu.test(text);
  const unsafeAuthorization = /(?:أصدر|اعتمد|نفّذ|نفذ|ابدأ|قم\s*بشراء|اسمح\s*بـ?)(?:.{0,50})(?:أمر\s*شراء\s*(?:لقاح|مضاد)|ذبح\s*القطيع|تسويق\s*القطيع|رفع\s*حظر\s*السحب)/iu.test(text);
  if (unsafeDose || unsafeAuthorization) {
    return 'لا يمكن للمستشار الذكي إصدار وصفة مضاد حيوي أو جرعة أو اعتماد شراء دواء أو لقاح أو ذبح أو تسويق أو رفع قيود السحب. يجب مراجعة الطبيب المخول، ثم المسؤول التجاري أو المالي المختص عند الاقتضاء.';
  }
  return text;
}

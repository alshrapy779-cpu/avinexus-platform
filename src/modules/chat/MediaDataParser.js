const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
const normalizeDigits = (text) => text.replace(/[٠-٩]/g, d => String(arabicDigits.indexOf(d))).replace(/٫/g, '.');
const aliases = { mortality: ['النافق', 'النفوق', 'mortality'], temperature_c: ['الحرارة', 'درجة الحرارة', 'temperature'], humidity_percent: ['الرطوبة', 'humidity'], weight_g: ['الوزن', 'متوسط الوزن', 'weight'], feed_kg: ['العلف', 'استهلاك العلف', 'feed'], water_liters: ['الماء', 'استهلاك الماء', 'water'], age_days: ['العمر', 'عمر القطيع', 'age'] };
function numberAfter(text, keys) {
    for (const key of keys) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const m = text.match(new RegExp(`${escaped}\\s*(?:اليوم|هو|حوالي|تقريباً)?\\s*[:=]?\\s*(-?\\d+(?:[.,]\\d+)?)`, 'i'));
        if (m)
            return Number(m[1].replace(',', '.'));
    }
}
export function parseFieldMediaTranscriptV19(raw) {
    const text = normalizeDigits(raw || '');
    const fields = [];
    const units = { temperature_c: 'C', humidity_percent: '%', weight_g: 'g', feed_kg: 'kg', water_liters: 'L', age_days: 'day' };
    for (const [key, keys] of Object.entries(aliases)) {
        const value = numberAfter(text, keys);
        if (value !== undefined)
            fields.push({ key, value, unit: units[key], confidence: key === 'mortality' ? 0.92 : 0.84, source: 'transcript' });
    }
    const lower = text.toLowerCase();
    if (/إسهال|اسهال|diarrhea/.test(lower))
        fields.push({ key: 'symptom', value: 'diarrhea', confidence: .75, source: 'text' });
    if (/فرشة.*مبل|رطوبة الفرشة|wet litter/.test(lower))
        fields.push({ key: 'litter_status', value: 'wet', confidence: .78, source: 'text' });
    if (/خمول|letharg/.test(lower))
        fields.push({ key: 'symptom', value: 'lethargy', confidence: .72, source: 'text' });
    return fields;
}

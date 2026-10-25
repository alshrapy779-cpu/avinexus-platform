export interface PoultrySizingInputR81 {
  bird_count: number;
  age_days: number;
  house_length_m?: number;
  house_width_m?: number;
}

export interface RangeR81 { min: number; max: number; unit: string; }

export interface PoultrySizingResultR81 {
  input: PoultrySizingInputR81;
  house_area_m2?: number;
  stocking_density_birds_m2: RangeR81;
  required_brooding_area_m2: RangeR81;
  available_area_note?: string;
  brooding_trays: number;
  manual_jumbo_feeders: RangeR81;
  pan_feeders: RangeR81;
  chain_feeder_linear_m: RangeR81;
  nipple_points: number;
  manual_drinkers_4_5l: RangeR81;
  jumbo_drinkers: RangeR81;
  starter_feed_total_kg: RangeR81;
  daily_feed_kg: number | null;
  daily_water_l: number | null;
  source_notes: string[];
  warnings: string[];
}

const ceil = (x:number) => Math.ceil(x);
const round = (x:number,d=1) => Number(x.toFixed(d));

function densityForAge(ageDays:number):RangeR81 {
  if(ageDays<=7) return {min:30,max:40,unit:'birds/m²'};
  if(ageDays<=14) return {min:30,max:30,unit:'birds/m²'};
  if(ageDays<=21) return {min:20,max:20,unit:'birds/m²'};
  if(ageDays<=28) return {min:15,max:15,unit:'birds/m²'};
  return {min:12,max:12,unit:'birds/m²'};
}

export function calculatePoultrySizingR81(input:PoultrySizingInputR81):PoultrySizingResultR81 {
  const birds=Math.max(1,Math.floor(Number(input.bird_count)||1));
  const age=Math.max(0,Math.floor(Number(input.age_days)||0));
  const density=densityForAge(age);
  const minArea=birds/density.max;
  const maxArea=birds/density.min;
  const houseArea=(input.house_length_m&&input.house_width_m)?Number(input.house_length_m)*Number(input.house_width_m):undefined;
  const warnings:string[]=[];
  if(age>28) warnings.push('The source table labels the final 12 birds/m² row inconsistently; keep this value under expert review before production activation.');
  const availableNote=houseArea?`Full house area is ${round(houseArea,1)} m². For the current age, the source-based brooding area is approximately ${round(minArea,1)}–${round(maxArea,1)} m²; do not automatically use the whole house for 2-day-old chicks.`:undefined;
  return {
    input:{bird_count:birds,age_days:age,house_length_m:input.house_length_m,house_width_m:input.house_width_m},
    house_area_m2:houseArea?round(houseArea,1):undefined,
    stocking_density_birds_m2:density,
    required_brooding_area_m2:{min:round(minArea,1),max:round(maxArea,1),unit:'m²'},
    available_area_note:availableNote,
    brooding_trays:ceil(birds/50),
    manual_jumbo_feeders:{min:ceil(birds/70),max:ceil(birds/50),unit:'units'},
    pan_feeders:{min:ceil(birds/70),max:ceil(birds/50),unit:'units'},
    chain_feeder_linear_m:{min:round(birds/100,1),max:round(birds/80,1),unit:'linear m'},
    nipple_points:ceil(birds/12),
    manual_drinkers_4_5l:{min:ceil(birds/100),max:ceil(birds/80),unit:'units'},
    jumbo_drinkers:{min:ceil(birds/100),max:ceil(birds/80),unit:'units'},
    starter_feed_total_kg:{min:round(birds*0.4,1),max:round(birds*0.5,1),unit:'kg total starter phase'},
    daily_feed_kg:null,
    daily_water_l:null,
    source_notes:[
      'Stocking/brooding density: week 1 = 30–40 chicks/m².',
      'Brooding trays: 1 per 50 chicks.',
      'Manual jumbo feeder and pan feeder: 1 per 50–70 chicks.',
      'Chain feeder: 1 linear metre per 80–100 birds.',
      'Nipple drinker: 1 nipple per 12 birds.',
      'Manual 4–5 L drinker and jumbo drinker: 1 per 80–100 birds.',
      'Starter feed total: 400–500 g per bird for the starter phase.'
    ],
    warnings:[...warnings,'Daily feed at a specific age is not activated from the uploaded equation source because its day-based feed/water wording is internally inconsistent. Use an approved breed/region curve or an expert-approved equation before returning a daily feed number.']
  };
}

function normalizeDigits(s:string){
  const ar='٠١٢٣٤٥٦٧٨٩';const fa='۰۱۲۳۴۵۶۷۸۹';
  return s.replace(/[٠-٩]/g,d=>String(ar.indexOf(d))).replace(/[۰-۹]/g,d=>String(fa.indexOf(d))).replace(/،/g,',');
}
function n(v:string|undefined){if(!v)return undefined;const x=Number(v.replace(/,/g,''));return Number.isFinite(x)?x:undefined;}

export function parsePoultrySizingQuestionR81(message:string):PoultrySizingInputR81|null {
  const text=normalizeDigits(String(message||'')).toLowerCase();
  const birdMatch=text.match(/(?:flock(?:\s+of)?|عدد(?:ها|ه)?|العدد|قطيع(?:\s+من)?|عنبر(?:\s+(?:فيه|به))?)\s*[:=-]?\s*([\d,]+)\s*(?:birds?|طيور|طائر|كتكوت|chicks?)?/i)
    || text.match(/([\d,]+)\s*(?:birds?|طيور|طائر|كتكوت|chicks?)/i);
  const ageMatch=text.match(/(?:age|aged|العمر|عمر(?:ها|ه)?)\s*[:=-]?\s*([\d,.]+)\s*(?:days?|day|يوم|ايام|أيام)?/i)
    || text.match(/([\d,.]+)\s*(?:days?\s*old|يوم(?:اً|ا)?\s*(?:من\s*العمر)?)/i);
  const naturalDims=text.match(/([\d,.]+)\s*(?:meters?|metres?|m)\s+(?:long|length).*?([\d,.]+)\s*(?:meters?|metres?|m)\s+(?:wide|width)/i) || text.match(/([\d,.]+)\s*متر\s*(?:طول|طوله).*?([\d,.]+)\s*متر\s*(?:عرض|عرضه)/i);
  let lengthMatch=naturalDims ? [naturalDims[0],naturalDims[1]] as any : text.match(/(?:length|long|طول(?:ه|ها)?|طوله)\s*[:=-]?\s*([\d,.]+)\s*(?:m|meter|meters|متر)?/i);
  let widthMatch=naturalDims ? [naturalDims[0],naturalDims[2]] as any : text.match(/(?:width|wide|عرض(?:ه|ها)?|عرضه)\s*[:=-]?\s*([\d,.]+)\s*(?:m|meter|meters|متر)?/i);
  if(!lengthMatch||!widthMatch){
    const dims=text.match(/([\d,.]+)\s*(?:m|meter|meters|متر)?\s*[x×*]\s*([\d,.]+)\s*(?:m|meter|meters|متر)?/i);
    if(dims){lengthMatch=lengthMatch||dims as any;widthMatch=widthMatch||[dims[0],dims[2]] as any;}
  }
  // Natural English phrasing: "60 meters long and 12 meters wide".
  if(!lengthMatch){const m=text.match(/([\d,.]+)\s*(?:m|meters?|metres?)\s+long/i);if(m)lengthMatch=m as any;}
  if(!widthMatch){const m=text.match(/([\d,.]+)\s*(?:m|meters?|metres?)\s+wide/i);if(m)widthMatch=m as any;}
  // Natural Arabic phrasing: "60 متر طول و12 متر عرض".
  if(!lengthMatch){const m=text.match(/([\d,.]+)\s*متر\s*(?:طول|طوله)/i);if(m)lengthMatch=m as any;}
  if(!widthMatch){const m=text.match(/([\d,.]+)\s*متر\s*(?:عرض|عرضه)/i);if(m)widthMatch=m as any;}
  const birds=n(birdMatch?.[1]);const age=n(ageMatch?.[1]);
  if(!birds||age===undefined)return null;
  return {bird_count:birds,age_days:age,house_length_m:n(lengthMatch?.[1]),house_width_m:n(widthMatch?.[1])};
}

function rangeText(r:RangeR81){return r.min===r.max?`${r.min} ${r.unit}`:`${r.min}–${r.max} ${r.unit}`;}

export function answerPoultrySizingQuestionR81(message:string,language:'ar'|'en'='ar'):{reply:string;result:PoultrySizingResultR81}|null {
  const parsed=parsePoultrySizingQuestionR81(message);if(!parsed)return null;
  const r=calculatePoultrySizingR81(parsed);
  if(language==='en'){
    const reply=[
      `Scientific sizing calculation — ${r.input.bird_count.toLocaleString()} birds, age ${r.input.age_days} days${r.house_area_m2?`, house ${r.input.house_length_m}×${r.input.house_width_m} m (${r.house_area_m2} m²)`:''}.`,
      `• Brooding/occupied area now: ${rangeText(r.required_brooding_area_m2)} based on ${rangeText(r.stocking_density_birds_m2)}.`,
      r.available_area_note?`• ${r.available_area_note}`:'',
      `• Brooding feed trays: ${r.brooding_trays} trays (1/50 chicks).`,
      `• Manual jumbo feeders: ${rangeText(r.manual_jumbo_feeders)}; automatic pan feeders: ${rangeText(r.pan_feeders)}.`,
      `• Chain feeder, if used: ${rangeText(r.chain_feeder_linear_m)}.`,
      `• Nipple drinkers: ${r.nipple_points} nipple points (1/12 birds).`,
      `• Manual 4–5 L drinkers: ${rangeText(r.manual_drinkers_4_5l)}; jumbo drinkers: ${rangeText(r.jumbo_drinkers)}.`,
      `• Starter feed for the starter phase: ${rangeText(r.starter_feed_total_kg)}.`,
      `• Daily feed/water: not returned from the uploaded equation source until the day-based formula is expert-validated; use the approved breed/region curve and actual temperature.`
    ].filter(Boolean).join('\n');return {reply,result:r};
  }
  const reply=[
    `حساب علمي للتجهيز — ${r.input.bird_count.toLocaleString()} طائر، العمر ${r.input.age_days} يوم${r.house_area_m2?`، العنبر ${r.input.house_length_m}×${r.input.house_width_m} م = ${r.house_area_m2} م²`:''}.`,
    `• مساحة التحضين/الإشغال الحالية: ${rangeText(r.required_brooding_area_m2)} بناءً على كثافة ${rangeText(r.stocking_density_birds_m2)}.`,
    r.available_area_note?`• ${r.available_area_note}`:'',
    `• أطباق التحضين للعلف: ${r.brooding_trays} طبق (طبق/50 كتكوت).`,
    `• العلافات الجامبو اليدوية: ${rangeText(r.manual_jumbo_feeders)}؛ البان فيدر الأوتوماتيك: ${rangeText(r.pan_feeders)}.`,
    `• خط الجنزير عند استخدامه: ${rangeText(r.chain_feeder_linear_m)}.`,
    `• النبل: ${r.nipple_points} حلمة (حلمة/12 طائر).`,
    `• المساقي اليدوية 4–5 لتر: ${rangeText(r.manual_drinkers_4_5l)}؛ الجامبو: ${rangeText(r.jumbo_drinkers)}.`,
    `• إجمالي العلف البادي للمرحلة: ${rangeText(r.starter_feed_total_kg)}.`,
    `• العلف/الماء اليومي: لا أعيد رقماً من معادلة اليوم في الملف المرفوع قبل اعتمادها خبيرياً لأن صياغتها تجمع بين العلف والماء بشكل متعارض؛ يستخدم النظام منحنى السلالة/المنطقة المعتمد ودرجة الحرارة الفعلية.`
  ].filter(Boolean).join('\n');return {reply,result:r};
}

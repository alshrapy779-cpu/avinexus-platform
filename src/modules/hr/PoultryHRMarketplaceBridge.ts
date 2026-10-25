export interface PoultryTalentProfileV19 { id:string; name:string; role:'vet'|'worker'|'supervisor'|'sales'|'driver'|'lab'; governorates:string[]; verified:boolean; available:boolean; rating?:number; }
export interface PoultryJobRequestV19 { id:string; farm_or_company:string; role:PoultryTalentProfileV19['role']; governorate:string; district:string; start_date:string; supervised_by_platform:boolean; status:'open'|'matched'|'closed'; }
export function matchPoultryTalentV19(job:PoultryJobRequestV19,profiles:PoultryTalentProfileV19[]){
  return profiles.filter(p=>p.role===job.role&&p.verified&&p.available).sort((a,b)=>Number(b.governorates.includes(job.governorate))-Number(a.governorates.includes(job.governorate))||(b.rating??0)-(a.rating??0));
}

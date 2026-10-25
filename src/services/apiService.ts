/**
 * apiService.ts
 * API Service for the National Smart Poultry Platform
 */

import { DailyLog, NecropsyCase, Prescription, LabSensitivityResult, AcousticAnalysisSession, Farm, Flock, EpidemiologicalOutbreak, EnterpriseOperationsV11State, SupervisionDailyReportV12, FieldDoctorVisitV14, CaseEscalationV14, CloudProductionConfigV14 } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');


export interface EnterpriseAuthSessionV2027 {
  access_token:string;
  refresh_token:string;
  expires_at:string;
  refresh_expires_at:string;
  identity:{user_id:string;username:string;role_code:string;permission_codes:string[]};
}
const AUTH_SESSION_KEY_V2027='spp-auth-session-v20-2-7';
function readAuthSessionV2027():EnterpriseAuthSessionV2027|undefined{
  try{const raw=typeof sessionStorage!=='undefined'?sessionStorage.getItem(AUTH_SESSION_KEY_V2027):null;return raw?JSON.parse(raw):undefined;}catch{return undefined;}
}
function writeAuthSessionV2027(session?:EnterpriseAuthSessionV2027){
  try{if(typeof sessionStorage==='undefined')return;if(session)sessionStorage.setItem(AUTH_SESSION_KEY_V2027,JSON.stringify(session));else sessionStorage.removeItem(AUTH_SESSION_KEY_V2027);}catch{/* session storage unavailable */}
}
function deviceIdV2027(){
  try{if(typeof sessionStorage==='undefined')return 'windows-web';let id=sessionStorage.getItem('spp-device-id-v20-2-7');if(!id){id=`web-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;sessionStorage.setItem('spp-device-id-v20-2-7',id);}return id;}catch{return 'windows-web';}
}

function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

async function refreshEnterpriseAuthV2027(): Promise<EnterpriseAuthSessionV2027|undefined> {
  const current=readAuthSessionV2027();
  if(!current?.refresh_token)return undefined;
  try{
    const res=await fetch(apiUrl('/api/v20.2.7/auth/refresh'),{method:'POST',headers:{'Content-Type':'application/json','X-Device-Id':deviceIdV2027()},body:JSON.stringify({refresh_token:current.refresh_token,device_id:deviceIdV2027()})});
    if(!res.ok){writeAuthSessionV2027(undefined);return undefined;}
    const data=await res.json();
    const next:EnterpriseAuthSessionV2027={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:data.expires_at,refresh_expires_at:data.refresh_expires_at,identity:data.identity};
    writeAuthSessionV2027(next);return next;
  }catch{return undefined;}
}

async function apiFetch(path: string, init?: RequestInit, timeoutMs = 20000, allowRefresh = true): Promise<Response> {
  const controller = new AbortController();
  const externalSignal = init?.signal;
  const abortFromExternal = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', abortFromExternal, { once: true });
  }
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const session=readAuthSessionV2027();
    const headers=new Headers(init?.headers||{});
    if(session?.access_token&&!headers.has('Authorization'))headers.set('Authorization',`Bearer ${session.access_token}`);
    if(!headers.has('X-Device-Id'))headers.set('X-Device-Id',deviceIdV2027());
    const response=await fetch(apiUrl(path), { ...init, headers, signal: controller.signal });
    if(response.status===401&&allowRefresh&&session?.refresh_token&&!path.includes('/auth/')){
      const refreshed=await refreshEnterpriseAuthV2027();
      if(refreshed){
        clearTimeout(timer);
        externalSignal?.removeEventListener?.('abort', abortFromExternal);
        return apiFetch(path,init,timeoutMs,false);
      }
    }
    return response;
  } catch (error) {
    if (controller.signal.aborted) throw new Error(`API request timeout/aborted after ${timeoutMs}ms: ${path}`);
    throw error;
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener?.('abort', abortFromExternal);
  }
}


export const apiService = {
  async getR7MasterIdentity():Promise<{offices:any[];organizations:any[];branches:any[];governorates:string[];contracts:any[];offers:any[];regional_markets:any[];market_prices:any[];price_change_history:any[]}> {
    const res=await apiFetch('/api/r7/master/identity');
    if(!res.ok)throw new Error(`r7_identity_http_${res.status}`);
    return res.json();
  },
  async createR7Office(office:{code:string;name:string;office_type:string;governorate:string;district:string;address:string;phone:string;manager_name:string;responsible_roles:string[];warehouse_ids:string[];status:string}):Promise<void> {
    const res=await apiFetch('/api/r7/master/offices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(office)});
    if(!res.ok)throw new Error(`r7_office_create_http_${res.status}: ${await res.text()}`);
  },
  async renameR7Office(id:string,name:string):Promise<void> {
    const res=await apiFetch(`/api/r7/master/offices/${encodeURIComponent(id)}/name`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
    if(!res.ok)throw new Error(`r7_office_rename_http_${res.status}: ${await res.text()}`);
  },
  async createR7Governorate(name:string):Promise<void> {
    const res=await apiFetch('/api/r7/master/governorates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
    if(!res.ok)throw new Error(`r7_governorate_http_${res.status}: ${await res.text()}`);
  },
  async saveR7Branch(branch:{id?:string;organization_id:string;name:string;governorate:string;district:string;phone:string}):Promise<void> {
    const url=branch.id?`/api/r7/master/branches/${encodeURIComponent(branch.id)}`:'/api/r7/master/branches';
    const res=await apiFetch(url,{method:branch.id?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(branch)});
    if(!res.ok)throw new Error(`r7_branch_http_${res.status}: ${await res.text()}`);
  },
  async createR7MarketingCompany(company:{code:string;name:string;phone:string;governorates_served:string[];preferred_currency:'SAR'|'USD'|'YER_NEW'|'YER_OLD';credit_days:number;contact_name:string;payment_terms:string}):Promise<void> {
    const res=await apiFetch('/api/r7/master/marketing-companies',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(company)});
    if(!res.ok)throw new Error(`r7_marketing_company_http_${res.status}: ${await res.text()}`);
  },
  async saveR7Offer(offer:{id?:string;organization_id:string;sku:string;item_name:string;category:string;contract_price:number;currency:'SAR'|'USD'|'YER_NEW'|'YER_OLD';note?:string;expected_contract_price?:number;expected_currency?:'SAR'|'USD'|'YER_NEW'|'YER_OLD'}):Promise<void> {
    const url=offer.id?`/api/r7/master/offers/${encodeURIComponent(offer.id)}`:'/api/r7/master/offers';
    const res=await apiFetch(url,{method:offer.id?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(offer)});
    if(!res.ok)throw new Error(`r7_offer_http_${res.status}: ${await res.text()}`);
  },
  async createR7Market(market:{name:string;governorate:string;market_type:'poultry_live'|'chicks'|'feed'|'mixed';district?:string;address?:string;phone?:string}):Promise<void> {
    const res=await apiFetch('/api/r7/master/markets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(market)});
    if(!res.ok)throw new Error(`r7_market_create_http_${res.status}: ${await res.text()}`);
  },
  async setR7MarketActive(id:string,active:boolean):Promise<void> {
    const res=await apiFetch(`/api/r7/master/markets/${encodeURIComponent(id)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({active})});
    if(!res.ok)throw new Error(`r7_market_status_http_${res.status}: ${await res.text()}`);
  },
  async addR7MarketPrice(price:{market_id:string;date:string;category:'broiler_live_kg'|'chick'|'feed_starter'|'feed_grower'|'feed_finisher'|'other';value:number;currency:'SAR'|'USD'|'YER_NEW'|'YER_OLD';trend:'up'|'stable'|'down'}):Promise<void> {
    const res=await apiFetch('/api/r7/master/market-prices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(price)});
    if(!res.ok)throw new Error(`r7_market_price_http_${res.status}: ${await res.text()}`);
  },
  async createR7Contract(contract:{contract_number:string;organization_id:string;office_id?:string;title:string;start_date:string;end_date?:string;currencies:Array<'SAR'|'USD'|'YER_NEW'|'YER_OLD'>;credit_days:number;tax_percent:number;payment_terms:string}):Promise<void> {
    const res=await apiFetch('/api/r7/master/contracts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(contract)});
    if(!res.ok)throw new Error(`r7_contract_create_http_${res.status}: ${await res.text()}`);
  },
  async reviseR7Contract(id:string,revision:{expected_version:number;effective_from:string;note:string;status?:'draft'|'active'|'expired'|'terminated';payment_terms?:string}):Promise<void> {
    const res=await apiFetch(`/api/r7/master/contracts/${encodeURIComponent(id)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(revision)});
    if(!res.ok)throw new Error(`r7_contract_revision_http_${res.status}: ${await res.text()}`);
  },
  async getAuthorizedContractedOfficesV2026(signal?:AbortSignal):Promise<Array<{id:string;code:string;name:string}>> {
    const res=await apiFetch('/api/v20.2.3/contracted-offices/authorized',{signal});
    if(!res.ok)throw new Error(`authorized_offices_http_${res.status}`);
    const body=await res.json();return body.offices;
  },
  async getContractedOfficeWorkspaceV2026(officeId:string, signal?:AbortSignal):Promise<any> {
    const res=await apiFetch(`/api/v20.2.3/contracted-office/${encodeURIComponent(officeId)}/workspace`,{signal});
    if(!res.ok)throw new Error(`office_workspace_http_${res.status}`);
    const body=await res.json();return body.workspace;
  },
  async getContractedOfficeTreasuryV2026(officeId:string, signal?:AbortSignal):Promise<any> {
    const res=await apiFetch(`/api/v20.2.3/contracted-office/${encodeURIComponent(officeId)}/treasury-reconciliation`,{signal});
    if(!res.ok)throw new Error(`office_treasury_http_${res.status}`);
    const body=await res.json();return body.reconciliation;
  },
  getStoredAuthSessionV2027():EnterpriseAuthSessionV2027|undefined { return readAuthSessionV2027(); },

  async getAuthStatusV2027():Promise<{version:string;ready:boolean;environment:string;bootstrap_configured:boolean;refresh_sessions_supported?:boolean}> {
    const res=await apiFetch('/api/v20.2.1/auth/status',undefined,10000,false);
    if(!res.ok)throw new Error('auth_status_unavailable');
    return await res.json();
  },

  async loginEnterpriseV2027(username:string,password:string):Promise<EnterpriseAuthSessionV2027> {
    const res=await apiFetch('/api/v20.2.1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password,device_id:deviceIdV2027(),device_name:'Windows/Web Workspace',trusted_device:true})},15000,false);
    const data=await res.json();if(!res.ok)throw new Error(data.error||'login_failed');
    const session:EnterpriseAuthSessionV2027={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:data.expires_at,refresh_expires_at:data.refresh_expires_at,identity:data.identity};
    writeAuthSessionV2027(session);return session;
  },

  async refreshEnterpriseV2027():Promise<EnterpriseAuthSessionV2027|undefined> { return refreshEnterpriseAuthV2027(); },

  async getAuthMeV2027():Promise<any> {
    const res=await apiFetch('/api/v20.2.1/auth/me');if(!res.ok)throw new Error('authentication_required');return await res.json();
  },

  async logoutEnterpriseV2027():Promise<void> {
    const session=readAuthSessionV2027();
    try{await apiFetch('/api/v20.2.1/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session?.refresh_token})},10000,false);}catch{/* local logout still proceeds */}
    writeAuthSessionV2027(undefined);
  },
  async getHealth() {
    try {
      const res = await apiFetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'offline', supervisor: 'الطبيب البيطري الاستشاري المعتمد' };
    }
  },

  async getFarms(): Promise<Farm[]> {
    const res = await apiFetch('/api/farms');
    return await res.json();
  },

  async updateFarmBiosecurity(farmId: string, score: number): Promise<{ success: boolean; farm: Farm }> {
    const res = await apiFetch(`/api/farms/${farmId}/biosecurity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score })
    });
    return await res.json();
  },

  async getOutbreaks(): Promise<EpidemiologicalOutbreak[]> {
    const res = await apiFetch('/api/outbreaks');
    return await res.json();
  },

  async broadcastOutbreakAlert(outbreakId: string): Promise<{ success: boolean; outbreak: EpidemiologicalOutbreak }> {
    const res = await apiFetch(`/api/outbreaks/${outbreakId}/broadcast`, {
      method: 'POST'
    });
    return await res.json();
  },

  async getFlocks(): Promise<Flock[]> {
    const res = await apiFetch('/api/flocks');
    return await res.json();
  },

  async getDailyLogs(flockId?: string): Promise<DailyLog[]> {
    const url = flockId ? `/api/daily-logs?flockId=${encodeURIComponent(flockId)}` : '/api/daily-logs';
    const res = await apiFetch(url);
    return await res.json();
  },

  async addDailyLog(log: Omit<DailyLog, 'id' | 'synced'>): Promise<DailyLog> {
    const res = await apiFetch('/api/daily-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    return await res.json();
  },

  async getNecropsyCases(): Promise<NecropsyCase[]> {
    const res = await apiFetch('/api/necropsy-cases');
    return await res.json();
  },

  async addNecropsyCase(caseData: Omit<NecropsyCase, 'id' | 'created_at'>): Promise<NecropsyCase> {
    const res = await apiFetch('/api/necropsy-cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });
    return await res.json();
  },

  async updateNecropsyCase(id: string, updates: Partial<NecropsyCase>): Promise<NecropsyCase> {
    const res = await apiFetch(`/api/necropsy-cases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async getLabReports(): Promise<LabSensitivityResult[]> {
    const res = await apiFetch('/api/lab-reports');
    return await res.json();
  },

  async getPrescriptions(): Promise<Prescription[]> {
    const res = await apiFetch('/api/prescriptions');
    return await res.json();
  },

  async createPrescription(rxData: Partial<Prescription>): Promise<{ success: boolean; data?: Prescription; error?: string }> {
    const res = await apiFetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rxData)
    });
    const result = await res.json();
    if (!res.ok) {
      return { success: false, error: result.error || 'حدث خطأ في قفل الوصفة الطبية' };
    }
    return { success: true, data: result };
  },

  async getAcousticSessions(): Promise<AcousticAnalysisSession[]> {
    const res = await apiFetch('/api/acoustic-sessions');
    return await res.json();
  },

  async recordAcousticSession(sessionData: Omit<AcousticAnalysisSession, 'id'>): Promise<AcousticAnalysisSession> {
    const res = await apiFetch('/api/acoustic-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    return await res.json();
  },

  // AI Service Calls
  async analyzeNecropsyAI(payload: { observations: any[]; bird_age_days: number; breed: string; flock_context?: string }) {
    const res = await apiFetch('/api/ai/necropsy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async analyzeAcousticAI(payload: { snick_count: number; sneeze_count: number; duration_seconds: number; time_of_recording: string; ambient_notes?: string }) {
    const res = await apiFetch('/api/ai/acoustic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async parseVoiceLogAI(voice_text: string) {
    const res = await apiFetch('/api/ai/voice-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice_text })
    });
    return await res.json();
  },

  async poultryAdvisorAI(payload: { message: string; customer_context?: Record<string, unknown>; flock_context?: Record<string, unknown> }): Promise<{ reply: string; requires_vet_escalation: boolean; intent: string; suggested_actions: string[] }> {
    const res = await apiFetch('/api/ai/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, 9000);
    if (!res.ok) throw new Error('AI advisor backend unavailable');
    return await res.json();
  },

  async getWeatherR81(payload:{site_id:string;latitude:number;longitude:number}):Promise<any>{
    const q=new URLSearchParams({site_id:payload.site_id,lat:String(payload.latitude),lon:String(payload.longitude)});
    const res=await apiFetch(`/api/r8.1/weather?${q.toString()}`,undefined,12000);
    if(!res.ok)throw new Error('r8_1_weather_unavailable');
    return await res.json();
  },

  async analyzeOperationalR81(payload:{message:string;flock_cycle_id:string;site_id?:string;house_id?:string}):Promise<{reply:string;requires_vet_escalation:boolean;severity:string;provenance:string[];suggested_actions:string[]}>{
    const res=await apiFetch('/api/r8.1/intelligence/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)},20000);
    const data=await res.json();
    if(!res.ok)throw new Error(data.error||'r8_1_intelligence_unavailable');
    return data;
  },
  async getEnterpriseV11(): Promise<EnterpriseOperationsV11State> {
    const res = await apiFetch('/api/v11/enterprise');
    if (!res.ok) throw new Error('V11 backend unavailable');
    return await res.json();
  },

  async saveEnterpriseV11(state: EnterpriseOperationsV11State): Promise<EnterpriseOperationsV11State> {
    const res = await apiFetch('/api/v11/enterprise', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'system_owner' },
      body: JSON.stringify(state)
    });
    if (!res.ok) throw new Error('Unable to persist V11 enterprise state');
    const data = await res.json();
    return data.enterprise;
  },

  async syncEnterpriseV11(): Promise<{ success: boolean; synced_at: string }> {
    const res = await apiFetch('/api/v11/enterprise/sync', { method: 'POST' });
    return await res.json();
  },

  async getDueSupervisionReports(): Promise<{ generated_at: string; due: Array<Record<string, unknown>> }> {
    const res = await apiFetch('/api/v12/supervision/due');
    if (!res.ok) throw new Error('Unable to load due supervision reports');
    return await res.json();
  },

  async submitSupervisionReport(payload: Partial<SupervisionDailyReportV12> & { contract_id: string }): Promise<{ success: boolean; report: SupervisionDailyReportV12; assigned_vet: { id?: string; name: string } }> {
    const res = await apiFetch('/api/v12/supervision/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'supervisor' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Unable to submit supervision report');
    return await res.json();
  },

  async getFieldVisitsV14(): Promise<FieldDoctorVisitV14[]> {
    const res = await apiFetch('/api/v14/field-visits');
    if (!res.ok) throw new Error('Unable to load V14 field visits');
    return await res.json();
  },

  async createFieldVisitV14(payload: Partial<FieldDoctorVisitV14>): Promise<{ success: boolean; visit: FieldDoctorVisitV14 }> {
    const res = await apiFetch('/api/v14/field-visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'field_vet' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Unable to create V14 field visit');
    return await res.json();
  },

  async escalateFieldVisitV14(visitId: string, payload: Partial<CaseEscalationV14>): Promise<{ success: boolean; escalation: CaseEscalationV14 }> {
    const res = await apiFetch(`/api/v14/field-visits/${visitId}/escalate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'field_vet' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Unable to escalate V14 field visit');
    return await res.json();
  },

  async getCloudReadinessV14(): Promise<{ config: CloudProductionConfigV14; production_ready: boolean; note: string }> {
    const res = await apiFetch('/api/v14/cloud-readiness');
    if (!res.ok) throw new Error('Unable to load V14 cloud readiness');
    return await res.json();
  },

  async syncEnterpriseV15(state: EnterpriseOperationsV11State): Promise<{ success: boolean; server_revision: number; synced_at?: string; enterprise: EnterpriseOperationsV11State; conflict?: boolean }> {
    const res = await apiFetch('/api/v15/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'system_owner', 'x-device-id': state.offline_sync_v15.device_id },
      body: JSON.stringify({ enterprise: state, base_revision: state.offline_sync_v15.client_revision, strategy: state.offline_sync_v15.conflict_strategy, client_updated_at: new Date().toISOString() })
    });
    const data = await res.json();
    if (!res.ok && res.status !== 409) throw new Error(data.error || 'V15 sync failed');
    return data;
  },

  async getSyncStatusV15(): Promise<{ online:boolean;server_revision:number;last_sync_at?:string;unresolved_conflicts:number }> {
    const res = await apiFetch('/api/v15/sync/status');
    if (!res.ok) throw new Error('V15 sync status unavailable');
    return await res.json();
  },

  async getLiveControlCenterV16() {
    const res = await apiFetch('/api/v16/live-control-center');
    if (!res.ok) throw new Error('V16 live control center unavailable');
    return await res.json();
  },

  async updateFieldPositionV16(payload: Record<string, unknown>) {
    const res = await apiFetch('/api/v16/field-position', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'field_app' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Unable to update V16 field position');
    return await res.json();
  },

  async createSmartRouteV16(payload: Record<string, unknown>) {
    const res = await apiFetch('/api/v16/smart-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'operations' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unable to create smart route');
    return data;
  },

  async queueCommunicationV16(payload: Record<string, unknown>) {
    const res = await apiFetch('/api/v16/communications/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'communications' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Unable to queue V16 communication');
    return await res.json();
  },

  async sendCommunicationV16(messageId: string) {
    const res = await apiFetch('/api/v16/communications/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message_id: messageId })
    });
    return await res.json();
  },

  async getCommandCenterV19() {
    const res = await apiFetch('/api/v19/command-center');
    if (!res.ok) throw new Error('V19 command center unavailable');
    return await res.json();
  },

  async routeLogisticsV19(payload: Record<string, unknown>) {
    const res = await apiFetch('/api/v19/logistics/route', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'operations' }, body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'V19 logistics routing failed');
    return data;
  },

  async assignFreelanceVetV19(governorate: string, district: string) {
    const res = await apiFetch('/api/v19/field-vets/assign', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'operations' }, body: JSON.stringify({ governorate, district })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'V19 vet assignment failed');
    return data;
  },

  async verifyHealthyPoultryQrV19(qrCode: string) {
    const res = await apiFetch(`/api/v19/quality/${encodeURIComponent(qrCode)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'V19 public verification failed');
    return data;
  },

  async confirmProofOfDeliveryV19(id: string, received_quantity: number, confirmed_by: string, discrepancy_note?: string) {
    const res = await apiFetch(`/api/v19/pod/${encodeURIComponent(id)}/confirm`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'branch_manager' },
      body: JSON.stringify({ received_quantity, confirmed_by, discrepancy_note })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'V19 POD confirmation failed');
    return data;
  },

  async getSovereigntyStateV19() {
    const res = await apiFetch('/api/v19/state');
    if (!res.ok) throw new Error('V19 sovereignty state unavailable');
    return await res.json();
  },

  async getInventoryAttestationsV19() {
    const res = await apiFetch('/api/v19/inventory/attestations');
    if (!res.ok) throw new Error('V19 inventory attestations unavailable');
    return await res.json();
  },

  async validateTransitPermitV19(permit: Record<string, unknown>) {
    const res = await apiFetch('/api/v19/biosecurity/transit/validate', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({permit})});
    const data=await res.json(); if(!res.ok)throw new Error(data.error||'V19 transit validation failed'); return data;
  },

  async profitabilityCheckV19(payload: Record<string, unknown>) {
    const res = await apiFetch('/api/v19/finance/profitability-check', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json(); if(!res.ok)throw new Error(data.error||'V19 profitability check failed'); return data;
  },

  async parseFieldChatV19(text: string) {
    const res = await apiFetch('/api/v19/chat/parse', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
    const data=await res.json(); if(!res.ok)throw new Error(data.error||'V19 chat parse failed'); return data;
  }

};

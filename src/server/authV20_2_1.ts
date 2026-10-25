import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface CredentialRecordV2021 {
  id:string;
  user_id:string;
  username:string;
  role_code:string;
  permission_codes:string[];
  password_salt:string;
  password_hash:string;
  password_iterations:number;
  password_digest:'sha512';
  disabled:boolean;
  auth_version:number;
  failed_attempts:number;
  locked_until?:string;
  created_at:string;
  password_changed_at:string;
}

export interface RevokedSessionV2021 { jti:string; revoked_at:string; expires_at:string; reason:string; }
export interface RefreshSessionV2027 { id:string; user_id:string; username:string; auth_version:number; token_hash:string; issued_at:string; expires_at:string; device_id?:string; revoked_at?:string; revoke_reason?:string; rotated_from_id?:string; }
export interface AuthStoreV2021 { version:'20.2.1'; credentials:CredentialRecordV2021[]; revoked_sessions:RevokedSessionV2021[]; refresh_sessions:RefreshSessionV2027[]; }
export interface AuthClaimsV2021 { sub:string; username:string; role_code:string; permission_codes:string[]; auth_version:number; iat:number; exp:number; jti:string; }

export interface AuthRuntimeV2021 {
  environment:string;
  secret:string;
  token_ttl_seconds:number;
  auth_file:string;
  ready:boolean;
  readiness_errors:string[];
}

const PBKDF2_ITERATIONS=210000;
const TOKEN_ALG='HS256';
const b64=(value:Buffer|string)=>Buffer.from(value).toString('base64url');
const utc=()=>new Date().toISOString();

export function buildAuthRuntimeV2021(runtimeDataDir:string,environment:string):AuthRuntimeV2021{
  const configuredSecret=String(process.env.SPP_AUTH_SECRET||'');
  const production=environment==='PRODUCTION';
  const readiness_errors:string[]=[];
  let secret=configuredSecret;
  if(production&&configuredSecret.length<32) readiness_errors.push('SPP_AUTH_SECRET_must_be_at_least_32_characters_in_production');
  if(!production&&secret.length<32) secret=crypto.randomBytes(48).toString('hex');
  const token_ttl_seconds=Math.max(300,Math.min(Number(process.env.SPP_AUTH_TOKEN_TTL_SECONDS||28800),86400));
  return {environment,secret,token_ttl_seconds,auth_file:path.join(runtimeDataDir,`auth-v20-2-1-${environment.toLowerCase()}.json`),ready:readiness_errors.length===0,readiness_errors};
}

export function loadAuthStoreV2021(runtime:AuthRuntimeV2021):AuthStoreV2021{
  try{
    if(fs.existsSync(runtime.auth_file)){
      const parsed=JSON.parse(fs.readFileSync(runtime.auth_file,'utf8')) as Partial<AuthStoreV2021>;
      const credentials=(Array.isArray(parsed.credentials)?parsed.credentials:[]).map((c:any)=>({...c,auth_version:Number(c.auth_version||1)}));
      return {version:'20.2.1',credentials,revoked_sessions:Array.isArray(parsed.revoked_sessions)?parsed.revoked_sessions:[],refresh_sessions:Array.isArray((parsed as any).refresh_sessions)?(parsed as any).refresh_sessions:[]};
    }
  }catch(error){
    console.warn('Unable to load V20.2.1 auth store:',error);
  }
  return {version:'20.2.1',credentials:[],revoked_sessions:[],refresh_sessions:[]};
}

export function saveAuthStoreV2021(runtime:AuthRuntimeV2021,store:AuthStoreV2021):void{
  const dir=path.dirname(runtime.auth_file); if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  const tmp=`${runtime.auth_file}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify({...store,version:'20.2.1'},null,2),{encoding:'utf8',mode:0o600});
  fs.renameSync(tmp,runtime.auth_file);
  try{fs.chmodSync(runtime.auth_file,0o600);}catch{/* Windows/limited FS may not apply POSIX mode. */}
}

function passwordDigest(password:string,saltHex:string,iterations=PBKDF2_ITERATIONS):string{
  return crypto.pbkdf2Sync(password,Buffer.from(saltHex,'hex'),iterations,64,'sha512').toString('hex');
}

export function createCredentialV2021(store:AuthStoreV2021,input:{user_id:string;username:string;role_code:string;permission_codes?:string[];password:string}):AuthStoreV2021{
  const username=input.username.trim().toLowerCase();
  if(username.length<3) throw new Error('username_too_short');
  if(input.password.length<12) throw new Error('password_must_be_at_least_12_characters');
  if(store.credentials.some(c=>c.username===username)) throw new Error('username_exists');
  const salt=crypto.randomBytes(16).toString('hex');
  const created=utc();
  const row:CredentialRecordV2021={id:`cred-${crypto.randomUUID()}`,user_id:input.user_id,username,role_code:input.role_code,permission_codes:input.permission_codes||[],password_salt:salt,password_hash:passwordDigest(input.password,salt),password_iterations:PBKDF2_ITERATIONS,password_digest:'sha512',disabled:false,auth_version:1,failed_attempts:0,created_at:created,password_changed_at:created};
  return {...store,credentials:[row,...store.credentials]};
}

export function ensureBootstrapCredentialV2021(runtime:AuthRuntimeV2021,store:AuthStoreV2021,input:{user_id:string;role_code:string;permission_codes?:string[]}):{store:AuthStoreV2021;created:boolean}{
  if(store.credentials.length) return {store,created:false};
  const username=String(process.env.SPP_BOOTSTRAP_ADMIN_USER||'').trim();
  const password=String(process.env.SPP_BOOTSTRAP_ADMIN_PASSWORD||'');
  if(!username||!password) return {store,created:false};
  const next=createCredentialV2021(store,{user_id:input.user_id,username,role_code:input.role_code,permission_codes:input.permission_codes||['*'],password});
  saveAuthStoreV2021(runtime,next);
  return {store:next,created:true};
}

export function verifyPasswordV2021(store:AuthStoreV2021,usernameInput:string,password:string):{store:AuthStoreV2021;credential?:CredentialRecordV2021;ok:boolean;reason:string}{
  const username=usernameInput.trim().toLowerCase();
  const credential=store.credentials.find(c=>c.username===username);
  if(!credential) return {store,ok:false,reason:'invalid_credentials'};
  if(credential.disabled) return {store,ok:false,reason:'credential_disabled'};
  if(credential.locked_until&&new Date(credential.locked_until)>new Date()) return {store,ok:false,reason:'credential_temporarily_locked'};
  const derived=passwordDigest(password,credential.password_salt,credential.password_iterations);
  const a=Buffer.from(derived,'hex'),b=Buffer.from(credential.password_hash,'hex');
  const ok=a.length===b.length&&crypto.timingSafeEqual(a,b);
  const failed=ok?0:credential.failed_attempts+1;
  const locked_until=!ok&&failed>=5?new Date(Date.now()+15*60*1000).toISOString():undefined;
  const updated={...credential,failed_attempts:failed,locked_until:ok?undefined:locked_until||credential.locked_until};
  const next={...store,credentials:store.credentials.map(c=>c.id===credential.id?updated:c)};
  return {store:next,credential:ok?updated:undefined,ok,reason:ok?'ok':'invalid_credentials'};
}

function signPart(secret:string,headerPart:string,payloadPart:string):string{
  return crypto.createHmac('sha256',secret).update(`${headerPart}.${payloadPart}`).digest('base64url');
}

export function issueAccessTokenV2021(runtime:AuthRuntimeV2021,credential:CredentialRecordV2021):{token:string;claims:AuthClaimsV2021}{
  if(!runtime.ready) throw new Error(`auth_runtime_not_ready:${runtime.readiness_errors.join(',')}`);
  const nowSec=Math.floor(Date.now()/1000);
  const claims:AuthClaimsV2021={sub:credential.user_id,username:credential.username,role_code:credential.role_code,permission_codes:credential.permission_codes,auth_version:credential.auth_version,iat:nowSec,exp:nowSec+runtime.token_ttl_seconds,jti:crypto.randomUUID()};
  const headerPart=b64(JSON.stringify({alg:TOKEN_ALG,typ:'JWT',ver:'20.2.1'}));
  const payloadPart=b64(JSON.stringify(claims));
  const signature=signPart(runtime.secret,headerPart,payloadPart);
  return {token:`${headerPart}.${payloadPart}.${signature}`,claims};
}

export function verifyAccessTokenV2021(runtime:AuthRuntimeV2021,store:AuthStoreV2021,token:string):{ok:boolean;reason:string;claims?:AuthClaimsV2021}{
  if(!runtime.ready) return {ok:false,reason:'auth_runtime_not_ready'};
  const parts=token.split('.'); if(parts.length!==3) return {ok:false,reason:'invalid_token_format'};
  const [headerPart,payloadPart,signature]=parts;
  const expected=signPart(runtime.secret,headerPart,payloadPart);
  const a=Buffer.from(signature),b=Buffer.from(expected); if(a.length!==b.length||!crypto.timingSafeEqual(a,b)) return {ok:false,reason:'invalid_token_signature'};
  try{
    const header=JSON.parse(Buffer.from(headerPart,'base64url').toString('utf8'));
    if(header.alg!==TOKEN_ALG) return {ok:false,reason:'invalid_token_algorithm'};
    const claims=JSON.parse(Buffer.from(payloadPart,'base64url').toString('utf8')) as AuthClaimsV2021;
    if(!claims.sub||!claims.jti||!claims.exp) return {ok:false,reason:'invalid_token_claims'};
    if(claims.exp<=Math.floor(Date.now()/1000)) return {ok:false,reason:'token_expired'};
    if(store.revoked_sessions.some(r=>r.jti===claims.jti)) return {ok:false,reason:'token_revoked'};
    const credential=store.credentials.find(c=>c.user_id===claims.sub&&c.username===claims.username&&!c.disabled);
    if(!credential) return {ok:false,reason:'credential_not_active'};
    if(Number(claims.auth_version)!==Number(credential.auth_version)) return {ok:false,reason:'session_version_revoked'};
    return {ok:true,reason:'ok',claims};
  }catch{return {ok:false,reason:'invalid_token_payload'};}
}

export function revokeAccessTokenV2021(store:AuthStoreV2021,claims:AuthClaimsV2021,reason='logout'):AuthStoreV2021{
  const expires_at=new Date(claims.exp*1000).toISOString();
  const clean=store.revoked_sessions.filter(r=>new Date(r.expires_at)>new Date());
  if(clean.some(r=>r.jti===claims.jti)) return {...store,revoked_sessions:clean};
  return {...store,revoked_sessions:[{jti:claims.jti,revoked_at:utc(),expires_at,reason},...clean]};
}

export function changeCredentialPasswordV2021(store:AuthStoreV2021,userId:string,newPassword:string):AuthStoreV2021{
  if(newPassword.length<12) throw new Error('password_must_be_at_least_12_characters');
  const credential=store.credentials.find(c=>c.user_id===userId); if(!credential) throw new Error('credential_not_found');
  const salt=crypto.randomBytes(16).toString('hex');
  const updated:CredentialRecordV2021={...credential,password_salt:salt,password_hash:passwordDigest(newPassword,salt),password_iterations:PBKDF2_ITERATIONS,password_digest:'sha512',failed_attempts:0,locked_until:undefined,password_changed_at:utc(),auth_version:Number(credential.auth_version||1)+1};
  return {...store,credentials:store.credentials.map(c=>c.id===credential.id?updated:c)};
}

export function setCredentialDisabledV2021(store:AuthStoreV2021,userId:string,disabled:boolean):AuthStoreV2021{
  const credential=store.credentials.find(c=>c.user_id===userId); if(!credential) throw new Error('credential_not_found');
  const updated:CredentialRecordV2021={...credential,disabled,auth_version:Number(credential.auth_version||1)+1,failed_attempts:0,locked_until:undefined};
  return {...store,credentials:store.credentials.map(c=>c.id===credential.id?updated:c)};
}


function refreshTokenHashV2027(token:string):string{
  return crypto.createHash('sha256').update(token).digest('hex');
}

function refreshTtlMsV2027():number{
  const days=Math.max(1,Math.min(Number(process.env.SPP_AUTH_REFRESH_TTL_DAYS||30),90));
  return days*24*60*60*1000;
}

export function issueRefreshSessionV2027(runtime:AuthRuntimeV2021,store:AuthStoreV2021,credential:CredentialRecordV2021,deviceId?:string,rotatedFromId?:string):{store:AuthStoreV2021;refresh_token:string;session:RefreshSessionV2027}{
  if(!runtime.ready) throw new Error(`auth_runtime_not_ready:${runtime.readiness_errors.join(',')}`);
  const refresh_token=crypto.randomBytes(48).toString('base64url');
  const issued_at=utc(),expires_at=new Date(Date.now()+refreshTtlMsV2027()).toISOString();
  const session:RefreshSessionV2027={id:`refresh-${crypto.randomUUID()}`,user_id:credential.user_id,username:credential.username,auth_version:credential.auth_version,token_hash:refreshTokenHashV2027(refresh_token),issued_at,expires_at,device_id:deviceId,rotated_from_id:rotatedFromId};
  const clean=(store.refresh_sessions||[]).filter(s=>new Date(s.expires_at)>new Date()&&(!s.revoked_at||new Date(s.revoked_at)>new Date(Date.now()-7*24*60*60*1000)));
  return {store:{...store,refresh_sessions:[session,...clean]},refresh_token,session};
}

export function rotateRefreshSessionV2027(runtime:AuthRuntimeV2021,store:AuthStoreV2021,refreshToken:string,deviceId?:string):{store:AuthStoreV2021;access_token:string;refresh_token:string;claims:AuthClaimsV2021;session:RefreshSessionV2027}{
  const hash=refreshTokenHashV2027(refreshToken);
  const old=(store.refresh_sessions||[]).find(s=>s.token_hash===hash);
  if(!old) throw new Error('refresh_session_not_found');
  if(old.revoked_at) throw new Error('refresh_session_revoked');
  if(new Date(old.expires_at)<=new Date()) throw new Error('refresh_session_expired');
  if(deviceId&&old.device_id&&deviceId!==old.device_id) throw new Error('refresh_device_mismatch');
  const credential=store.credentials.find(c=>c.user_id===old.user_id&&c.username===old.username&&!c.disabled);
  if(!credential) throw new Error('credential_not_active');
  if(Number(credential.auth_version)!==Number(old.auth_version)) throw new Error('refresh_session_version_revoked');
  const revoked:RefreshSessionV2027={...old,revoked_at:utc(),revoke_reason:'rotated'};
  let nextStore={...store,refresh_sessions:(store.refresh_sessions||[]).map(s=>s.id===old.id?revoked:s)};
  const issued=issueAccessTokenV2021(runtime,credential);
  const refreshed=issueRefreshSessionV2027(runtime,nextStore,credential,deviceId||old.device_id,old.id);
  nextStore=refreshed.store;
  return {store:nextStore,access_token:issued.token,refresh_token:refreshed.refresh_token,claims:issued.claims,session:refreshed.session};
}

export function revokeRefreshSessionV2027(store:AuthStoreV2021,refreshToken:string,reason='logout'):AuthStoreV2021{
  const hash=refreshTokenHashV2027(refreshToken);
  return {...store,refresh_sessions:(store.refresh_sessions||[]).map(s=>s.token_hash===hash&&!s.revoked_at?{...s,revoked_at:utc(),revoke_reason:reason}:s)};
}

export function revokeUserRefreshSessionsV2027(store:AuthStoreV2021,userId:string,reason='security_change'):AuthStoreV2021{
  return {...store,refresh_sessions:(store.refresh_sessions||[]).map(s=>s.user_id===userId&&!s.revoked_at?{...s,revoked_at:utc(),revoke_reason:reason}:s)};
}

export function publicAuthStatusV2021(runtime:AuthRuntimeV2021,store:AuthStoreV2021){
  return {version:'20.2.7-security',ready:runtime.ready,environment:runtime.environment,credential_count:store.credentials.filter(c=>!c.disabled).length,bootstrap_configured:store.credentials.length>0,refresh_sessions_supported:true,active_refresh_sessions:(store.refresh_sessions||[]).filter(s=>!s.revoked_at&&new Date(s.expires_at)>new Date()).length,readiness_errors:runtime.readiness_errors};
}

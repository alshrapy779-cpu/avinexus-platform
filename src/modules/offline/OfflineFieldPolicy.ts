export interface OfflineFieldOperationV19 { id:string; created_at:string; actor_id:string; entity:string; action:string; payload:unknown; idempotency_key:string; }
export const createOfflineFieldOperationV19=(actorId:string,entity:string,action:string,payload:unknown):OfflineFieldOperationV19=>({id:`off19-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,created_at:new Date().toISOString(),actor_id:actorId,entity,action,payload,idempotency_key:`${actorId}:${entity}:${Date.now()}:${Math.random().toString(36).slice(2,10)}`});
export const shouldQueueOfflineV19=(online:boolean,enabled:boolean)=>enabled&&!online;
export function conflictPolicyV19(serverUpdatedAt?:string,clientUpdatedAt?:string){
  if(!serverUpdatedAt||!clientUpdatedAt)return 'manual_review' as const;
  const delta=Math.abs(new Date(serverUpdatedAt).getTime()-new Date(clientUpdatedAt).getTime());
  return delta<5000?'merge_safe_fields' as const:'manual_review' as const;
}

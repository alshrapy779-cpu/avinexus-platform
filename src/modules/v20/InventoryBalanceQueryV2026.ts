/** Read-only Section 7 inventory reconciliation. No financial journal or stock mutations. */
export type Movement = {id:string;business_unit_id:string;warehouse_id:string;product_id:string;kind:string;quantity_base:number;occurred_at:string};
const IN=new Set(['receipt','transfer_in','adjustment_in','return_in']);
const OUT=new Set(['issue','transfer_out','adjustment_out','return_out']);
export function inventoryBalanceQueryV2026(movements:Movement[], query:{business_unit_id:string;from:string;to:string;warehouse_id?:string;product_id?:string}) {
  if(!query.business_unit_id||!/^\d{4}-\d{2}-\d{2}$/.test(query.from)||!/^\d{4}-\d{2}-\d{2}$/.test(query.to)||query.from>query.to)throw Error('invalid_balance_query');
  const seen=new Set<string>();let opening=0,incoming=0,outgoing=0;let count=0;
  for(const m of movements){
    if(m.business_unit_id!==query.business_unit_id||(query.warehouse_id&&m.warehouse_id!==query.warehouse_id)||(query.product_id&&m.product_id!==query.product_id))continue;
    const date=m.occurred_at?.slice(0,10);
    if(!date||date>query.to)continue;
    if(seen.has(m.id))throw Error('duplicate_inventory_movement_id');seen.add(m.id);
    if(!Number.isFinite(m.quantity_base)||m.quantity_base<0)throw Error('invalid_inventory_movement_quantity');
    if(!IN.has(m.kind)&&!OUT.has(m.kind)){if(m.kind==='reservation'||m.kind==='release')continue;throw Error('unsupported_inventory_movement_kind');}
    const signed=IN.has(m.kind)?m.quantity_base:-m.quantity_base;
    if(date<query.from)opening+=signed;
    else {if(signed>=0)incoming+=signed;else outgoing-=signed;count++;}
  }
  const round=(v:number)=>Math.round((v+Number.EPSILON)*10000)/10000;
  return {business_unit_id:query.business_unit_id,from:query.from,to:query.to,warehouse_id:query.warehouse_id||null,product_id:query.product_id||null,opening:round(opening),incoming:round(incoming),outgoing:round(outgoing),closing:round(opening+incoming-outgoing),movement_count:count,unit:'base_quantity',source:'section7_inventory_movements',read_only:true};
}

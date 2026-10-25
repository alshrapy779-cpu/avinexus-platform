import React from 'react';
import { SmartOperationsState } from '../../types';
import { SovereigntyOperationsV19Tab } from '../../components/admin/SovereigntyOperationsV19Tab';
import { hasPermissionV19, SovereigntyRoleV19 } from '../governance/RBACPermissions';

export interface MasterControlCenterProps { operations:SmartOperationsState; onUpdateOperations:(next:SmartOperationsState)=>void; role?:SovereigntyRoleV19; }
export const MasterControlCenter:React.FC<MasterControlCenterProps>=({operations,onUpdateOperations,role='system_owner'})=>{
  if(!hasPermissionV19(role as SovereigntyRoleV19,'view_executive_dashboard'))return <div className="p-6 text-sm text-rose-300" dir="rtl">لا تملك صلاحية الدخول إلى مركز القيادة التنفيذي.</div>;
  return <SovereigntyOperationsV19Tab operations={operations} onUpdateOperations={onUpdateOperations}/>;
};

import { HealthyPoultryCertificateV19 } from '../../types';
import { canPublishHealthyLabelV19 } from '../marketplace/HealthyPoultryLabel';
export function publicQualityPayloadV19(c:HealthyPoultryCertificateV19){
  if(!canPublishHealthyLabelV19(c))return {verified:false,code:c.qr_public_code};
  return {verified:true,certificate_number:c.certificate_number,farm_name:c.farm_name,issue_date:c.issue_date,valid_until:c.valid_until,lab_verified:c.lab_verified,withdrawal_period_cleared:c.withdrawal_period_cleared,toxin_screen_cleared:c.toxin_screen_cleared,vet_signed:c.vet_signed,public_summary:c.public_summary};
}

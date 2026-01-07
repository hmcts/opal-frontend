import { IOpalFinesDefendantAccountEnforcementAction } from './opal-fines-defendant-account-enforcement-action.interface';
import { IOpalFinesDefendantAccountEnforcementOverride } from './opal-fines-defendant-account-enforcement-override.interface';

export interface IOpalFinesDefendantAccountEnforcementStatus {
  last_enforcement_action: IOpalFinesDefendantAccountEnforcementAction | null;
  collection_order_made: boolean;
  default_days_in_jail: number | null;
  enforcement_override: IOpalFinesDefendantAccountEnforcementOverride | null;
  last_movement_date: string | null;
}

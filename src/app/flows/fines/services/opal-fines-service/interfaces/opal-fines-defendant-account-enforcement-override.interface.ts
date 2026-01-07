import { IOpalFinesDefendantAccountEnforcer } from './opal-fines-defendant-account-enforcer.interface';
import { IOpalFinesDefendantAccountEnforcementOverrideResult } from './opal-fines-defendant-account-enforcement-override-result.interface';
import { IOpalFinesDefendantAccountLja } from './opal-fines-defendant-account-lja.interface';

export interface IOpalFinesDefendantAccountEnforcementOverride {
  enforcement_override_result: IOpalFinesDefendantAccountEnforcementOverrideResult;
  enforcer: IOpalFinesDefendantAccountEnforcer | null;
  lja: IOpalFinesDefendantAccountLja | null;
}

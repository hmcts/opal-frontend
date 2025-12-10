/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { GetDefendantAccountEnforcementStatusResponseDefendantAccountTypeEnum } from '../../types/opal-fines-get-defendant-account-enforcement-status-response-defendant-account-type-enum.type';

import type { EnforcementOverviewDefendantAccount } from './opal-fines-enforcement-overview-defendant-account.interface';
import type { EnforcementOverrideCommon } from './opal-fines-enforcement-override-common.interface';
import type { EnforcementActionDefendantAccount } from './opal-fines-enforcement-action-defendant-account.interface';
import type { AccountStatusReferenceCommon } from './opal-fines-account-status-reference-common.interface';

export interface GetDefendantAccountEnforcementStatusResponse {
  /**
   *
   * @type {EnforcementOverviewDefendantAccount}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  enforcement_overview: EnforcementOverviewDefendantAccount;
  /**
   *
   * @type {EnforcementOverrideCommon}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  enforcement_override: EnforcementOverrideCommon | null;
  /**
   *
   * @type {EnforcementActionDefendantAccount}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  last_enforcement_action: EnforcementActionDefendantAccount | null;
  /**
   * A comma-separated list of result IDs, 'all' , or null .
   * @type {string}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  next_enforcement_action_data: string | null;
  /**
   *
   * @type {string}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  defendant_account_type: (typeof GetDefendantAccountEnforcementStatusResponseDefendantAccountTypeEnum)[keyof typeof GetDefendantAccountEnforcementStatusResponseDefendantAccountTypeEnum];
  /**
   *
   * @type {AccountStatusReferenceCommon}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  account_status_reference: AccountStatusReferenceCommon;
  /**
   *
   * @type {boolean}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  employer_flag: boolean;
  /**
   * This field will return true if all of the following are met, else will return false.
   * - The defendant account has a date of birth
   * - The defendant account has a national insurance number
   * - The defendant account has a first name
   * - The defendant account has a last name
   * - The defendant account does not have zero balance
   * - The defendant account type is not one of the following
   * -- Company
   * -- Youth
   * -- Parent / guardian to pay
   *
   * @type {boolean}
   * @memberof GetDefendantAccountEnforcementStatusResponse
   */
  is_hmrc_check_eligible: boolean;
}

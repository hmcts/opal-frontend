/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { GetDefendantAccountHeaderSummaryResponseDebtorTypeEnum } from '../../types/opal-fines-get-defendant-account-header-summary-response-debtor-type-enum.type';
import type { GetDefendantAccountHeaderSummaryResponseAccountTypeEnum } from '../../types/opal-fines-get-defendant-account-header-summary-response-account-type-enum.type';
import type { GetDefendantAccountHeaderSummaryResponseOriginatorTypeEnum } from '../../types/opal-fines-get-defendant-account-header-summary-response-originator-type-enum.type';

import type { AccountStatusReferenceCommon } from './opal-fines-account-status-reference-common.interface';
import type { BusinessUnitSummaryCommon } from './opal-fines-business-unit-summary-common.interface';
import type { PaymentStateSummaryCommon } from './opal-fines-payment-state-summary-common.interface';
import type { PartyDetailsCommon } from './opal-fines-party-details-common.interface';

export interface GetDefendantAccountHeaderSummaryResponse {
  /**
   * DB Mapping - defendant_accounts.defendant_account_id
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  defendant_account_id: string;
  /**
   * DB Mapping - defendant_accounts.account_number
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  account_number: string;
  /**
   * defendant_account_parties.defendant_account_party_id (where defendant_account_parties.association_type = 'Defendant')
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  defendant_party_id: string;
  /**
   * Only provided if a parent/guardian has been associated with the account, during account creation.
   * DB Mapping - defendant_account_parties.defendant_account_party_id (where defendant_account_parties.association_type = 'Parent/Guardian')
   *
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  parent_guardian_party_id: string | null;
  /**
   * This field will be set to 'Defendant' if defendant_account_parties.debtor = 'TRUE', otherwise if this is null and a Parent/Guardian is on the account with defendant_account_parties.debtor = 'TRUE', then the value returned is 'Parent/Guardian'.
   * DB Mapping - defendant_account_parties.debtor (where debtor = True)
   *
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  debtor_type: (typeof GetDefendantAccountHeaderSummaryResponseDebtorTypeEnum)[keyof typeof GetDefendantAccountHeaderSummaryResponseDebtorTypeEnum];
  /**
   * DERIVED FROM THE DEFENDANT
   * The BE will need to check the defendants DOB via (parties.birth_date) and if:
   * parties.birth_date ≥ 18, then value is FALSE
   * I.e. An Adult defendant
   * parties.birth_date < 18, then value is TRUE
   * I.e. A Youth defendant
   * If parties.birth_date = null, then the defendants age (parties.age) should be observed:
   * parties.age ≥ 18, then the value is ‘FALSE’
   * parties.age < 18, then the value is ‘TRUE’
   * parties.age = null, then the value is ‘FALSE’
   *
   * DB Mapping - parties.birth_date The defendants DOB is derived from this database field, but is not returned. Instead the BE will set the is_youth flag depending on the DOB value parties.age
   *
   * @type {boolean}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  is_youth: boolean;
  /**
   *
   * @type {AccountStatusReferenceCommon}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  account_status_reference: AccountStatusReferenceCommon;
  /**
   * DB Mapping - defendant_accounts.account_type
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  account_type: (typeof GetDefendantAccountHeaderSummaryResponseAccountTypeEnum)[keyof typeof GetDefendantAccountHeaderSummaryResponseAccountTypeEnum];
  /**
   * NEW - DB Mapping - defendant_accounts.originator_type
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  originator_type: (typeof GetDefendantAccountHeaderSummaryResponseOriginatorTypeEnum)[keyof typeof GetDefendantAccountHeaderSummaryResponseOriginatorTypeEnum];
  /**
   * NEW - DB Mapping - defendant.accounts.originator_name
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  originator_name: string;
  /**
   * DB Mapping - defendant.accounts.prosecutor_case_reference
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  prosecutor_case_reference: string | null;
  /**
   * Only provided for Fixed Penalty accounts
   * DB Mapping - fixed_penalty_offences.ticket_number
   *
   * @type {string}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  fixed_penalty_ticket_number: string | null;
  /**
   *
   * @type {BusinessUnitSummaryCommon}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  business_unit_summary: BusinessUnitSummaryCommon;
  /**
   *
   * @type {PaymentStateSummaryCommon}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  payment_state_summary: PaymentStateSummaryCommon;
  /**
   *
   * @type {PartyDetailsCommon}
   * @memberof GetDefendantAccountHeaderSummaryResponse
   */
  party_details: PartyDetailsCommon;
}

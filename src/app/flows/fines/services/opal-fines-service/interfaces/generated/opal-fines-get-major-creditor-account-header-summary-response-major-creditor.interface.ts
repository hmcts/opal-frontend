/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { CreditorAccountTypeReferenceCommon } from './opal-fines-creditor-account-type-reference-common.interface';

export interface GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor {
  /**
   * The unique identifier for the major creditor account. DB Mapping from creditor_accounts.creditor_account_id
   * @type {number}
   * @memberof GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor
   */
  creditor_account_id: number;
  /**
   * The account number of the major creditor account. DB Mapping from creditor_accounts.account_number
   * @type {string}
   * @memberof GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor
   */
  account_number: string;
  /**
   * major_creditors.name where the creditor account type is 'MJ'  configuration_items.item_values.$.name where configuration_items.item_name = 'CENTRAL_FUND_ACCOUNT' and configuration_items.business_unit_id = creditor_accounts.business_unit_id
   * @type {string}
   * @memberof GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor
   */
  name: string;
  /**
   * Set to 'Major creditor' or 'Central fund'
   * @type {CreditorAccountTypeReferenceCommon}
   * @memberof GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor
   */
  account_reference: CreditorAccountTypeReferenceCommon;
}

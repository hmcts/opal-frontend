/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { MajorCreditorAddressDetailsCommon } from './opal-fines-major-creditor-address-details-common.interface';

export interface GetMajorCreditorAccountAtAGlanceResponseMajorCreditor {
  /**
   * The unique identifier for the major creditor account. DB Mapping from creditor_accounts.creditor_account_id
   * @type {number}
   * @memberof GetMajorCreditorAccountAtAGlanceResponseMajorCreditor
   */
  creditor_account_id: number;
  /**
   * major_creditors.name where the creditor account type is 'MJ'  configuration_items.item_values.$.name where configuration_items.item_name = 'CENTRAL_FUND_ACCOUNT' and configuration_items.business_unit_id = creditor_accounts.business_unit_id. DB Mapping - $.major_creditor.name
   * @type {string}
   * @memberof GetMajorCreditorAccountAtAGlanceResponseMajorCreditor
   */
  name: string;
  /**
   * Required where creditor account type is 'MJ'. DB Mapping - $.major_creditor.code
   * @type {string}
   * @memberof GetMajorCreditorAccountAtAGlanceResponseMajorCreditor
   */
  code: string | null;
  /**
   *
   * @type {MajorCreditorAddressDetailsCommon}
   * @memberof GetMajorCreditorAccountAtAGlanceResponseMajorCreditor
   */
  address: MajorCreditorAddressDetailsCommon | null;
  /**
   * Required where creditor account type is 'MJ' - DB Mapping - creditor_accounts.pay_by_bacs
   * @type {boolean}
   * @memberof GetMajorCreditorAccountAtAGlanceResponseMajorCreditor
   */
  pay_by_bacs: boolean | null;
}

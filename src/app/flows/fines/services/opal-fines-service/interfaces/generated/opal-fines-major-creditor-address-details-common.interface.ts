/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

export interface MajorCreditorAddressDetailsCommon {
  /**
   * major_creditors.address_line_1 where the creditor account type is 'MJ'  configuration_items.item_values.$.address_line_1 where configuration_items.item_name = 'CENTRAL_FUND_ACCOUNT' and configuration_items.business_unit_id = creditor_accounts.business_unit_id
   * @type {string}
   * @memberof MajorCreditorAddressDetailsCommon
   */
  line_1: string | null;
  /**
   * major_creditors.address_line_2 where the creditor account type is 'MJ'  configuration_items.item_values.$.address_line_2 where configuration_items.item_name = 'CENTRAL_FUND_ACCOUNT' and configuration_items.business_unit_id = creditor_accounts.business_unit_id
   * @type {string}
   * @memberof MajorCreditorAddressDetailsCommon
   */
  line_2: string | null;
  /**
   * major_creditors.address_line_3 where the creditor account type is 'MJ'            configuration_items.item_values.$.address_line_3 where configuration_items.item_name = 'CENTRAL_FUND_ACCOUNT' and configuration_items.business_unit_id = creditor_accounts.business_unit_id
   * @type {string}
   * @memberof MajorCreditorAddressDetailsCommon
   */
  line_3: string | null;
  /**
   * DB Mapping - major_creditors.postcode
   * @type {string}
   * @memberof MajorCreditorAddressDetailsCommon
   */
  postcode: string | null;
}

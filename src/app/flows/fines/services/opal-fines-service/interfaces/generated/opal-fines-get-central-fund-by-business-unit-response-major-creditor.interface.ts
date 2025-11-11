/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

export interface GetCentralFundByBusinessUnitResponseMajorCreditor {
  /**
   * The unique identifier for the major creditor account. DB Mapping from creditor_accounts.creditor_account_id
   * @type {number}
   * @memberof GetCentralFundByBusinessUnitResponseMajorCreditor
   */
  creditor_account_id: number;
  /**
   * The account number of the major creditor account. DB Mapping from creditor_accounts.account_number
   * @type {string}
   * @memberof GetCentralFundByBusinessUnitResponseMajorCreditor
   */
  account_number: string;
  /**
   * DB Mapping configuration_items.item_values.$.name
   * @type {string}
   * @memberof GetCentralFundByBusinessUnitResponseMajorCreditor
   */
  name: string;
}

/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

export interface CreditorAccountPaymentDetailsCommon {
  /**
   * DB Mapping - creditor_accounts.bank_account_name
   * @type {string}
   * @memberof CreditorAccountPaymentDetailsCommon
   */
  account_name: string | null;
  /**
   * DB Mapping - creditor_accounts.bank_sort_code
   * @type {string}
   * @memberof CreditorAccountPaymentDetailsCommon
   */
  sort_code: string | null;
  /**
   * DB Mapping - creditor_accounts.bank_account_number
   * @type {string}
   * @memberof CreditorAccountPaymentDetailsCommon
   */
  account_number: string | null;
  /**
   * DB Mapping - creditor_accounts.bank_account_reference
   * @type {string}
   * @memberof CreditorAccountPaymentDetailsCommon
   */
  account_reference: string | null;
  /**
   * DB Mapping - creditor_accounts.pay_by_bacs
   * @type {boolean}
   * @memberof CreditorAccountPaymentDetailsCommon
   */
  pay_by_bacs: boolean;
  /**
   * DB Mapping - creditor_accounts.hold_payout
   * @type {boolean}
   * @memberof CreditorAccountPaymentDetailsCommon
   */
  hold_payment: boolean;
}

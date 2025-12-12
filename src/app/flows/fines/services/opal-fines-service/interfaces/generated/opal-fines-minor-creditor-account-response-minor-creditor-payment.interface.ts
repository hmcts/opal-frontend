/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

export interface MinorCreditorAccountResponseMinorCreditorPayment {
  /**
   * DB Mapping - creditor_accounts.bank_account_name
   * @type {string}
   * @memberof MinorCreditorAccountResponseMinorCreditorPayment
   */
  account_name: string | null;
  /**
   * DB Mapping - creditor_accounts.bank_sort_code
   * @type {string}
   * @memberof MinorCreditorAccountResponseMinorCreditorPayment
   */
  sort_code: string | null;
  /**
   * DB Mapping - creditor_accounts.bank_account_number
   * @type {string}
   * @memberof MinorCreditorAccountResponseMinorCreditorPayment
   */
  account_number: string | null;
  /**
   * DB Mapping - creditor_accounts.bank_account_reference
   * @type {string}
   * @memberof MinorCreditorAccountResponseMinorCreditorPayment
   */
  account_reference: string | null;
  /**
   * DB Mapping - creditor_accounts.pay_by_bacs
   * @type {boolean}
   * @memberof MinorCreditorAccountResponseMinorCreditorPayment
   */
  pay_by_bacs: boolean;
  /**
   * DB Mapping - creditor_accounts.hold_payout
   * @type {boolean}
   * @memberof MinorCreditorAccountResponseMinorCreditorPayment
   */
  hold_payment: boolean;
}

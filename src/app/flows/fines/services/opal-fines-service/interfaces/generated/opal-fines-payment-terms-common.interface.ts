/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { PaymentTermsTypeCommon } from './opal-fines-payment-terms-type-common.interface';
import type { InstalmentPeriodCommon } from './opal-fines-instalment-period-common.interface';

export interface PaymentTermsCommon {
  /**
   *
   * @type {number}
   * @memberof PaymentTermsCommon
   */
  days_in_default: number | null;
  /**
   *
   * @type {string}
   * @memberof PaymentTermsCommon
   */
  date_days_in_default_imposed: string | null;
  /**
   *
   * @type {string}
   * @memberof PaymentTermsCommon
   */
  reason_for_extension: string | null;
  /**
   *
   * @type {PaymentTermsTypeCommon}
   * @memberof PaymentTermsCommon
   */
  payment_terms_type: PaymentTermsTypeCommon;
  /**
   *
   * @type {string}
   * @memberof PaymentTermsCommon
   */
  effective_date: string | null;
  /**
   *
   * @type {InstalmentPeriodCommon}
   * @memberof PaymentTermsCommon
   */
  instalment_period: InstalmentPeriodCommon | null;
  /**
   *
   * @type {number}
   * @memberof PaymentTermsCommon
   */
  lump_sum_amount: number | null;
  /**
   *
   * @type {number}
   * @memberof PaymentTermsCommon
   */
  instalment_amount: number | null;
}

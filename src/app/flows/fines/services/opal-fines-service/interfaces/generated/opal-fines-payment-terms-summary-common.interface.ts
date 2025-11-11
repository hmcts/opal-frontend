/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { PaymentTermsTypeCommon } from './opal-fines-payment-terms-type-common.interface';
import type { InstalmentPeriodCommon } from './opal-fines-instalment-period-common.interface';

export interface PaymentTermsSummaryCommon {
  /**
   *
   * @type {PaymentTermsTypeCommon}
   * @memberof PaymentTermsSummaryCommon
   */
  payment_terms_type: PaymentTermsTypeCommon;
  /**
   *
   * @type {string}
   * @memberof PaymentTermsSummaryCommon
   */
  effective_date: string | null;
  /**
   *
   * @type {InstalmentPeriodCommon}
   * @memberof PaymentTermsSummaryCommon
   */
  instalment_period: InstalmentPeriodCommon | null;
  /**
   *
   * @type {number}
   * @memberof PaymentTermsSummaryCommon
   */
  lump_sum_amount: number | null;
  /**
   *
   * @type {number}
   * @memberof PaymentTermsSummaryCommon
   */
  instalment_amount: number | null;
}

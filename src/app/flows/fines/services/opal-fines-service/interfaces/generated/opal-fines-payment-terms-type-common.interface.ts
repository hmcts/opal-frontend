/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { PaymentTermsTypeCommonPaymentTermsTypeCodeEnum } from '../../types/opal-fines-payment-terms-type-common-payment-terms-type-code-enum.type';

export interface PaymentTermsTypeCommon {
  /**
   *
   * @type {string}
   * @memberof PaymentTermsTypeCommon
   */
  payment_terms_type_code: (typeof PaymentTermsTypeCommonPaymentTermsTypeCodeEnum)[keyof typeof PaymentTermsTypeCommonPaymentTermsTypeCodeEnum];
}

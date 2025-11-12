/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { PartyDetailsCommon } from './opal-fines-party-details-common.interface';
import type { AddressDetailsCommon } from './opal-fines-address-details-common.interface';
import type { CreditorAccountPaymentDetailsCommon } from './opal-fines-creditor-account-payment-details-common.interface';

export interface PatchMinorCreditorAccountRequest {
  /**
   *
   * @type {PartyDetailsCommon}
   * @memberof PatchMinorCreditorAccountRequest
   */
  party_details: PartyDetailsCommon;
  /**
   *
   * @type {AddressDetailsCommon}
   * @memberof PatchMinorCreditorAccountRequest
   */
  address: AddressDetailsCommon;
  /**
   *
   * @type {CreditorAccountPaymentDetailsCommon}
   * @memberof PatchMinorCreditorAccountRequest
   */
  payment: CreditorAccountPaymentDetailsCommon;
}

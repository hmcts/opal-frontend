/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { PartyDetailsCommon } from './opal-fines-party-details-common.interface';
import type { AddressDetailsCommon } from './opal-fines-address-details-common.interface';
import type { MinorCreditorAccountResponseMinorCreditorPayment } from './opal-fines-minor-creditor-account-response-minor-creditor-payment.interface';

export interface MinorCreditorAccountResponseMinorCreditor {
  /**
   *
   * @type {number}
   * @memberof MinorCreditorAccountResponseMinorCreditor
   */
  creditor_account_id: number;
  /**
   *
   * @type {PartyDetailsCommon}
   * @memberof MinorCreditorAccountResponseMinorCreditor
   */
  party_details: PartyDetailsCommon;
  /**
   *
   * @type {AddressDetailsCommon}
   * @memberof MinorCreditorAccountResponseMinorCreditor
   */
  address: AddressDetailsCommon;
  /**
   *
   * @type {MinorCreditorAccountResponseMinorCreditorPayment}
   * @memberof MinorCreditorAccountResponseMinorCreditor
   */
  payment: MinorCreditorAccountResponseMinorCreditorPayment;
}

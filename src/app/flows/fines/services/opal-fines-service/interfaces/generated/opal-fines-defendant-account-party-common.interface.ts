/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { PartyDetailsCommon } from './opal-fines-party-details-common.interface';
import type { AddressDetailsCommon } from './opal-fines-address-details-common.interface';
import type { ContactDetailsCommon } from './opal-fines-contact-details-common.interface';
import type { VehicleDetailsCommon } from './opal-fines-vehicle-details-common.interface';
import type { EmployerDetailsCommon } from './opal-fines-employer-details-common.interface';
import type { LanguagePreferencesCommon } from './opal-fines-language-preferences-common.interface';

export interface DefendantAccountPartyCommon {
  /**
   *
   * @type {string}
   * @memberof DefendantAccountPartyCommon
   */
  defendant_account_party_type: string;
  /**
   *
   * @type {boolean}
   * @memberof DefendantAccountPartyCommon
   */
  is_debtor: boolean;
  /**
   *
   * @type {PartyDetailsCommon}
   * @memberof DefendantAccountPartyCommon
   */
  party_details: PartyDetailsCommon;
  /**
   *
   * @type {AddressDetailsCommon}
   * @memberof DefendantAccountPartyCommon
   */
  address: AddressDetailsCommon;
  /**
   *
   * @type {ContactDetailsCommon}
   * @memberof DefendantAccountPartyCommon
   */
  contact_details: ContactDetailsCommon | null;
  /**
   *
   * @type {VehicleDetailsCommon}
   * @memberof DefendantAccountPartyCommon
   */
  vehicle_details: VehicleDetailsCommon | null;
  /**
   *
   * @type {EmployerDetailsCommon}
   * @memberof DefendantAccountPartyCommon
   */
  employer_details: EmployerDetailsCommon | null;
  /**
   *
   * @type {LanguagePreferencesCommon}
   * @memberof DefendantAccountPartyCommon
   */
  language_preferences: LanguagePreferencesCommon | null;
}

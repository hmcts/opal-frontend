/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { OrganisationDetailsCommon } from './opal-fines-organisation-details-common.interface';
import type { IndividualDetailsCommon } from './opal-fines-individual-details-common.interface';

export interface PartyDetailsCommon {
  /**
   *
   * @type {string}
   * @memberof PartyDetailsCommon
   */
  party_id: string;
  /**
   *
   * @type {boolean}
   * @memberof PartyDetailsCommon
   */
  organisation_flag: boolean;
  /**
   *
   * @type {OrganisationDetailsCommon}
   * @memberof PartyDetailsCommon
   */
  organisation_details: OrganisationDetailsCommon | null;
  /**
   *
   * @type {IndividualDetailsCommon}
   * @memberof PartyDetailsCommon
   */
  individual_details: IndividualDetailsCommon | null;
}

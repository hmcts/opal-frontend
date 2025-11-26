/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { OrganisationAliasCommon } from './opal-fines-organisation-alias-common.interface';

export interface OrganisationDetailsCommon {
  /**
   *
   * @type {string}
   * @memberof OrganisationDetailsCommon
   */
  organisation_name: string;
  /**
   *
   * @type {Array<OrganisationAliasCommon>}
   * @memberof OrganisationDetailsCommon
   */
  organisation_aliases: Array<OrganisationAliasCommon> | null;
}

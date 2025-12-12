/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

export interface OffenceReferenceCommon {
  /**
   *
   * @type {number}
   * @memberof OffenceReferenceCommon
   */
  id: number | null;
  /**
   * DB mapping - offences.cjs_code
   * @type {string}
   * @memberof OffenceReferenceCommon
   */
  code: string | null;
  /**
   * DB mapping - offences.offence_title
   * @type {string}
   * @memberof OffenceReferenceCommon
   */
  title: string;
}

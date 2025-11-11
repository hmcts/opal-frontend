/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

export interface ProblemDetailCommon {
  /**
   *
   * @type {string}
   * @memberof ProblemDetailCommon
   */
  type: string | null;
  /**
   *
   * @type {string}
   * @memberof ProblemDetailCommon
   */
  title: string;
  /**
   *
   * @type {number}
   * @memberof ProblemDetailCommon
   */
  status: number;
  /**
   *
   * @type {string}
   * @memberof ProblemDetailCommon
   */
  detail: string;
  /**
   *
   * @type {string}
   * @memberof ProblemDetailCommon
   */
  instance: string | null;
  /**
   * A unique operation id that links logs of the same operation together
   * @type {string}
   * @memberof ProblemDetailCommon
   */
  operation_id: string | null;
  /**
   *
   * @type {boolean}
   * @memberof ProblemDetailCommon
   */
  retriable: boolean | null;
  /**
   *
   * @type {{ [key: string]: string; }}
   * @memberof ProblemDetailCommon
   */
  properties: { [key: string]: string | null };
}

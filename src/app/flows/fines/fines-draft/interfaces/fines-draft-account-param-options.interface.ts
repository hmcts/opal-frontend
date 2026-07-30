export interface IFinesDraftAccountParamOptions {
  /**
   * Draft account statuses to include in the request.
   */
  statuses?: string[];

  /**
   * Whether the request should only include draft accounts submitted by the current user.
   */
  includeSubmittedBy?: boolean;

  /**
   * Whether the request should only include draft accounts not submitted by the current user.
   */
  includeNotSubmittedBy?: boolean;
}

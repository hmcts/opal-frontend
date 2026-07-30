import { IFinesDraftAccountParamOptions } from '../../../interfaces/fines-draft-account-param-options.interface';

export interface FinesDraftCountResolverOptions extends Omit<IFinesDraftAccountParamOptions, 'statuses'> {
  /**
   * Draft account statuses to include in the count request.
   */
  statuses: string[];
}

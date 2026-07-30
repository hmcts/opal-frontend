import { FinesDraftTabFragment } from '../../../types/fines-draft-tab-fragment.type';
import { IFinesDraftAccountParamOptions } from '../../../interfaces/fines-draft-account-param-options.interface';

export interface FinesDraftResolverOptions extends IFinesDraftAccountParamOptions {
  useFragmentForStatuses?: boolean;
  defaultTab?: FinesDraftTabFragment;
  defaultStatuses?: string[];
}

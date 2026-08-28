import { FinesDraftTabFragment } from '../../../types/fines-draft-tab-fragment.type';
import { IFinesDraftAccountParamOptions } from '../../../interfaces/fines-draft-account-param-options.interface';

export interface IFinesDraftResolverOptions extends Pick<
  IFinesDraftAccountParamOptions,
  'includeSubmittedBy' | 'includeNotSubmittedBy'
> {
  defaultTab: FinesDraftTabFragment;
}

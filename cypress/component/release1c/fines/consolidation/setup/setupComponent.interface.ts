import { IFinesConSearchAccountState } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { IFinesConSearchResultDefendantAccount } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';

export type ConsolidationTabFragment = 'search' | 'results' | 'for-consolidation';
export type DefendantType = 'individual' | 'company';

export interface IComponentProperties {
  defendantType?: DefendantType;
  fragments?: ConsolidationTabFragment;
  searchAccountFormData?: IFinesConSearchAccountState;
  initialResults?: IFinesConSearchResultDefendantAccount[];
  setupRouterSpy?: boolean;
  updateSearchSpy?: (formData: IFinesConSearchAccountState) => void;
}

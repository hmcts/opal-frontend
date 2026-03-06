import { IFinesConSearchAccountState } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';

export type ConsolidationTabFragment = 'search' | 'results' | 'for-consolidation';
export type DefendantType = 'individual' | 'company';

export interface IComponentProperties {
  defendantType?: DefendantType;
  fragments?: ConsolidationTabFragment;
  searchAccountFormData?: IFinesConSearchAccountState;
  setupRouterSpy?: boolean;
  updateSearchSpy?: (formData: IFinesConSearchAccountState) => void;
}

import { IFinesSuspenseItemSearchFormState } from '../../fines-suspense-item-search/interfaces/fines-suspense-item-search-form-state.interface';

export interface IFinesSuspenseItemState {
  selectedBusinessUnitId: number | null;
  submittedCriteria: IFinesSuspenseItemSearchFormState | null;
}

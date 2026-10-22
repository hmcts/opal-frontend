import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IFinesSuspenseItemSearchFormState } from '../fines-suspense-item-search/interfaces/fines-suspense-item-search-form-state.interface';
import { FINES_SUSPENSE_ITEM_STATE } from './constants/fines-suspense-item-state.constant';

export const FinesSuspenseItemStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({ ...FINES_SUSPENSE_ITEM_STATE })),
  withMethods((store) => ({
    setSelectedBusinessUnitId(selectedBusinessUnitId: number | null): void {
      if (selectedBusinessUnitId !== store.selectedBusinessUnitId()) {
        patchState(store, { selectedBusinessUnitId, submittedCriteria: null });
      }
    },
    setSubmittedCriteria(criteria: IFinesSuspenseItemSearchFormState): void {
      patchState(store, {
        selectedBusinessUnitId: criteria.fsis_business_unit_id,
        submittedCriteria: { ...criteria },
      });
    },
  })),
);

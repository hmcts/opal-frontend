import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const FinesSuspenseItemStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    selectedBusinessUnitId: null as number | null,
    selectedBusinessUnitName: null as string | null,
    submittedBusinessUnitId: null as number | null,
    submittedBusinessUnitName: null as string | null,
    unsavedChanges: false,
  })),
  withMethods((store) => ({
    setSelectedBusinessUnit(selectedBusinessUnitId: number | null, selectedBusinessUnitName: string | null): void {
      patchState(store, { selectedBusinessUnitId, selectedBusinessUnitName });
    },
    setSubmittedBusinessUnit(submittedBusinessUnitId: number | null, submittedBusinessUnitName: string | null): void {
      patchState(store, { submittedBusinessUnitId, submittedBusinessUnitName });
    },
    setUnsavedChanges(unsavedChanges: boolean): void {
      patchState(store, { unsavedChanges });
    },
    resetStore(): void {
      patchState(store, {
        selectedBusinessUnitId: null,
        selectedBusinessUnitName: null,
        submittedBusinessUnitId: null,
        submittedBusinessUnitName: null,
        unsavedChanges: false,
      });
    },
  })),
);

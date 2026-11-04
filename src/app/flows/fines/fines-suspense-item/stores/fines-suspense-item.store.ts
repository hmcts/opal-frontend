import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const FinesSuspenseItemStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    selectedBusinessUnitId: null as number | null,
    unsavedChanges: false,
  })),
  withMethods((store) => ({
    setSelectedBusinessUnitId(selectedBusinessUnitId: number | null): void {
      patchState(store, { selectedBusinessUnitId });
    },
    setUnsavedChanges(unsavedChanges: boolean): void {
      patchState(store, { unsavedChanges });
    },
    resetStore(): void {
      patchState(store, { selectedBusinessUnitId: null, unsavedChanges: false });
    },
  })),
);

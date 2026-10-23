import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const FinesSuspenseItemStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    selectedBusinessUnitId: null as number | null,
  })),
  withMethods((store) => ({
    setSelectedBusinessUnitId(selectedBusinessUnitId: number | null): void {
      patchState(store, { selectedBusinessUnitId });
    },
    resetStore(): void {
      patchState(store, { selectedBusinessUnitId: null });
    },
  })),
);

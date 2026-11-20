import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { FINES_FPU_STATE } from './constants/fines-fpu-state.constant';

export const FinesFpuStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({ ...FINES_FPU_STATE })),
  withMethods((store) => ({
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
    resetFinesFpuState: () => {
      patchState(store, { ...FINES_FPU_STATE });
    },
  })),
);

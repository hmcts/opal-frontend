import { signalStore, withState } from '@ngrx/signals';
import { FinesMacStore } from '../fines-mac/stores/fines-mac.store';

export const FinesStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    finesMacStore: FinesMacStore,
  })),
);

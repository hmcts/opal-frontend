import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';

export const FinesMciStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    businessUnit: null as IOpalFinesBusinessUnit | null,
  })),
  withMethods((store) => ({
    setBusinessUnit(businessUnit: IOpalFinesBusinessUnit): void {
      patchState(store, { businessUnit });
    },
    reset(): void {
      patchState(store, { businessUnit: null });
    },
  })),
);

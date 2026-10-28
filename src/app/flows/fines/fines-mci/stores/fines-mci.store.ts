import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';

export type FinesMciJourney = 'criminal' | 'courtFee' | 'suspense';

export interface IFinesMciPayment {
  paymentId: string;
  journey: FinesMciJourney;
}

export interface IFinesMciTill {
  tillId: string;
  payments: IFinesMciPayment[];
}

export const FinesMciStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    businessUnit: null as IOpalFinesBusinessUnit | null,
    tills: [] as IFinesMciTill[],
  })),
  withMethods((store) => {
    const ensureTill = (): string => {
      const existingTill = store.tills()[0];
      if (existingTill) {
        return existingTill.tillId;
      }

      const tillId = crypto.randomUUID();
      patchState(store, { tills: [{ tillId, payments: [] }] });
      return tillId;
    };

    return {
      setBusinessUnit(businessUnit: IOpalFinesBusinessUnit): void {
        const currentBusinessUnit = store.businessUnit();
        if (currentBusinessUnit && currentBusinessUnit.business_unit_id !== businessUnit.business_unit_id) {
          patchState(store, { businessUnit, tills: [] });
          return;
        }

        patchState(store, { businessUnit });
      },
      ensureTill,
      addPayment(tillId: string, journey: FinesMciJourney): string {
        const paymentId = crypto.randomUUID();
        patchState(store, {
          tills: store
            .tills()
            .map((till) =>
              till.tillId === tillId ? { ...till, payments: [...till.payments, { paymentId, journey }] } : till,
            ),
        });
        return paymentId;
      },
      reset(): void {
        patchState(store, { businessUnit: null, tills: [] });
      },
    };
  }),
);

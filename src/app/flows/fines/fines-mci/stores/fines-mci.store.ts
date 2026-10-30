import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IOpalFinesDefendantAccount } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
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
    criminalSearchResults: null as IOpalFinesDefendantAccountResponse | null,
    selectedCriminalAccount: null as IOpalFinesDefendantAccount | null,
  })),
  withMethods((store) => ({
    setBusinessUnit(businessUnit: IOpalFinesBusinessUnit): void {
      patchState(store, { businessUnit });
    },
    addTill(): string {
      const tillId = crypto.randomUUID();
      patchState(store, { tills: [...store.tills(), { tillId, payments: [] }] });
      return tillId;
    },
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
    setCriminalSearchResults: (criminalSearchResults: IOpalFinesDefendantAccountResponse | null) => {
      patchState(store, { criminalSearchResults, selectedCriminalAccount: null });
    },
    setSelectedCriminalAccount: (selectedCriminalAccount: IOpalFinesDefendantAccount | null) => {
      patchState(store, { selectedCriminalAccount });
    },
    resetCriminalSearch: () => {
      patchState(store, { criminalSearchResults: null, selectedCriminalAccount: null });
    },
  })),
);

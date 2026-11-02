import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IOpalFinesDefendantAccount } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { FinesMciJourney, IFinesMciTill } from './interfaces/fines-mci.interface';

export const FinesMciStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    businessUnit: null as IOpalFinesBusinessUnit | null,
    tills: [] as IFinesMciTill[],
    criminalSearchResults: null as IOpalFinesDefendantAccountResponse | null,
    selectedCriminalAccount: null as IOpalFinesDefendantAccount | null,
  })),
  withMethods((store) => {
    /** Returns the existing till ID or creates the first till for the current business unit. */
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
      /** Sets the selected business unit and clears tills when switching to a different unit. */
      setBusinessUnit(businessUnit: IOpalFinesBusinessUnit): void {
        const currentBusinessUnit = store.businessUnit();
        if (currentBusinessUnit && currentBusinessUnit.business_unit_id !== businessUnit.business_unit_id) {
          patchState(store, { businessUnit, tills: [] });
          return;
        }

        patchState(store, { businessUnit });
      },
      /** Ensures a till exists and returns its ID. */
      ensureTill,
      /** Adds a payment journey to the matching till and returns the new payment ID. */
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
      setCriminalSearchResults: (criminalSearchResults: IOpalFinesDefendantAccountResponse | null) => {
        patchState(store, { criminalSearchResults, selectedCriminalAccount: null });
      },
      setSelectedCriminalAccount: (selectedCriminalAccount: IOpalFinesDefendantAccount | null) => {
        patchState(store, { selectedCriminalAccount });
      },
      resetCriminalSearch: () => {
        patchState(store, { criminalSearchResults: null, selectedCriminalAccount: null });
      },
      /** Clears the selected business unit and all till data. */
      reset(): void {
        patchState(store, { businessUnit: null, tills: [] });
      },
    };
  }),
);

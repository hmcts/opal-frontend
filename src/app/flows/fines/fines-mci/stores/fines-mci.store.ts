import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IOpalFinesDefendantAccount } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { FinesMciJourney, IFinesMciTill } from './interfaces/fines-mci.interface';
import { IFinesMciCriminalSearch } from './interfaces/fines-mci-criminal-search.interface';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';

export const FinesMciStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    businessUnit: null as IOpalFinesBusinessUnit | null,
    tills: [] as IFinesMciTill[],
    criminalSearch: null as IFinesMciCriminalSearch | null,
    criminalSearchResults: null as IOpalFinesDefendantAccountResponse | null,
    selectedCriminalAccount: null as IOpalFinesDefendantAccount | null,
    selectedCriminalAccountAtAGlance: null as IOpalFinesAccountDefendantAtAGlance | null,
    draftJourney: null as FinesMciJourney | null,
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
      setCriminalSearch(criminalSearch: IFinesMciCriminalSearch): void {
        patchState(store, {
          criminalSearch,
          criminalSearchResults: null,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
        });
      },
      setCriminalSearchResults(criminalSearchResults: IOpalFinesDefendantAccountResponse | null): void {
        patchState(store, {
          criminalSearchResults,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
        });
      },
      setSelectedCriminalAccount(selectedCriminalAccount: IOpalFinesDefendantAccount | null): void {
        patchState(store, { selectedCriminalAccount, selectedCriminalAccountAtAGlance: null });
      },
      setSelectedCriminalAccountAtAGlance(selectedCriminalAccountAtAGlance: IOpalFinesAccountDefendantAtAGlance): void {
        patchState(store, { selectedCriminalAccountAtAGlance });
      },
      resetCriminalSearch(): void {
        patchState(store, {
          criminalSearch: null,
          criminalSearchResults: null,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
        });
      },
      /** Sets the selected business unit and clears tills when switching to a different unit. */
      setBusinessUnit(businessUnit: IOpalFinesBusinessUnit): void {
        const currentBusinessUnit = store.businessUnit();
        if (currentBusinessUnit && currentBusinessUnit.business_unit_id !== businessUnit.business_unit_id) {
          patchState(store, {
            businessUnit,
            tills: [],
            criminalSearch: null,
            criminalSearchResults: null,
            selectedCriminalAccount: null,
            selectedCriminalAccountAtAGlance: null,
            draftJourney: null,
          });
          return;
        }

        patchState(store, { businessUnit });
      },
      /** Ensures a till exists and returns its ID. */
      ensureTill,
      /** Stores the selected payment journey until its details are completed. */
      setDraftJourney(draftJourney: FinesMciJourney | null): void {
        patchState(store, { draftJourney });
      },
      /** Adds a payment journey to the matching till and returns the new payment ID. */
      addPayment(tillId: string, journey: FinesMciJourney): string {
        const paymentId = crypto.randomUUID();
        const tillExists = store.tills().some((till) => till.tillId === tillId);
        patchState(store, {
          tills: store
            .tills()
            .map((till) =>
              till.tillId === tillId ? { ...till, payments: [...till.payments, { paymentId, journey }] } : till,
            ),
          ...(tillExists && { draftJourney: null }),
        });
        return paymentId;
      },
      /** Clears the selected business unit and all till data. */
      reset(): void {
        patchState(store, {
          businessUnit: null,
          tills: [],
          criminalSearch: null,
          criminalSearchResults: null,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
          draftJourney: null,
        });
      },
    };
  }),
);

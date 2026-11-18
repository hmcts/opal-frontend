import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IFinesMciCriminalAccount } from '../interfaces/fines-mci-criminal-account.interface';
import { IFinesMciCriminalAccountsResponse } from '../interfaces/fines-mci-criminal-accounts-response.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import {
  FinesMciJourney,
  IFinesMciSuspensePayerDetails,
  IFinesMciCourtFeeDraft,
  IFinesMciSuspensePayment,
  IFinesMciTill,
} from './interfaces/fines-mci.interface';
import { IFinesMciCriminalSearch } from './interfaces/fines-mci-criminal-search.interface';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';

import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';

export const FinesMciStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    businessUnit: null as IOpalFinesBusinessUnit | null,
    tills: [] as IFinesMciTill[],
    criminalSearch: null as IFinesMciCriminalSearch | null,
    criminalSearchResults: null as IFinesMciCriminalAccountsResponse | null,
    selectedCriminalAccount: null as IFinesMciCriminalAccount | null,
    selectedCriminalAccountHeader: null as IOpalFinesAccountDefendantDetailsHeader | null,
    selectedCriminalAccountAtAGlance: null as IOpalFinesAccountDefendantAtAGlance | null,
    draftJourney: null as FinesMciJourney | null,
    courtFeeDraft: null as IFinesMciCourtFeeDraft | null,
    suspensePayment: null as IFinesMciSuspensePayment | null,
    suspensePayerDetails: null as IFinesMciSuspensePayerDetails | null,
    suspenseNote: '',
    editingPaymentId: null as string | null,
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
      /**
       * Stores submitted criteria, the selected tab and the conflict flag for the matches resolver
       * and for restoring the form when the user returns to amend their search.
       *
       * @param criminalSearch The submitted criminal account search state.
       */
      setCriminalSearch(criminalSearch: IFinesMciCriminalSearch): void {
        patchState(store, {
          criminalSearch,
          criminalSearchResults: null,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
          selectedCriminalAccountHeader: null,
        });
      },
      /** Replaces search results and clears the previous selection and its fetched details. */
      setCriminalSearchResults(criminalSearchResults: IFinesMciCriminalAccountsResponse | null): void {
        patchState(store, {
          criminalSearchResults,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
          selectedCriminalAccountHeader: null,
        });
      },
      /** Sets or clears the selected account, invalidating both detail responses even when reselecting an account. */
      setSelectedCriminalAccount(selectedCriminalAccount: IFinesMciCriminalAccount | null): void {
        patchState(store, {
          selectedCriminalAccount,
          selectedCriminalAccountAtAGlance: null,
          selectedCriminalAccountHeader: null,
        });
      },
      /** Stores the selected account's at-a-glance response for the subsequent payment page. */
      setSelectedCriminalAccountAtAGlance(selectedCriminalAccountAtAGlance: IOpalFinesAccountDefendantAtAGlance): void {
        patchState(store, { selectedCriminalAccountAtAGlance });
      },
      /** Stores the selected account's header, including the status used to choose the account placeholder. */
      setSelectedCriminalAccountHeader(selectedCriminalAccountHeader: IOpalFinesAccountDefendantDetailsHeader): void {
        patchState(store, { selectedCriminalAccountHeader });
      },
      /** Clears submitted search state while preserving the selected business unit, tills and category draft. */
      resetCriminalSearch(): void {
        patchState(store, {
          criminalSearch: null,
          criminalSearchResults: null,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
          selectedCriminalAccountHeader: null,
        });
      },
      /** Sets the business unit, clearing payment and search state when the unit changes. */
      setBusinessUnit(businessUnit: IOpalFinesBusinessUnit): void {
        const currentBusinessUnit = store.businessUnit();
        if (currentBusinessUnit && currentBusinessUnit.business_unit_id !== businessUnit.business_unit_id) {
          patchState(store, {
            businessUnit,
            tills: [],
            draftJourney: null,
            suspensePayment: null,
            suspensePayerDetails: null,
            suspenseNote: '',
            editingPaymentId: null,
            criminalSearch: null,
            criminalSearchResults: null,
            selectedCriminalAccount: null,
            selectedCriminalAccountAtAGlance: null,
            selectedCriminalAccountHeader: null,
            courtFeeDraft: null,
          });
          return;
        }

        patchState(store, { businessUnit });
      },
      /** Ensures a till exists and returns its ID. */
      ensureTill,
      /** Stores the selected payment journey until its details are completed. */
      setDraftJourney(draftJourney: FinesMciJourney | null): void {
        patchState(store, { draftJourney, ...(draftJourney !== 'courtFee' && { courtFeeDraft: null }) });
      },
      /** Holds court fee form values while the payment journey is in progress. */
      setCourtFeeDraft(courtFeeDraft: IFinesMciCourtFeeDraft | null): void {
        patchState(store, { courtFeeDraft });
      },
      /** Stores validated suspense details in application memory. */
      setSuspensePayment(suspensePayment: IFinesMciSuspensePayment | null): void {
        patchState(store, { suspensePayment });
      },
      /** Stores payer details until the suspense payment is confirmed. */
      setSuspensePayerDetails(suspensePayerDetails: IFinesMciSuspensePayerDetails | null): void {
        patchState(store, { suspensePayerDetails });
      },
      /** Stores the suspense note while the payment is being checked. */
      setSuspenseNote(suspenseNote: string): void {
        patchState(store, { suspenseNote });
      },
      /** Restores a saved suspense payment for amendment. */
      editSuspensePayment(paymentId: string): void {
        const payment = store
          .tills()
          .flatMap((till) => till.payments)
          .find((item) => item.paymentId === paymentId);
        if (payment?.suspensePayment) {
          patchState(store, {
            draftJourney: 'suspense',
            editingPaymentId: paymentId,
            suspensePayment: payment.suspensePayment,
            suspensePayerDetails: payment.suspensePayerDetails ?? null,
            suspenseNote: payment.suspenseNote ?? '',
          });
        }
      },
      /** Saves a new suspense payment or replaces the one being amended. */
      saveSuspensePayment(): void {
        const suspensePayment = store.suspensePayment();
        if (!suspensePayment) return;
        const tillId = ensureTill();
        const editingPaymentId = store.editingPaymentId();
        const payment = {
          paymentId: editingPaymentId ?? crypto.randomUUID(),
          journey: 'suspense' as const,
          suspensePayment,
          suspensePayerDetails: store.suspensePayerDetails(),
          suspenseNote: store.suspenseNote(),
        };
        patchState(store, {
          tills: store.tills().map((till) =>
            till.tillId === tillId
              ? {
                  ...till,
                  payments: editingPaymentId
                    ? till.payments.map((item) => (item.paymentId === editingPaymentId ? payment : item))
                    : [...till.payments, payment],
                }
              : till,
          ),
          draftJourney: null,
          editingPaymentId: null,
          suspensePayment: null,
          suspensePayerDetails: null,
          suspenseNote: '',
        });
      },
      /** Discards an in-progress suspense payment without changing saved payments. */
      discardSuspensePayment(): void {
        patchState(store, {
          draftJourney: null,
          editingPaymentId: null,
          suspensePayment: null,
          suspensePayerDetails: null,
          suspenseNote: '',
        });
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
      /** Removes a saved payment from its till. */
      removePayment(paymentId: string): void {
        patchState(store, {
          tills: store.tills().map((till) => ({
            ...till,
            payments: till.payments.filter((payment) => payment.paymentId !== paymentId),
          })),
        });
      },
      /** Clears the business unit, tills, payment drafts and submitted search criteria. */
      reset(): void {
        patchState(store, {
          businessUnit: null,
          tills: [],
          draftJourney: null,
          suspensePayment: null,
          suspensePayerDetails: null,
          suspenseNote: '',
          editingPaymentId: null,
          criminalSearch: null,
          courtFeeDraft: null,
          criminalSearchResults: null,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
          selectedCriminalAccountHeader: null,
        });
      },
    };
  }),
);

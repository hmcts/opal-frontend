import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IFinesMciCriminalAccount } from '../interfaces/fines-mci-criminal-account.interface';
import { IFinesMciCriminalAccountsResponse } from '../interfaces/fines-mci-criminal-accounts-response.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { FinesMciJourney, IFinesMciCourtFeeDraft, IFinesMciTill } from './interfaces/fines-mci.interface';
import { IFinesMciCriminalSearch } from './interfaces/fines-mci-criminal-search.interface';
import { IFinesMciCourtFeePaymentDetails } from './interfaces/fines-mci-court-fee-payment-details.interface';
import { FinesMciCourtFeePaymentOrigin } from './types/fines-mci-court-fee-payment-origin.type';
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
    courtFeePaymentDetails: null as IFinesMciCourtFeePaymentDetails | null,
    courtFeePaymentOrigin: null as FinesMciCourtFeePaymentOrigin | null,
    courtFeeSuspenseNote: '',
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
            criminalSearch: null,
            criminalSearchResults: null,
            selectedCriminalAccount: null,
            selectedCriminalAccountAtAGlance: null,
            selectedCriminalAccountHeader: null,
            draftJourney: null,
            courtFeeDraft: null,
            courtFeePaymentDetails: null,
            courtFeePaymentOrigin: null,
            courtFeeSuspenseNote: '',
          });
          return;
        }

        patchState(store, { businessUnit });
      },
      /** Ensures a till exists and returns its ID. */
      ensureTill,
      /** Stores the selected payment journey until its details are completed. */
      setDraftJourney(draftJourney: FinesMciJourney | null): void {
        patchState(store, {
          draftJourney,
          ...(draftJourney !== 'courtFee' && {
            courtFeeDraft: null,
            courtFeePaymentDetails: null,
            courtFeePaymentOrigin: null,
            courtFeeSuspenseNote: '',
          }),
        });
      },
      /** Holds the court fee draft and retains payment details when editing from the check screen. */
      setCourtFeeDraft(courtFeeDraft: IFinesMciCourtFeeDraft | null, preservePaymentDetails = false): void {
        const previous = store.courtFeeDraft();
        const changed =
          !courtFeeDraft ||
          !previous ||
          courtFeeDraft.courtFeeId !== previous.courtFeeId ||
          courtFeeDraft.amountPaid !== previous.amountPaid ||
          courtFeeDraft.numberOfItems !== previous.numberOfItems;
        patchState(store, {
          courtFeeDraft,
          ...(changed &&
            (!courtFeeDraft || !preservePaymentDetails) && {
              courtFeePaymentDetails: null,
              courtFeePaymentOrigin: null,
              courtFeeSuspenseNote: '',
            }),
        });
      },
      /** Stores validated payment details while the user reviews the court fee. */
      setCourtFeePaymentDetails(courtFeePaymentDetails: IFinesMciCourtFeePaymentDetails | null): void {
        patchState(store, { courtFeePaymentDetails });
      },
      /** Records whether payment details were opened from an exact payment or overpayment confirmation. */
      setCourtFeePaymentOrigin(courtFeePaymentOrigin: FinesMciCourtFeePaymentOrigin | null): void {
        patchState(store, { courtFeePaymentOrigin });
      },
      /** Keeps the in-progress suspense note while the user edits the payment. */
      setCourtFeeSuspenseNote(courtFeeSuspenseNote: string): void {
        patchState(store, { courtFeeSuspenseNote });
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
      /** Clears the business unit, tills, payment drafts and submitted search criteria. */
      reset(): void {
        patchState(store, {
          businessUnit: null,
          tills: [],
          criminalSearch: null,
          courtFeeDraft: null,
          courtFeePaymentDetails: null,
          courtFeePaymentOrigin: null,
          courtFeeSuspenseNote: '',
          criminalSearchResults: null,
          selectedCriminalAccount: null,
          selectedCriminalAccountAtAGlance: null,
          selectedCriminalAccountHeader: null,
          draftJourney: null,
        });
      },
    };
  }),
);

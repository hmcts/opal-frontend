import { Injectable } from '@angular/core';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';
import { IFinesMacOffenceDetailsForm } from '../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacAccountDetailsForm } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacPayloadService {
  private defendantType!: string | null;
  private accountType!: string | null;
  private businessUnit!: string | null;
  private isCompany!: boolean;

  private buildOffences() {}

  private buildDefendant() {}

  private buildFpTicketDetails() {}

  private buildPaymentTerms() {}

  private buildAccountNotes() {}

  private initialSetup(accountDetailsState: IFinesMacAccountDetailsState): void {
    const {
      fm_create_account_defendant_type: defendantType,
      fm_create_account_account_type: accountType,
      fm_create_account_business_unit: businessUnit,
    } = accountDetailsState;

    this.defendantType = defendantType;
    this.accountType = accountType;
    this.businessUnit = businessUnit;

    this.isCompany = accountType === 'company';
  }

  public buildPayload(finesMacState: IFinesMacState): any {
    const { courtDetails, accountDetails, paymentTerms } = finesMacState;
    const courtDetailsState = courtDetails.formData;
    const accountDetailsState = accountDetails.formData;
    const paymentTermsState = paymentTerms.formData;

    // Setup frequently used values.
    this.initialSetup(accountDetailsState);

    return {
      account_type: this.accountType,
      defendant_type: this.defendantType,
      originator_name: 'awaiting autocomplete change',
      originator_id: 'awaiting autocomplete change',
      prosecutor_case_reference: courtDetailsState['fm_court_details_prosecutor_case_reference'],
      enforcement_court_id: 'awaiting autocomplete change',
      collection_order_made: paymentTermsState['fm_payment_terms_collection_order_made'],
      collection_order_made_today: paymentTermsState['fm_payment_terms_make_collection_order_today'],
      collection_order_date: paymentTermsState['fm_payment_terms_collection_order_date'],
      suspended_committal_date: paymentTermsState['fm_payment_terms_suspended_committal_date'],
      payment_card_request: paymentTermsState['fm_payment_terms_payment_card_request'],
      account_sentence_date: '2023-09-15', // Derived from from the earliest of all offence sentence dates
    };
  }
}

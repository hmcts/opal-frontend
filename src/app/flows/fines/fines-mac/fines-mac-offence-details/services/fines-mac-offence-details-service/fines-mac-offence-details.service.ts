import { Injectable } from '@angular/core';
import { IFinesMacOffenceDetailsDraftState } from '../../interfaces/fines-mac-offence-details-draft-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../../constants/fines-mac-offence-details-draft-state.constant';
import { IFinesMacOffenceDetailsForm } from '../../interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsReviewSummaryForm } from '../../fines-mac-offence-details-review/interfaces/fines-mac-offence-details-review-summary-form.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacOffenceDetailsService {
  public finesMacOffenceDetailsDraftState: IFinesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
  public offenceIndex: number = 0;
  public emptyOffences: boolean = false;
  public addedOffenceCode!: string;
  public minorCreditorAdded!: boolean;
  public offenceRemoved!: boolean;
  public offenceCodeMessage!: string;

  /**
   * Removes the index from the keys of the `fm_offence_details_impositions` array in each form data object.
   * @param forms - An array of `IFinesMacOffenceDetailsForm` objects.
   * @returns An array of `IFinesMacOffenceDetailsForm` objects with the index removed from the keys of `fm_offence_details_impositions`.
   */
  public removeIndexFromImpositionKeys(
    forms: IFinesMacOffenceDetailsForm[],
  ): IFinesMacOffenceDetailsReviewSummaryForm[] {
    const uniqueDates = new Set<string>(); // Track unique dates of offence
    return forms.map((form) => {
      const dateOfOffence = form.formData.fm_offence_details_date_of_offence;

      let show_date_of_sentence = false;
      if (dateOfOffence && !uniqueDates.has(dateOfOffence)) {
        show_date_of_sentence = true;
        uniqueDates.add(dateOfOffence);
      }

      return {
        formData: {
          ...form.formData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fm_offence_details_impositions: form.formData.fm_offence_details_impositions.map((imposition: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cleanedImposition: any = {};
            Object.keys(imposition).forEach((key) => {
              // Use regex to remove the _{{index}} from the key
              const newKey = key.replace(/_\d+$/, '');
              cleanedImposition[newKey] = imposition[key];
            });
            return cleanedImposition;
          }),
          show_date_of_sentence,
        },
        nestedFlow: form.nestedFlow,
        status: form.status,
      };
    });
  }
}

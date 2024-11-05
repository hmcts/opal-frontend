import { IFinesMacOffenceDetailsForm } from '../../interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsReviewSummaryState } from './fines-mac-offence-details-review-summary-state.interface';

export interface IFinesMacOffenceDetailsReviewSummaryForm extends IFinesMacOffenceDetailsForm {
  formData: IFinesMacOffenceDetailsReviewSummaryState;
}

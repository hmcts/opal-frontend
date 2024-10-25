import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_STATE_MOCK } from './fines-mac-offence-details-review-summary-state.mock';
import { IFinesMacOffenceDetailsReviewSummaryForm } from '../interfaces/fines-mac-offence-details-review-summary-form.interface';
import { FINES_MAC_STATUS } from '../../../constants/fines-mac-status';

export const FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK: IFinesMacOffenceDetailsReviewSummaryForm[] = [
  {
    formData: FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_STATE_MOCK[0],
    nestedFlow: false,
    status: FINES_MAC_STATUS.PROVIDED,
  },
  {
    formData: FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_STATE_MOCK[1],
    nestedFlow: false,
    status: FINES_MAC_STATUS.PROVIDED,
  },
];

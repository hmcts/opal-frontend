import { IFinesMacOffenceDetailsReviewSummaryState } from '../interfaces/fines-mac-offence-details-review-summary-state.interface';

export const FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_STATE_MOCK: IFinesMacOffenceDetailsReviewSummaryState[] = [
  {
    fm_offence_details_id: 0,
    fm_offence_details_date_of_offence: '01/09/2024',
    fm_offence_details_offence_code: 'AK123456',
    fm_offence_details_impositions: [
      {
        fm_offence_details_result_code: 'FCC',
        fm_offence_details_amount_imposed: 200,
        fm_offence_details_amount_paid: 50,
        fm_offence_details_balance_remaining: 150,
        fm_offence_details_needs_creditor: true,
        fm_offence_details_creditor: 'major',
        fm_offence_details_major_creditor: 3856,
        fm_offence_details_minor_creditor: null,
      },
    ],
    show_date_of_sentence: true,
  },
  {
    fm_offence_details_id: 1,
    fm_offence_details_date_of_offence: '01/09/2024',
    fm_offence_details_offence_code: 'AK123456',
    fm_offence_details_impositions: [
      {
        fm_offence_details_result_code: 'FCC',
        fm_offence_details_amount_imposed: 200,
        fm_offence_details_amount_paid: 50,
        fm_offence_details_balance_remaining: 150,
        fm_offence_details_needs_creditor: true,
        fm_offence_details_creditor: 'major',
        fm_offence_details_major_creditor: 3856,
        fm_offence_details_minor_creditor: null,
      },
    ],
    show_date_of_sentence: false,
  },
];

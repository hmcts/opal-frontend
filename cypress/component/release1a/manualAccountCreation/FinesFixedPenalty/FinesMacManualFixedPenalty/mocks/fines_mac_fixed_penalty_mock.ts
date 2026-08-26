import { FINES_MAC_STATE_MOCK } from '../../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';

export const FINES_FIXED_PENALTY_MOCK = {
  // Include all properties from FINES_MAC_STATE_MOCK as the base structure
  ...FINES_MAC_STATE_MOCK,

  // Override the fixedPenaltyDetails section with both required properties
  fixedPenaltyDetails: {
    // Set nestedFlow to a boolean value as required by the interface
    nestedFlow: false,

    // All fields blank/empty
    formData: {
      // Offence Details Section
      fm_offence_details_notice_number: '',
      fm_offence_details_offence_type: 'vehicle',
      fm_offence_details_date_of_offence: '',
      fm_offence_details_offence_id: null,
      fm_offence_details_offence_cjs_code: '',
      fm_offence_details_time_of_offence: '',
      fm_offence_details_place_of_offence: '',
      fm_offence_details_amount_imposed: null,
      fm_offence_details_vehicle_registration_number: '',
      fm_offence_details_driving_licence_number: '',
      fm_offence_details_nto_nth: '',
      fm_offence_details_date_nto_issued: '',
      fm_court_details_issuing_authority_id: '',
    },
  },
};

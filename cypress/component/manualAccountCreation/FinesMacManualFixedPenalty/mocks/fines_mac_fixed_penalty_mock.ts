import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';

export const FINES_FIXED_PENALTY_MOCK = {
  // Include all properties from FINES_MAC_STATE_MOCK as the base structure
  ...FINES_MAC_STATE_MOCK,

  // Override the fixedPenaltyDetails section with both required properties
  fixedPenaltyDetails: {
    // Add the missing nestedFlow property
    nestedFlow: {
      completed: true,
      current: null,
      isValid: true,
    },

    // Keep the formData as before
    formData: {
      fm_fixed_penalty_details_issuing_authority: 'West London Police',
      fm_fixed_penalty_details_enforcement_court: "Westminster Magistrates' Court",
      fm_fixed_penalty_details_title: 'Mr',
      fm_fixed_penalty_details_forenames: 'John',
      fm_fixed_penalty_details_surname: 'Smith',
      fm_fixed_penalty_details_dob: '01/01/1990',
      fm_fixed_penalty_details_address_line_1: '123 Test Street',
      fm_fixed_penalty_details_address_line_2: 'Test Area',
      fm_fixed_penalty_details_post_code: 'SW1A 1AA',
      fm_fixed_penalty_details_notice_number: 'FPN12345678',
      fm_fixed_penalty_details_vehicle_registration: 'AB12CDE',
      fm_fixed_penalty_details_driving_licence: 'SMITH901011J99AB',
      fm_fixed_penalty_details_date_of_offence: '01/01/2023',
      fm_fixed_penalty_details_offence_code: 'CJ03507',
      fm_fixed_penalty_details_time_of_offence: '14:30',
      fm_fixed_penalty_details_place_of_offence: 'Oxford Street, London',
      fm_fixed_penalty_details_amount_imposed: '150',
      fm_fixed_penalty_details_is_vehicle_offence: true,
    },
  },

  // Additional validation properties remain unchanged
  validIssuingAuthority: 'West London Police',
  validEnforcementCourt: "Westminster Magistrates' Court",
  validTitle: 'Mr',
  validFirstName: 'John',
  validLastName: 'Smith',
  validDob: '01/01/1990',
  futureDob: '01/01/2050',
  validAddressLine1: '123 Test Street',
  validPostcode: 'SW1A 1AA',
  validNoticeNumber: 'FPN12345678',
  validVehicleRegistration: 'AB12CDE',
  validDrivingLicence: 'SMITH901011J99AB',
  validDateOfOffence: '01/01/2023',
  validOffenceCode: 'CJ03507',
  validPlaceOfOffence: 'Oxford Street, London',
  validAmountImposed: '150',
};

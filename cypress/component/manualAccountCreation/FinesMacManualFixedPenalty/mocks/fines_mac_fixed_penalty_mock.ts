import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';

export const FINES_FIXED_PENALTY_MOCK = {
  // Include all properties from FINES_MAC_STATE_MOCK as the base structure
  ...FINES_MAC_STATE_MOCK,
  
  // Override the fixedPenaltyDetails section with both required properties
  fixedPenaltyDetails: {
    // Set nestedFlow to a boolean value as required by the interface
    nestedFlow: true,
    
    // Keep the formData as before
    formData: {
      fm_offence_details_notice_number: "FPN12345678",
      fm_offence_details_offence_type: "Vehicle",
      fm_offence_details_date_of_offence: "01/01/2023",
      fm_offence_details_offence_id: 12345,
      fm_offence_details_offence_cjs_code: "CJ03507",
      fm_offence_details_time_of_offence: "14:30",
      fm_offence_details_place_of_offence: "Oxford Street, London",
      fm_offence_details_amount_imposed: "150",
      fm_offence_details_vehicle_registration_number: "AB12CDE",
      fm_offence_details_driving_licence_number: "SMITH901011J99AB",
      fm_offence_details_nto_nth: null,
      fm_offence_details_date_nto_issued: null,
      fm_court_details_issuing_authority_id: "West London Police"
    }
  },

  // Additional validation properties remain unchanged
  validIssuingAuthority: "West London Police",
  validEnforcementCourt: "Westminster Magistrates' Court",
  validTitle: "Mr",
  validFirstName: "John", 
  validLastName: "Smith",
  validDob: "01/01/1990",
  futureDob: "01/01/2050",
  validAddressLine1: "123 Test Street",
  validPostcode: "SW1A 1AA",
  validNoticeNumber: "FPN12345678",
  validVehicleRegistration: "AB12CDE",
  validDrivingLicence: "SMITH901011J99AB",
  validDateOfOffence: "01/01/2023",
  validOffenceCode: "CJ03507",
  validPlaceOfOffence: "Oxford Street, London",
  validAmountImposed: "150"
};
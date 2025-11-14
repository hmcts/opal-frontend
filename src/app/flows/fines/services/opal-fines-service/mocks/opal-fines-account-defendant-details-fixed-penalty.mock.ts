import { IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData } from '../interfaces/opal-fines-account-defendant-details-fixed-penalty-tab-ref-data.interface';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK: IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData =
  {
    version: null,
    vehicle_fixed_penalty_flag: false,
    fixed_penalty_ticket_details: {
      issuing_authority: 'City of Metropolis',
      ticket_number: 'FP-123456',
      time_of_offence: '14:30',
      place_of_offence: 'Main Street, Metropolis',
    },
    vehicle_fixed_penalty_details: {
      vehicle_registration_number: 'XY21 ABC',
      vehicle_drivers_license: 'LIC-789012',
      notice_number: 'NT-345678',
      date_notice_issued: '01/05/2023',
    },
  };

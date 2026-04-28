import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData extends IOpalFinesVersion {
  vehicle_fixed_penalty_flag: boolean;
  fixed_penalty_ticket_details: {
    issuing_authority: string;
    ticket_number: string;
    time_of_offence: string;
    place_of_offence: string;
  };
  vehicle_fixed_penalty_details: {
    vehicle_registration_number: string;
    vehicle_drivers_license: string;
    notice_number: string;
    date_notice_issued: string;
  } | null;
}

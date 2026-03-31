/**
 * @file draft-account.seed-builders.ts
 * @description
 * Typed payload-override builders used by Draft Account step definitions.
 * These helpers keep step files focused on Gherkin parsing and orchestration
 * while centralizing the nested override shapes merged into draft fixtures.
 */

export type DraftAccountSeedOverrides = Record<string, unknown>;

/**
 * Input values required to build a published non-vehicle fixed-penalty defendant seed override.
 */
export interface PublishedNonVehicleFixedPenaltySeedInput {
  businessUnitId: number;
  issuingAuthority: string;
  ticketNumber: string;
  title: string;
  firstNames: string;
  lastName: string;
  timeOfOffence: string;
  placeOfOffence: string;
}

/**
 * Input values required to build a published vehicle fixed-penalty company seed override.
 */
export interface PublishedVehicleFixedPenaltyCompanySeedInput {
  businessUnitId: number;
  issuingAuthority: string;
  ticketNumber: string;
  companyName: string;
  registrationNumber: string;
  drivingLicence: string;
  ntoNumber: string;
  dateNoticeIssued: string;
  timeOfOffence: string;
  placeOfOffence: string;
}

/**
 * Builds payload overrides for a published non-vehicle fixed-penalty defendant seed.
 * @param input - Normalized feature values used to override the fixed-penalty fixture.
 * @returns Nested override object merged into the draft fixture before creation.
 */
export function buildPublishedNonVehicleFixedPenaltyOverrides(
  input: PublishedNonVehicleFixedPenaltySeedInput,
): DraftAccountSeedOverrides {
  const { businessUnitId, issuingAuthority, ticketNumber, title, firstNames, lastName, timeOfOffence, placeOfOffence } =
    input;

  return {
    business_unit_id: businessUnitId,
    account: {
      originator_name: issuingAuthority,
      prosecutor_case_reference: ticketNumber,
      collection_order_made: false,
      collection_order_made_today: false,
      payment_card_request: false,
      defendant: {
        title,
        forenames: firstNames,
        surname: lastName,
        debtor_detail: {
          vehicle_registration_mark: null,
        },
      },
      offences: [
        {
          offence_type: 'Non-vehicle',
        },
      ],
      fp_ticket_detail: {
        ticket_number: ticketNumber,
        notice_number: ticketNumber,
        offence_type: 'Non-vehicle',
        offence_location: placeOfOffence,
        place_of_offence: placeOfOffence,
        time_of_offence: timeOfOffence,
        time_of_issue: timeOfOffence,
        vehicle_registration: null,
        fp_registration_number: null,
        driving_licence_number: null,
        fp_driving_licence_number: null,
        notice_to_hirer_number: null,
        notice_to_owner_hirer: null,
        date_notice_to_owner_issued: null,
      },
    },
  };
}

/**
 * Builds payload overrides for a published vehicle fixed-penalty company seed.
 * @param input - Normalized feature values used to override the fixed-penalty company fixture.
 * @returns Nested override object merged into the draft fixture before creation.
 */
export function buildPublishedVehicleFixedPenaltyCompanyOverrides(
  input: PublishedVehicleFixedPenaltyCompanySeedInput,
): DraftAccountSeedOverrides {
  const {
    businessUnitId,
    issuingAuthority,
    ticketNumber,
    companyName,
    registrationNumber,
    drivingLicence,
    ntoNumber,
    dateNoticeIssued,
    timeOfOffence,
    placeOfOffence,
  } = input;

  return {
    business_unit_id: businessUnitId,
    account: {
      originator_name: issuingAuthority,
      prosecutor_case_reference: ticketNumber,
      collection_order_made: false,
      collection_order_made_today: false,
      payment_card_request: false,
      defendant: {
        company_flag: true,
        company_name: companyName,
        debtor_detail: {
          vehicle_registration_mark: registrationNumber,
        },
      },
      offences: [
        {
          offence_type: 'Vehicle',
        },
      ],
      fp_ticket_detail: {
        ticket_number: ticketNumber,
        notice_number: ticketNumber,
        offence_type: 'Vehicle',
        offence_location: placeOfOffence,
        place_of_offence: placeOfOffence,
        time_of_offence: timeOfOffence,
        time_of_issue: timeOfOffence,
        vehicle_registration: registrationNumber,
        fp_registration_number: registrationNumber,
        driving_licence_number: drivingLicence,
        fp_driving_licence_number: drivingLicence,
        notice_to_hirer_number: ntoNumber,
        notice_to_owner_hirer: ntoNumber,
        date_notice_to_owner_issued: dateNoticeIssued,
        date_of_issue: dateNoticeIssued,
      },
    },
  };
}

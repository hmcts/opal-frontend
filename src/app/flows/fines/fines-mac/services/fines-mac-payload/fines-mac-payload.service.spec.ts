import { TestBed } from '@angular/core/testing';

import { FinesMacPayloadService } from './fines-mac-payload.service';

import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../fines-mac-account-details/mocks/fines-mac-account-details-state.mock';

import { FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from '../../fines-mac-company-details/mocks/fines-mac-company-details-state.mock';

import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';

import { FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK } from '../../fines-mac-employer-details/mocks/fines-mac-employer-details-state.mock';

import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';

import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../../fines-mac-parent-guardian-details/mocks/fines-mac-parent-guardian-details-state.mock';

import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';

describe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a payload', () => {
    const finesMacState: IFinesMacState = {
      ...FINES_MAC_STATE_MOCK,
      accountDetails: {
        ...FINES_MAC_STATE_MOCK.accountDetails,
        formData: {
          ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
          fm_create_account_defendant_type: 'individual',
        },
      },
      personalDetails: {
        ...FINES_MAC_STATE_MOCK.personalDetails,
        formData: {
          ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
          fm_personal_details_add_alias: false,
          fm_personal_details_aliases: [],
        },
      },
      contactDetails: {
        ...FINES_MAC_STATE_MOCK.contactDetails,
        formData: {
          ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
        },
      },
      employerDetails: {
        ...FINES_MAC_STATE_MOCK.employerDetails,
        formData: {
          ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
        },
      },
      languagePreferences: {
        ...FINES_MAC_STATE_MOCK.languagePreferences,
        formData: {
          ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
        },
      },
      companyDetails: {
        ...FINES_MAC_STATE_MOCK.companyDetails,
        formData: {
          ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK,
        },
      },
      parentGuardianDetails: {
        ...FINES_MAC_STATE_MOCK.parentGuardianDetails,
        formData: {
          ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
        },
      },
      accountCommentsNotes: {
        ...FINES_MAC_STATE_MOCK.accountCommentsNotes,
        formData: {
          fm_account_comments_notes_comments: 'Test comment',
          fm_account_comments_notes_notes: 'Test note',
        },
      },
      paymentTerms: {
        ...FINES_MAC_STATE_MOCK.accountCommentsNotes,
        formData: {
          fm_payment_terms_payment_terms: 'payInFull',
          fm_payment_terms_payment_card_request: true,
          fm_payment_terms_collection_order_made: true,
          fm_payment_terms_has_days_in_default: true,
          fm_payment_terms_add_enforcement_action: true,
          fm_payment_terms_collection_order_date: '2024-10-21',
          fm_payment_terms_pay_by_date: '2024-10-14',
          fm_payment_terms_suspended_committal_date: '2024-10-11',
          fm_payment_terms_default_days_in_jail: 11,
          fm_payment_terms_enforcement_action: 'defendantIsInCustody',
          fm_payment_terms_earliest_release_date: '2024-10-21',
          fm_payment_terms_prison_and_prison_number: 'Test and test',
        },
      },
    };

    const result = service.buildPayload(finesMacState);

    expect(result).toEqual({
      account_type: 'conditionalCaution',
      defendant_type: 'individual',
      originator_name: null,
      originator_id: null,
      prosecutor_case_reference: null,
      enforcement_court_id: null,
      collection_order_made: true,
      collection_order_made_today: null,
      collection_order_date: '2024-10-21',
      suspended_committal_date: '2024-10-11',
      payment_card_request: true,
      account_sentence_date: null,
      defendant: {
        company_flag: false,
        title: 'Mr',
        surname: 'Doe',
        forenames: 'John',
        organisation_name: null,
        dob: '01/01/1990',
        address_line_1: '123 Street',
        address_line_2: 'City',
        address_line_3: 'County',
        address_line_4: null,
        address_line_5: null,
        post_code: 'AB12 3CD',
        telephone_number_home: '12345678910',
        telephone_number_business: '12345678910',
        telephone_number_mobile: '12345678910',
        email_address_1: 'abc@def.co.uk',
        email_address_2: 'abc@def.co.uk',
        national_insurance_number: 'AB123456C',
        driving_licence_number: null,
        pnc_id: null,
        nationality_1: null,
        nationality_2: null,
        ethnicity_self_defined: null,
        ethnicity_observed: null,
        cro_number: null,
        occupation: null,
        gender: null,
        custody_status: null,
        prison_number: null,
        interpreter_lang: null,
        debtor_detail: {
          vehicle_make: 'Ford',
          vehicle_registration_mark: 'AB123CDE',
          document_language: 'welshEnglish',
          hearing_language: 'welshEnglish',
          employee_reference: 'Test Reference',
          employer_company_name: 'Test Employer Name',
          employer_address_line_1: 'Test Employer Address 1',
          employer_address_line_2: 'Test Employer Address 2',
          employer_address_line_3: 'Test Employer Address 3',
          employer_address_line_4: 'Test Employer Address 4',
          employer_address_line_5: 'Test Employer Address 5',
          employer_post_code: 'TE10 1ST',
          employer_telephone_number: '12345678910',
          employer_email_address: 'abc@def.co.uk',
          aliases: null,
        },
        parent_guardian: {
          company_flag: null,
          company_name: null,
          surname: null,
          forenames: null,
          dob: null,
          national_insurance_number: null,
          address_line_1: null,
          address_line_2: null,
          address_line_3: null,
          address_line_4: null,
          address_line_5: null,
          post_code: null,
          telephone_number_home: null,
          telephone_number_business: null,
          telephone_number_mobile: null,
          email_address_1: null,
          email_address_2: null,
          debtor_detail: {
            vehicle_make: null,
            vehicle_registration_mark: null,
            document_language: null,
            hearing_language: null,
            employee_reference: null,
            employer_company_name: null,
            employer_address_line_1: null,
            employer_address_line_2: null,
            employer_address_line_3: null,
            employer_address_line_4: null,
            employer_address_line_5: null,
            employer_post_code: null,
            employer_telephone_number: null,
            employer_email_address: null,
            aliases: null,
          },
        },
      },
      offences: null,
      fp_ticket_detail: null,
      payment_terms: {
        payment_terms_type_code: 'B',
        effective_date: '2024-10-14',
        instalment_period: null,
        lump_sum_amount: null,
        instalment_amount: null,
        default_days_in_jail: 11,
        enforcements: [
          {
            result_id: 'PRIS',
            enforcement_result_responses: [
              {
                parameter_name: 'earliestreleasedate',
                response: '2024-10-21',
              },
              {
                parameter_name: 'prisonandprisonnumber',
                response: 'Test and test',
              },
            ],
          },
        ],
      },
      account_notes: [
        {
          account_note_serial: 3,
          account_note_text: 'Test comment',
          note_type: 'AC',
        },
        {
          account_note_serial: 2,
          account_note_text: 'Test note',
          note_type: 'AA',
        },
      ],
    });
  });
});

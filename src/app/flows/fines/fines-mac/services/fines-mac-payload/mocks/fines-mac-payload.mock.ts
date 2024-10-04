export const FINES_MAC_PAYLOAD_MOCK = {
  account_type: 'Adult',
  defendant_type: 'PG to Pay',
  originator_name: 'LJS',
  originator_id: '12345',
  prosecutor_case_reference: 'ABC123456',
  enforcement_court_id: 987,
  collection_order_made: true,
  collection_order_made_today: true,
  collection_order_date: '2023-09-10',
  suspended_committal_date: '2023-12-15',
  payment_card_request: true,
  account_sentence_date: '2023-09-15',
  defendant: {
    company_flag: false,
    title: 'Mr',
    surname: 'Smith',
    forenames: 'John',
    dob: '1980-05-20',
    address_line_1: '123 High Street',
    address_line_2: 'Suite 10',
    address_line_3: 'Old Town',
    address_line_4: 'Some City',
    address_line_5: 'Region X',
    post_code: 'AB12 3CD',
    telephone_number_home: '01234 567890',
    telephone_number_business: '01234 678901',
    telephone_number_mobile: '07700 900123',
    email_address_1: 'john.smith@example.com',
    email_address_2: 'john.smith.secondary@example.com',
    national_insurance_number: 'AB123456C',
    driving_licence_number: 'SMITH12345678A99BC',
    pnc_id: 'PNC1234567',
    nationality_1: 'British',
    nationality_2: 'None',
    ethnicity_self_defined: 'White',
    ethnicity_observed: 'White',
    cro_number: 'CRO123456',
    occupation: 'Engineer',
    gender: 'Male',
    custody_status: 'Released',
    prison_number: 'PRISON1234',
    interpreter_lang: 'None',
    debtor_detail: {
      vehicle_make: 'Ford',
      vehicle_registration_mark: 'AB12CDE',
      document_language: 'English',
      hearing_language: 'English',
      employee_reference: 'EMP12345',
      employer_company_name: 'TechCorp',
      employer_address_line_1: '1 Innovation Park',
      employer_address_line_2: 'Tech Avenue',
      employer_address_line_3: 'Tech City',
      employer_address_line_4: 'Region Y',
      employer_address_line_5: 'State Z',
      employer_post_code: 'TC1 4YZ',
      employer_telephone_number: '01234 765432',
      employer_email_address: 'hr@techcorp.com',
      aliases: [
        {
          alias_forenames: 'Jonathan',
          alias_surname: 'Doe',
          alias_company_name: 'Doe Enterprises',
        },
      ],
    },
    parent_guardian: {
      company_flag: false,
      company_name: '',
      surname: 'Smith',
      forenames: 'Jane',
      dob: '1955-01-15',
      national_insurance_number: 'AB987654D',
      address_line_1: '456 Elm Street',
      address_line_2: 'Flat 2A',
      address_line_3: 'West City',
      address_line_4: 'Another Region',
      address_line_5: 'Postcode W12',
      post_code: 'WC1A 1AA',
      telephone_number_home: '0208 123456',
      telephone_number_business: '0208 654321',
      telephone_number_mobile: '07999 123456',
      email_address_1: 'jane.smith@example.com',
      email_address_2: 'j.smith@anothermail.com',
      debtor_detail: {
        vehicle_make: 'Volkswagen',
        vehicle_registration_mark: 'ZX12FDE',
        document_language: 'English',
        hearing_language: 'English',
      },
    },
  },
  offences: [
    {
      date_of_sentence: '2023-09-10',
      imposing_court_id: 123,
      offence_id: 456,
      impositions: [
        {
          result_id: 1,
          amount_imposed: 500.0,
          amount_paid: 150.0,
          major_creditor_id: 789,
          minor_creditor: {
            company_flag: true,
            title: 'Director',
            company_name: 'Minor Creditor Corp',
            surname: 'Doe',
            forenames: 'Jane',
            dob: '1975-02-25',
            address_line_1: '789 Maple Road',
            address_line_2: '',
            address_line_3: '',
            address_line_4: '',
            address_line_5: '',
            post_code: 'XY12 8AB',
            telephone: '01234 678905',
            email_address: 'jane.doe@creditorcorp.com',
            payout_hold: false,
            pay_by_bacs: true,
            bank_account_type: 'Business',
            bank_sort_code: '20-50-50',
            bank_account_number: '12345678',
            bank_account_name: 'Creditor Corp',
            bank_account_ref: 'CCORP-123',
          },
        },
      ],
    },
  ],
  fp_ticket_detail: {
    notice_number: 'FP123456',
    date_of_issue: '2023-08-01',
    time_of_issue: '09:30:00',
    fp_registration_number: 'FPREG1234',
    notice_to_owner_hirer: 'Mr John Smith',
    place_of_offence: 'City Centre',
    fp_driving_licence_number: 'SMITH12345678A99BC',
  },
  payment_terms: {
    payment_terms_type_code: 'B',
    effective_date: '2023-09-16',
    instalment_period: 'M',
    lump_sum_amount: 200.0,
    instalment_amount: 50.0,
    default_days_in_jail: 10,
    enforcements: [
      {
        result_id: 'PRIS',
        enforcement_result_responses: [
          {
            parameter_name: 'Reason',
            response: 'Failure to Pay',
          },
        ],
      },
    ],
  },
  account_notes: [
    {
      account_note_serial: 1,
      account_note_text: 'Initial account creation',
      note_type: 'AC',
    },
  ],
};

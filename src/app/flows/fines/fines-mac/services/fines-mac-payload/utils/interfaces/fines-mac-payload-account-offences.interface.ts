export interface IFinesMacPayloadAccountOffencesMinorCreditor {
  company_flag: boolean | null;
  title: string | null;
  company_name: string | null;
  surname: string | null;
  forenames: string | null;
  dob: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  post_code: string | null;
  telephone: string | null;
  email_address: string | null;
  payout_hold: boolean | null;
  pay_by_bacs: boolean | null;
  bank_account_type: number | null;
  bank_sort_code: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  bank_account_ref: string | null;
}

export interface IFinesMacPayloadAccountOffencesImposition {
  result_id: string | null;
  amount_imposed: number | null;
  amount_paid: number | null;
  major_creditor_id: number | null;
  minor_creditor: IFinesMacPayloadAccountOffencesMinorCreditor | null;
}

export interface IFinesMacPayloadAccountOffences {
  date_of_sentence: string | null;
  imposing_court_id: string | null;
  offence_id: string | null;
  impositions: IFinesMacPayloadAccountOffencesImposition[] | null;
}

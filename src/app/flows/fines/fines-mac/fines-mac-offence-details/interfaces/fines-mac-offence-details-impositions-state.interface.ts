export interface IFinesMacOffenceDetailsImpositionsState {
  fm_offence_details_result_code: string | null;
  fm_offence_details_amount_imposed: number | null;
  fm_offence_details_amount_paid: number | null;
  fm_offence_details_balance_remaining: number | null;
  fm_offence_details_needs_creditor: boolean | null;
  fm_offence_details_creditor: string | null;
}

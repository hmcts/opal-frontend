import { IFinesMacOffenceDetailsImpositionsState } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-impositions-state.interface';

export const IMPOSITION_MOCK_1: IFinesMacOffenceDetailsImpositionsState[] = [
  {
    fm_offence_details_imposition_id: 0,
    fm_offence_details_result_id: 'FCOMP',
    fm_offence_details_amount_imposed: 100,
    fm_offence_details_amount_paid: 50,
    fm_offence_details_balance_remaining: 50,
    fm_offence_details_needs_creditor: true,
    fm_offence_details_creditor: '',
    fm_offence_details_major_creditor_id: 3856,
  },
];

export const IMPOSITION_MOCK_2: IFinesMacOffenceDetailsImpositionsState[] = [
  {
    fm_offence_details_imposition_id: 0,
    fm_offence_details_result_id: 'FCOMP',
    fm_offence_details_amount_imposed: 100,
    fm_offence_details_amount_paid: 50,
    fm_offence_details_balance_remaining: 50,
    fm_offence_details_needs_creditor: true,
    fm_offence_details_creditor: '',
    fm_offence_details_major_creditor_id: 3856,
  },
  {
    fm_offence_details_imposition_id: 0,
    fm_offence_details_result_id: 'FCOMP',
    fm_offence_details_amount_imposed: 100,
    fm_offence_details_amount_paid: 50,
    fm_offence_details_balance_remaining: 50,
    fm_offence_details_needs_creditor: true,
    fm_offence_details_creditor: '',
    fm_offence_details_major_creditor_id: 3856,
  },
];

export const IMPOSITION_MOCK_3: IFinesMacOffenceDetailsImpositionsState[] = [
  {
    fm_offence_details_imposition_id: 0,
    fm_offence_details_result_id: 'FVS',
    fm_offence_details_amount_imposed: 100,
    fm_offence_details_amount_paid: 50,
    fm_offence_details_balance_remaining: 50,
    fm_offence_details_needs_creditor: false,
    fm_offence_details_creditor: '',
    fm_offence_details_major_creditor_id: 3856,
  },
];

export const IMPOSITION_MOCK_4: IFinesMacOffenceDetailsImpositionsState[] = [
  {
    fm_offence_details_imposition_id: 0,
    fm_offence_details_result_id: 'FCOMP',
    fm_offence_details_amount_imposed: 100,
    fm_offence_details_amount_paid: 50,
    fm_offence_details_balance_remaining: 50,
    fm_offence_details_needs_creditor: true,
    fm_offence_details_creditor: '',
    fm_offence_details_major_creditor_id: null,
  },
];

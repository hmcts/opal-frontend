import { IFinesMacOffenceDetailsImpositionFieldNames } from '../interfaces/fines-mac-offence-details-imposition-field-names.interface';

export const FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES: IFinesMacOffenceDetailsImpositionFieldNames = {
  dynamicFieldPrefix: 'fm_offence_details',
  fieldNames: [
    'amount_imposed',
    'amount_paid',
    'balance_remaining',
    'creditor',
    'needs_creditor',
    'result_id',
    'major_creditor_id',
  ],
};

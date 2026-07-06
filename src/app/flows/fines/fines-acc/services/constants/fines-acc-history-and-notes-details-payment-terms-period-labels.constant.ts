import { FINES_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../../../constants/fines-payment-terms-frequency-options.constant';

export const FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_PERIOD_LABELS = Object.entries(
  FINES_PAYMENT_TERMS_FREQUENCY_OPTIONS,
).reduce<Record<string, string>>((labels, [code, label]) => {
  labels[code] = `${label.toLowerCase()} from`;
  return labels;
}, {});

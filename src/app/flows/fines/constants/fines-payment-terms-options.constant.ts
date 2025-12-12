import { IFinesPaymentTermsFrequencyOptions } from '../interfaces/fines-payment-terms-options.interface';
import { IFinesPaymentTermsOptions } from '../interfaces/fines-payment-terms-options.interface';

export const FINES_PAYMENT_TERMS_FREQUENCY_OPTIONS: IFinesPaymentTermsFrequencyOptions = {
  W: 'Weekly',
  F: 'Fortnightly',
  M: 'Monthly',
};

export const FINES_PAYMENT_TERMS_OPTIONS: IFinesPaymentTermsOptions = {
  payInFull: 'Pay in full',
  instalmentsOnly: 'Instalments only',
  lumpSumPlusInstalments: 'Lump sum plus instalments',
};

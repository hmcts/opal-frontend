import { IFinesPaymentTermsOptions } from '../interfaces/fines-payment-terms-options.interface';
import { IFinesPaymentTermsTypeOptions } from '../interfaces/fines-payment-terms-type-options.interface';

export const FINES_PAYMENT_TERMS_TYPE_CODE_MAP: Record<
  keyof IFinesPaymentTermsOptions,
  keyof IFinesPaymentTermsTypeOptions
> = {
  payInFull: 'B',
  instalmentsOnly: 'I',
  lumpSumPlusInstalments: 'B',
};

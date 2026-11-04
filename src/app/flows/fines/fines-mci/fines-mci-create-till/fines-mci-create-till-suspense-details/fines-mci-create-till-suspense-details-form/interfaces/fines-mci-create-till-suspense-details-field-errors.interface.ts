import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMciCreateTillSuspenseDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  amount: { required: { message: string; priority: number }; validAmount: { message: string; priority: number }; amountFormat: { message: string; priority: number } };
  payerType: { required: { message: string; priority: number } };
  methodOfPayment: { required: { message: string; priority: number } };
  paymentReferencePostalOrder: { maxlength: { message: string; priority: number }; pattern: { message: string; priority: number } };
  paymentReferenceCheque: { maxlength: { message: string; priority: number }; pattern: { message: string; priority: number } };
  paymentReferenceCreditTransfer: { maxlength: { message: string; priority: number }; pattern: { message: string; priority: number } };
  source: { required: { message: string; priority: number } };
  reason: { required: { message: string; priority: number } };
  relevantDetails: { maxlength: { message: string; priority: number }; pattern: { message: string; priority: number } };
}

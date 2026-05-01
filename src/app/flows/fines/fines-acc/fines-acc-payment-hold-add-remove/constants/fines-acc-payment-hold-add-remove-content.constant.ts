import { FINES_ACC_BANNER_MESSAGES } from '../../stores/constants/fines-acc-store-banner-messages.constant';
import { IFinesAccPaymentHoldAddRemoveContent } from '../interfaces/fines-acc-payment-hold-add-remove-content.interface';
import { FinesAccPaymentHoldAddRemoveAction } from '../types/fines-acc-payment-hold-add-remove-actions.type';

export const FINES_ACC_PAYMENT_HOLD_ADD_REMOVE_CONTENT: Record<
  FinesAccPaymentHoldAddRemoveAction,
  IFinesAccPaymentHoldAddRemoveContent
> = {
  add: {
    buttonId: 'addPaymentHold',
    buttonText: 'Yes - add hold',
    headingText: 'Do you want to add a payment hold?',
    holdPayment: true,
  },
  remove: {
    buttonId: 'removePaymentHold',
    buttonText: 'Yes - remove hold',
    headingText: 'Do you want to remove the payment hold?',
    holdPayment: false,
    successMessage: FINES_ACC_BANNER_MESSAGES.paymentHoldRemoved,
  },
};

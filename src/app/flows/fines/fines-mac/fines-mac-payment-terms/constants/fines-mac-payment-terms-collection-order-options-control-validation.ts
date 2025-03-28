import { Validators } from '@angular/forms';
import { IFinesMacPaymentTermsCollectionOrderOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-collection-order-options-control-validation.interface';
import { futureDateValidator, optionalValidDateValidator } from '@hmcts/opal-frontend-common/core/validators';

export const FINES_MAC_PAYMENT_TERMS_COLLECTION_ORDER_OPTIONS_CONTROL_VALIDATION: IFinesMacPaymentTermsCollectionOrderOptionsControlValidation =
  {
    true: {
      fieldsToAdd: [
        {
          controlName: 'fm_payment_terms_collection_order_date',
          validators: [Validators.required, optionalValidDateValidator(), futureDateValidator()],
        },
      ],
      fieldsToRemove: [
        { controlName: 'fm_payment_terms_collection_order_made_today', validators: [] },
        {
          controlName: 'fm_payment_terms_collection_order_date',
          validators: [],
        },
      ],
    },
    false: {
      fieldsToAdd: [
        { controlName: 'fm_payment_terms_collection_order_made_today', validators: [] },
        {
          controlName: 'fm_payment_terms_collection_order_date',
          validators: [],
        },
      ],
      fieldsToRemove: [
        {
          controlName: 'fm_payment_terms_collection_order_date',
          validators: [Validators.required, optionalValidDateValidator(), futureDateValidator()],
        },
      ],
    },
  };

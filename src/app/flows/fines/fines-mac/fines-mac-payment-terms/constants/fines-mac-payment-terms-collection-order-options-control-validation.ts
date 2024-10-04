import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { Validators } from '@angular/forms';
import { IFinesMacPaymentTermsCollectionOrderOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-collection-order-options-control-validation.interface';
import { futureDateValidator } from '@validators/future-date/future-date.validator';

export const FINES_MAC_PAYMENT_TERMS_COLLECTION_ORDER_OPTIONS_CONTROL_VALIDATION: IFinesMacPaymentTermsCollectionOrderOptionsControlValidation =
  {
    yes: {
      fieldsToAdd: [
        {
          controlName: 'fm_payment_terms_collection_order_date',
          validators: [Validators.required, optionalValidDateValidator(), futureDateValidator()],
        },
      ],
      fieldsToRemove: [
        { controlName: 'fm_payment_terms_make_collection_order_today', validators: [] },
        {
          controlName: 'fm_payment_terms_collection_order_date',
          validators: [],
        },
      ],
    },
    no: {
      fieldsToAdd: [
        { controlName: 'fm_payment_terms_make_collection_order_today', validators: [] },
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

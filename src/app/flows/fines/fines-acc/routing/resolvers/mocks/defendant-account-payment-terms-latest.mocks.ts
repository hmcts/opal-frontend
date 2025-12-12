import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IFinesAccPaymentTermsAmendForm } from '../../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-form.interface';

export const MOCK_PAYMENT_TERMS_DATA: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  version: '1.0',
  payment_terms: {
    days_in_default: null,
    date_days_in_default_imposed: null,
    extension: false,
    reason_for_extension: null,
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    },
    effective_date: '2025-01-15',
    instalment_period: {
      instalment_period_code: 'M',
      instalment_period_display_name: 'Monthly',
    },
    lump_sum_amount: 0.0,
    instalment_amount: 50.0,
    posted_details: {
      posted_date: '2025-01-01',
      posted_by: 'TEST001',
      posted_by_name: 'Test User',
    },
  },
  payment_card_last_requested: null,
  last_enforcement: 'ENF123',
};

export const MOCK_RESULT_DATA: IOpalFinesResultRefData = {
  result_id: 'ENF123',
  result_title: 'Test Enforcement Action',
  result_title_cy: 'Gweithred Orfodi Prawf',
  result_type: 'ENFORCEMENT',
  active: true,
  imposition: false,
  imposition_category: undefined,
  imposition_allocation_priority: undefined,
  imposition_accruing: false,
  imposition_creditor: undefined,
  enforcement: true,
  enforcement_override: false,
  further_enforcement_warn: false,
  further_enforcement_disallow: false,
  enforcement_hold: false,
  requires_enforcer: true,
  generates_hearing: false,
  generates_warrant: undefined,
  collection_order: false,
  extend_ttp_disallow: false,
  extend_ttp_preserve_last_enf: false,
  prevent_payment_card: false,
  lists_monies: false,
  result_parameters: '{}',
  allow_payment_terms: undefined,
  requires_employment_data: undefined,
  allow_additional_action: undefined,
  enf_next_permitted_actions: undefined,
  requires_lja: undefined,
  manual_enforcement: undefined,
};

export const MOCK_TRANSFORMED_FORM: IFinesAccPaymentTermsAmendForm = {
  formData: {
    facc_payment_terms_payment_terms: 'instalmentsOnly',
    facc_payment_terms_pay_by_date: null,
    facc_payment_terms_lump_sum_amount: null,
    facc_payment_terms_instalment_amount: 50.0,
    facc_payment_terms_instalment_period: 'M',
    facc_payment_terms_start_date: '15/01/2025',
    facc_payment_terms_payment_card_request: null,
    facc_payment_terms_prevent_payment_card: null,
    facc_payment_terms_has_days_in_default: null,
    facc_payment_terms_suspended_committal_date: null,
    facc_payment_terms_default_days_in_jail: null,
    facc_payment_terms_reason_for_change: null,
    facc_payment_terms_change_letter: null,
  },
  nestedFlow: false,
};

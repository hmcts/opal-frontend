import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesResultRefData } from '../../../../services/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';

/**
 * Base payment terms data structure for testing
 */
export const BASE_PAYMENT_TERMS_DATA: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  version: '1.0',
  payment_terms: {
    days_in_default: null,
    date_days_in_default_imposed: null,
    extension: false,
    reason_for_extension: null,
    payment_terms_type: {
      payment_terms_type_code: 'P',
      payment_terms_type_display_name: 'Paid',
    },
    effective_date: '2025-01-15',
    instalment_period: null,
    lump_sum_amount: null,
    instalment_amount: null,
    posted_details: {
      posted_date: '2025-01-01',
      posted_by: 'TEST001',
      posted_by_name: 'Test User',
    },
  },
  payment_card_last_requested: null,
  last_enforcement: null,
  resultData: null,
};

/**
 * Payment terms data with type P (Pay in Full)
 */
export const PAYMENT_TERMS_PAY_IN_FULL_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'P',
      payment_terms_type_display_name: 'Paid',
    },
  },
};

/**
 * Payment terms data with type I (Instalments Only)
 */
export const PAYMENT_TERMS_INSTALMENTS_ONLY_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    },
    instalment_period: {
      instalment_period_code: 'M',
      instalment_period_display_name: 'Monthly',
    },
    instalment_amount: 50.0,
  },
};

/**
 * Payment terms data with type B (By Date) with lump sum - maps to Lump Sum Plus Instalments
 */
export const PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'B',
      payment_terms_type_display_name: 'By date',
    },
    instalment_period: {
      instalment_period_code: 'W',
      instalment_period_display_name: 'Weekly',
    },
    lump_sum_amount: 100.0,
    instalment_amount: 25.0,
  },
};

/**
 * Payment terms data with type B (By Date) without lump sum - maps to Pay in Full
 */
export const PAYMENT_TERMS_BY_DATE_NO_LUMP_SUM_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'B',
      payment_terms_type_display_name: 'By date',
    },
    lump_sum_amount: 0.0,
  },
};

/**
 * Payment terms data with days in default
 */
export const PAYMENT_TERMS_WITH_DAYS_IN_DEFAULT_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    days_in_default: 5,
    date_days_in_default_imposed: '2025-01-01',
  },
};

/**
 * Payment terms data with zero days in default
 */
export const PAYMENT_TERMS_WITH_ZERO_DAYS_IN_DEFAULT_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    days_in_default: 0,
  },
};

/**
 * Payment terms data with payment card requested
 */
export const PAYMENT_TERMS_WITH_PAYMENT_CARD_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_card_last_requested: '2025-01-10',
};

/**
 * Payment terms data with null effective date
 */
export const PAYMENT_TERMS_NULL_EFFECTIVE_DATE_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    effective_date: null,
  },
};

/**
 * Payment terms data with null instalment amounts and periods
 */
export const PAYMENT_TERMS_NULL_INSTALMENT_DATA_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    },
    instalment_period: null,
    instalment_amount: null,
  },
};

/**
 * Complete instalments scenario with all fields populated
 */
export const PAYMENT_TERMS_COMPLETE_INSTALMENTS_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  version: '1.0',
  payment_terms: {
    days_in_default: 10,
    date_days_in_default_imposed: '2024-12-01',
    extension: false,
    reason_for_extension: null,
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    },
    effective_date: '2025-02-01',
    instalment_period: {
      instalment_period_code: 'F',
      instalment_period_display_name: 'Fortnightly',
    },
    lump_sum_amount: null,
    instalment_amount: 75.0,
    posted_details: {
      posted_date: '2025-01-01',
      posted_by: 'TEST001',
      posted_by_name: 'Test User',
    },
  },
  payment_card_last_requested: '2024-11-15',
  last_enforcement: 'ENF456',
  resultData: null,
};

/**
 * Complete lump sum plus instalments scenario
 */
export const PAYMENT_TERMS_COMPLETE_LUMP_SUM_PLUS_INSTALMENTS_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest =
  {
    version: '1.0',
    payment_terms: {
      days_in_default: null,
      date_days_in_default_imposed: null,
      extension: false,
      reason_for_extension: null,
      payment_terms_type: {
        payment_terms_type_code: 'B',
        payment_terms_type_display_name: 'By date',
      },
      effective_date: '2025-03-01',
      instalment_period: {
        instalment_period_code: 'M',
        instalment_period_display_name: 'Monthly',
      },
      lump_sum_amount: 200.0,
      instalment_amount: 50.0,
      posted_details: {
        posted_date: '2025-01-01',
        posted_by: 'TEST001',
        posted_by_name: 'Test User',
      },
    },
    payment_card_last_requested: null,
    last_enforcement: null,
    resultData: null,
  };

/**
 * Mock result data for enforcement actions
 */
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

/**
 * Mock result data with prevent_payment_card set to true
 */
export const MOCK_RESULT_DATA_WITH_PREVENT_PAYMENT_CARD: IOpalFinesResultRefData = {
  ...MOCK_RESULT_DATA,
  prevent_payment_card: true,
};

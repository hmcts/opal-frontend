import { describe, expect, it } from 'vitest';
import { FINES_PAYMENT_TERMS_TYPE_CODE_MAP } from '../../../constants/fines-payment-terms-type-code-map.constant';
import { FINES_PAYMENT_TERMS_TYPE_DISPLAY_OPTIONS } from '../../../constants/fines-payment-terms-type-display-options.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-field-types.constant';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_FIELDS_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-fields.mock';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_LUMP_SUM_PLUS_INSTALMENTS_FORM_STATE_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-lump-sum-plus-instalments-form-state.mock';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_NO_PAYMENT_TERMS_FORM_STATE_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-no-payment-terms-form-state.mock';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_COLLO_RESULT_WITHOUT_PAYMENT_TERMS_FLAG_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-collo-result-without-payment-terms-flag.mock';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-payment-terms-disabled-result.mock';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_NOT_ALLOWED_FORM_STATE_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-payment-terms-not-allowed-form-state.mock';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAY_IN_FULL_FORM_STATE_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-pay-in-full-form-state.mock';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK } from './mocks/fines-acc-payload-enforcement-action-add-result.mock';
import {
  buildEnforcementActionAddPayload,
  trimUnderscores,
} from './fines-acc-payload-build-enforcement-action-add.utils';

describe('buildEnforcementActionAddPayload', () => {
  it('builds result responses and lump sum plus instalments payment terms', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK,
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_FIELDS_MOCK,
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_LUMP_SUM_PLUS_INSTALMENTS_FORM_STATE_MOCK,
    );

    expect(payload).toEqual({
      result_id: 'COLLO',
      enforcement_result_responses: [
        { parameter_name: 'reason', response: 'Reason' },
        { parameter_name: 'reason_cy', response: 'Rheswm' },
        { parameter_name: 'hearing_date', response: '2026-05-20' },
      ],
      payment_terms: {
        days_in_default: 7,
        date_days_in_default_imposed: '2026-05-19',
        reason_for_extension: '',
        extension: true,
        payment_terms_type: {
          payment_terms_type_code: FINES_PAYMENT_TERMS_TYPE_CODE_MAP.lumpSumPlusInstalments,
          payment_terms_type_display_name:
            FINES_PAYMENT_TERMS_TYPE_DISPLAY_OPTIONS[FINES_PAYMENT_TERMS_TYPE_CODE_MAP.lumpSumPlusInstalments],
        },
        effective_date: '2026-05-21',
        instalment_period: {
          instalment_period_code: 'W',
          instalment_period_display_name: 'Weekly',
        },
        lump_sum_amount: 10,
        instalment_amount: 5,
        posted_details: {
          posted_by: '',
          posted_by_name: '',
          posted_date: '',
        },
      },
    });
  });

  it('uses pay by date and omits instalment details for pay in full payment terms', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK,
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_FIELDS_MOCK,
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAY_IN_FULL_FORM_STATE_MOCK,
    );

    expect(payload.payment_terms).toEqual({
      days_in_default: null,
      date_days_in_default_imposed: null,
      reason_for_extension: '',
      extension: true,
      payment_terms_type: {
        payment_terms_type_code: FINES_PAYMENT_TERMS_TYPE_CODE_MAP.payInFull,
        payment_terms_type_display_name:
          FINES_PAYMENT_TERMS_TYPE_DISPLAY_OPTIONS[FINES_PAYMENT_TERMS_TYPE_CODE_MAP.payInFull],
      },
      effective_date: '2026-05-22',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      posted_details: {
        posted_by: '',
        posted_by_name: '',
        posted_date: '',
      },
    });
  });

  it('omits payment terms when payment terms are not allowed or not changed', () => {
    expect(
      buildEnforcementActionAddPayload(
        FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK,
        FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_FIELDS_MOCK,
        FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_NO_PAYMENT_TERMS_FORM_STATE_MOCK,
      ),
    ).not.toHaveProperty('payment_terms');
    expect(
      buildEnforcementActionAddPayload(
        FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK,
        FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_FIELDS_MOCK,
        FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_NOT_ALLOWED_FORM_STATE_MOCK,
      ),
    ).not.toHaveProperty('payment_terms');
  });

  it('includes payment terms for COLLO even when the allow payment terms flag is false', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_COLLO_RESULT_WITHOUT_PAYMENT_TERMS_FLAG_MOCK,
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_FIELDS_MOCK,
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAY_IN_FULL_FORM_STATE_MOCK,
    );

    expect(payload.payment_terms).toEqual({
      days_in_default: null,
      date_days_in_default_imposed: null,
      reason_for_extension: '',
      extension: true,
      payment_terms_type: {
        payment_terms_type_code: FINES_PAYMENT_TERMS_TYPE_CODE_MAP.payInFull,
        payment_terms_type_display_name:
          FINES_PAYMENT_TERMS_TYPE_DISPLAY_OPTIONS[FINES_PAYMENT_TERMS_TYPE_CODE_MAP.payInFull],
      },
      effective_date: '2026-05-22',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      posted_details: {
        posted_by: '',
        posted_by_name: '',
        posted_date: '',
      },
    });
  });

  it('joins selected menu-checkbox options into the result response', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK,
      [
        {
          controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved',
          parameterName: 'selecthowitwillbeserved',
          label: 'Select how it will be served',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox,
          required: false,
          options: [
            { value: 'Consecutive', name: 'Consecutive' },
            { value: 'Concurrent', name: 'Concurrent' },
          ],
          checkboxControls: [
            {
              controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved_consecutive',
              option: { value: 'Consecutive', name: 'Consecutive' },
            },
            {
              controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved_concurrent',
              option: { value: 'Concurrent', name: 'Concurrent' },
            },
          ],
        },
      ],
      {
        'fines-acc-enf-action-add_selecthowitwillbeserved': 'Consecutive',
        'fines-acc-enf-action-add_selecthowitwillbeserved_consecutive': true,
        'fines-acc-enf-action-add_selecthowitwillbeserved_concurrent': false,
      },
    );

    expect(payload.enforcement_result_responses).toEqual([
      { parameter_name: 'select_how_it_will_be_served', response: 'Consecutive' },
    ]);
  });

  it('normalises concatenated result parameter names to snake case', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK,
      [
        {
          controlName: 'fines-acc-enf-action-add_courtcode',
          parameterName: 'courtcode',
          label: 'Court code',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
          required: false,
          options: [],
        },
        {
          controlName: 'fines-acc-enf-action-add_daysindefault',
          parameterName: 'daysindefault',
          label: 'Days in default',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.integer,
          required: false,
          options: [],
        },
        {
          controlName: 'fines-acc-enf-action-add_basisofcommittal',
          parameterName: 'basisofcommittal',
          label: 'Basis of committal',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
          required: false,
          options: [],
          welshControlName: 'fines-acc-enf-action-add_basisofcommittal_cy',
        },
      ],
      {
        'fines-acc-enf-action-add_courtcode': '123',
        'fines-acc-enf-action-add_daysindefault': '14',
        'fines-acc-enf-action-add_basisofcommittal': 'Basis',
        'fines-acc-enf-action-add_basisofcommittal_cy': 'Sail',
      },
    );

    expect(payload.enforcement_result_responses).toEqual([
      { parameter_name: 'court_code', response: '123' },
      { parameter_name: 'days_in_default', response: '14' },
      { parameter_name: 'basis_of_committal', response: 'Basis' },
      { parameter_name: 'basis_of_committal_cy', response: 'Sail' },
    ]);
  });

  it('normalises unmapped result parameter names to snake case', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK,
      [
        {
          controlName: 'fines-acc-enf-action-add_customParameterName',
          parameterName: 'customParameterName',
          label: 'Custom parameter name',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
          required: false,
          options: [],
        },
        {
          controlName: 'fines-acc-enf-action-add_custom_parameter_name',
          parameterName: ' custom parameter name ',
          label: 'Custom parameter name',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
          required: false,
          options: [],
        },
      ],
      {
        'fines-acc-enf-action-add_customParameterName': 'Camel',
        'fines-acc-enf-action-add_custom_parameter_name': 'Spaced',
      },
    );

    expect(payload.enforcement_result_responses).toEqual([
      { parameter_name: 'custom_parameter_name', response: 'Camel' },
      { parameter_name: 'custom_parameter_name', response: 'Spaced' },
    ]);
  });

  it('omits menu-checkbox responses when checkbox controls are missing', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK,
      [
        {
          controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved',
          parameterName: 'selecthowitwillbeserved',
          label: 'Select how it will be served',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox,
          required: false,
          options: [],
        },
      ],
      {},
    );

    expect(payload.enforcement_result_responses).toEqual([]);
  });

  it('keeps invalid date responses as entered', () => {
    const payload = buildEnforcementActionAddPayload(
      FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK,
      [
        {
          controlName: 'fines-acc-enf-action-add_hearing_date',
          parameterName: 'hearing_date',
          label: 'Hearing date',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.date,
          required: false,
          options: [],
        },
      ],
      {
        'fines-acc-enf-action-add_hearing_date': 'May 2026',
      },
    );

    expect(payload.enforcement_result_responses).toEqual([{ parameter_name: 'hearing_date', response: 'May 2026' }]);
  });

  it('omits payment terms when no payment term option is selected', () => {
    const payload = buildEnforcementActionAddPayload(FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK, [], {
      'fines-acc-enf-action-add_add_payment_terms': true,
      'fines-acc-enf-action-add_payment_terms': null,
    });

    expect(payload).not.toHaveProperty('payment_terms');
  });

  it('uses null for incomplete payment term dates', () => {
    const payload = buildEnforcementActionAddPayload(FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK, [], {
      ...FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAY_IN_FULL_FORM_STATE_MOCK,
      'fines-acc-enf-action-add_pay_by_date': '28/05',
    });

    expect(payload.payment_terms?.effective_date).toBeNull();
  });
});

describe('trimUnderscores', () => {
  it.each([
    ['_parameter_name', 'parameter_name'],
    ['parameter_name_', 'parameter_name'],
    ['__parameter_name__', 'parameter_name'],
    ['parameter__name', 'parameter__name'],
    ['___', ''],
    ['', ''],
  ])('returns "%s" as "%s"', (value, expected) => {
    expect(trimUnderscores(value)).toBe(expected);
  });
});

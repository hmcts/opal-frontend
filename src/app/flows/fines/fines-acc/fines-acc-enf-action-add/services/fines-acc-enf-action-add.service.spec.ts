import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { FinesAccEnfActionAddService } from './fines-acc-enf-action-add.service';
import { FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS } from '../constants/fines-acc-enf-action-add-api-data-keys.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK } from '../mocks/fines-acc-enf-action-add-result.mock';
import { FINES_ACC_ENF_ACTION_ADD_COLLECTION_TYPE_RESULT_PARAMETERS_MOCK } from '../mocks/fines-acc-enf-action-add-collection-type-result-parameters.mock';
import { FINES_ACC_ENF_ACTION_ADD_SUPPORTED_FIELD_TYPES_RESULT_PARAMETERS_MOCK } from '../mocks/fines-acc-enf-action-add-supported-field-types-result-parameters.mock';
import { FINES_ACC_ENF_ACTION_ADD_MIXED_FIELD_TYPES_RESULT_PARAMETERS_MOCK } from '../mocks/fines-acc-enf-action-add-mixed-field-types-result-parameters.mock';

describe('FinesAccEnfActionAddService', () => {
  const service = new FinesAccEnfActionAddService();

  it('maps result parameters to dynamic form fields including Welsh text companions', () => {
    const structure = service.mapResultParamsToFormStructure(
      FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK.result_parameters,
      true,
    );

    expect(structure.fields).toEqual([
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_reason',
        label: 'Reason',
        required: true,
        max: 60,
        welshControlName: 'fines-acc-enf-action-add_reason_cy',
        welshLabel: 'Reason - Welsh version',
      }),
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_hearingdate',
        label: 'Hearing date',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.date,
      }),
    ]);
  });

  it('does not map Welsh companions when the account is not Welsh language preference', () => {
    const structure = service.mapResultParamsToFormStructure(
      FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK.result_parameters,
      false,
    );

    expect(structure.fields[0].welshControlName).toBeUndefined();
  });

  it('maps collection type parameters to menu fields', () => {
    const structure = service.mapResultParamsToFormStructure(
      FINES_ACC_ENF_ACTION_ADD_COLLECTION_TYPE_RESULT_PARAMETERS_MOCK,
      false,
    );

    expect(structure.fields).toEqual([
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_collection_type',
        label: 'Collection type',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuRadio,
        required: true,
        options: [
          { value: 'standard', name: 'Standard' },
          { value: 'fast_track', name: 'Fast track' },
        ],
      }),
    ]);
  });

  it('maps supported API field types to the correct dynamic field types', () => {
    const structure = service.mapResultParamsToFormStructure(
      FINES_ACC_ENF_ACTION_ADD_SUPPORTED_FIELD_TYPES_RESULT_PARAMETERS_MOCK,
      true,
    );

    expect(structure.fields).toEqual([
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_basisofcommittal',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.textarea,
        max: 1000,
        welshControlName: 'fines-acc-enf-action-add_basisofcommittal_cy',
      }),
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_enforcer',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuAutocomplete,
        apiData: FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS.enforcers,
        required: true,
      }),
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox,
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
      }),
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_normaldeductionrate',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.decimal,
        required: true,
      }),
    ]);
  });

  it('falls back to an empty structure when result parameters are invalid JSON', () => {
    const structure = service.mapResultParamsToFormStructure('[invalid-json', true);

    expect(structure.fields).toEqual([]);
  });

  it('falls back to an empty structure when result parameters are missing or not an array', () => {
    expect(service.mapResultParamsToFormStructure(undefined, true).fields).toEqual([]);
    expect(service.mapResultParamsToFormStructure('{"type":"text"}', true).fields).toEqual([]);
  });

  it('maps integer, unknown, and object-option API parameters', () => {
    const structure = service.mapResultParamsToFormStructure(
      FINES_ACC_ENF_ACTION_ADD_MIXED_FIELD_TYPES_RESULT_PARAMETERS_MOCK,
      false,
    );

    expect(structure.fields).toEqual([
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_days',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.integer,
      }),
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_unknown',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
      }),
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_notes',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.textarea,
      }),
      expect.objectContaining({
        controlName: 'fines-acc-enf-action-add_selection',
        options: [{ value: 'A', name: 'Option A' }],
      }),
    ]);
  });

  it('builds integer field errors', () => {
    const errors = service.buildFieldErrors([
      {
        controlName: 'fines-acc-enf-action-add_days',
        parameterName: 'days',
        label: 'Days',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.integer,
        required: true,
        min: 1,
        max: 10,
        options: [],
      },
    ]);

    expect(errors['fines-acc-enf-action-add_days']).toEqual(
      expect.objectContaining({
        numericalTextPattern: expect.objectContaining({ message: 'Enter only numbers' }),
        min: expect.objectContaining({ message: 'Days must be 1 or more' }),
        max: expect.objectContaining({ message: 'Days must be 10 or less' }),
      }),
    );
  });

  it('sets paired language errors when only one language field is populated', () => {
    const form = new FormGroup(
      {
        english: new FormControl('English reason'),
        welsh: new FormControl<string | null>(null),
      },
      service.pairedLanguageValidator('english', 'welsh'),
    );

    form.updateValueAndValidity();

    expect(form.get('welsh')?.hasError('pairedLanguage')).toBe(true);
    expect(form.get('english')?.hasError('pairedLanguage')).toBe(false);
  });

  it('clears paired language errors when both language fields are populated', () => {
    const form = new FormGroup(
      {
        english: new FormControl('English reason'),
        welsh: new FormControl<string | null>(null),
      },
      service.pairedLanguageValidator('english', 'welsh'),
    );

    form.updateValueAndValidity();
    form.get('welsh')!.setValue('Rheswm');
    form.updateValueAndValidity();

    expect(form.get('english')?.hasError('pairedLanguage')).toBe(false);
    expect(form.get('welsh')?.hasError('pairedLanguage')).toBe(false);
  });

  it('handles missing and cleared paired language controls', () => {
    const setPairError = (
      service as unknown as {
        setPairError: (control: FormControl<string | null> | null, errorKey: string, shouldSet: boolean) => void;
      }
    ).setPairError.bind(service);
    const control = new FormControl<string | null>('value');

    setPairError(null, 'pairedLanguage', true);
    setPairError(control, 'pairedLanguage', true);

    expect(control.hasError('pairedLanguage')).toBe(true);

    setPairError(control, 'pairedLanguage', false);

    expect(control.errors).toBeNull();

    control.setErrors({ required: true, pairedLanguage: true });

    setPairError(control, 'pairedLanguage', false);

    expect(control.errors).toEqual({ required: true });
  });
});

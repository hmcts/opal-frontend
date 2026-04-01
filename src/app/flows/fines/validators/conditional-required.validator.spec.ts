import { FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { createConditionalRequiredValidator } from './conditional-required.validator';
import { ConditionalRequiredRuleConfig } from './interfaces/conditional-required-rule-config.interface';

describe('createConditionalRequiredValidator', () => {
  it('should return null for non-FormGroup controls', () => {
    const validator = createConditionalRequiredValidator([]);
    const control = new FormControl('value');

    expect(validator(control)).toBeNull();
  });

  it('should add required validator when any trigger field has a value', () => {
    const rules: ConditionalRequiredRuleConfig[] = [
      {
        dependentField: 'lastName',
        triggerFields: ['firstName', 'dob'],
      },
    ];

    const form = new FormGroup({
      lastName: new FormControl<string | null>(null),
      firstName: new FormControl<string | null>('Jane'),
      dob: new FormControl<string | null>(null),
    });

    const validator = createConditionalRequiredValidator(rules);
    const result = validator(form);

    expect(result).toBeNull();
    expect(form.get('lastName')?.hasValidator(Validators.required)).toBe(true);
    expect(form.get('lastName')?.hasError('required')).toBe(true);
  });

  it('should remove required validator when trigger fields are empty', () => {
    const rules: ConditionalRequiredRuleConfig[] = [
      {
        dependentField: 'lastName',
        triggerFields: ['firstName'],
      },
    ];

    const form = new FormGroup({
      lastName: new FormControl<string | null>(null, [Validators.required]),
      firstName: new FormControl<string | null>('Jane'),
    });

    const validator = createConditionalRequiredValidator(rules);

    validator(form);
    expect(form.get('lastName')?.hasValidator(Validators.required)).toBe(true);

    form.get('firstName')?.setValue('');
    validator(form);

    expect(form.get('lastName')?.hasValidator(Validators.required)).toBe(false);
  });

  it('should treat boolean false trigger as empty and true as populated', () => {
    const rules: ConditionalRequiredRuleConfig[] = [
      {
        dependentField: 'firstName',
        triggerFields: ['exactMatch'],
      },
    ];

    const form = new FormGroup({
      firstName: new FormControl<string | null>(null),
      exactMatch: new FormControl<boolean>(false),
    });

    const validator = createConditionalRequiredValidator(rules);

    validator(form);
    expect(form.get('firstName')?.hasValidator(Validators.required)).toBe(false);

    form.get('exactMatch')?.setValue(true);
    validator(form);
    expect(form.get('firstName')?.hasValidator(Validators.required)).toBe(true);
  });

  it('should return invalid config error when dependent field does not exist', () => {
    const rules: ConditionalRequiredRuleConfig[] = [
      {
        dependentField: 'missingField',
        triggerFields: ['firstName'],
      },
    ];

    const form = new FormGroup({
      firstName: new FormControl<string | null>('Jane'),
    });

    const validator = createConditionalRequiredValidator(rules);
    const result = validator(form);

    expect(result).toEqual({ invalidConditionalRequiredRuleConfig: true });
  });

  it('should evaluate multiple rules independently', () => {
    const rules: ConditionalRequiredRuleConfig[] = [
      {
        dependentField: 'lastName',
        triggerFields: ['firstName'],
      },
      {
        dependentField: 'firstName',
        triggerFields: ['exactMatch'],
      },
    ];

    const form = new FormGroup({
      lastName: new FormControl<string | null>(null),
      firstName: new FormControl<string | null>(null),
      exactMatch: new FormControl<boolean>(true),
    });

    const validator = createConditionalRequiredValidator(rules);
    validator(form);

    expect(form.get('firstName')?.hasValidator(Validators.required)).toBe(true);
    expect(form.get('lastName')?.hasValidator(Validators.required)).toBe(false);

    form.get('firstName')?.setValue('Jane');
    validator(form);

    expect(form.get('lastName')?.hasValidator(Validators.required)).toBe(true);
  });
});

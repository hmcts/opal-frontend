import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { focusAfterAliasRemoval, renumberAliasFormControls } from './fines-alias-renumbering.utils';

describe('renumberAliasFormControls', () => {
  it('should renumber a single alias field while preserving its FormControl instance', () => {
    const originalControl = new FormControl('SECOND COMPANY', Validators.required);

    const aliases = new FormArray([
      new FormGroup({
        fm_company_details_alias_company_name_1: originalControl,
      }),
    ]);

    renumberAliasFormControls(aliases, ['fm_company_details_alias_company_name']);

    const remainingGroup = aliases.at(0);

    expect(remainingGroup.get('fm_company_details_alias_company_name_0')).toBe(originalControl);
    expect(remainingGroup.get('fm_company_details_alias_company_name_1')).toBeNull();
    expect(remainingGroup.get('fm_company_details_alias_company_name_0')?.value).toBe('SECOND COMPANY');
    expect(remainingGroup.valid).toBe(true);
  });

  it('should renumber both alias fields and preserve their values and validators', () => {
    const forenamesControl = new FormControl('DAVID', Validators.required);
    const surnameControl = new FormControl('JONES', Validators.required);

    const aliases = new FormArray([
      new FormGroup({
        fm_personal_details_alias_forenames_1: forenamesControl,
        fm_personal_details_alias_surname_1: surnameControl,
      }),
    ]);

    renumberAliasFormControls(aliases, ['fm_personal_details_alias_forenames', 'fm_personal_details_alias_surname']);

    const remainingGroup = aliases.at(0);

    expect(remainingGroup.get('fm_personal_details_alias_forenames_0')).toBe(forenamesControl);
    expect(remainingGroup.get('fm_personal_details_alias_surname_0')).toBe(surnameControl);

    expect(remainingGroup.get('fm_personal_details_alias_forenames_1')).toBeNull();
    expect(remainingGroup.get('fm_personal_details_alias_surname_1')).toBeNull();

    expect(remainingGroup.get('fm_personal_details_alias_forenames_0')?.value).toBe('DAVID');
    expect(remainingGroup.get('fm_personal_details_alias_surname_0')?.value).toBe('JONES');

    expect(remainingGroup.valid).toBe(true);

    forenamesControl.setValue('');
    expect(forenamesControl.hasError('required')).toBe(true);
  });

  it('should renumber remaining controls after removing a middle alias', () => {
    const firstForenames = new FormControl('JOHN', Validators.required);
    const firstSurname = new FormControl('SMITH', Validators.required);
    const thirdForenames = new FormControl('PETER', Validators.required);
    const thirdSurname = new FormControl('BROWN', Validators.required);

    const aliases = new FormArray<FormGroup>([
      new FormGroup({
        fm_personal_details_alias_forenames_0: firstForenames,
        fm_personal_details_alias_surname_0: firstSurname,
      }),
      new FormGroup({
        fm_personal_details_alias_forenames_1: new FormControl('DAVID'),
        fm_personal_details_alias_surname_1: new FormControl('JONES'),
      }),
      new FormGroup({
        fm_personal_details_alias_forenames_2: thirdForenames,
        fm_personal_details_alias_surname_2: thirdSurname,
      }),
    ]);

    aliases.removeAt(1);

    renumberAliasFormControls(aliases, ['fm_personal_details_alias_forenames', 'fm_personal_details_alias_surname']);

    expect(aliases).toHaveLength(2);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')).toBe(firstForenames);
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')).toBe(firstSurname);

    expect(aliases.at(1).get('fm_personal_details_alias_forenames_1')).toBe(thirdForenames);
    expect(aliases.at(1).get('fm_personal_details_alias_surname_1')).toBe(thirdSurname);

    expect(aliases.at(1).value).toEqual({
      fm_personal_details_alias_forenames_1: 'PETER',
      fm_personal_details_alias_surname_1: 'BROWN',
    });
  });

  it('should preserve validation state when renumbering an invalid alias control', () => {
    const invalidControl = new FormControl('', Validators.required);

    invalidControl.markAsTouched();
    invalidControl.markAsDirty();

    const aliases = new FormArray([
      new FormGroup({
        fm_company_details_alias_company_name_1: invalidControl,
      }),
    ]);

    expect(invalidControl.hasError('required')).toBe(true);

    renumberAliasFormControls(aliases, ['fm_company_details_alias_company_name']);

    const renamedControl = aliases.at(0).get('fm_company_details_alias_company_name_0');

    expect(renamedControl).toBe(invalidControl);
    expect(renamedControl?.hasError('required')).toBe(true);
    expect(renamedControl?.touched).toBe(true);
    expect(renamedControl?.dirty).toBe(true);
  });

  it('should focus Add another alias when no Remove buttons remain', () => {
    const container = document.createElement('div');

    container.innerHTML = `
      <button id="addAlias" type="button">Add another alias</button>
    `;

    document.body.appendChild(container);

    try {
      focusAfterAliasRemoval(container, 1);

      expect(document.activeElement).toBe(container.querySelector('#addAlias'));
    } finally {
      container.remove();
    }
  });

  it('should focus the appropriate surviving Remove button', () => {
    const container = document.createElement('div');

    container.innerHTML = `
      <button class="moj-add-another__remove-button" type="button">Remove alias 1</button>
      <button class="moj-add-another__remove-button" type="button">Remove alias 2</button>
      <button id="addAlias" type="button">Add another alias</button>
    `;

    document.body.appendChild(container);

    try {
      focusAfterAliasRemoval(container, 2);

      const buttons = container.querySelectorAll('.moj-add-another__remove-button');

      expect(document.activeElement).toBe(buttons[1]);
    } finally {
      container.remove();
    }
  });
});

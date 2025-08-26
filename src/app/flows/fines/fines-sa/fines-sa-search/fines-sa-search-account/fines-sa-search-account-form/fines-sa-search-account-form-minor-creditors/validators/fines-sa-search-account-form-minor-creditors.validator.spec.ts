import { FormControl, FormGroup, Validators } from '@angular/forms';
import { requiredMinorCreditorDataValidator } from './fines-sa-search-account-form-minor-creditors.validator';

describe('requiredMinorCreditorDataValidator', () => {
  function createForm({
    type,
    individualValue,
    companyValue,
    individualValid = true,
    companyValid = true,
  }: {
    type?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    individualValue?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    companyValue?: any;
    individualValid?: boolean;
    companyValid?: boolean;
  }) {
    const individualGroup = new FormGroup({
      field: new FormControl(individualValue, individualValid ? [] : [Validators.required]),
    });
    const companyGroup = new FormGroup({
      field: new FormControl(companyValue, companyValid ? [] : [Validators.required]),
    });
    const form = new FormGroup({
      fsa_search_account_minor_creditors_minor_creditor_type: new FormControl(type),
      individualGroup,
      companyGroup,
    });
    return { form, individualGroup, companyGroup };
  }

  it('should return null if type is not set', () => {
    const { form, individualGroup, companyGroup } = createForm({ type: undefined });
    const validator = requiredMinorCreditorDataValidator(() => ({
      individualGroup,
      companyGroup,
    }));
    expect(validator(form.get('fsa_search_account_minor_creditors_minor_creditor_type')!)).toBeNull();
  });

  it('should return null if type is "individual" and individualGroup has value', () => {
    const { form, individualGroup, companyGroup } = createForm({ type: 'individual', individualValue: 'foo' });
    const validator = requiredMinorCreditorDataValidator(() => ({
      individualGroup,
      companyGroup,
    }));
    expect(validator(form.get('fsa_search_account_minor_creditors_minor_creditor_type')!)).toBeNull();
  });

  it('should return { required: true } if type is "individual" and individualGroup is empty', () => {
    const { form, individualGroup, companyGroup } = createForm({ type: 'individual', individualValue: '' });
    const validator = requiredMinorCreditorDataValidator(() => ({
      individualGroup,
      companyGroup,
    }));
    expect(validator(form.get('fsa_search_account_minor_creditors_minor_creditor_type')!)).toEqual({
      requiredIndividualMinorCreditorData: true,
    });
  });

  it('should return null if type is "company" and companyGroup has value', () => {
    const { form, individualGroup, companyGroup } = createForm({ type: 'company', companyValue: 'bar' });
    const validator = requiredMinorCreditorDataValidator(() => ({
      individualGroup,
      companyGroup,
    }));
    expect(validator(form.get('fsa_search_account_minor_creditors_minor_creditor_type')!)).toBeNull();
  });

  it('should return { required: true } if type is "company" and companyGroup is empty', () => {
    const { form, individualGroup, companyGroup } = createForm({ type: 'company', companyValue: '' });
    const validator = requiredMinorCreditorDataValidator(() => ({
      individualGroup,
      companyGroup,
    }));
    expect(validator(form.get('fsa_search_account_minor_creditors_minor_creditor_type')!)).toEqual({
      requiredCompanyMinorCreditorData: true,
    });
  });

  it('should return null if the control is not a FormControl', () => {
    const validator = requiredMinorCreditorDataValidator(() => ({
      individualGroup: new FormGroup({}),
      companyGroup: new FormGroup({}),
    }));
    // @ts-expect-error purposely passing wrong type
    expect(validator({})).toBeNull();
  });

  it('should ignore validation if the relevant group is invalid', () => {
    const { form, individualGroup, companyGroup } = createForm({
      type: 'individual',
      individualValue: 'foo',
      individualValid: false,
    });
    const validator = requiredMinorCreditorDataValidator(() => ({
      individualGroup,
      companyGroup,
    }));
    expect(validator(form.get('fsa_search_account_minor_creditors_minor_creditor_type')!)).toBeNull();
  });
});

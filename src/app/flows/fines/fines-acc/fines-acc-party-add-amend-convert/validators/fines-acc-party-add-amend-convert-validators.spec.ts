import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { employerFieldsValidator } from './fines-acc-party-add-amend-convert-validators';

describe('fines-acc-party-add-amend-convert-validators', () => {
  it('should require company name when employer address data is present', () => {
    const group = new FormGroup({
      facc_party_add_amend_convert_employer_company_name: new FormControl(''),
      facc_party_add_amend_convert_employer_reference: new FormControl('REF-1'),
      facc_party_add_amend_convert_employer_email_address: new FormControl(''),
      facc_party_add_amend_convert_employer_telephone_number: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_1: new FormControl('1 Employer Street'),
      facc_party_add_amend_convert_employer_address_line_2: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_3: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_4: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_5: new FormControl(''),
      facc_party_add_amend_convert_employer_post_code: new FormControl(''),
    });

    const result = employerFieldsValidator(group.controls['facc_party_add_amend_convert_employer_company_name']);

    expect(result).toEqual({ required: true });
  });

  it('should fall back to an empty control name when the control is not registered on the parent', () => {
    const detachedControl = new FormControl('');
    const group = new FormGroup({
      facc_party_add_amend_convert_employer_company_name: new FormControl('Employer Ltd'),
      facc_party_add_amend_convert_employer_reference: new FormControl('REF-1'),
      facc_party_add_amend_convert_employer_email_address: new FormControl(''),
      facc_party_add_amend_convert_employer_telephone_number: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_1: new FormControl('1 Employer Street'),
      facc_party_add_amend_convert_employer_address_line_2: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_3: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_4: new FormControl(''),
      facc_party_add_amend_convert_employer_address_line_5: new FormControl(''),
      facc_party_add_amend_convert_employer_post_code: new FormControl(''),
    });

    Object.defineProperty(detachedControl, 'parent', {
      configurable: true,
      value: group,
    });

    const result = employerFieldsValidator(detachedControl);

    expect(result).toBeNull();
  });
});

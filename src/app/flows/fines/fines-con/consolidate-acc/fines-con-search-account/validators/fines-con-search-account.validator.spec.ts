import { FormGroup, FormControl } from '@angular/forms';
import { activeTabCriteriaValidator } from './fines-con-search-account.validator';

describe('fines-con-search-account.validator', () => {
  describe('activeTabCriteriaValidator', () => {
    it('should return null when individual tab has exactly one criterion', () => {
      const formGroup = new FormGroup({
        fcon_search_account_individuals_last_name: new FormControl('Smith'),
        fcon_search_account_individuals_first_names: new FormControl(null),
        fcon_search_account_individuals_date_of_birth: new FormControl(null),
        fcon_search_account_companies_name: new FormControl(null),
        fcon_search_account_companies_reference_number: new FormControl(null),
      });

      const validator = activeTabCriteriaValidator('individual');
      expect(validator(formGroup)).toBeNull();
    });

    it('should return error when individual tab has no criteria', () => {
      const formGroup = new FormGroup({
        fcon_search_account_individuals_last_name: new FormControl(null),
        fcon_search_account_individuals_first_names: new FormControl(null),
        fcon_search_account_individuals_date_of_birth: new FormControl(null),
        fcon_search_account_companies_name: new FormControl(null),
        fcon_search_account_companies_reference_number: new FormControl(null),
      });

      const validator = activeTabCriteriaValidator('individual');
      expect(validator(formGroup)).toEqual({ formEmpty: true });
    });

    it('should return null when company tab has exactly one criterion', () => {
      const formGroup = new FormGroup({
        fcon_search_account_individuals_last_name: new FormControl(null),
        fcon_search_account_individuals_first_names: new FormControl(null),
        fcon_search_account_individuals_date_of_birth: new FormControl(null),
        fcon_search_account_companies_name: new FormControl('Acme Corp'),
        fcon_search_account_companies_reference_number: new FormControl(null),
      });

      const validator = activeTabCriteriaValidator('company');
      expect(validator(formGroup)).toBeNull();
    });

    it('should return error when company tab has no criteria', () => {
      const formGroup = new FormGroup({
        fcon_search_account_individuals_last_name: new FormControl(null),
        fcon_search_account_individuals_first_names: new FormControl(null),
        fcon_search_account_individuals_date_of_birth: new FormControl(null),
        fcon_search_account_companies_name: new FormControl(null),
        fcon_search_account_companies_reference_number: new FormControl(null),
      });

      const validator = activeTabCriteriaValidator('company');
      expect(validator(formGroup)).toEqual({ formEmpty: true });
    });

    it('should return null when control is not a FormGroup', () => {
      const formControl = new FormControl('test');

      const validator = activeTabCriteriaValidator('individual');
      expect(validator(formControl)).toBeNull();
    });
  });
});

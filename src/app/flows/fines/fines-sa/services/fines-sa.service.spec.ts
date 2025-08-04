import { FinesSaService } from './fines-sa.service';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';
import { AbstractControl } from '@angular/forms';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individuals-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/mocks/fines-sa-search-account-form-companies-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/mocks/fines-sa-search-account-form-minor-creditors-state.mock';

describe('FinesSaService', () => {
  let service: FinesSaService;

  beforeEach(() => {
    service = new FinesSaService();
  });

  const getBaseState = (): IFinesSaSearchAccountState => FINES_SA_SEARCH_ACCOUNT_STATE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createControl = (value: any) => ({ value }) as AbstractControl;

  it('should return false when all search criteria are null', () => {
    const state = getBaseState();
    expect(service.hasAnySearchCriteriaPopulated(state)).toBeFalse();
  });

  it('should return false when all search criteria are empty objects', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: {},
      fsa_search_account_companies_search_criteria: {},
      fsa_search_account_minor_creditors_search_criteria: {},
      fsa_search_account_major_creditor_search_criteria: {},
    } as IFinesSaSearchAccountState;
    expect(service.hasAnySearchCriteriaPopulated(state)).toBeFalse();
  });

  it('should return true when individual search criteria has data', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: { fsa_search_account_individuals_last_name: 'Smith' },
    } as IFinesSaSearchAccountState;
    expect(service.hasAnySearchCriteriaPopulated(state)).toBeTrue();
  });

  it('should return true when any boolean field is true', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: {
        fsa_search_account_individuals_first_names_exact_match: true,
      },
    } as IFinesSaSearchAccountState;

    expect(service.hasAnySearchCriteriaPopulated(state)).toBeTrue();
  });

  it('should return true if at least one control has a non-empty trimmed string', () => {
    const controls = [createControl(''), createControl('   '), createControl('test')];
    expect(service.isAnyTextFieldPopulated(controls)).toBeTrue();
  });

  it('should return false if all controls are empty or whitespace strings', () => {
    const controls = [createControl(''), createControl('  '), createControl('   ')];
    expect(service.isAnyTextFieldPopulated(controls)).toBeFalse();
  });

  it('should return true if at least one control has a truthy non-string value', () => {
    const controls = [createControl(null), createControl(false), createControl(123)];
    expect(service.isAnyTextFieldPopulated(controls)).toBeTrue();
  });

  it('should return false if all controls are null or falsy', () => {
    const controls = [createControl(null), createControl(undefined), createControl(false), createControl(0)];
    expect(service.isAnyTextFieldPopulated(controls)).toBeFalse();
  });

    it('should return "accountNumber" if fsa_search_account_number is present', () => {
      const state = {
        ...getBaseState(),
        fsa_search_account_number: 'ACC123456',
      };
      expect(service.getSearchResultView(state)).toBe('accountNumber');
    });

    it('should return "referenceCaseNumber" if reference is present and account number is not', () => {
      const state = {
        ...getBaseState(),
        fsa_search_account_reference_case_number: 'REF123456',
      };
      expect(service.getSearchResultView(state)).toBe('referenceCaseNumber');
    });

    it('should return "individuals" if individual criteria is populated', () => {
      const state = {
        ...getBaseState(),
        fsa_search_account_individual_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
      };
      expect(service.getSearchResultView(state)).toBe('individuals');
    });

    it('should return "companies" if company criteria is populated and others are not', () => {
      const state = {
        ...getBaseState(),
        fsa_search_account_companies_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK,
      };
      expect(service.getSearchResultView(state)).toBe('companies');
    });

    it('should return "minorCreditors" if minor creditor criteria is populated and others are not', () => {
      const state = {
        ...getBaseState(),
        fsa_search_account_minor_creditors_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK,
      };
      expect(service.getSearchResultView(state)).toBe('minorCreditors');
    });

    it('should default to "accountNumber" if no criteria is populated', () => {
      const state = getBaseState();
      expect(service.getSearchResultView(state)).toBe('accountNumber');
    });
});

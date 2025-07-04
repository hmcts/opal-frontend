import { FinesSaService } from './fines-sa.service';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';

describe('FinesSaService', () => {
  let service: FinesSaService;

  beforeEach(() => {
    service = new FinesSaService();
  });

  const getBaseState = (): IFinesSaSearchAccountState => FINES_SA_SEARCH_ACCOUNT_STATE;

  it('should return false when all search criteria are null', () => {
    const state = getBaseState();
    expect(service.hasAnySearchCriteriaPopulated(state)).toBeFalse();
  });

  it('should return false when all search criteria are empty objects', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: {},
      fsa_search_account_companies_search_criteria: {},
      fsa_search_account_minor_creditor_search_criteria: {},
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
});

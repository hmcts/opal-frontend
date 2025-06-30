import { fakeAsync, TestBed } from '@angular/core/testing';
import { finesSaFlowStateGuard } from './fines-sa-flow-state.guard';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FinesSaService } from '../../services/fines-sa.service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';
import { FinesSaStoreType } from '../../stores/types/fines-sa.type';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { runFinesSaEmptyFlowGuardWithContext } from '../helpers/run-fines-sa-empty-flow-guard-with-context';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUAL_STATE_MOCK } from '../../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individual-state.mock';
import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { of } from 'rxjs';

describe('finesSaFlowStateGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFinesSaStore: FinesSaStoreType;
  let service: jasmine.SpyObj<FinesSaService>;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.sa.root}/${FINES_SA_ROUTING_PATHS.children.search}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.sa.root}/${FINES_SA_ROUTING_PATHS.children.search}`;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj(finesSaFlowStateGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    service = jasmine.createSpyObj<FinesSaService>('FinesSaService', ['hasAnySearchCriteriaPopulated']);

    TestBed.configureTestingModule({
      providers: [
        FinesSaStore,
        { provide: FinesSaService, useValue: service },
        { provide: Router, useValue: mockRouter },
      ],
    });

    mockRouter.createUrlTree.and.returnValue(new UrlTree());

    mockFinesSaStore = TestBed.inject(FinesSaStore);
  });

  it('should return true if account number is present', fakeAsync(async () => {
    mockFinesSaStore.setSearchAccount({ ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_number: '12345' });
    service.hasAnySearchCriteriaPopulated.and.returnValue(false);

    const result = await runFinesSaEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesSaFlowStateGuard, urlPath));
    expect(result).toBeTrue();
  }));

  it('should return true if reference number is present', fakeAsync(async () => {
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_reference_case_number: 'ABC123',
    });
    service.hasAnySearchCriteriaPopulated.and.returnValue(false);

    const result = await runFinesSaEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesSaFlowStateGuard, urlPath));
    expect(result).toBeTrue();
  }));

  it('should return true if search criteria is populated', fakeAsync(async () => {
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_individual_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUAL_STATE_MOCK,
    });
    service.hasAnySearchCriteriaPopulated.and.returnValue(true);

    const result = await runFinesSaEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesSaFlowStateGuard, urlPath));
    expect(result).toBeTrue();
  }));

  it('should return false if nothing is entered', fakeAsync(async () => {
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_active_accounts_only: false,
    });
    service.hasAnySearchCriteriaPopulated.and.returnValue(false);

    const result = await runFinesSaEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesSaFlowStateGuard, urlPath));
    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should handle observable result correctly', fakeAsync(async () => {
    const mockResult = true;
    const guardReturningObservable = () => of(mockResult);

    const result = await runFinesSaEmptyFlowGuardWithContext(guardReturningObservable);

    expect(result).toBe(mockResult);
  }));
});

import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { finesMacOffenceDetailsSearchOffencesFlowStateGuard } from './fines-mac-offence-details-search-offences-flow-state.guard';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths.constant';
import { runFinesMacEmptyFlowGuardWithContext } from '../../../guards/helpers/run-fines-mac-empty-flow-guard-with-context';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from '../stores/types/fines-mac-offence-details-search-offences-store.type';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-search-offences-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK } from '../mocks/fines-mac-offence-details-search-offences-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM } from '../constants/fines-mac-offence-details-search-offences-form.constant';

describe('finesMacOffenceDetailsSearchOffencesFlowStateGuard', () => {
  let store: FinesMacOffenceDetailsSearchOffencesStoreType;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.offenceDetails}/${FINES_MAC_ROUTING_PATHS.children.searchOffences}/${FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS.children.searchOffencesResults}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.offenceDetails}/${FINES_MAC_ROUTING_PATHS.children.searchOffences}`;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });
    mockRouter.createUrlTree.and.returnValue(new UrlTree());

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    store = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    store.resetSearchOffencesStore();
  });

  it('should return true if any search field is populated', fakeAsync(async () => {
    store.setSearchOffences(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK);

    const result = await runFinesMacEmptyFlowGuardWithContext(
      getGuardWithDummyUrl(finesMacOffenceDetailsSearchOffencesFlowStateGuard, urlPath),
    );

    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  }));

  it('should redirect if all search fields are empty', fakeAsync(async () => {
    store.setSearchOffences(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM);

    const result = await runFinesMacEmptyFlowGuardWithContext(
      getGuardWithDummyUrl(finesMacOffenceDetailsSearchOffencesFlowStateGuard, urlPath),
    );

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should handle observable result correctly', fakeAsync(async () => {
    const mockResult = true;
    const guardReturningObservable = () => of(mockResult);

    const result = await runFinesMacEmptyFlowGuardWithContext(guardReturningObservable);

    expect(result).toBe(mockResult);
  }));
});

import { TestBed, fakeAsync } from '@angular/core/testing';
import { Router, UrlSegment, UrlSegmentGroup, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { finesAccStateGuard } from './fines-acc-state.guard';
import { FinesAccountStore } from '../../../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { runFinesAccEmptyFlowGuardWithContext } from '../helpers/run-fines-acc-empty-flow-guard-with-context';

describe('finesAccStateGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesAccountStore: any;

  const testAccountNumber = '123456789';
  const expectedUrlWithAccount = `${FINES_ROUTING_PATHS.root}/defendant/${testAccountNumber}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

  // Helper function to create a mock ActivatedRouteSnapshot with proper params
  function createMockRoute(params: Record<string, string> = {}): ActivatedRouteSnapshot {
    const route = new ActivatedRouteSnapshot();
    route.params = params;
    return route;
  }

  // Helper function to run the guard with a mock route
  function runGuardWithRoute(route: ActivatedRouteSnapshot) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return TestBed.runInInjectionContext(() => finesAccStateGuard(route, {} as any));
  }

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });
    mockRouter.createUrlTree.and.returnValue(new UrlTree());

    // Create mock FinesAccountStore
    mockFinesAccountStore = {
      account_number: jasmine.createSpy('account_number').and.returnValue(null),
      party_id: jasmine.createSpy('party_id').and.returnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: FinesAccountStore, useValue: mockFinesAccountStore },
      ],
    });
  });

  it('should redirect when no accountId in URL but account number exists in store', fakeAsync(async () => {
    mockFinesAccountStore.party_id.and.returnValue(testAccountNumber);

    const route = createMockRoute(); // No accountId in params
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalled();
  }));

  it('should return true when store and URL account numbers match', fakeAsync(async () => {
    mockFinesAccountStore.party_id.and.returnValue(testAccountNumber);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  }));

  it('should redirect when no account number in store but accountId in URL', fakeAsync(async () => {
    mockFinesAccountStore.party_id.and.returnValue(null);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should redirect when store and URL account numbers do not match', fakeAsync(async () => {
    mockFinesAccountStore.party_id.and.returnValue('different-account');

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should redirect when account number is empty string', fakeAsync(async () => {
    mockFinesAccountStore.party_id.and.returnValue('');

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should redirect when account number is undefined', fakeAsync(async () => {
    mockFinesAccountStore.party_id.and.returnValue(undefined);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should handle whitespace-only account number when it matches URL', fakeAsync(async () => {
    const whitespaceAccount = '   ';
    mockFinesAccountStore.party_id.and.returnValue(whitespaceAccount);

    const route = createMockRoute({ accountId: whitespaceAccount });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  }));
});

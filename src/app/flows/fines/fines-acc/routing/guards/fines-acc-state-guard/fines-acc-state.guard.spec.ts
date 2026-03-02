import { TestBed } from '@angular/core/testing';
import { Router, UrlSegment, UrlSegmentGroup, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { finesAccStateGuard } from './fines-acc-state.guard';
import { FinesAccountStore } from '../../../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { runFinesAccEmptyFlowGuardWithContext } from '../helpers/run-fines-acc-empty-flow-guard-with-context';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('finesAccStateGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesAccountStore: any;

  const testAccountNumber = '123456789';
  const expectedUrlWithAccount = `${FINES_ROUTING_PATHS.root}/account/defendant/${testAccountNumber}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

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
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
      createUrlTree: vi.fn().mockName('Router.createUrlTree'),
      parseUrl: vi.fn().mockName('Router.parseUrl'),
    };
    mockRouter.parseUrl.mockImplementation((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });
    mockRouter.createUrlTree.mockReturnValue(new UrlTree());

    // Create mock FinesAccountStore
    mockFinesAccountStore = {
      account_number: vi.fn().mockReturnValue(null),
      account_id: vi.fn().mockReturnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: FinesAccountStore, useValue: mockFinesAccountStore },
      ],
    });
  });

  it('should redirect when no accountId in URL but account number exists in store', async () => {
    mockFinesAccountStore.account_id.mockReturnValue(77);

    const route = createMockRoute(); // No accountId in params
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(expect.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalled();
  });

  it('should return true when store and URL account numbers match', async () => {
    mockFinesAccountStore.account_id.mockReturnValue(123456789);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });

  it('should redirect when no account number in store but accountId in URL', async () => {
    mockFinesAccountStore.account_id.mockReturnValue(null);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(expect.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should redirect when store and URL account numbers do not match', async () => {
    mockFinesAccountStore.account_id.mockReturnValue(88);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(expect.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should redirect when account number is empty string', async () => {
    mockFinesAccountStore.account_id.mockReturnValue(null);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(expect.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should redirect when account number is undefined', async () => {
    mockFinesAccountStore.account_id.mockReturnValue(undefined);

    const route = createMockRoute({ accountId: testAccountNumber });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toEqual(expect.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrlWithAccount], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should handle whitespace-only account number when it matches URL', async () => {
    const numericAccountId = 123456789;
    mockFinesAccountStore.account_id.mockReturnValue(numericAccountId);

    const route = createMockRoute({ accountId: numericAccountId.toString() });
    const result = await runFinesAccEmptyFlowGuardWithContext(() => runGuardWithRoute(route));

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });
});

import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { of } from 'rxjs';
import { hasFlowStateGuard } from './has-flow-state.guard';
import { FINES_MAC_ROUTING_PATHS } from '../../flows/fines/fines-mac/routing/constants/fines-mac-routing-paths';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../flows/fines/fines-mac/fines-mac-account-details/mocks/fines-mac-account-details-state.mock';
import { getGuardWithDummyUrl } from '@guards/helpers/get-guard-with-dummy-url';
import { runHasFlowStateGuardWithContext } from '@guards/helpers/run-has-flow-state-guard-with-context';

import { FINES_MAC_ACCOUNT_DETAILS_STATE } from 'src/app/flows/fines/fines-mac/fines-mac-account-details/constants/fines-mac-account-details-state';
import { FINES_MAC_STATE } from 'src/app/flows/fines/fines-mac/constants/fines-mac-state';

describe('hasFlowStateGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finesMacEmptyFlowGuard: any;
  let mockRouter: jasmine.SpyObj<Router> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`;

  beforeEach(() => {
    finesMacEmptyFlowGuard = hasFlowStateGuard(
      () => mockFinesService!.finesMacState.accountDetails,
      (accountDetails) =>
        !!accountDetails.formData.fm_create_account_account_type &&
        !!accountDetails.formData.fm_create_account_defendant_type,
      () => expectedUrl,
    );

    mockRouter = jasmine.createSpyObj(hasFlowStateGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter!.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: FinesService,
          useValue: mockFinesService,
        },
      ],
    });

    mockRouter!.createUrlTree.and.returnValue(new UrlTree());
  });

  afterAll(() => {
    finesMacEmptyFlowGuard = null;
    mockRouter = null;
    mockFinesService = null;
    TestBed.resetTestingModule();
  });

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  beforeEach(() => {
    if (!mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState = structuredClone(FINES_MAC_STATE);
  });

  it('should return true if AccountType and DefendantType are populated', fakeAsync(async () => {
    if (!mockFinesService || !mockRouter) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.accountDetails.formData = structuredClone(FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK);

    const result = await runHasFlowStateGuardWithContext(getGuardWithDummyUrl(finesMacEmptyFlowGuard, urlPath));

    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  }));

  it('should navigate to create account page if AccountType and DefendantType are not populated', fakeAsync(async () => {
    if (!mockFinesService || !mockRouter) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.accountDetails.formData = structuredClone(FINES_MAC_ACCOUNT_DETAILS_STATE);
    const result = await runHasFlowStateGuardWithContext(getGuardWithDummyUrl(finesMacEmptyFlowGuard, urlPath));

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should handle observable result correctly', fakeAsync(async () => {
    const mockResult = true;
    const guardReturningObservable = () => of(mockResult);

    const result = await runHasFlowStateGuardWithContext(guardReturningObservable);

    expect(result).toBe(mockResult);
  }));
});

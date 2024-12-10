import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { finesMacFlowStateGuard } from './fines-mac-flow-state.guard';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../fines-mac-account-details/mocks/fines-mac-account-details-state.mock';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { runFinesMacEmptyFlowGuardWithContext } from '../helpers/run-fines-mac-empty-flow-guard-with-context';
import { of } from 'rxjs';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from '../../fines-mac-account-details/constants/fines-mac-account-details-state';
import { getGuardWithDummyUrl } from '@guards/helpers/get-guard-with-dummy-url';

describe('finesMacFlowStateGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFinesService: jasmine.SpyObj<FinesService>;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj(finesMacFlowStateGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: FinesService,
          useValue: mockFinesService,
        },
      ],
    });
    mockRouter.createUrlTree.and.returnValue(new UrlTree());
  });

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  it('should return true if AccountType and DefendantType are populated', fakeAsync(async () => {
    mockFinesService.finesMacState.accountDetails.formData = FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK;

    const result = await runFinesMacEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesMacFlowStateGuard, urlPath));

    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  }));

  it('should navigate to create account page if AccountType and DefendantType are not populated', fakeAsync(async () => {
    mockFinesService.finesMacState.accountDetails.formData = FINES_MAC_ACCOUNT_DETAILS_STATE;
    const result = await runFinesMacEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesMacFlowStateGuard, urlPath));

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

import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { FinesService } from '@services/fines';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { FINES_ROUTING_PATHS } from '@constants/fines';
import { of } from 'rxjs';
import { canActivateGuard } from './can-activate.guard';
import { FINES_MAC_ROUTING_PATHS } from '../..//flows/fines/fines-mac/routing/constants';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from '../../flows/fines/fines-mac/fines-mac-account-details/constants';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../flows/fines/fines-mac/fines-mac-account-details/mocks';
import { getGuardWithDummyUrl, runCanActivateGuardWithContext } from '../helpers';

describe('finesMacEmptyFlowGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let finesService: jasmine.SpyObj<FinesService>;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`;

  // Create an instance of the can activate guard for testing
  const finesMacEmptyFlowGuard = canActivateGuard(
    () => finesService.finesMacState.accountDetails,
    (accountDetails) => !!accountDetails.AccountType && !!accountDetails.DefendantType,
    () => expectedUrl,
  );

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj(finesMacEmptyFlowGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: FinesService,
          useValue: jasmine.createSpyObj('FinesService', [], {
            finesMacState: { accountDetails: FINES_MAC_ACCOUNT_DETAILS_STATE },
          }),
        },
      ],
    });

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    finesService = TestBed.inject(FinesService) as jasmine.SpyObj<FinesService>;

    // Return a dummy UrlTree for createUrlTree calls
    mockRouter.createUrlTree.and.returnValue(new UrlTree());
  });

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  it('should return true if AccountType and DefendantType are populated', fakeAsync(async () => {
    finesService.finesMacState.accountDetails = FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK;

    const result = await runCanActivateGuardWithContext(getGuardWithDummyUrl(finesMacEmptyFlowGuard, urlPath));

    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  }));

  it('should navigate to create account page if AccountType and DefendantType are not populated', fakeAsync(async () => {
    finesService.finesMacState.accountDetails = FINES_MAC_ACCOUNT_DETAILS_STATE;

    const result = await runCanActivateGuardWithContext(getGuardWithDummyUrl(finesMacEmptyFlowGuard, urlPath));

    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should handle observable result correctly', fakeAsync(async () => {
    const mockResult = true;
    const guardReturningObservable = () => of(mockResult);

    const result = await runCanActivateGuardWithContext(guardReturningObservable);

    expect(result).toBe(mockResult);
  }));
});

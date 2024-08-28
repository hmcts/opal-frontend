import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { finesMacEmptyFlowGuard } from './fines-mac-empty-flow.guard';
import { FinesService } from '@services/fines';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../fines-mac-account-details/mocks';
import { FINES_ROUTING_PATHS } from '@constants/fines';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { runFinesMacEmptyFlowGuardWithContext } from '../helpers';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from '../../fines-mac-account-details/constants';
import { getGuardWithDummyUrl } from '../../../../../guards/helpers';
import { of } from 'rxjs';

describe('finesMacEmptyFlowGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let finesService: jasmine.SpyObj<FinesService>;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`;

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
    // Arrange
    finesService.finesMacState.accountDetails = FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK;

    // Act
    const result = await runFinesMacEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesMacEmptyFlowGuard, urlPath));

    // Assert
    expect(result).toBeTrue();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  }));

  it('should navigate to create account page if AccountType and DefendantType are not populated', fakeAsync(async () => {
    // Arrange
    finesService.finesMacState.accountDetails = FINES_MAC_ACCOUNT_DETAILS_STATE;

    // Act
    const result = await runFinesMacEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesMacEmptyFlowGuard, urlPath));

    // Assert
    expect(result).toEqual(jasmine.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  }));

  it('should handle observable result correctly', fakeAsync(async () => {
    // Arrange
    const mockResult = true;
    const guardReturningObservable = () => of(mockResult);

    // Act
    const result = await runFinesMacEmptyFlowGuardWithContext(guardReturningObservable);

    // Assert
    expect(result).toBe(mockResult);
  }));
});

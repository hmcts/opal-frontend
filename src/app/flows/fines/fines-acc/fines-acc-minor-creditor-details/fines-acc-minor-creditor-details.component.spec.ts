import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccMinorCreditorDetailsComponent } from './fines-acc-minor-creditor-details.component';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from './mocks/fines-acc-minor-creditor-details-header.mock';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-with-defendant.mock';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';

describe('FinesAccMinorCreditorDetailsComponent', () => {
  let component: FinesAccMinorCreditorDetailsComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let routerSpy: any;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let mockOpalFinesService: Pick<
    OpalFines,
    | 'getMinorCreditorAccountHeadingData'
    | 'getMinorCreditorAccountAtAGlance'
    | 'getMinorCreditorAccount'
    | 'clearCache'
    | 'getResult'
  >;
  let mockPayloadService: Pick<
    FinesAccPayloadService,
    'transformMinorCreditorAccountHeaderForStore' | 'transformPayload'
  >;

  beforeEach(async () => {
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
      createUrlTree: vi.fn().mockName('Router.createUrlTree'),
      serializeUrl: vi.fn().mockName('Router.serializeUrl'),
    };
    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          minorCreditorAccountHeadingData: structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
        },
        fragment: 'at-a-glance',
        paramMap: convertToParamMap({ accountId: '123' }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as ActivatedRouteSnapshot, // Using 'as any' to avoid type issues
    };

    mockPayloadService = {
      transformMinorCreditorAccountHeaderForStore: vi.fn().mockReturnValue(MOCK_FINES_ACCOUNT_STATE),
      transformPayload: vi.fn().mockImplementation((...args) => {
        return args[0]; // returns the first argument = payload
      }),
    };

    mockOpalFinesService = {
      getMinorCreditorAccountHeadingData: vi
        .fn()
        .mockReturnValue(of(structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK))),
      clearCache: vi.fn(),
      getResult: vi.fn(),
      getMinorCreditorAccountAtAGlance: vi
        .fn()
        .mockReturnValue(of(structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK))),
      getMinorCreditorAccount: vi
        .fn()
        .mockReturnValue(of(structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK))),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorDetailsComponent, MojSubNavigationComponent, MojSubNavigationItemComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorDetailsComponent);
    component = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routerSpy = TestBed.inject(Router) as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to at-a-glance tab if no fragment is present', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.fragment = null; // Simulate no fragment
    component['getHeaderDataFromRoute']();
    expect(component.activeTab).toBe('at-a-glance');
  });

  it('should initialize accountData and activeTab from route data', () => {
    expect(component.accountData).toEqual(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
    expect(component.activeTab).toBe('at-a-glance');
  });

  it('should handle tab switch', () => {
    component.handleTabSwitch('details');
    expect(component.activeTab).toBe('details');
  });

  it('should call router.navigate when navigateToAddAccountNotePage is called', () => {
    vi.spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(true);
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.note}/add`],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should refresh the data for the header and current tab when refreshPage is called', () => {
    component.accountStore.setAccountState(MOCK_FINES_ACCOUNT_STATE);
    component.refreshPage();
    expect(mockOpalFinesService.getMinorCreditorAccountHeadingData).toHaveBeenCalledWith(
      Number(MOCK_FINES_ACCOUNT_STATE.account_id),
    );
  });

  it('should fetch creditor tab data when fragment is changed to creditor', () => {
    vi.mocked(mockPayloadService.transformPayload).mockClear();

    component['refreshFragment$'].next('creditor');
    component.tabCreditor$.subscribe();

    expect(mockOpalFinesService.getMinorCreditorAccount).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE.account_id);
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK,
      expect.any(Array),
    );
  });

  it('should navigate to access-denied if user lacks permission for the add account note page', () => {
    vi.spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/access-denied'], {
      relativeTo: component['activatedRoute'],
    });
  });

  it('should call router.navigate when navigateToAddPaymentHoldPage is called', () => {
    vi.spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(true);
    component.navigateToAddPaymentHoldPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/add`],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should navigate to payment hold denied page when user lacks permission for add payment hold', () => {
    vi.spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
    component.navigateToAddPaymentHoldPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/denied`],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should call router.navigate when navigateToRemovePaymentHoldPage is called', () => {
    vi.spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(true);
    component.navigateToRemovePaymentHoldPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/remove`],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should navigate to payment hold denied page when user lacks permission for remove payment hold', () => {
    vi.spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
    component.navigateToRemovePaymentHoldPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/denied`],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });

  it('should open the defendant account page in a new tab when navigateToDefendantAccountPage is called', () => {
    const accountId = 123;
    const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/${accountId}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

    routerSpy.createUrlTree.mockReturnValue({});
    routerSpy.serializeUrl.mockReturnValue(expectedUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(globalThis, 'open');
    component.navigateToDefendantAccountPage(accountId);

    expect(routerSpy.serializeUrl).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank');
  });
});

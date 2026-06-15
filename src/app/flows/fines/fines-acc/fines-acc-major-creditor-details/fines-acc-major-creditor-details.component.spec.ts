import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccMajorCreditorDetailsComponent } from './fines-acc-major-creditor-details.component';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK } from './mocks/fines-acc-major-creditor-details-header.mock';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-map-transform-items-config.constant';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-major-creditor-at-a-glance-with-defendant.mock';
import { FINES_ACC_BANNER_MESSAGES } from '../stores/constants/fines-acc-store-banner-messages.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

describe('FinesAccMajorCreditorDetailsComponent', () => {
  let component: FinesAccMajorCreditorDetailsComponent;
  let fixture: ComponentFixture<FinesAccMajorCreditorDetailsComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let mockOpalFinesService: Pick<OpalFines, 'getMajorCreditorAccountHeadingData' | 'clearCache' | 'getResult'>;
  let mockPayloadService: Pick<
    FinesAccPayloadService,
    'transformMajorCreditorAccountHeaderForStore' | 'transformPayload'
  >;

  beforeEach(async () => {
    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          majorCreditorAccountHeadingData: structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK),
        },
        fragment: 'at-a-glance',
        paramMap: convertToParamMap({ accountId: '123' }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as ActivatedRouteSnapshot,
    };

    mockPayloadService = {
      transformMajorCreditorAccountHeaderForStore: vi.fn().mockReturnValue(MOCK_FINES_ACCOUNT_STATE),
      transformPayload: vi.fn().mockImplementation((...args) => args[0]),
    };

    mockOpalFinesService = {
      getMajorCreditorAccountHeadingData: vi
        .fn()
        .mockReturnValue(of(structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK))),
      clearCache: vi.fn(),
      getResult: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccMajorCreditorDetailsComponent, MojSubNavigationComponent, MojSubNavigationItemComponent],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn(), createUrlTree: vi.fn(), serializeUrl: vi.fn() } },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMajorCreditorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to at-a-glance tab if no fragment is present', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.fragment = null;
    component['getHeaderDataFromRoute']();

    expect(component.activeTab).toBe('at-a-glance');
  });

  it('should initialize accountData and activeTab from route data', () => {
    expect(component.accountData).toEqual(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
    expect(component.activeTab).toBe('at-a-glance');
    expect(mockPayloadService.transformMajorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      123,
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
  });

  it('should fetch tab data and compare the returned version', () => {
    vi.mocked(mockPayloadService.transformPayload).mockClear();
    const compareVersionSpy = vi.spyOn(component.accountStore, 'compareVersion');
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK);

    component['fetchTabDataTyped'](of(tabData)).subscribe((result) => {
      expect(result).toEqual(tabData);
    });

    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(tabData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG);
    expect(compareVersionSpy).toHaveBeenCalledWith(tabData.version);
  });

  it('should set payment hold state when at-a-glance tab data emits', () => {
    const setHasPaymentHoldSpy = vi.spyOn(component.accountStore, 'setHasPaymentHold');

    component['refreshFragment$'].next('at-a-glance');
    component.tabAtAGlance$.subscribe();

    expect(setHasPaymentHoldSpy).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK.payment.hold_payment,
    );
  });

  it('should fetch major creditor header data for the account id', () => {
    vi.mocked(mockOpalFinesService.getMajorCreditorAccountHeadingData).mockClear();
    const accountId = 456;

    component['getHeaderData'](accountId).subscribe((result) => {
      expect(result).toEqual(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
    });

    expect(mockOpalFinesService.getMajorCreditorAccountHeadingData).toHaveBeenCalledWith(accountId);
  });

  it('should transform tab data for the view', () => {
    vi.mocked(mockPayloadService.transformPayload).mockClear();
    const tabData = structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK);

    const result = component['transformTabData'](tabData);

    expect(result).toEqual(tabData);
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(tabData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG);
  });

  it('should refresh the header and set the latest information message', () => {
    component.accountStore.setAccountState(MOCK_FINES_ACCOUNT_STATE);
    vi.mocked(mockOpalFinesService.getMajorCreditorAccountHeadingData).mockClear();
    const setHasVersionMismatchSpy = vi.spyOn(component.accountStore, 'setHasVersionMismatch');
    const setSuccessMessageSpy = vi.spyOn(component.accountStore, 'setSuccessMessage');

    component.refreshPage();

    expect(setHasVersionMismatchSpy).toHaveBeenCalledWith(false);
    expect(mockOpalFinesService.getMajorCreditorAccountHeadingData).toHaveBeenCalledWith(
      Number(MOCK_FINES_ACCOUNT_STATE.account_id),
    );
    expect(setSuccessMessageSpy).toHaveBeenCalledWith(FINES_ACC_BANNER_MESSAGES.latest);
    expect(component.accountData).toEqual(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
  });

  it('should check business unit permission using the account business unit id', () => {
    component.accountStore.setAccountState(MOCK_FINES_ACCOUNT_STATE);
    const hasBusinessUnitPermissionAccessSpy = vi
      .spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess')
      .mockReturnValue(true);

    const result = component.hasBusinessUnitPermissionKey('add-account-activity-notes');

    expect(result).toBe(true);
    expect(hasBusinessUnitPermissionAccessSpy).toHaveBeenCalledWith(
      FINES_PERMISSIONS['add-account-activity-notes'],
      Number(MOCK_FINES_ACCOUNT_STATE.business_unit_id),
      component['userState'].business_unit_users,
    );
  });
});

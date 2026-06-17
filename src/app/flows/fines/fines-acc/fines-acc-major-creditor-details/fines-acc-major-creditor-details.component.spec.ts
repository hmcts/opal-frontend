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
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-major-creditor-at-a-glance-with-defendant.mock';

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

  it('should initialize accountData and activeTab from route data', () => {
    expect(component.accountData).toEqual(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
    expect(component.activeTab).toBe('at-a-glance');
    expect(mockPayloadService.transformMajorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      123,
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
  });

  it('should set payment hold state when at-a-glance tab data emits', () => {
    const setHasPaymentHoldSpy = vi.spyOn(component.accountStore, 'setHasPaymentHold');

    component['refreshFragment$'].next('at-a-glance');
    component.tabAtAGlance$.subscribe();

    expect(setHasPaymentHoldSpy).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK.payment.hold_payment,
    );
  });
});

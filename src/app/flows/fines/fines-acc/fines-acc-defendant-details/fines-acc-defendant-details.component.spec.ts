import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsComponent } from './fines-acc-defendant-details.component';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab/fines-acc-defendant-details-at-a-glance-tab.component';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from './mocks/fines-acc-defendant-details-header.mock';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-at-a-glance-tab-ref-data.mock';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SA_ROUTING_PATHS } from '../../fines-sa/routing/constants/fines-sa-routing-paths.constant';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_DEFENDANT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-defendant-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions-tab-ref-data.mock';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';

describe('FinesAccDefendantDetailsComponent', () => {
  let component: FinesAccDefendantDetailsComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<InstanceType<typeof FinesAccPayloadService>>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          defendantAccountHeadingData: FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
        },
        fragment: 'at-a-glance',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as ActivatedRouteSnapshot, // Using 'as any' to avoid type issues
    };

    mockPayloadService = jasmine.createSpyObj<FinesAccPayloadService>('FinesAccPayloadService', [
      'transformAccountHeaderForStore',
    ]);
    mockPayloadService.transformAccountHeaderForStore.and.returnValue(MOCK_FINES_ACCOUNT_STATE);

    mockUtilsService = jasmine.createSpyObj<UtilsService>('UtilsService', ['convertToMonetaryString']);
    mockUtilsService.convertToMonetaryString.and.callFake((value: number) => `£${value.toFixed(2)}`);

    mockOpalFinesService = jasmine.createSpyObj<OpalFines>('OpalFines', [
      'getDefendantAccountHeadingData',
      'getDefendantAccountAtAGlanceTabData',
      'getDefendantAccountImpositionsTabData',
      'getDefendantAccountHistoryAndNotesTabData',
      'getDefendantAccountEnforcementTabData',
      'getDefendantAccountPaymentTermsTabData',
      'getDefendantAccountDefendantTabData',
      'clearAccountDetailsCache',
    ]);
    mockOpalFinesService.getDefendantAccountHeadingData.and.returnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK));
    mockOpalFinesService.getDefendantAccountAtAGlanceTabData.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountDefendantTabData.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_DEFENDANT_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountEnforcementTabData.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountPaymentTermsTabData.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountHistoryAndNotesTabData.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountImpositionsTabData.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK),
    );

    await TestBed.configureTestingModule({
      imports: [
        FinesAccDefendantDetailsComponent,
        FinesAccDefendantDetailsAtAGlanceTabComponent,
        MojSubNavigationComponent,
        MojSubNavigationItemComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsComponent);
    component = fixture.componentInstance;
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
    expect(component.accountData).toEqual(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    expect(component.activeTab).toBe('at-a-glance');
  });

  it('should handle tab switch', () => {
    component.handleTabSwitch('details');
    expect(component.activeTab).toBe('details');
  });

  it('should call router.navigate when navigateToAddAccountNotePage is called', () => {
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`], {
      relativeTo: component['activatedRoute'],
    });
  });

  it('should call router.navigate when navigateToAddCommentsPage is called', () => {
    const event: Event = new Event('click');
    component.navigateToAddCommentsPage(event);
    expect(routerSpy.navigate).toHaveBeenCalledWith([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`], {
      relativeTo: component['activatedRoute'],
    });
  });

  it('should navigate back to the search results page when navigateBack is called', () => {
    component.navigateBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.children.results}`,
    ]);
  });

  it('should fetch the defendant tab data when fragment is changed to defendant', () => {
    component['refreshFragment$'].next('defendant');
    expect(mockOpalFinesService.getDefendantAccountDefendantTabData).toHaveBeenCalled();
  });

  it('should fetch the enforcement tab data when fragment is changed to enforcement', () => {
    component['refreshFragment$'].next('enforcement');
    expect(mockOpalFinesService.getDefendantAccountEnforcementTabData).toHaveBeenCalled();
  });

  it('should fetch the payment terms tab data when fragment is changed to payment-terms', () => {
    component['refreshFragment$'].next('payment-terms');
    expect(mockOpalFinesService.getDefendantAccountPaymentTermsTabData).toHaveBeenCalled();
  });

  it('should fetch the history and notes tab data when fragment is changed to history-and-notes', () => {
    component['refreshFragment$'].next('history-and-notes');
    expect(mockOpalFinesService.getDefendantAccountHistoryAndNotesTabData).toHaveBeenCalled();
  });

  it('should fetch the impositions tab data when fragment is changed to impositions', () => {
    component['refreshFragment$'].next('impositions');
    expect(mockOpalFinesService.getDefendantAccountImpositionsTabData).toHaveBeenCalled();
  });

  it('should refresh the data for the header and current tab when refreshPage is called', () => {
    component.accountStore.setAccountState(MOCK_FINES_ACCOUNT_STATE);
    const event = new Event('click');
    component.refreshPage(event);
    expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(
      Number(MOCK_FINES_ACCOUNT_STATE.account_id),
    );
  });
});

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
import { OPAL_FINES_ACCOUNT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-details-tab-ref-data.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';

describe('FinesAccDefendantDetailsComponent', () => {
  let component: FinesAccDefendantDetailsComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

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

    mockUtilsService = jasmine.createSpyObj<UtilsService>('UtilsService', ['convertToMonetaryString']);
    mockUtilsService.convertToMonetaryString.and.callFake((value: number) => `£${value.toFixed(2)}`);

    mockOpalFinesService = jasmine.createSpyObj<OpalFines>('OpalFines', [
      'getDefendantAccountAtAGlance',
      'clearAccountDetailsCache',
    ]);
    mockOpalFinesService.getDefendantAccountAtAGlance.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK),
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
    component['getDataFromRoute']();
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
    spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').and.returnValue(true);
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`], {
      relativeTo: component['activatedRoute'],
    });
  });

  it('should navigate to access-denied if user lacks permission', () => {
    spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').and.returnValue(false);
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/access-denied'], {
      relativeTo: component['activatedRoute'],
    });
  });
});

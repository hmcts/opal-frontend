import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccMinorCreditorDetailsComponent } from './fines-acc-minor-creditor-details.component';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
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

describe('FinesAccMinorCreditorDetailsComponent', () => {
  let component: FinesAccMinorCreditorDetailsComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<InstanceType<typeof FinesAccPayloadService>>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          minorCreditorAccountHeadingData: structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
        },
        fragment: 'at-a-glance',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as ActivatedRouteSnapshot, // Using 'as any' to avoid type issues
    };

    mockPayloadService = jasmine.createSpyObj<FinesAccPayloadService>('FinesAccPayloadService', [
      'transformAccountHeaderForStore',
      'transformPayload',
    ]);
    mockPayloadService.transformAccountHeaderForStore.and.returnValue(MOCK_FINES_ACCOUNT_STATE);
    mockPayloadService.transformPayload.and.callFake((...args) => {
      return args[0]; // returns the first argument = payload
    });

    mockOpalFinesService = jasmine.createSpyObj<OpalFines>('OpalFines', [
      'getMinorCreditorAccountHeadingData',
      'clearCache',
      'getResult',
    ]);
    mockOpalFinesService.getMinorCreditorAccountHeadingData.and.returnValue(
      of(structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK)),
    );

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
    spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').and.returnValue(true);
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

  it('should navigate to access-denied if user lacks permission for the add account note page', () => {
    spyOn(component['permissionsService'], 'hasBusinessUnitPermissionAccess').and.returnValue(false);
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/access-denied'], {
      relativeTo: component['activatedRoute'],
    });
  });
});

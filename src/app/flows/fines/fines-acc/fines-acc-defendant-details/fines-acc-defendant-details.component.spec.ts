import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsComponent } from './fines-acc-defendant-details.component';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { FinesAccDetailsAccountInfoComponent } from '../components/fines-acc-details-account-info/fines-acc-details-account-info.component';
import { FinesAccDetailsAccountInfoBlockComponent } from '../components/fines-acc-details-account-info-block/fines-acc-details-account-info-block.component';
import { FinesAccDetailsAccountHeadingComponent } from '../components/fines-acc-details-account-heading/fines-acc-details-account-heading.component';
import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab/fines-acc-defendant-details-at-a-glance-tab.component';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK } from './constants/fines-acc-defendant-account-header.mock';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { of } from 'rxjs';

describe('FinesAccDefendantDetailsComponent', () => {
  let component: FinesAccDefendantDetailsComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  const mockHeaderDataAndBusinessUnit = {
    headingData: FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK,
    businessUnit: OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK,
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          headerDataAndBusinessUnit: mockHeaderDataAndBusinessUnit,
        },
        fragment: 'at-a-glance',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as ActivatedRouteSnapshot, // Using 'as any' to avoid type issues
    };

    mockUtilsService = jasmine.createSpyObj<UtilsService>('UtilsService', ['convertToMonetaryString']);
    mockUtilsService.convertToMonetaryString.and.callFake((value: number) => `£${value.toFixed(2)}`);

    await TestBed.configureTestingModule({
      imports: [
        FinesAccDefendantDetailsComponent,
        FinesAccDetailsAccountInfoComponent,
        FinesAccDetailsAccountInfoBlockComponent,
        FinesAccDetailsAccountHeadingComponent,
        FinesAccDefendantDetailsAtAGlanceTabComponent,
        MojSubNavigationComponent,
        MojSubNavigationItemComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize accountData, businessUnit, and activeTab from route data', () => {
    expect(component.accountData).toEqual(mockHeaderDataAndBusinessUnit.headingData);
    expect(component.businessUnit).toEqual(mockHeaderDataAndBusinessUnit.businessUnit);
    expect(component.activeTab).toBe('at-a-glance');
  });

  it('should handle tab switch', () => {
    component.handleTabSwitch('details');
    expect(component.activeTab).toBe('details');
  });

  xit('should call router.navigate when addAccountNote is called', () => {
    component.addAccountNote();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`../${FINES_ACC_ROUTING_PATHS.children.note}/add`], {
      relativeTo: component['activatedRoute'],
    });
  });

  xit('should have a linkClickEvent method that does nothing', () => {
    expect(() => component.linkClickEvent()).not.toThrow();
  });
});

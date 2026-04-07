import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { DashboardPage } from '@hmcts/opal-frontend-common/pages/dashboard-page';
import { By } from '@angular/platform-browser';
import { DASHBOARD_PAGE_CONFIGURATION_MAP } from './constants/dashboard-config.constant';
import { DASHBOARD_CONFIG_DEFAULT_DASHBOARD } from './constants/dashboard-config-default-dashboard.constant';
import { DASHBOARD_PAGE_DEFAULT_TAB } from './constants/dashboard-config-default-tab.constant';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardTypeParamMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let permissionsServiceMock: any;

  beforeEach(async () => {
    dashboardTypeParamMapSubject = new BehaviorSubject(convertToParamMap({ dashboardType: 'accounts' }));
    permissionsServiceMock = createSpyObj('PermissionsService', ['getUniquePermissions']);
    permissionsServiceMock.getUniquePermissions.mockReturnValue([101, 202, 303]);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: dashboardTypeParamMapSubject.asObservable(),
          },
        },
        { provide: PermissionsService, useValue: permissionsServiceMock },
        { provide: GlobalStore, useValue: { userState: () => null } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the reports config for the reports dashboard type', () => {
    dashboardTypeParamMapSubject.next(convertToParamMap({ dashboardType: 'reports' }));
    fixture.detectChanges();

    expect(component.resolvedConfig()).toEqual(DASHBOARD_PAGE_CONFIGURATION_MAP.reports);
  });

  it('should fall back to the default config for an unknown dashboard type', () => {
    dashboardTypeParamMapSubject.next(convertToParamMap({ dashboardType: 'unknown' }));
    fixture.detectChanges();

    expect(component.resolvedConfig()).toEqual(DASHBOARD_CONFIG_DEFAULT_DASHBOARD);
  });

  it('should use the hard-coded default dashboard config when the default tab map entry is missing', () => {
    const dashboardConfigMap = DASHBOARD_PAGE_CONFIGURATION_MAP as Partial<typeof DASHBOARD_PAGE_CONFIGURATION_MAP>;
    const originalDefaultConfig = dashboardConfigMap[DASHBOARD_PAGE_DEFAULT_TAB];

    delete dashboardConfigMap[DASHBOARD_PAGE_DEFAULT_TAB];

    try {
      dashboardTypeParamMapSubject.next(convertToParamMap({ dashboardType: 'unknown' }));
      fixture.detectChanges();

      expect(component.resolvedConfig()).toEqual(DASHBOARD_CONFIG_DEFAULT_DASHBOARD);
    } finally {
      dashboardConfigMap[DASHBOARD_PAGE_DEFAULT_TAB] = originalDefaultConfig;
    }
  });

  it('should render the dashboard page with the resolved dashboard config', () => {
    dashboardTypeParamMapSubject.next(convertToParamMap({ dashboardType: 'reports' }));
    fixture.detectChanges();

    const dashboardPageDebugElement = fixture.debugElement.query(By.directive(DashboardPage));
    const dashboardPageComponent = dashboardPageDebugElement.componentInstance as DashboardPage;
    const dashboardTitle = fixture.nativeElement.querySelector('.govuk-heading-l') as HTMLHeadingElement;

    expect(dashboardPageComponent.dashboardConfig).toEqual(DASHBOARD_PAGE_CONFIGURATION_MAP.reports);
    expect(dashboardTitle.textContent?.trim()).toBe(DASHBOARD_PAGE_CONFIGURATION_MAP.reports.title);
  });
});

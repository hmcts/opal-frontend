import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from '@hmcts/opal-frontend-common/pages/dashboard-page';
import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { beforeEach, describe, expect, it } from 'vitest';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

const DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Dashboard Integration Test',
  highlights: [
    {
      id: 'allowed-highlight-link',
      text: 'Allowed highlight link',
      routerLink: [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_DASHBOARD_ROUTING_PATHS.root,
        FINES_DASHBOARD_ROUTING_PATHS.children.reports,
      ],
      fragment: 'review',
      permissionIds: [101],
      newTab: true,
      style: 'guidance-panel-blue',
    },
    {
      id: 'blocked-highlight-link',
      text: 'Blocked highlight link',
      routerLink: [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_DASHBOARD_ROUTING_PATHS.root,
        FINES_DASHBOARD_ROUTING_PATHS.children.reports,
      ],
      fragment: null,
      permissionIds: [202],
      newTab: false,
      style: '',
    },
  ],
  groups: [
    {
      id: 'integration-group',
      title: 'Integration Group',
      links: [
        {
          id: 'allowed-group-link',
          text: 'Allowed group link',
          routerLink: [
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ],
          fragment: 'summary',
          permissionIds: [101],
          newTab: false,
          style: '',
        },
        {
          id: 'blocked-group-link',
          text: 'Blocked group link',
          routerLink: [
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ],
          fragment: null,
          permissionIds: [202],
          newTab: false,
          style: '',
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-dashboard-page-host',
  standalone: true,
  imports: [DashboardPage],
  template: '<opal-lib-dashboard-page [dashboardConfig]="dashboardConfig" />',
})
class DashboardPageHostComponent {
  public readonly dashboardConfig = DASHBOARD_CONFIG;
}

describe('DashboardPage integration', () => {
  let fixture: ComponentFixture<DashboardPageHostComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let permissionsServiceMock: any;

  beforeEach(async () => {
    permissionsServiceMock = createSpyObj('PermissionsService', ['getUniquePermissions']);

    await TestBed.configureTestingModule({
      imports: [DashboardPageHostComponent],
      providers: [
        provideRouter([]),
        { provide: PermissionsService, useValue: permissionsServiceMock },
        { provide: GlobalStore, useValue: { userState: () => null } },
      ],
    }).compileComponents();
  });

  it('should only render links the user has permission to access', () => {
    permissionsServiceMock.getUniquePermissions.mockReturnValue([101]);

    fixture = TestBed.createComponent(DashboardPageHostComponent);
    fixture.detectChanges();

    const renderedText = fixture.nativeElement.textContent as string;

    expect(renderedText).toContain('Allowed highlight link');
    expect(renderedText).toContain('Allowed group link');
    expect(renderedText).not.toContain('Blocked highlight link');
    expect(renderedText).not.toContain('Blocked group link');
    expect(permissionsServiceMock.getUniquePermissions).toHaveBeenCalled();
  });

  it('should render new-tab and fragment link attributes from config', () => {
    permissionsServiceMock.getUniquePermissions.mockReturnValue([101]);

    fixture = TestBed.createComponent(DashboardPageHostComponent);
    fixture.detectChanges();

    const newTabLink = fixture.nativeElement.querySelector('#allowed-highlight-link') as HTMLAnchorElement;
    const normalLink = fixture.nativeElement.querySelector('#allowed-group-link') as HTMLAnchorElement;

    expect(newTabLink).toBeTruthy();
    expect(newTabLink.getAttribute('target')).toBe('_blank');
    expect(newTabLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(newTabLink.getAttribute('href')).toContain('#review');

    expect(normalLink).toBeTruthy();
    expect(normalLink.getAttribute('target')).toBe('_self');
    expect(normalLink.getAttribute('rel')).toBeNull();
    expect(normalLink.getAttribute('href')).toContain('#summary');
  });

  it('should not render highlight or group sections when no permissions are available', () => {
    permissionsServiceMock.getUniquePermissions.mockReturnValue([]);

    fixture = TestBed.createComponent(DashboardPageHostComponent);
    fixture.detectChanges();

    const renderedText = fixture.nativeElement.textContent as string;
    const sectionHeadings = fixture.nativeElement.querySelectorAll('h2.govuk-heading-m');
    const links = fixture.nativeElement.querySelectorAll('a.govuk-link');

    expect(renderedText).toContain(DASHBOARD_CONFIG.title);
    expect(renderedText).not.toContain('Integration Group');
    expect(sectionHeadings.length).toBe(0);
    expect(links.length).toBe(0);
  });
});

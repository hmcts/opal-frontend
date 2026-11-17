import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { filter, firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FinesFpuPlaceholderComponent } from '../fines-fpu-placeholder/fines-fpu-placeholder.component';
import { routing } from './fines-fpu.routes';

@Component({ selector: 'app-fpu-test-accounts', template: '<h1>Accounts</h1>' })
class AccountsDestinationComponent {}

@Component({ selector: 'app-fpu-test-access-denied', template: '<h1>Access denied</h1>' })
class AccessDeniedDestinationComponent {}

describe('fines FPU routes', () => {
  const fixedPenaltyUploadsUrl = '/fines/accounts/fixed-penalty-uploads';
  const accountsUrl = '/fines/dashboard/accounts';
  let permissionIds: number[];

  beforeEach(() => {
    permissionIds = [FINES_PERMISSIONS['publish-fixed-penalty']];

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'fines/accounts/fixed-penalty-uploads', children: routing },
          { path: 'fines/dashboard/accounts', component: AccountsDestinationComponent },
          { path: 'access-denied', component: AccessDeniedDestinationComponent },
        ]),
        { provide: AuthService, useValue: { checkAuthenticated: () => of(true) } },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: () =>
              of({
                business_unit_users: [
                  {
                    permissions: permissionIds.map((permissionId) => ({ permission_id: permissionId })),
                  },
                ],
              }),
          },
        },
        { provide: GlobalStore, useValue: {} },
      ],
    });
  });

  it('should allow direct entry with the publish permission and render the titled placeholder', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(fixedPenaltyUploadsUrl, FinesFpuPlaceholderComponent);

    expect(TestBed.inject(Router).url).toBe(fixedPenaltyUploadsUrl);
    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Fixed Penalty Uploads');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Fixed Penalty Uploads');
    expect(harness.routeNativeElement?.textContent).toContain('This page is for future implementation.');
    expect(harness.routeNativeElement?.querySelector('a.govuk-back-link')?.getAttribute('href')).toBe(accountsUrl);
  });

  it('should navigate back to Accounts from the placeholder', async () => {
    const harness = await RouterTestingHarness.create(fixedPenaltyUploadsUrl);
    const navigationFinished = firstValueFrom(
      TestBed.inject(Router).events.pipe(filter((event) => event instanceof NavigationEnd)),
    );

    harness.routeNativeElement?.querySelector<HTMLAnchorElement>('a.govuk-back-link')?.click();
    await navigationFinished;
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe(accountsUrl);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Accounts');
  });

  it.each([
    ['no permissions', []],
    ['only the check and validate permission', [FINES_PERMISSIONS['check-and-validate-draft-accounts']]],
  ])('should deny direct entry with %s', async (_, permissions) => {
    permissionIds = permissions;
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(fixedPenaltyUploadsUrl, AccessDeniedDestinationComponent);

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(harness.routeNativeElement?.querySelector('#fines-fpu-heading')).toBeNull();
  });
});

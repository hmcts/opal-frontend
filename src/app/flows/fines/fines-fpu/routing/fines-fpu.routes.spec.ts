import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { filter, firstValueFrom, of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FinesFpuTabsComponent } from '../fines-fpu-tabs/fines-fpu-tabs.component';
import { FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK } from '../services/mocks/fines-fpu-payload.mock';
import { routing } from './fines-fpu.routes';

@Component({ selector: 'app-fpu-test-accounts', template: '<h1>Accounts</h1>' })
class AccountsDestinationComponent {}

@Component({ selector: 'app-fpu-test-access-denied', template: '<h1>Access denied</h1>' })
class AccessDeniedDestinationComponent {}

describe('fines FPU routes', () => {
  const fixedPenaltyUploadsUrl = '/fines/accounts/fixed-penalty-uploads';
  const accountsUrl = '/fines/dashboard/accounts';
  let permissionIds: number[];
  let opalFines: { getDraftAccounts: ReturnType<typeof vi.fn>; clearDraftAccountsCache: ReturnType<typeof vi.fn> };

  const userState = (): IOpalUserState => ({
    ...structuredClone(OPAL_USER_STATE_MOCK),
    business_unit_users: [
      {
        business_unit_id: 78,
        business_unit_user_id: 'fpu-test-user',
        permissions: permissionIds.map((permissionId) => ({
          permission_id: permissionId,
          permission_name: `Permission ${permissionId}`,
        })),
      },
    ],
  });

  beforeEach(() => {
    permissionIds = [FINES_PERMISSIONS['publish-fixed-penalty']];
    opalFines = {
      getDraftAccounts: vi.fn().mockReturnValue(of({ count: 0, summaries: [] })),
      clearDraftAccountsCache: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'fines/accounts/fixed-penalty-uploads', children: routing },
          { path: 'fines/dashboard/accounts', component: AccountsDestinationComponent },
          { path: 'access-denied', component: AccessDeniedDestinationComponent },
        ]),
        { provide: AuthService, useValue: { checkAuthenticated: () => of(true) } },
        { provide: OpalFines, useValue: opalFines },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: () => of(userState()),
          },
        },
      ],
    });
    TestBed.inject(GlobalStore).setUserState(userState());
  });

  it('should allow direct entry with permission 23 and render the titled To publish page', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(fixedPenaltyUploadsUrl, FinesFpuTabsComponent);

    expect(TestBed.inject(Router).url).toBe(fixedPenaltyUploadsUrl);
    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Fixed Penalty Uploads');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Fixed Penalty uploads');
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
    expect(harness.routeNativeElement?.querySelector('a.govuk-back-link')?.getAttribute('href')).toBe(accountsUrl);
    expect(harness.routeNativeElement?.querySelector('#fines-fpu-empty')?.textContent).toBe(
      'There are no tickets to register or publish.',
    );
    expect(opalFines.getDraftAccounts).toHaveBeenCalledExactlyOnceWith({
      source: 'VPFPO',
      businessUnitIds: [78],
      statuses: ['Submitted'],
    });
    expect(opalFines.clearDraftAccountsCache).not.toHaveBeenCalled();
  });

  it('should retain Accounts until the initial draft accounts resolve and render the table with one request', async () => {
    const pendingResponse = new Subject<IOpalFinesDraftAccountsResponse>();
    const requestStarted = new Subject<void>();
    opalFines.getDraftAccounts.mockImplementation(() => {
      requestStarted.next();
      return pendingResponse;
    });
    const harness = await RouterTestingHarness.create(accountsUrl);
    const started = firstValueFrom(requestStarted);

    const navigation = harness.navigateByUrl(fixedPenaltyUploadsUrl, FinesFpuTabsComponent);
    await started;

    expect(TestBed.inject(Router).url).toBe(accountsUrl);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Accounts');
    expect(harness.routeNativeElement?.querySelector('#fines-fpu-heading')).toBeNull();
    expect(opalFines.getDraftAccounts).toHaveBeenCalledOnce();

    pendingResponse.next({ count: 1, summaries: [FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK] });
    pendingResponse.complete();
    await navigation;

    expect(TestBed.inject(Router).url).toBe(fixedPenaltyUploadsUrl);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
    expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Zedford');
    expect(
      harness.routeNativeElement?.querySelector('#fines-fpu-business-unit-ticket-count-78')?.textContent?.trim(),
    ).toBe('1');
    expect(opalFines.getDraftAccounts).toHaveBeenCalledOnce();
    expect(opalFines.clearDraftAccountsCache).not.toHaveBeenCalled();
  });

  it.each([
    ['published', 'Published'],
    ['upload-errors', 'Upload errors'],
  ])(
    'should skip the initial request for #%s and fetch current rows on each return to To publish',
    async (fragment, label) => {
      opalFines.getDraftAccounts
        .mockReturnValueOnce(of({ count: 1, summaries: [FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK] }))
        .mockReturnValueOnce(of({ count: 0, summaries: [] }));
      const harness = await RouterTestingHarness.create(`${fixedPenaltyUploadsUrl}#${fragment}`);

      expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe(label);
      expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();

      await harness.navigateByUrl(`${fixedPenaltyUploadsUrl}#to-publish`);

      expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
      expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Zedford');
      expect(opalFines.getDraftAccounts).toHaveBeenCalledOnce();
      expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledOnce();

      await harness.navigateByUrl(`${fixedPenaltyUploadsUrl}#${fragment}`);
      await harness.navigateByUrl(`${fixedPenaltyUploadsUrl}#to-publish`);

      expect(harness.routeNativeElement?.querySelector('#fines-fpu-empty')?.textContent).toBe(
        'There are no tickets to register or publish.',
      );
      expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
      expect(opalFines.getDraftAccounts).toHaveBeenCalledTimes(2);
      expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledTimes(2);
    },
  );

  it('should navigate back to Accounts from Fixed Penalty uploads', async () => {
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
    expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
  });
});

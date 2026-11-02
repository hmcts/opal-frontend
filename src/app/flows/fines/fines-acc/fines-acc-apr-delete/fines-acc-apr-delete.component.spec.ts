import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { businessUnitRoutePermissionsGuard } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import {
  IOpalFinesApr,
  IOpalFinesAprResponse,
  IOpalFinesAprsResponse,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { finesAccAprResolver } from '../routing/resolvers/fines-acc-apr/fines-acc-apr.resolver';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { routing } from '../routing/fines-acc-apr.routes';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { transformAprsPayload } from '../services/utils/fines-acc-payload-transform-apr-data.utils';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprDeleteComponent } from './fines-acc-apr-delete.component';

@Component({ template: '' })
class DeleteTestDestinationComponent {}

const reference: IOpalFinesApr = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  business_unit_id: 77,
  relationship: 'APR',
  category: 'APR',
  apr_text: 'TEST-REFERENCE',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: '2026-06-03T12:00:00Z',
};
const listUrl = '/fines/account/defendant/141/alternate/payment/reference/list';
const deleteUrl = '/fines/account/defendant/141/alternate/payment/reference/delete?alternatePaymentReferenceId=11';

describe('FinesAccAprDeleteComponent', () => {
  let harness: RouterTestingHarness;
  let accountStore: InstanceType<typeof FinesAccountStore>;
  let data: IOpalFinesAprsResponse;
  let api: {
    getDefendantAccountHeadingData: ReturnType<typeof vi.fn>;
    getAprs: ReturnType<typeof vi.fn>;
    deleteApr: ReturnType<typeof vi.fn>;
    clearAccountDetailsCache: ReturnType<typeof vi.fn>;
  };

  const render = () => harness.navigateByUrl(deleteUrl, FinesAccAprDeleteComponent);
  const confirm = () => (harness.routeNativeElement!.querySelector('#apr-remove-confirm') as HTMLButtonElement).click();

  beforeEach(async () => {
    data = { references: [reference], version: '"7"' };
    api = {
      getDefendantAccountHeadingData: vi.fn().mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK)),
      getAprs: vi.fn().mockImplementation(() => of(data)),
      deleteApr: vi.fn().mockReturnValue(of({ reference, version: '"8"' })),
      clearAccountDetailsCache: vi.fn(),
    };
    await TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: api },
        {
          provide: FinesAccPayloadService,
          useValue: {
            transformAprsPayload,
            transformDefendantAccountHeaderForStore: vi.fn().mockImplementation((accountId: number) => ({
              ...MOCK_FINES_ACCOUNT_STATE,
              account_id: accountId,
              account_number: '177A',
              party_name: 'APR TEST',
            })),
          },
        },
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference',
            children: [
              {
                path: 'delete',
                component: FinesAccAprDeleteComponent,
                runGuardsAndResolvers: 'always',
                resolve: { aprs: finesAccAprResolver },
              },
              { path: 'list', component: DeleteTestDestinationComponent },
            ],
          },
          { path: 'error/internal-server', component: DeleteTestDestinationComponent },
        ]),
      ],
    }).compileComponents();
    accountStore = TestBed.inject(FinesAccountStore);
    harness = await RouterTestingHarness.create();
  });

  it('renders the selected APR and account caption with common controls and no table management actions', async () => {
    data = {
      ...data,
      references: [reference, { ...reference, alternate_payment_reference_id: 12, apr_text: 'OTHER-REFERENCE' }],
    };

    await render();

    const element = harness.routeNativeElement!;
    expect(element.querySelector('h1')?.textContent).toContain(
      'Are you sure you want to remove this alternate payment reference',
    );
    expect(element.textContent).toContain('177A - APR TEST');
    expect(element.querySelectorAll('#apr-remove-table tbody tr')).toHaveLength(1);
    expect(element.querySelector('#apr-remove-table')?.textContent).toContain('TEST-REFERENCE');
    expect(element.querySelector('#apr-remove-table')?.textContent).toContain('01 June 2026');
    expect(element.querySelector('#apr-remove-table')?.textContent).toContain('03 June 2026');
    expect(element.querySelector('#apr-remove-table')?.textContent).not.toContain('OTHER-REFERENCE');
    expect(element.querySelector('#apr-remove-table a')).toBeNull();
    expect(element.querySelectorAll('#apr-remove-table thead th')).toHaveLength(3);
    expect(element.querySelector('opal-lib-govuk-button #apr-remove-confirm')?.textContent?.trim()).toBe(
      'Yes - remove reference',
    );
    expect(element.querySelector('opal-lib-govuk-cancel-link a')?.textContent?.trim()).toBe('No - cancel');
    expect(api.deleteApr).not.toHaveBeenCalled();
  });

  it.each(['APR', 'CONSOLIDATED', 'AMALGAMATED'] as const)(
    'confirms removal of an eligible %s reference using the freshly resolved account version',
    async (relationship) => {
      const selected = { ...reference, relationship };
      data = { references: [selected], version: '"27"' };
      accountStore.setAccountState({ ...MOCK_FINES_ACCOUNT_STATE, base_version: '"stale"' });
      api.deleteApr.mockReturnValue(of({ reference: selected, version: '"28"' }));
      await render();

      confirm();
      await harness.fixture.whenStable();

      expect(api.deleteApr).toHaveBeenCalledExactlyOnceWith(141, 11, '"27"');
      expect(accountStore.base_version()).toBe('"28"');
      expect(api.clearAccountDetailsCache).toHaveBeenCalledOnce();
      expect(accountStore.successMessage()).toBe('Alternate payment reference removed');
      expect(TestBed.inject(Router).url).toBe(listUrl);
    },
  );

  it('returns to the current account list on cancel without deleting, changing the version or announcing success', async () => {
    await render();

    (harness.routeNativeElement!.querySelector('#apr-remove-cancel a') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(listUrl);
    expect(api.deleteApr).not.toHaveBeenCalled();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(accountStore.base_version()).toBe('"7"');
    expect(accountStore.successMessage()).toBeNull();
  });

  it('ignores repeated confirmations while the removal request is pending', async () => {
    const result = new Subject<IOpalFinesAprResponse>();
    api.deleteApr.mockReturnValue(result);
    const component = await render();

    confirm();
    component.handleRemove();
    harness.detectChanges();

    expect(component.isRemoving()).toBe(true);
    expect(harness.routeNativeElement!.querySelector('fieldset')?.disabled).toBe(true);
    expect(api.deleteApr).toHaveBeenCalledExactlyOnceWith(141, 11, '"7"');
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(accountStore.successMessage()).toBeNull();

    result.next({ reference, version: '"8"' });
    result.complete();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(listUrl);
  });

  it.each([409, 500, 504])(
    'leaves success state untouched after HTTP %s so the shared interceptor retains error handling',
    async (status) => {
      api.deleteApr.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status, error: { status, retriable: status !== 409 } })),
      );
      const component = await render();

      confirm();
      await harness.fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe(deleteUrl);
      expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
      expect(accountStore.base_version()).toBe('"7"');
      expect(accountStore.successMessage()).toBeNull();
      expect(component.isRemoving()).toBe(false);
    },
  );

  it('uses newly resolved selection and version when Angular reuses the component after a query change', async () => {
    const component = await render();
    const nextReference = { ...reference, alternate_payment_reference_id: 12, apr_text: 'NEXT-REFERENCE' };
    data = { references: [reference, nextReference], version: '"9"' };
    api.deleteApr.mockReturnValue(of({ reference: nextReference, version: '"10"' }));

    const reused = await harness.navigateByUrl(
      deleteUrl.replace('alternatePaymentReferenceId=11', 'alternatePaymentReferenceId=12'),
      FinesAccAprDeleteComponent,
    );

    expect(reused).toBe(component);
    expect(harness.routeNativeElement!.querySelector('#apr-remove-table')?.textContent).toContain('NEXT-REFERENCE');
    confirm();
    await harness.fixture.whenStable();
    expect(api.deleteApr).toHaveBeenCalledExactlyOnceWith(141, 12, '"9"');
    expect(accountStore.base_version()).toBe('"10"');
  });

  it.each(['query', 'account'] as const)(
    'cancels pending removal on a %s change so its late response cannot alter the new context',
    async (change) => {
      const result = new Subject<IOpalFinesAprResponse>();
      api.deleteApr.mockReturnValue(result);
      const component = await render();
      confirm();
      expect(result.observed).toBe(true);

      const accountId = change === 'account' ? 142 : 141;
      const nextReference = {
        ...reference,
        alternate_payment_reference_id: 12,
        defendant_account_id: accountId,
        apr_text: 'NEXT-REFERENCE',
      };
      data = { references: [nextReference], version: '"9"' };
      const nextUrl = deleteUrl
        .replace('/141/', `/${accountId}/`)
        .replace('alternatePaymentReferenceId=11', 'alternatePaymentReferenceId=12');

      const reused = await harness.navigateByUrl(nextUrl, FinesAccAprDeleteComponent);
      expect(result.observed).toBe(false);
      result.next({ reference, version: '"8"' });
      result.complete();
      await harness.fixture.whenStable();

      expect(reused).toBe(component);
      expect(component.isRemoving()).toBe(false);
      expect(TestBed.inject(Router).url).toBe(nextUrl);
      expect(accountStore.account_id()).toBe(accountId);
      expect(accountStore.base_version()).toBe('"9"');
      expect(accountStore.successMessage()).toBeNull();
      expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
      expect(harness.routeNativeElement!.querySelector('#apr-remove-table')?.textContent).toContain('NEXT-REFERENCE');

      api.deleteApr.mockReturnValue(of({ reference: nextReference, version: '"10"' }));
      confirm();
      await harness.fixture.whenStable();
      expect(api.deleteApr).toHaveBeenLastCalledWith(accountId, 12, '"9"');
      expect(accountStore.base_version()).toBe('"10"');
      expect(TestBed.inject(Router).url).toBe(listUrl.replace('/141/', `/${accountId}/`));
    },
  );

  it('cancels pending removal when the confirmation page is destroyed and ignores its late response', async () => {
    const result = new Subject<IOpalFinesAprResponse>();
    api.deleteApr.mockReturnValue(result);
    const component = await render();
    confirm();
    expect(result.observed).toBe(true);

    await harness.navigateByUrl(listUrl);
    result.next({ reference, version: '"8"' });
    result.complete();

    expect(result.observed).toBe(false);
    expect(component.isRemoving()).toBe(false);
    expect(accountStore.base_version()).toBe('"7"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe(listUrl);
  });

  it.each(['999', 'invalid', ''])(
    'returns missing selection %s to manage without exposing a delete action',
    async (id) => {
      await harness.navigateByUrl(
        deleteUrl.replace('alternatePaymentReferenceId=11', `alternatePaymentReferenceId=${id}`),
      );

      expect(TestBed.inject(Router).url).toBe(listUrl);
      expect(api.deleteApr).not.toHaveBeenCalled();
    },
  );

  it('returns a read-only account-reference selection to manage without deleting it', async () => {
    data = { ...data, references: [{ ...reference, category: 'ACC' }] };

    await harness.navigateByUrl(deleteUrl);

    expect(TestBed.inject(Router).url).toBe(listUrl);
    expect(api.deleteApr).not.toHaveBeenCalled();
  });

  it('rejects a missing account ETag before showing the confirmation page', async () => {
    data = { ...data, version: null };

    await harness.navigateByUrl(deleteUrl);

    expect(TestBed.inject(Router).url).toBe('/error/internal-server');
    expect(api.deleteApr).not.toHaveBeenCalled();
  });

  it('registers a descriptive lazy delete route with business-unit permission and fresh APR resolution', async () => {
    const deleteRoute = routing.find((route) => route.path === 'delete');

    expect(await deleteRoute?.loadComponent?.()).toBe(FinesAccAprDeleteComponent);
    expect(deleteRoute?.data?.['title']).toBe('Remove Alternate Payment Reference');
    expect(deleteRoute?.data?.['routePermissionId']).toEqual([
      FINES_PERMISSIONS['manage-alternate-payment-references'],
    ]);
    expect(deleteRoute?.canActivate).toEqual([businessUnitRoutePermissionsGuard]);
    expect(deleteRoute?.resolve).toEqual({
      title: TitleResolver,
      aprs: finesAccAprResolver,
    });
    expect(deleteRoute?.runGuardsAndResolvers).toBe('always');
  });
});

import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { IOpalFinesDraftAccountsSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-accounts-summary.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesFpuToPublishTableWrapperComponent } from '../fines-fpu-to-publish/fines-fpu-to-publish-form/fines-fpu-to-publish-table-wrapper/fines-fpu-to-publish-table-wrapper.component';
import { FinesFpuStore } from '../stores/fines-fpu.store';
import { FinesFpuTabsComponent } from './fines-fpu-tabs.component';
import { FINES_FPU_ROUTE_DATA_KEYS } from '../constants/fines-fpu-route-data-keys.constant';

describe('FinesFpuTabsComponent', () => {
  const uploadsUrl = '/fines/accounts/fixed-penalty-uploads';
  const draftAccount = (
    draftAccountId: number,
    businessUnitId = 78,
    businessUnitName = 'Eastshire',
  ): IOpalFinesDraftAccountsSummary => ({
    draft_account_id: draftAccountId,
    business_unit_id: businessUnitId,
    account_type: 'Fine',
    account_status: 'Submitted',
    account_number: '',
    account_status_date: '2026-11-16',
    created_at: '2026-11-16',
    submitted_by: 'fpu-test-user',
    account_snapshot: {
      account_type: 'Fine',
      business_unit_name: businessUnitName,
      created_date: '2026-11-16',
      date_of_birth: null,
      defendant_name: '',
      submitted_by: 'fpu-test-user',
      submitted_by_name: '',
    },
  });
  const response = (...summaries: IOpalFinesDraftAccountsSummary[]): IOpalFinesDraftAccountsResponse => ({
    count: summaries.length,
    summaries,
  });
  let opalFines: { getDraftAccounts: ReturnType<typeof vi.fn>; clearDraftAccountsCache: ReturnType<typeof vi.fn> };
  let store: InstanceType<typeof FinesFpuStore>;
  let userState: IOpalUserState;

  beforeEach(() => {
    opalFines = {
      getDraftAccounts: vi.fn().mockReturnValue(of(response(draftAccount(1), draftAccount(2)))),
      clearDraftAccountsCache: vi.fn(),
    };
    userState = {
      ...structuredClone(OPAL_USER_STATE_MOCK),
      business_unit_users: [78, 80].map((businessUnitId) => ({
        business_unit_id: businessUnitId,
        business_unit_user_id: `fpu-test-user-${businessUnitId}`,
        permissions: [
          { permission_id: FINES_PERMISSIONS['publish-fixed-penalty'], permission_name: 'Publish Fixed Penalty' },
        ],
      })),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/accounts/fixed-penalty-uploads',
            children: [{ path: '', component: FinesFpuTabsComponent }],
          },
        ]),
        { provide: OpalFines, useValue: opalFines },
      ],
    });
    TestBed.inject(GlobalStore).setUserState(userState);
    store = TestBed.inject(FinesFpuStore);
  });

  const clickTab = async (harness: RouterTestingHarness, text: string): Promise<void> => {
    const link = Array.from(harness.routeNativeElement!.querySelectorAll<HTMLAnchorElement>('nav a')).find(
      (item) => item.textContent?.trim() === text,
    );
    expect(link).toBeDefined();

    link!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
  };

  const provideResolvedDraftAccounts = (draftAccounts: IOpalFinesDraftAccountsResponse): void => {
    TestBed.inject(Router).resetConfig([
      {
        path: 'fines/accounts/fixed-penalty-uploads',
        children: [
          {
            path: '',
            component: FinesFpuTabsComponent,
            resolve: { [FINES_FPU_ROUTE_DATA_KEYS.draftAccounts]: () => of(draftAccounts) },
          },
        ],
      },
    ]);
  };

  it('should use resolved draft accounts once and request fresh data when returning to To publish', async () => {
    provideResolvedDraftAccounts(response(draftAccount(1)));
    opalFines.getDraftAccounts.mockReturnValue(of(response(draftAccount(2, 80, 'Westshire'))));
    const harness = await RouterTestingHarness.create(uploadsUrl);

    expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Eastshire');
    expect(store.tabData()).toEqual([{ business_unit_id: 78, business_unit_name: 'Eastshire', ticket_count: 1 }]);
    expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
    expect(opalFines.clearDraftAccountsCache).not.toHaveBeenCalled();

    await clickTab(harness, 'Published');
    await clickTab(harness, 'To publish');

    expect(store.tabData()).toEqual([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 }]);
    expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Westshire');
    expect(opalFines.getDraftAccounts).toHaveBeenCalledOnce();
    expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledOnce();
  });

  it('should display a resolved empty response without making a second request', async () => {
    provideResolvedDraftAccounts(response());
    const harness = await RouterTestingHarness.create(uploadsUrl);

    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
    expect(harness.routeNativeElement?.querySelector('#fines-fpu-empty')?.textContent).toBe(
      'There are no tickets to register or publish.',
    );
    expect(store.tabData()).toEqual([]);
    expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
    expect(opalFines.clearDraftAccountsCache).not.toHaveBeenCalled();
  });

  it('should open To publish by default and request current Submitted fixed penalties for eligible business units', async () => {
    const harness = await RouterTestingHarness.create(uploadsUrl);

    expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledOnce();
    expect(opalFines.getDraftAccounts).toHaveBeenCalledExactlyOnceWith({
      businessUnitIds: [78, 80],
      source: 'VPFPO',
      statuses: ['Submitted'],
    });
    expect(opalFines.clearDraftAccountsCache.mock.invocationCallOrder[0]).toBeLessThan(
      opalFines.getDraftAccounts.mock.invocationCallOrder[0],
    );
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Fixed Penalty uploads');
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
    expect(harness.routeNativeElement?.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('To publish');
    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toEqual([{ business_unit_id: 78, business_unit_name: 'Eastshire', ticket_count: 2 }]);
    expect(store.businessUnits()).toEqual([{ business_unit_id: 78, business_unit_name: 'Eastshire', ticket_count: 2 }]);
    expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Eastshire');
    expect(harness.routeNativeElement?.textContent).toContain(
      'Select the business unit(s) where you want to register and publish the Fixed Penalties',
    );
    expect(harness.routeNativeElement?.querySelector('button')).toBeNull();
  });

  it.each([
    ['published', 'Published'],
    ['upload-errors', 'Upload errors'],
  ])('should support a direct #%s link without requesting To publish data', async (fragment, label) => {
    const harness = await RouterTestingHarness.create(`${uploadsUrl}#${fragment}`);

    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe(label);
    expect(harness.routeNativeElement?.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe(label);
    expect(harness.routeNativeElement?.textContent).toContain('This page is for future implementation.');
    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
    expect(store.fragment()).toBe(fragment);
    expect(store.tabData()).toBeNull();
    expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
    expect(opalFines.clearDraftAccountsCache).not.toHaveBeenCalled();
  });

  it('should request fresh rows when returning to To publish through the navigation links', async () => {
    opalFines.getDraftAccounts
      .mockReturnValueOnce(of(response(draftAccount(1), draftAccount(2, 80, 'Westshire'))))
      .mockReturnValueOnce(of(response(draftAccount(3, 80, 'Westshire'), draftAccount(4, 80, 'Westshire'))));
    const harness = await RouterTestingHarness.create(uploadsUrl);
    const table = harness.routeDebugElement!.query(By.directive(FinesFpuToPublishTableWrapperComponent))
      .componentInstance as FinesFpuToPublishTableWrapperComponent;

    table.selectedBusinessUnitIdsChange.emit([78, 80]);
    await harness.fixture.whenStable();
    expect(store.selectedBusinessUnitIds()).toEqual([78, 80]);

    await clickTab(harness, 'Published');
    expect(TestBed.inject(Router).url).toBe(`${uploadsUrl}#published`);
    expect(store.fragment()).toBe('published');
    expect(store.tabData()).toBeNull();
    expect(store.selectedBusinessUnitIds()).toEqual([78, 80]);
    expect(opalFines.getDraftAccounts).toHaveBeenCalledOnce();
    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();

    await clickTab(harness, 'To publish');

    expect(TestBed.inject(Router).url).toBe(`${uploadsUrl}#to-publish`);
    expect(opalFines.getDraftAccounts).toHaveBeenCalledTimes(2);
    expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledTimes(2);
    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toEqual([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 2 }]);
    expect(store.businessUnits()).toEqual([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 2 }]);
    expect(store.selectedBusinessUnitIds()).toEqual([80]);
    const refreshedTable = harness.routeDebugElement!.query(By.directive(FinesFpuToPublishTableWrapperComponent))
      .componentInstance as FinesFpuToPublishTableWrapperComponent;
    expect(refreshedTable.selectedBusinessUnitIds()).toEqual([80]);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should hide the tab heading, table and empty state until the request completes', async () => {
    const pendingResponse = new Subject<IOpalFinesDraftAccountsResponse>();
    opalFines.getDraftAccounts.mockReturnValue(pendingResponse);
    store.setBusinessUnits([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 }]);
    store.setSelectedBusinessUnitIds([80]);
    const harness = await RouterTestingHarness.create(uploadsUrl);

    expect(harness.routeNativeElement?.querySelector('[role="status"]')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('h2')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('#fines-fpu-empty')).toBeNull();
    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toBeNull();
    expect(store.businessUnits()).toEqual([]);
    expect(store.selectedBusinessUnitIds()).toEqual([80]);

    pendingResponse.next(response(draftAccount(1)));
    pendingResponse.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelector('[role="status"]')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
    expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Eastshire');
    expect(store.tabData()).toEqual([{ business_unit_id: 78, business_unit_name: 'Eastshire', ticket_count: 1 }]);
    expect(store.selectedBusinessUnitIds()).toEqual([]);
  });

  it('should display an empty state when there are no tickets', async () => {
    opalFines.getDraftAccounts.mockReturnValue(of(response()));
    const harness = await RouterTestingHarness.create(uploadsUrl);

    expect(harness.routeNativeElement?.querySelector('#fines-fpu-empty')?.textContent).toBe(
      'There are no tickets to register or publish.',
    );
    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('button')).toBeNull();
    expect(store.tabData()).toEqual([]);
  });

  it('should avoid showing an empty state after a failed request and fetch fresh data when revisiting To publish', async () => {
    opalFines.getDraftAccounts
      .mockReturnValueOnce(throwError(() => new Error('Unavailable')))
      .mockReturnValueOnce(of(response(draftAccount(1))));
    store.setBusinessUnits([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 }]);
    store.setSelectedBusinessUnitIds([80]);
    const harness = await RouterTestingHarness.create(uploadsUrl);

    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('#fines-fpu-empty')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('button')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('[role="status"]')).toBeNull();
    expect(store.businessUnits()).toEqual([]);
    expect(store.selectedBusinessUnitIds()).toEqual([80]);
    expect(store.tabData()).toBeNull();

    await clickTab(harness, 'Published');
    await clickTab(harness, 'To publish');

    expect(opalFines.getDraftAccounts).toHaveBeenCalledTimes(2);
    expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledTimes(2);
    expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Eastshire');
    expect(store.tabData()).toEqual([{ business_unit_id: 78, business_unit_name: 'Eastshire', ticket_count: 1 }]);
    expect(store.selectedBusinessUnitIds()).toEqual([]);
  });

  it('should send no draft account request when the user has no eligible business units', async () => {
    userState.business_unit_users.forEach((businessUnitUser) => {
      businessUnitUser.permissions = [];
    });
    TestBed.inject(GlobalStore).setUserState(userState);
    const harness = await RouterTestingHarness.create(uploadsUrl);

    expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
    expect(opalFines.clearDraftAccountsCache).not.toHaveBeenCalled();
    expect(store.tabData()).toEqual([]);
    expect(harness.routeNativeElement?.querySelector('#fines-fpu-empty')?.textContent).toBe(
      'There are no tickets to register or publish.',
    );
  });

  it('should discard an obsolete response after navigating to another tab', async () => {
    const pendingResponse = new Subject<IOpalFinesDraftAccountsResponse>();
    opalFines.getDraftAccounts.mockReturnValue(pendingResponse);
    const harness = await RouterTestingHarness.create(uploadsUrl);

    await clickTab(harness, 'Upload errors');
    pendingResponse.next(response(draftAccount(1)));
    pendingResponse.complete();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${uploadsUrl}#upload-errors`);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('Upload errors');
    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
    expect(store.businessUnits()).toEqual([]);
    expect(store.fragment()).toBe('upload-errors');
    expect(store.tabData()).toBeNull();
    expect(opalFines.getDraftAccounts).toHaveBeenCalledOnce();
  });

  it('should restore the default tab and fetch its data when the URL fragment is cleared', async () => {
    opalFines.getDraftAccounts
      .mockReturnValueOnce(of(response(draftAccount(1))))
      .mockReturnValueOnce(of(response(draftAccount(2, 80, 'Westshire'))));
    const harness = await RouterTestingHarness.create(uploadsUrl);
    await clickTab(harness, 'Published');

    await harness.navigateByUrl(uploadsUrl);

    expect(TestBed.inject(Router).url).toBe(uploadsUrl);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
    expect(harness.routeNativeElement?.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('To publish');
    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toEqual([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 }]);
    expect(opalFines.getDraftAccounts).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['published', 'Published'],
    ['upload-errors', 'Upload errors'],
  ])('should restore #%s when revisiting it after the hashless URL', async (fragment, label) => {
    opalFines.getDraftAccounts
      .mockReturnValueOnce(of(response(draftAccount(1))))
      .mockReturnValueOnce(of(response(draftAccount(2, 80, 'Westshire'))));
    const harness = await RouterTestingHarness.create(uploadsUrl);
    const router = TestBed.inject(Router);
    await clickTab(harness, label);

    await harness.navigateByUrl(uploadsUrl);

    expect(router.url).toBe(uploadsUrl);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe('To register and publish');
    expect(harness.routeNativeElement?.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('To publish');
    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toEqual([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 }]);
    expect(harness.routeNativeElement?.querySelector('table')?.textContent).toContain('Westshire');
    expect(opalFines.getDraftAccounts).toHaveBeenCalledTimes(2);

    await harness.navigateByUrl(`${uploadsUrl}#${fragment}`);

    expect(router.url).toBe(`${uploadsUrl}#${fragment}`);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toBe(label);
    expect(harness.routeNativeElement?.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe(label);
    expect(store.fragment()).toBe(fragment);
    expect(store.tabData()).toBeNull();
    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
    expect(opalFines.getDraftAccounts).toHaveBeenCalledTimes(2);
    expect(opalFines.clearDraftAccountsCache).toHaveBeenCalledTimes(2);
  });

  it('should stop a pending request from updating the store after the tabs are destroyed', async () => {
    const pendingResponse = new Subject<IOpalFinesDraftAccountsResponse>();
    opalFines.getDraftAccounts.mockReturnValue(pendingResponse);
    const harness = await RouterTestingHarness.create(uploadsUrl);
    const storedTabData = store.tabData();

    harness.fixture.destroy();
    pendingResponse.next(response(draftAccount(1)));
    pendingResponse.complete();

    expect(store.tabData()).toEqual(storedTabData);
    expect(store.businessUnits()).toEqual([]);
    expect(store.fragment()).toBe('to-publish');
  });
});

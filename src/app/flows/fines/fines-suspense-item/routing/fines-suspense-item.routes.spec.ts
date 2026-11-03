import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { By } from '@angular/platform-browser';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { FinesSuspenseItemComponent } from '../fines-suspense-item.component';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesSuspenseItemSearchComponent } from '../fines-suspense-item-search/fines-suspense-item-search.component';
import { routing } from './fines-suspense-item.routes';

@Component({ template: '<h1>Finance</h1>' })
class TestFinanceComponent {}

describe('Suspense item navigation', () => {
  const getBusinessUnitsByPermission = vi.fn();
  const getLoggedInUserState = vi.fn();
  const clearCache = vi.fn();
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    clearCache.mockReset();
    const user = structuredClone(OPAL_USER_STATE_MOCK);
    user.business_unit_users[0].permissions = [
      { permission_id: FINES_PERMISSIONS['view-suspense-items'], permission_name: 'View suspense items' },
    ];
    getLoggedInUserState.mockReset().mockReturnValue(of(user));
    getBusinessUnitsByPermission.mockReset().mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalUserService, useValue: { getLoggedInUserState } },
        { provide: OpalFines, useValue: { getBusinessUnitsByPermission, clearCache } },
        provideRouter([
          { path: 'fines/suspense-item', component: FinesSuspenseItemComponent, children: routing },
          { path: 'fines/dashboard/finance', component: TestFinanceComponent },
          { path: 'access-denied', component: TestFinanceComponent },
        ]),
      ],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it.each([24, 25])('allows search with only permission %s', async (permissionId) => {
    const user = structuredClone(OPAL_USER_STATE_MOCK);
    user.business_unit_users = [user.business_unit_users[0]];
    user.business_unit_users[0].permissions = [{ permission_id: permissionId, permission_name: 'Suspense permission' }];
    getLoggedInUserState.mockReturnValue(of(user));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');
    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
  });

  it('denies direct access without suspense permission before requesting business units', async () => {
    const user = structuredClone(OPAL_USER_STATE_MOCK);
    user.business_unit_users.forEach((unit) => {
      unit.permissions = [];
    });
    getLoggedInUserState.mockReturnValue(of(user));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');
    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('redirects the suspense root to the search screen', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item');

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Search for suspense item');
  });

  it('opens the search URL with a page title, reference input and Continue and Cancel actions', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item/search');

    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Search for suspense item');
    expect(harness.routeNativeElement?.querySelector('#fsis_suspense_reference_number')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('Continue');
    expect(harness.routeNativeElement?.querySelector('opal-lib-govuk-cancel-link a')?.textContent?.trim()).toBe(
      'Cancel',
    );
  });

  it('passes resolved business units to the search component', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');
    const component: FinesSuspenseItemSearchComponent = harness.routeDebugElement!.query(
      By.directive(FinesSuspenseItemSearchComponent),
    ).componentInstance;

    expect(getBusinessUnitsByPermission).toHaveBeenCalledWith('VIEW_SUSPENSE_ITEMS');
    expect(getBusinessUnitsByPermission).toHaveBeenCalledWith('MANAGE_SUSPENSE_ITEMS');
    expect(component.businessUnitAutoCompleteItems).toEqual(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData.map((unit) => ({
        value: unit.business_unit_id,
        name: unit.business_unit_name,
      })),
    );
    expect(harness.routeNativeElement?.querySelector('opal-lib-alphagov-accessible-autocomplete')).not.toBeNull();
  });

  it('displays and selects the single resolved business unit', async () => {
    const unit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    getBusinessUnitsByPermission.mockReturnValue(of({ count: 1, refData: [unit] }));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');
    const component: FinesSuspenseItemSearchComponent = harness.routeDebugElement!.query(
      By.directive(FinesSuspenseItemSearchComponent),
    ).componentInstance;

    expect(component.initialBusinessUnitId).toBe(unit.business_unit_id);
    expect(harness.routeNativeElement?.querySelector('.govuk-summary-list__value')?.textContent).toContain(
      unit.business_unit_name,
    );
    expect(harness.routeNativeElement?.querySelector('opal-lib-alphagov-accessible-autocomplete')).toBeNull();
  });

  it('does not activate the search page when business unit loading fails', async () => {
    const error = new Error('Business unit request failed');
    getBusinessUnitsByPermission.mockReturnValue(throwError(() => error));
    const harness = await RouterTestingHarness.create('/fines/dashboard/finance');

    await expect(harness.navigateByUrl('/fines/suspense-item/search')).rejects.toThrow(error);
    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Finance');
  });

  it('returns to Finance when Cancel is selected', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');

    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnitId(22);
    const cancelLink = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a');
    expect(cancelLink).not.toBeNull();
    cancelLink!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Finance');
    expect(clearCache).toHaveBeenCalledWith('suspenseItemSummaryCache$');
    expect(clearCache).toHaveBeenCalledWith('suspenseItemHistoryCache$');
    expect(TestBed.inject(FinesSuspenseItemStore).selectedBusinessUnitId()).toBeNull();
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it.each([false, true])('confirms Cancel after entering a reference (leave: %s)', async (leave) => {
    vi.mocked(window.confirm).mockReturnValue(leave);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');
    const reference = harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsis_suspense_reference_number')!;
    reference.value = '001234';
    reference.dispatchEvent(new Event('input'));
    harness.detectChanges();

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(window.confirm).toHaveBeenCalledOnce();
    if (leave) {
      expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
      expect(clearCache).toHaveBeenCalledWith('suspenseItemSummaryCache$');
      expect(clearCache).toHaveBeenCalledWith('suspenseItemHistoryCache$');
    } else {
      expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
      expect(reference.value).toBe('001234');
      expect(clearCache).not.toHaveBeenCalled();
    }
  });

  it('confirms Cancel when only the business unit has been selected', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');
    const autocomplete: AlphagovAccessibleAutocompleteComponent = harness.routeDebugElement!.query(
      By.directive(AlphagovAccessibleAutocompleteComponent),
    ).componentInstance;
    autocomplete.getControl.markAsDirty();
    autocomplete.getControl.setValue(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id);

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
    await harness.fixture.whenStable();

    expect(window.confirm).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
  });

  it('does not confirm Cancel for an automatically selected sole business unit', async () => {
    const unit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    getBusinessUnitsByPermission.mockReturnValue(of({ count: 1, refData: [unit] }));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
    await harness.fixture.whenStable();

    expect(window.confirm).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
  });
});

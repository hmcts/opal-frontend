import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-suspense-item-summary.mock';
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
import { FinesSuspenseItemResultsComponent } from '../fines-suspense-item-results/fines-suspense-item-results.component';
import { routing } from './fines-suspense-item.routes';

@Component({ template: '<h1>Finance</h1>' })
class TestFinanceComponent {}

describe('Suspense item navigation', () => {
  const getBusinessUnitsByPermission = vi.fn();
  const getLoggedInUserState = vi.fn();
  const clearCache = vi.fn();
  const getSuspenseItemSummary = vi.fn();
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    clearCache.mockReset();
    getSuspenseItemSummary
      .mockReset()
      .mockImplementation(() => throwError(() => new HttpErrorResponse({ status: 404 })));
    const user = structuredClone(OPAL_USER_STATE_MOCK);
    user.business_unit_users[0].permissions = [
      { permission_id: FINES_PERMISSIONS['view-suspense-items'], permission_name: 'View suspense items' },
    ];
    getLoggedInUserState.mockReset().mockReturnValue(of(user));
    getBusinessUnitsByPermission.mockReset().mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalUserService, useValue: { getLoggedInUserState } },
        { provide: OpalFines, useValue: { getBusinessUnitsByPermission, clearCache, getSuspenseItemSummary } },
        provideRouter([
          {
            path: 'fines/suspense-item',
            component: FinesSuspenseItemComponent,
            children: routing.map((route) => ({ ...route, providers: undefined })),
          },
          { path: 'fines/dashboard/finance', component: TestFinanceComponent },
          { path: 'access-denied', component: TestFinanceComponent },
        ]),
      ],
    });
    const unit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnit(unit.business_unit_id, unit.business_unit_name);
  });

  afterEach(() => vi.restoreAllMocks());

  function submitReference(harness: RouterTestingHarness, fieldId: string, value: string): void {
    const input = harness.routeNativeElement!.querySelector<HTMLInputElement>(`#${fieldId}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    harness.detectChanges();
    harness
      .routeNativeElement!.querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  function setUserPermissions(permissionIds: number[]): void {
    const user = structuredClone(OPAL_USER_STATE_MOCK);
    user.business_unit_users.forEach((unit) => {
      unit.permissions = permissionIds.map((permissionId) => ({
        permission_id: permissionId,
        permission_name: 'Test permission',
      }));
    });
    getLoggedInUserState.mockReturnValue(of(user));
  }

  it('redirects a direct results URL without BU context to search before requesting a summary', async () => {
    TestBed.inject(FinesSuspenseItemStore).resetStore();
    const harness = await RouterTestingHarness.create('/fines/suspense-item/001234/results');
    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Search for suspense item');
    expect(getSuspenseItemSummary).not.toHaveBeenCalled();
  });

  it('waits for the lookup, then shows the found placeholder on 200 and not-found after a subsequent 404', async () => {
    const pending = new Subject<typeof OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK>();
    getSuspenseItemSummary.mockReturnValueOnce(pending);
    const harness = await RouterTestingHarness.create('/fines/suspense-item/search');
    submitReference(harness, 'fsis_suspense_reference_number', '001234');
    await vi.waitFor(() => expect(getSuspenseItemSummary).toHaveBeenCalledOnce());
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('app-fines-suspense-item-results-not-found')).toBeNull();
    pending.next(OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK);
    pending.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('View suspense item');
    expect(harness.routeNativeElement?.querySelector('app-fines-suspense-item-results-not-found')).toBeNull();

    submitReference(harness, 'fsir_suspense_reference_number', '005678');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Suspense item not found');
    expect(harness.routeNativeElement?.querySelector('app-fines-suspense-item-results-found')).toBeNull();

    getSuspenseItemSummary.mockReturnValueOnce(of(OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK));
    submitReference(harness, 'fsir_suspense_reference_number', '009999');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('View suspense item');
    expect(harness.routeNativeElement?.querySelector('app-fines-suspense-item-results-not-found')).toBeNull();
  });

  it('does not activate not-found results when the summary lookup fails unexpectedly', async () => {
    const harness = await RouterTestingHarness.create('/fines/suspense-item/search');
    getSuspenseItemSummary.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
    submitReference(harness, 'fsis_suspense_reference_number', '001234');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
    expect(harness.routeNativeElement?.querySelector('app-fines-suspense-item-results-not-found')).toBeNull();
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(true);

    submitReference(harness, 'fsis_suspense_reference_number', '005678');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Suspense item not found');
  });

  it('restores the leave warning after a failed search on results and allows another attempt', async () => {
    const harness = await RouterTestingHarness.create('/fines/suspense-item/001234/results');
    getSuspenseItemSummary.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
    submitReference(harness, 'fsir_suspense_reference_number', '005678');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/001234/results');
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(true);
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe(
      '005678',
    );

    submitReference(harness, 'fsir_suspense_reference_number', '005678');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/005678/results');
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
  });

  describe.each([
    { destination: 'Finance', url: '/fines/dashboard/finance', retainsBusinessUnit: false },
    { destination: 'Search', url: '/fines/suspense-item/search', retainsBusinessUnit: true },
  ])('leaving results for $destination', ({ url, retainsBusinessUnit }) => {
    it.each([false, true])('confirms navigation after editing the reference (leave: %s)', async (leave) => {
      vi.mocked(window.confirm).mockReturnValue(leave);
      const resultsUrl = '/fines/suspense-item/001234/results';
      const harness = await RouterTestingHarness.create(resultsUrl);
      const store = TestBed.inject(FinesSuspenseItemStore);
      const businessUnitId = store.selectedBusinessUnitId();
      const businessUnitName = store.selectedBusinessUnitName();
      const input = harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!;
      input.value = '005678';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      harness.detectChanges();

      await TestBed.inject(Router).navigateByUrl(url);
      harness.detectChanges();

      expect(window.confirm).toHaveBeenCalledOnce();
      expect(TestBed.inject(Router).url).toBe(leave ? url : resultsUrl);
      expect(store.selectedBusinessUnitId()).toBe(leave && !retainsBusinessUnit ? null : businessUnitId);
      expect(store.selectedBusinessUnitName()).toBe(leave && !retainsBusinessUnit ? null : businessUnitName);
      expect(getSuspenseItemSummary).toHaveBeenCalledOnce();
      if (!leave) {
        expect(input.value).toBe('005678');
        expect(store.unsavedChanges()).toBe(true);
      }
    });

    it('allows navigation without confirmation when the reference has not been edited', async () => {
      await RouterTestingHarness.create('/fines/suspense-item/001234/results');

      await TestBed.inject(Router).navigateByUrl(url);

      expect(window.confirm).not.toHaveBeenCalled();
      expect(TestBed.inject(Router).url).toBe(url);
    });
  });

  it('opens not-found results after the summary API returns 404', async () => {
    const store = TestBed.inject(FinesSuspenseItemStore);
    const unit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    store.setSelectedBusinessUnit(unit.business_unit_id, unit.business_unit_name);
    const harness = await RouterTestingHarness.create('/fines/suspense-item/search');

    submitReference(harness, 'fsis_suspense_reference_number', '001234');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/001234/results');
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Suspense item not found');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe(
      '001234',
    );
    expect(harness.routeNativeElement!.querySelector('.govuk-caption-l')?.textContent).toBe(unit.business_unit_name);
    expect(store.selectedBusinessUnitId()).toBe(unit.business_unit_id);
    expect(store.unsavedChanges()).toBe(false);
    expect(getSuspenseItemSummary).toHaveBeenCalled();
    expect(clearCache).toHaveBeenCalledWith('suspenseItemSummaryCache$');
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('searches another reference on the reused results page while retaining the BU', async () => {
    const store = TestBed.inject(FinesSuspenseItemStore);
    const unit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    store.setSelectedBusinessUnit(unit.business_unit_id, unit.business_unit_name);
    const harness = await RouterTestingHarness.create('/fines/suspense-item/001234/results');
    const results = harness.routeDebugElement!.query(By.directive(FinesSuspenseItemResultsComponent)).componentInstance;

    submitReference(harness, 'fsir_suspense_reference_number', '005678');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/005678/results');
    expect(harness.routeDebugElement!.query(By.directive(FinesSuspenseItemResultsComponent)).componentInstance).toBe(
      results,
    );
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe(
      '005678',
    );
    expect(harness.routeNativeElement!.querySelector('.govuk-caption-l')?.textContent).toBe(unit.business_unit_name);
    expect(store.selectedBusinessUnitId()).toBe(unit.business_unit_id);
    expect(store.unsavedChanges()).toBe(false);
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Suspense item not found');
    expect(getSuspenseItemSummary).toHaveBeenCalled();
  });

  it('requests the same reference again without an unsaved-change warning', async () => {
    const harness = await RouterTestingHarness.create('/fines/suspense-item/001234/results');
    submitReference(harness, 'fsir_suspense_reference_number', '001234');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/001234/results');
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Suspense item not found');
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
    expect(getSuspenseItemSummary).toHaveBeenCalledTimes(2);

    const input = harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!;
    input.value = '5678';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(true);
  });

  it('keeps invalid retry input on the current results page with validation feedback', async () => {
    const harness = await RouterTestingHarness.create('/fines/suspense-item/001234/results');
    submitReference(harness, 'fsir_suspense_reference_number', 'abc');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/001234/results');
    expect(harness.routeNativeElement!.querySelector('.govuk-error-summary')?.textContent).toContain(
      'Enter suspense reference number in the correct format',
    );
    expect(getSuspenseItemSummary).toHaveBeenCalledOnce();
  });

  describe.each([
    { page: 'search', url: '/fines/suspense-item/search' },
    { page: 'results with retained business-unit context', url: '/fines/suspense-item/001234/results' },
  ])('permissions for $page', ({ url }) => {
    it.each([FINES_PERMISSIONS['view-suspense-items'], FINES_PERMISSIONS['manage-suspense-items']])(
      'allows access with only permission %s',
      async (permissionId) => {
        setUserPermissions([permissionId]);
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl(url);
        expect(TestBed.inject(Router).url).toBe(url);
      },
    );

    it.each([{ permissionIds: [] }, { permissionIds: [24] }])(
      'denies access with permissions %j before requesting business units or a summary',
      async ({ permissionIds }) => {
        setUserPermissions(permissionIds);
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl(url);
        expect(TestBed.inject(Router).url).toBe('/access-denied');
        expect(getBusinessUnitsByPermission).not.toHaveBeenCalled();
        expect(getSuspenseItemSummary).not.toHaveBeenCalled();
      },
    );
  });

  it('rechecks permissions before requesting a summary when the same reference is searched again', async () => {
    const harness = await RouterTestingHarness.create('/fines/suspense-item/001234/results');
    expect(getSuspenseItemSummary).toHaveBeenCalledOnce();
    setUserPermissions([]);

    submitReference(harness, 'fsir_suspense_reference_number', '001234');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(getSuspenseItemSummary).toHaveBeenCalledOnce();
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

  it('opens the parameterised results URL with its page title and not-found screen', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item/1234/results');

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/1234/results');
    expect(TestBed.inject(Router).routerState.snapshot.root.firstChild?.firstChild?.params['suspenseItemId']).toBe(
      '1234',
    );
    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Suspense item results');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Suspense item not found');
    expect(harness.routeNativeElement?.querySelector('opal-lib-govuk-back-link a')?.textContent?.trim()).toBe('Back');
    expect(getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('returns from results to a fresh search with the selected business unit retained', async () => {
    const store = TestBed.inject(FinesSuspenseItemStore);
    const unit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    store.setSelectedBusinessUnit(unit.business_unit_id, unit.business_unit_name);
    const harness = await RouterTestingHarness.create('/fines/suspense-item/1234/results');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe(
      '1234',
    );
    expect(harness.routeNativeElement!.querySelector('.govuk-caption-l')!.textContent).toBe(unit.business_unit_name);

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-back-link a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Search for suspense item');
    expect(store.selectedBusinessUnitId()).toBe(unit.business_unit_id);
    expect(store.selectedBusinessUnitName()).toBe(unit.business_unit_name);
    const search: FinesSuspenseItemSearchComponent = harness.routeDebugElement!.query(
      By.directive(FinesSuspenseItemSearchComponent),
    ).componentInstance;
    expect(search.initialBusinessUnitId).toBe(unit.business_unit_id);
    const reference = harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsis_suspense_reference_number')!;
    expect(reference.value).toBe('');
    expect(clearCache).toHaveBeenCalledWith('suspenseItemSummaryCache$');
  });

  it('uses the new BU ID and matching name after returning from results and changing the selection', async () => {
    const units = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    const store = TestBed.inject(FinesSuspenseItemStore);
    store.setSelectedBusinessUnit(units[0].business_unit_id, units[0].business_unit_name);
    const harness = await RouterTestingHarness.create('/fines/suspense-item/1234/results');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-back-link a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    const autocomplete: AlphagovAccessibleAutocompleteComponent = harness.routeDebugElement!.query(
      By.directive(AlphagovAccessibleAutocompleteComponent),
    ).componentInstance;
    autocomplete.getControl.setValue(units[1].business_unit_id);
    expect(store.selectedBusinessUnitId()).toBe(units[1].business_unit_id);
    expect(store.selectedBusinessUnitName()).toBe(units[1].business_unit_name);
    submitReference(harness, 'fsis_suspense_reference_number', '5678');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/5678/results');
    expect(harness.routeNativeElement!.querySelector('.govuk-caption-l')!.textContent).toBe(
      units[1].business_unit_name,
    );
    expect(harness.routeNativeElement!.querySelector('.govuk-body-s strong')!.textContent).toBe(
      units[1].business_unit_name,
    );
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe(
      '5678',
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
    TestBed.inject(FinesSuspenseItemStore).resetStore();
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

    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnit(22, 'Test business unit');
    const cancelLink = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a');
    expect(cancelLink).not.toBeNull();
    cancelLink!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Finance');
    expect(clearCache).toHaveBeenCalledWith('suspenseItemSummaryCache$');
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
    TestBed.inject(FinesSuspenseItemStore).resetStore();
    getBusinessUnitsByPermission.mockReturnValue(of({ count: 1, refData: [unit] }));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search');

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
    await harness.fixture.whenStable();

    expect(window.confirm).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
  });
});

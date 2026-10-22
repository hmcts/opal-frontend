import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesSuspenseItemSearchComponent } from '../fines-suspense-item-search/fines-suspense-item-search.component';
import { routing } from './fines-suspense-item.routes';

@Component({ template: '<h1>Finance</h1>' })
class TestFinanceComponent {}

describe('Suspense item navigation', () => {
  const getBusinessUnits = vi.fn();
  beforeEach(() => {
    getBusinessUnits.mockReset().mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: { getBusinessUnits } },
        provideRouter([
          { path: 'fines/suspense-item', children: routing },
          { path: 'fines/dashboard/finance', component: TestFinanceComponent },
        ]),
      ],
    });
  });

  it('redirects the suspense root to the search screen', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item', FinesSuspenseItemSearchComponent);

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Search for suspense item');
  });

  it('opens the search URL with a page title, reference input and Continue and Cancel actions', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item/search', FinesSuspenseItemSearchComponent);

    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Search for suspense item');
    expect(harness.routeNativeElement?.querySelector('#fsis_suspense_reference_number')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('Continue');
    expect(harness.routeNativeElement?.querySelector('opal-lib-govuk-cancel-link a')?.textContent?.trim()).toBe(
      'Cancel',
    );
  });

  it('passes resolved business units to the search component', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/fines/suspense-item/search', FinesSuspenseItemSearchComponent);

    expect(getBusinessUnits).toHaveBeenCalledOnce();
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
    getBusinessUnits.mockReturnValue(of({ count: 1, refData: [unit] }));
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/fines/suspense-item/search', FinesSuspenseItemSearchComponent);

    expect(component.initialBusinessUnitId).toBe(unit.business_unit_id);
    expect(harness.routeNativeElement?.querySelector('.govuk-summary-list__value')?.textContent).toContain(
      unit.business_unit_name,
    );
    expect(harness.routeNativeElement?.querySelector('opal-lib-alphagov-accessible-autocomplete')).toBeNull();
  });

  it('does not activate the search page when business unit loading fails', async () => {
    const error = new Error('Business unit request failed');
    getBusinessUnits.mockReturnValue(throwError(() => error));
    const harness = await RouterTestingHarness.create('/fines/dashboard/finance');

    await expect(harness.navigateByUrl('/fines/suspense-item/search')).rejects.toThrow(error);
    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Finance');
  });

  it('returns to Finance when Cancel is selected', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search', FinesSuspenseItemSearchComponent);

    const cancelLink = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a');
    expect(cancelLink).not.toBeNull();
    cancelLink!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Finance');
  });
});

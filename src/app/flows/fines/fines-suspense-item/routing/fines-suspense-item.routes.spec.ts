import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSuspenseItemSearchComponent } from '../fines-suspense-item-search/fines-suspense-item-search.component';
import { routing } from './fines-suspense-item.routes';

@Component({ template: '<h1>Finance</h1>' })
class TestFinanceComponent {}

describe('Suspense item navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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

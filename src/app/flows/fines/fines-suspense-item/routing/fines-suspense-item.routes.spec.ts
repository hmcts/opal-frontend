import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSuspenseItemSearchComponent } from '../fines-suspense-item-search/fines-suspense-item-search.component';
import { routing } from './fines-suspense-item.routes';

describe('Suspense item navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'fines/suspense-item', children: routing }])],
    });
  });

  it('redirects the suspense root to the search screen', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item', FinesSuspenseItemSearchComponent);

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Search for suspense item');
  });

  it('opens the search URL with a page title, unavailable message and link back to Finance', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item/search', FinesSuspenseItemSearchComponent);

    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Search for suspense item');
    expect(harness.routeNativeElement?.querySelector('p')?.textContent).toBe('This page is not available yet.');
    const backLink = harness.routeNativeElement?.querySelector('a');
    expect(backLink?.textContent).toBe('Back to finance');
    expect(backLink?.getAttribute('href')).toBe('/fines/dashboard/finance');
  });
});

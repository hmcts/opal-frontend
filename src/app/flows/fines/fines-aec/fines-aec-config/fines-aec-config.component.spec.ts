import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';
import { run } from 'axe-core';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAecStore } from '../stores/fines-aec.store';
import { FinesAecConfigComponent } from './fines-aec-config.component';

@Component({ selector: 'app-aec-test-administration', template: '<h1>Administration</h1>' })
class AdministrationTestPageComponent {}

describe('FinesAecConfigComponent', () => {
  let harness: RouterTestingHarness;
  let store: InstanceType<typeof FinesAecStore>;
  let getEnforcementAccountTypes: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getEnforcementAccountTypes = vi.fn().mockReturnValue(of(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK));
    await TestBed.configureTestingModule({
      imports: [FinesAecConfigComponent],
      providers: [
        provideRouter([
          { path: 'config', component: FinesAecConfigComponent },
          {
            path: 'fines/dashboard/administration',
            component: AdministrationTestPageComponent,
          },
        ]),
        FinesAecStore,
        { provide: OpalFines, useValue: { getEnforcementAccountTypes, clearCache: vi.fn() } },
      ],
    }).compileComponents();
    store = TestBed.inject(FinesAecStore);
  });

  async function render(url = '/config'): Promise<FinesAecConfigComponent> {
    harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(url, FinesAecConfigComponent);
    harness.detectChanges();
    return component;
  }

  it('opens Account types by default and renders all four tabs in the design order', async () => {
    store.setActiveTab('enforcer-allocation');

    await render();

    const page = harness.routeNativeElement!;
    const tabs = [...page.querySelectorAll('.moj-sub-navigation__link')];
    expect(page.querySelector('h1')?.textContent).toBe('Auto-enforcement configuration');
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual([
      'Account types',
      'Enforcement paths',
      'Run parameters',
      'Enforcer allocation',
    ]);
    expect(tabs[0].getAttribute('aria-current')).toBe('page');
    expect(store.activeTab()).toBe('account-types');
    expect(page.querySelector('#aec-account-types-heading')?.textContent).toBe('Account types');
    expect(page.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(getEnforcementAccountTypes).toHaveBeenCalledOnce();
  });

  it.each([
    ['enforcement-paths', 'Enforcement paths'],
    ['run-parameters', 'Run parameters'],
    ['enforcer-allocation', 'Enforcer allocation'],
  ])('opens the %s placeholder without requesting account types', async (fragment, heading) => {
    await render(`/config#${fragment}`);

    expect(store.activeTab()).toBe(fragment);
    expect(harness.routeNativeElement!.querySelector('#aec-tab-placeholder-heading')?.textContent).toBe(heading);
    expect(harness.routeNativeElement!.querySelector('table')).toBeNull();
    expect(getEnforcementAccountTypes).not.toHaveBeenCalled();
  });

  it('falls back to Account types for an unknown URL fragment', async () => {
    await render('/config#unknown-tab');

    expect(store.activeTab()).toBe('account-types');
    expect(harness.routeNativeElement!.querySelector('#aec-account-types-heading')).not.toBeNull();
    expect(getEnforcementAccountTypes).toHaveBeenCalledOnce();
  });

  it('updates the selected tab and fetches account types when the URL fragment changes', async () => {
    const component = await render('/config#enforcement-paths');

    const sameComponent = await harness.navigateByUrl('/config#account-types', FinesAecConfigComponent);
    harness.detectChanges();

    expect(sameComponent).toBe(component);
    expect(store.activeTab()).toBe('account-types');
    expect(harness.routeNativeElement!.querySelector('#aec-account-types-heading')).not.toBeNull();
    expect(getEnforcementAccountTypes).toHaveBeenCalledOnce();

    await harness.navigateByUrl('/config#run-parameters', FinesAecConfigComponent);
    harness.detectChanges();

    expect(store.activeTab()).toBe('run-parameters');
    expect(harness.routeNativeElement!.querySelector('#aec-tab-placeholder-heading')?.textContent).toBe(
      'Run parameters',
    );
    expect(getEnforcementAccountTypes).toHaveBeenCalledOnce();
  });

  it('shows and dismisses a success message returned from the amend journey', async () => {
    store.setSuccessMessage('Enforcement values updated');

    const component = await render();

    expect(store.successMessage()).toBeNull();
    expect(harness.routeNativeElement!.querySelector('#aec-account-types-success')?.textContent).toContain(
      'Enforcement values updated',
    );
    const banner = harness.routeNativeElement!.querySelector('#aec-account-types-success')!;
    const heading = harness.routeNativeElement!.querySelector('h1')!;
    expect(banner.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const dismissButton = harness.routeNativeElement!.querySelector<HTMLButtonElement>('.moj-alert__dismiss');
    dismissButton!.click();
    harness.detectChanges();

    expect(component.successMessage()).toBeNull();
    expect(harness.routeNativeElement!.querySelector('#aec-account-types-success')).toBeNull();
  });

  it('shows an empty state when the API returns no configured account types', async () => {
    getEnforcementAccountTypes.mockReturnValue(of({ enforcement_account_types: [] }));

    await render();

    expect(harness.routeNativeElement!.querySelector('#aec-account-types-empty')?.textContent).toBe(
      'There are no account types to display.',
    );
    expect(harness.routeNativeElement!.querySelector('table')).toBeNull();
  });

  it('keeps the page navigation available when account types cannot be loaded', async () => {
    getEnforcementAccountTypes.mockReturnValue(throwError(() => new Error('Account types unavailable')));

    await render();

    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Auto-enforcement configuration');
    expect(harness.routeNativeElement!.querySelectorAll('.moj-sub-navigation__link')).toHaveLength(4);
    expect(harness.routeNativeElement!.querySelector('table')).toBeNull();
  });

  it('returns to the Administration dashboard when Back is selected', async () => {
    await render();

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/administration');
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Administration');
  });

  it('has no Axe Core WCAG A or AA violations in the account types screen', async () => {
    await render();

    const results = await run(harness.routeNativeElement!, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      // JSDOM does not calculate layout or colour contrast.
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(results.violations).toEqual([]);
  });
});

describe('FinesAecConfigComponent account types cache', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'config', component: FinesAecConfigComponent },
          { path: 'fines/dashboard/administration', component: AdministrationTestPageComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches and displays fresh thresholds when returning from another tab', async () => {
    const harness = await RouterTestingHarness.create('/config');
    httpMock.expectOne(OPAL_FINES_PATHS.enforcementAccountTypes).flush(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('#aec-minimum-COL')?.textContent?.trim()).toBe('£100.00');

    await harness.navigateByUrl('/config#enforcement-paths');
    httpMock.expectNone(OPAL_FINES_PATHS.enforcementAccountTypes);
    await harness.navigateByUrl('/config#account-types');
    const updatedResponse = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    updatedResponse.enforcement_account_types.find((record) => record.id === 2)!.minimum_balance = 150;
    httpMock.expectOne(OPAL_FINES_PATHS.enforcementAccountTypes).flush(updatedResponse);
    harness.detectChanges();

    expect(harness.routeNativeElement!.querySelector('#aec-minimum-COL')?.textContent?.trim()).toBe('£150.00');
  });

  it('retains the current response when selecting the already active Account types tab', async () => {
    const harness = await RouterTestingHarness.create('/config');
    httpMock.expectOne(OPAL_FINES_PATHS.enforcementAccountTypes).flush(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    harness.detectChanges();

    await harness.navigateByUrl('/config#account-types');

    httpMock.expectNone(OPAL_FINES_PATHS.enforcementAccountTypes);
    expect(harness.routeNativeElement!.querySelector('#aec-minimum-COL')?.textContent?.trim()).toBe('£100.00');
  });

  it('cancels a pending request when switching tabs and starts a fresh request on return', async () => {
    const harness = await RouterTestingHarness.create('/config');
    const pendingRequest = httpMock.expectOne(OPAL_FINES_PATHS.enforcementAccountTypes);

    await harness.navigateByUrl('/config#enforcement-paths');
    harness.detectChanges();

    expect(pendingRequest.cancelled).toBe(true);

    await harness.navigateByUrl('/config#account-types');
    httpMock.expectOne(OPAL_FINES_PATHS.enforcementAccountTypes).flush(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    harness.detectChanges();

    expect(harness.routeNativeElement!.querySelector('#aec-minimum-COL')?.textContent?.trim()).toBe('£100.00');
  });

  it('cancels a pending request when Back leaves configuration for Administration', async () => {
    const harness = await RouterTestingHarness.create('/config');
    const pendingRequest = httpMock.expectOne(OPAL_FINES_PATHS.enforcementAccountTypes);

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/administration');
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Administration');
    expect(pendingRequest.cancelled).toBe(true);
  });
});

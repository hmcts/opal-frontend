import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { finesAccAprResolver } from '../routing/resolvers/fines-acc-apr/fines-acc-apr.resolver';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { transformAprsPayload } from '../services/utils/fines-acc-payload-transform-apr-data.utils';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprListComponent } from './fines-acc-apr-list.component';

const currentReference: IOpalFinesApr = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  business_unit_id: 77,
  relationship: 'APR',
  category: 'APR',
  apr_text: 'CURRENT-REFERENCE',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: null,
};
const listUrl = '/fines/account/defendant/141/alternate/payment/reference/list';

const renderList = async (references: IOpalFinesApr[], initialMessage: string | null = null) => {
  let successMessage = initialMessage;
  const accountStore = {
    getAccountNumber: () => '177A',
    party_name: () => 'APR TEST',
    account_id: () => 141,
    successMessage: () => successMessage,
    clearSuccessMessage: vi.fn(() => {
      successMessage = null;
    }),
  };
  await TestBed.configureTestingModule({
    providers: [
      { provide: FinesAccountStore, useValue: accountStore },
      { provide: FinesAccPayloadService, useValue: { transformAprsPayload } },
      provideRouter([
        {
          path: 'fines/account/defendant/:accountId/alternate/payment/reference/list',
          component: FinesAccAprListComponent,
          data: { aprs: { references, version: '"7"' } },
        },
      ]),
    ],
  }).compileComponents();
  const harness = await RouterTestingHarness.create();
  const component = await harness.navigateByUrl(listUrl, FinesAccAprListComponent);
  return { element: harness.routeNativeElement!, component, accountStore, harness };
};

const navigationDestination = (element: Element, selector: string): string => {
  const router = TestBed.inject(Router);
  const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  (element.querySelector(selector) as HTMLElement).click();
  const [commands, extras] = navigate.mock.calls.at(-1)!;
  const destination = router.serializeUrl(router.createUrlTree(commands, extras));
  navigate.mockRestore();
  return destination;
};

describe('FinesAccAprListComponent', () => {
  it('renders the account caption, both empty states and links to add or return to the same account Payment terms', async () => {
    const { element } = await renderList([]);

    expect(element.querySelector('h1')?.textContent).toContain('Manage Alternate Payment References');
    expect(element.textContent).toContain('177A - APR TEST');
    expect(element.querySelector('#apr-current-empty')?.textContent).toContain(
      'There are no alternative payment reference for this account',
    );
    expect(element.querySelector('#apr-consolidated-empty')?.textContent).toContain(
      'There are no alternative payment reference from consolidated accounts',
    );
    expect(navigationDestination(element, '#apr-add')).toBe(
      '/fines/account/defendant/141/alternate/payment/reference/add',
    );
    expect(navigationDestination(element, '#apr-back a')).toBe('/fines/account/defendant/141/details#payment-terms');
  });

  it('separates direct and inherited APRs, excludes account-number references and preserves response order', async () => {
    const { element } = await renderList([
      { ...currentReference, alternate_payment_reference_id: 15, relationship: 'AMALGAMATED', apr_text: 'Z-INHERITED' },
      { ...currentReference, alternate_payment_reference_id: 13, category: 'ACC', apr_text: 'HIDDEN-ACCOUNT' },
      {
        ...currentReference,
        alternate_payment_reference_id: 14,
        relationship: 'CONSOLIDATED',
        apr_text: 'A-INHERITED',
      },
      currentReference,
      {
        ...currentReference,
        alternate_payment_reference_id: 12,
        relationship: 'CONSOLIDATED',
        category: 'ACC',
        apr_text: 'HIDDEN-CONSOLIDATED',
      },
    ]);

    expect(
      Array.from(element.querySelectorAll('#apr-current-table tbody tr')).map((row) =>
        row.getAttribute('data-reference-id'),
      ),
    ).toEqual(['11']);
    expect(
      Array.from(element.querySelectorAll('#apr-consolidated-table tbody tr')).map((row) =>
        row.getAttribute('data-reference-id'),
      ),
    ).toEqual(['15', '14']);
    expect(element.textContent).not.toContain('HIDDEN-ACCOUNT');
    expect(element.textContent).not.toContain('HIDDEN-CONSOLIDATED');
    expect(element.querySelector('#apr-add')).toBeNull();
  });

  it('retains the selected reference ID and current account in each direct APR management link', async () => {
    const { element } = await renderList([currentReference]);

    expect(element.querySelector('#apr-change-11')?.getAttribute('href')).toBe(
      '/fines/account/defendant/141/alternate/payment/reference/edit?alternatePaymentReferenceId=11',
    );
    expect(element.querySelector('#apr-remove-11')?.getAttribute('href')).toBe(
      '/fines/account/defendant/141/alternate/payment/reference/delete?alternatePaymentReferenceId=11',
    );
    expect(element.querySelector('#apr-add')).toBeNull();
  });

  it('allows another reference to be added alongside removable inherited APRs', async () => {
    const { element } = await renderList([{ ...currentReference, relationship: 'CONSOLIDATED' }]);

    expect(element.querySelector('#apr-current-empty')).not.toBeNull();
    expect(element.querySelector('#apr-add')).not.toBeNull();
    expect(element.querySelector('#apr-change-11')).toBeNull();
    expect(element.querySelector('#apr-remove-11')).not.toBeNull();
  });

  it('displays empty APR sections when only inherited account-number references exist', async () => {
    const { element } = await renderList([{ ...currentReference, category: 'ACC', relationship: 'AMALGAMATED' }]);

    expect(element.querySelector('#apr-current-empty')).not.toBeNull();
    expect(element.querySelector('#apr-consolidated-empty')).not.toBeNull();
    expect(element.querySelector('table')).toBeNull();
    expect(element.querySelector('#apr-add')).not.toBeNull();
  });

  it('shows returned success feedback while consuming the stored message once', async () => {
    const { element, component, accountStore } = await renderList([], 'Reference saved');

    expect(element.querySelector('#apr-banners')?.textContent).toContain('Reference saved');
    expect(component.successMessage()).toBe('Reference saved');
    expect(accountStore.clearSuccessMessage).toHaveBeenCalledOnce();
    expect(accountStore.successMessage()).toBeNull();
  });

  it('clears displayed success feedback when its Dismiss button is selected', async () => {
    const { element, component, harness } = await renderList([], 'Reference saved');

    (element.querySelector('#apr-banners button') as HTMLButtonElement).click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(component.successMessage()).toBeNull();
    expect(element.querySelector('#apr-banners')?.textContent).not.toContain('Reference saved');
  });

  it('updates references, caption and account action links when Angular reuses the list for another account', async () => {
    const inheritedReference: IOpalFinesApr = {
      ...currentReference,
      alternate_payment_reference_id: 22,
      defendant_account_id: 142,
      relationship: 'CONSOLIDATED',
      apr_text: 'SECOND-REFERENCE',
    };
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference/list',
            component: FinesAccAprListComponent,
            runGuardsAndResolvers: 'always',
            resolve: { aprs: finesAccAprResolver },
          },
        ]),
        {
          provide: OpalFines,
          useValue: {
            getDefendantAccountHeadingData: (accountId: number) =>
              of({ ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK, defendant_account_id: String(accountId) }),
            getAprs: (accountId: number) =>
              of({ references: [accountId === 141 ? currentReference : inheritedReference], version: '"7"' }),
          },
        },
        {
          provide: FinesAccPayloadService,
          useValue: {
            transformAprsPayload,
            transformDefendantAccountHeaderForStore: (accountId: number) => ({
              ...MOCK_FINES_ACCOUNT_STATE,
              account_id: accountId,
              account_number: accountId === 141 ? '177A' : '178B',
              party_name: accountId === 141 ? 'FIRST TEST' : 'SECOND TEST',
            }),
          },
        },
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    const accountStore = TestBed.inject(FinesAccountStore);
    accountStore.setSuccessMessage('First account feedback');
    const firstComponent = await harness.navigateByUrl(listUrl, FinesAccAprListComponent);
    expect(harness.routeNativeElement?.textContent).toContain('177A - FIRST TEST');
    expect(harness.routeNativeElement?.textContent).toContain('First account feedback');
    expect(harness.routeNativeElement?.querySelector('#apr-current-table [data-reference-id="11"]')).not.toBeNull();

    const reusedComponent = await harness.navigateByUrl(listUrl.replace('/141/', '/142/'), FinesAccAprListComponent);
    const element = harness.routeNativeElement!;

    expect(reusedComponent).toBe(firstComponent);
    expect(element.textContent).toContain('178B - SECOND TEST');
    expect(element.textContent).not.toContain('CURRENT-REFERENCE');
    expect(element.textContent).not.toContain('First account feedback');
    expect(element.querySelector('#apr-current-empty')).not.toBeNull();
    expect(element.querySelector('#apr-consolidated-table [data-reference-id="22"]')).not.toBeNull();
    expect(navigationDestination(element, '#apr-back a')).toBe('/fines/account/defendant/142/details#payment-terms');
    expect(navigationDestination(element, '#apr-add')).toBe(
      '/fines/account/defendant/142/alternate/payment/reference/add',
    );
    expect(element.querySelector('#apr-remove-22')?.getAttribute('href')).toBe(
      '/fines/account/defendant/142/alternate/payment/reference/delete?alternatePaymentReferenceId=22',
    );
    expect(element.querySelector('#apr-change-22')).toBeNull();
  });
});

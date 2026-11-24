import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { firstValueFrom, filter, take } from 'rxjs';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NavigationEnd,
  NavigationCancel,
  NavigationSkipped,
  provideRouter,
  Router,
  Routes,
  withRouterConfig,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../stores/fines-mci.store';
import { IFinesMciCriminalPayment } from '../stores/interfaces/fines-mci.interface';
import { FinesMciPaymentCategoryCriminalPaymentDetailsComponent } from '../fines-mci-payment-category-criminal-payment-details/fines-mci-payment-category-criminal-payment-details.component';
import { finesMciFlowStateGuard } from './guards/fines-mci-flow-state.guard';
import { finesMciCriminalCheckPaymentGuard } from './guards/fines-mci-criminal-check-payment.guard';
import { finesMciCriminalPaymentAccountGuard } from './guards/fines-mci-criminal-payment-account.guard';
import { finesMciCriminalAccountStateGuard } from './guards/fines-mci-criminal-account-state.guard';
import { routing } from './fines-mci.routes';

@Component({ template: '' })
class NavigationDestinationComponent {}

const TILL_ROOT = '/fines/manual-cash-input/create/till';
const CRIMINAL_PATH = 'payment/category/criminal';
const PAYMENT_URL = `${TILL_ROOT}/${CRIMINAL_PATH}/payment-details/1`;
const PAYMENT: IFinesMciCriminalPayment = {
  amount: '25.00',
  payerType: 'defendant',
  thirdPartyName: '',
  methodOfPayment: 'notesCoins',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: '',
  source: null,
};
const tillRoute = routing.find((route) => route.path === 'create')!.children!.find((route) => route.path === 'till')!;
const criminalRoute = tillRoute
  .children!.find((route) => route.path === 'payment')!
  .children!.find((route) => route.path === 'category')!
  .children!.find((route) => route.path === 'criminal')!;
const paymentRoute = criminalRoute.children!.find((route) => route.path === 'payment-details/:accountId')!;
const checkRoute = tillRoute.children!.find((route) => route.path === 'check-payment')!;

async function openPaymentDetails(saved: IFinesMciCriminalPayment | null = null, company = false) {
  const routes: Routes = [
    {
      path: TILL_ROOT.slice(1),
      children: [
        {
          path: CRIMINAL_PATH,
          children: [
            {
              ...paymentRoute,
              canActivate: [finesMciFlowStateGuard, finesMciCriminalPaymentAccountGuard],
              resolve: {},
            },
            {
              path: 'account/:accountId/:type',
              component: NavigationDestinationComponent,
              canMatch: [finesMciCriminalAccountStateGuard],
            },
          ],
        },
        { ...checkRoute, canActivate: [finesMciFlowStateGuard, finesMciCriminalCheckPaymentGuard], resolve: {} },
        { path: 'details', component: NavigationDestinationComponent },
      ],
    },
  ];
  TestBed.configureTestingModule({
    providers: [
      provideLocationMocks(),
      provideRouter(routes, withRouterConfig({ canceledNavigationResolution: 'computed' })),
    ],
  });
  const store = TestBed.inject(FinesMciStore);
  store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
  store.ensureTill();
  store.setDraftJourney('criminal');
  store.setSelectedCriminalAccount({
    ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
    organisation_flag: company,
  });
  store.setSelectedCriminalAccountAtAGlance({ ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, account_balance: 100 });
  store.setCriminalPayment(saved);
  const harness = await RouterTestingHarness.create();
  TestBed.inject(Router).setUpLocationChangeListener();
  await harness.navigateByUrl(`${TILL_ROOT}/${CRIMINAL_PATH}/account/1/${company ? 'company' : 'individual'}`);
  const component = await harness.navigateByUrl(PAYMENT_URL, FinesMciPaymentCategoryCriminalPaymentDetailsComponent);
  return { harness, component, store, router: TestBed.inject(Router) };
}

function enterAmount(harness: RouterTestingHarness, value: string): void {
  const input = harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  harness.detectChanges();
}

describe('Criminal payment details navigation', () => {
  afterEach(() => vi.restoreAllMocks());

  it('protects Check Payment with authentication, permission, business-unit and payment-state guards', () => {
    expect(checkRoute.canActivate).toEqual([
      authGuard,
      routePermissionsGuard,
      finesMciFlowStateGuard,
      finesMciCriminalCheckPaymentGuard,
    ]);
    expect(checkRoute.data?.['routePermissionId']).toEqual([FINES_PERMISSIONS['process-and-allocate-payments']]);
  });

  it('redirects direct navigation without a payment draft to Payment Details', async () => {
    const { harness, router, store } = await openPaymentDetails();
    await harness.navigateByUrl(`${TILL_ROOT}/check-payment`);
    expect(router.url).toBe(PAYMENT_URL);
    expect(store.criminalPayment()).toBeNull();
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!.value).toBe('');
  });

  it.each(['notesCoins', 'postalOrder', 'cheque', 'creditTransfer'] as const)(
    'continues to Check Payment with the saved %s draft and no leave warning',
    async (methodOfPayment) => {
      const payment = { ...PAYMENT, methodOfPayment, source: methodOfPayment === 'creditTransfer' ? 'allpay' : null };
      const { harness, store, router } = await openPaymentDetails(payment);
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      harness.routeNativeElement!.querySelector<HTMLButtonElement>('#submitForm')!.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(router.url).toBe(`${TILL_ROOT}/check-payment`);
      expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe('Check payment');
      expect(store.criminalPayment()).toEqual(payment);
      expect(confirm).not.toHaveBeenCalled();
    },
  );

  for (const action of ['Back', 'Cancel'] as const) {
    for (const entered of ['saved draft', 'amount only', 'radio only'] as const) {
      it.each([true, false])(`${action} with ${entered} and leave confirmation %s`, async (accepted) => {
        const { harness, component, store, router } = await openPaymentDetails(
          entered === 'saved draft' ? PAYMENT : null,
        );
        const tills = store.tills();
        if (entered === 'amount only') enterAmount(harness, '12.34');
        if (entered === 'radio only') {
          harness
            .routeNativeElement!.querySelector<HTMLInputElement>('input[name="payerType"][value="thirdParty"]')!
            .click();
          harness.detectChanges();
        }
        const confirm = vi.spyOn(window, 'confirm').mockReturnValue(accepted);
        if (action === 'Back') component.handleBack();
        else component.handleCancel();
        await harness.fixture.whenStable();
        harness.detectChanges();

        expect(confirm).toHaveBeenCalledOnce();
        expect(confirm).toHaveBeenCalledWith(
          'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.',
        );
        expect(store.tills()).toEqual(tills);
        expect(store.businessUnit()).not.toBeNull();
        if (accepted) {
          expect(router.url).toBe(
            action === 'Back' ? `${TILL_ROOT}/${CRIMINAL_PATH}/account/1/individual` : `${TILL_ROOT}/details`,
          );
          expect(store.criminalPayment()).toBeNull();
          if (action === 'Back') {
            expect(store.selectedCriminalAccount()?.defendant_account_id).toBe(1);
            await harness.navigateByUrl(PAYMENT_URL);
            expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!.value).toBe('');
            expect(harness.routeNativeElement!.querySelector('input:checked')).toBeNull();
          } else {
            expect(store.selectedCriminalAccount()).toBeNull();
            expect(store.draftJourney()).toBeNull();
          }
        } else {
          expect(router.url).toBe(PAYMENT_URL);
          expect(harness.routeDebugElement!.componentInstance).toBe(component);
          expect(store.criminalPayment()).toEqual(entered === 'saved draft' ? PAYMENT : null);
          expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!.value).toBe(
            entered === 'saved draft' ? PAYMENT.amount : entered === 'amount only' ? '12.34' : '',
          );
          if (entered === 'radio only')
            expect(
              harness.routeNativeElement!.querySelector<HTMLInputElement>('input[value="thirdParty"]')!.checked,
            ).toBe(true);
        }
      });
    }
    it(`${action} with an empty form leaves without a warning`, async () => {
      const { harness, component, router } = await openPaymentDetails();
      const confirm = vi.spyOn(window, 'confirm');
      if (action === 'Back') component.handleBack();
      else component.handleCancel();
      await harness.fixture.whenStable();
      expect(router.url).toBe(
        action === 'Back' ? `${TILL_ROOT}/${CRIMINAL_PATH}/account/1/individual` : `${TILL_ROOT}/details`,
      );
      expect(confirm).not.toHaveBeenCalled();
    });
  }

  it.each([true, false])('handles browser Back after Check Payment with leave confirmation %s', async (accepted) => {
    const { harness, store, router } = await openPaymentDetails(PAYMENT);
    const account = store.selectedCriminalAccount();
    const tills = store.tills();
    const businessUnit = store.businessUnit();
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('#submitForm')!.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe(`${TILL_ROOT}/check-payment`);
    expect(store.criminalPayment()).toEqual(PAYMENT);

    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const returned = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      ),
    );
    TestBed.inject(Location).back();
    await returned;
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe(PAYMENT_URL);
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!.value).toBe(PAYMENT.amount);

    const page = harness.routeDebugElement!.componentInstance;
    expect(confirm).toHaveBeenCalledOnce();
    confirm.mockClear().mockReturnValue(accepted);
    const completed = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd || event instanceof NavigationCancel),
        take(1),
      ),
    );
    const restored = accepted
      ? Promise.resolve()
      : firstValueFrom(
          router.events.pipe(
            filter((event) => event instanceof NavigationSkipped),
            take(1),
          ),
        );
    TestBed.inject(Location).back();
    await completed;
    await restored;
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(confirm).toHaveBeenCalledOnce();
    expect(store.selectedCriminalAccount()).toEqual(account);
    expect(store.tills()).toEqual(tills);
    expect(store.businessUnit()).toEqual(businessUnit);
    if (accepted) {
      expect(router.url).toBe(`${TILL_ROOT}/${CRIMINAL_PATH}/account/1/individual`);
      expect(store.criminalPayment()).toBeNull();
      await harness.navigateByUrl(PAYMENT_URL);
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!.value).toBe('');
      expect(harness.routeNativeElement!.querySelector('input:checked')).toBeNull();
    } else {
      expect(router.url).toBe(PAYMENT_URL);
      expect(harness.routeDebugElement!.componentInstance).toBe(page);
      expect(store.criminalPayment()).toEqual(PAYMENT);
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!.value).toBe(PAYMENT.amount);
    }
  });

  it('returns a company to its company confirmation screen', async () => {
    const { harness, component, router } = await openPaymentDetails(null, true);
    component.handleBack();
    await harness.fixture.whenStable();
    expect(router.url).toBe(`${TILL_ROOT}/${CRIMINAL_PATH}/account/1/company`);
  });
});

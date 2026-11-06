import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsPaymentTermsTabComponent } from './fines-acc-defendant-details-payment-terms-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FRAGMENTS } from '../../fines-acc-payment-terms-amend/constants/fines-acc-payment-terms-amend-fragments.constant';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccPaymentTermsAmendComponent', () => {
  let component: FinesAccDefendantDetailsPaymentTermsTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsPaymentTermsTabComponent>;

  const getLinkByText = (linkText: string): HTMLAnchorElement | undefined =>
    Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('a.govuk-link')).find(
      (link) => link.textContent?.trim() === linkText,
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsPaymentTermsTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsPaymentTermsTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display Change in the payment terms summary card and Request payment card in its existing row when allowed', () => {
    component.hasAmendPaymentTermsPermission = true;
    component.accountAllowsPaymentTermsActions = true;

    fixture.detectChanges();

    const changeLink = getLinkByText('Change');
    const requestPaymentCardLink = getLinkByText('Request payment card');

    expect(changeLink).toBeTruthy();
    expect(changeLink?.closest('.govuk-summary-card__actions')).toBeTruthy();
    expect(requestPaymentCardLink).toBeTruthy();
    expect(requestPaymentCardLink?.closest('#payment-termsPayment-card-last-requestedActions')).toBeTruthy();
  });

  it('should hide Change and Request payment card when the account status or balance prevents payment terms actions', () => {
    component.hasAmendPaymentTermsPermission = true;
    component.accountAllowsPaymentTermsActions = false;

    fixture.detectChanges();

    expect(getLinkByText('Change')).toBeUndefined();
    expect(getLinkByText('Request payment card')).toBeUndefined();
  });

  it('should hide Change and Request payment card when amend payment terms permission is absent', () => {
    component.hasAmendPaymentTermsPermission = false;
    component.accountAllowsPaymentTermsActions = true;

    fixture.detectChanges();

    expect(getLinkByText('Change')).toBeUndefined();
    expect(getLinkByText('Request payment card')).toBeUndefined();
  });

  it('should display Change when enforcement prevents amending so the user can follow the existing denied route', () => {
    component.hasAmendPaymentTermsPermission = true;
    component.accountAllowsPaymentTermsActions = true;
    component.canAmendPaymentTerms = false;
    component.amendPaymentTermsDeniedType = 'enforcement';

    fixture.detectChanges();

    const changeLink = getLinkByText('Change');

    expect(changeLink).toBeTruthy();
    expect(changeLink?.getAttribute('href')).toContain('/payment-terms/denied/enforcement');
    expect(changeLink?.getAttribute('href')).not.toContain('#select-payment-terms');
  });

  it.each([
    {
      caseName: 'Pay in full',
      lumpSumAmount: 50.0,
      instalmentAmount: 0.0,
      paymentTermsTypeCode: undefined,
      expectedTitle: 'Pay in full',
    },
    {
      caseName: 'Lump sum and instalments',
      lumpSumAmount: 50.0,
      instalmentAmount: 50.0,
      paymentTermsTypeCode: undefined,
      expectedTitle: 'Lump sum plus instalments',
    },
    {
      caseName: 'Instalments only',
      lumpSumAmount: 0.0,
      instalmentAmount: 50.0,
      paymentTermsTypeCode: undefined,
      expectedTitle: 'Instalments only',
    },
    {
      caseName: 'Pay by date with no instalment or lump sum values',
      lumpSumAmount: 0.0,
      instalmentAmount: 0.0,
      paymentTermsTypeCode: 'B',
      expectedTitle: 'Pay in full',
    },
    {
      caseName: 'Paid with no instalment or lump sum values and code P',
      lumpSumAmount: 0.0,
      instalmentAmount: 0.0,
      paymentTermsTypeCode: 'P',
      expectedTitle: 'Paid',
    },
    {
      caseName: 'Paid with no instalment or lump sum values and another code',
      lumpSumAmount: 0.0,
      instalmentAmount: 0.0,
      paymentTermsTypeCode: 'I',
      expectedTitle: 'Paid',
    },
  ] as const)(
    'should return the correct card title for $caseName',
    ({ lumpSumAmount, instalmentAmount, paymentTermsTypeCode, expectedTitle }) => {
      component.tabData.payment_terms.lump_sum_amount = lumpSumAmount;
      component.tabData.payment_terms.instalment_amount = instalmentAmount;
      if (paymentTermsTypeCode) {
        component.tabData.payment_terms.payment_terms_type.payment_terms_type_code = paymentTermsTypeCode;
      }

      expect(component.cardTitle()).toBe(expectedTitle);
    },
  );

  it('should return the amend payment terms route when the action is allowed', () => {
    component.canAmendPaymentTerms = true;

    expect(component.changePaymentTermsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/amend`,
    );
  });

  it('should return the amend denied route when the action is not allowed', () => {
    component.canAmendPaymentTerms = false;
    component.amendPaymentTermsDeniedType = 'balance';

    expect(component.changePaymentTermsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/denied/balance`,
    );
  });

  it('should return the shared payment terms fragment when the action is allowed', () => {
    component.canAmendPaymentTerms = true;

    expect(component.changePaymentTermsFragment()).toBe(FINES_ACC_PAYMENT_TERMS_AMEND_FRAGMENTS.selectPaymentTerms);
  });

  it('should return the request payment card route when the action is allowed', () => {
    component.canRequestPaymentCard = true;

    expect(component.requestPaymentCardLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/request`,
    );
  });

  it('should return the request payment card denied route when the action is not allowed', () => {
    component.canRequestPaymentCard = false;
    component.requestPaymentCardDeniedType = 'enforcement';

    expect(component.requestPaymentCardLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/denied/enforcement`,
    );
  });

  it('should navigate to the resolved request payment card route', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');
    component.canRequestPaymentCard = true;

    component.handleRequestPaymentCard();

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/request`],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });
});

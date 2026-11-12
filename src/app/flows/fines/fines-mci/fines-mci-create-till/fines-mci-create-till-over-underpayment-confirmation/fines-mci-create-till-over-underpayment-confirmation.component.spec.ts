import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import * as axe from 'axe-core';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillOverUnderpaymentConfirmationComponent } from './fines-mci-create-till-over-underpayment-confirmation.component';

describe('FinesMciCreateTillOverUnderpaymentConfirmationComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillOverUnderpaymentConfirmationComponent>;
  let store: InstanceType<typeof FinesMciStore>;
  let router: Router;
  const courtFees = [
    { court_fee_id: 1, court_fee_code: 'CF001', description: 'Application', amount: 12.5 },
    { court_fee_id: 2, court_fee_code: 'CF002', description: 'Issue', amount: 0.1 },
  ];
  const getCourtFees = vi.fn(() => of({ court_fees: courtFees }));

  beforeEach(async () => {
    getCourtFees.mockReset();
    getCourtFees.mockReturnValue(of({ court_fees: courtFees }));
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillOverUnderpaymentConfirmationComponent],
      providers: [provideRouter([]), FinesMciStore, { provide: OpalFines, useValue: { getCourtFees } }],
    }).compileComponents();
    store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setDraftJourney('courtFee');
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  function render(): HTMLElement {
    fixture = TestBed.createComponent(FinesMciCreateTillOverUnderpaymentConfirmationComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the overpayment difference and entered court fee details', () => {
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '30', numberOfItems: '2' });

    const element = render();

    expect(getCourtFees).toHaveBeenCalledWith(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id);
    expect(element.textContent).toContain('Historical Debt');
    expect(element.querySelector('h1')?.textContent).toContain('Confirm overpayment');
    expect(element.querySelector('.moj-alert--information')?.textContent).toContain(
      'This amount contains a £5.00 overpayment.',
    );
    const summaryRows = element.querySelectorAll('.govuk-summary-list__row');
    expect(summaryRows[0].textContent).toContain('CF001 – Application (£12.50)');
    expect(summaryRows[1].textContent).toContain('£30.00');
    expect(summaryRows[2].textContent).toContain('2');
  });

  it('shows the underpayment difference in the warning banner', () => {
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '24.99', numberOfItems: '2' });

    const element = render();

    expect(element.querySelector('h1')?.textContent).toContain('You cannot add an underpayment');
    expect(element.querySelector('.moj-alert--warning')?.textContent).toContain(
      'This amount contains a £0.01 underpayment.',
    );
    expect(element.querySelector('.moj-alert--information')).toBeNull();
  });

  it.each([
    ['overpayment', '30'],
    ['underpayment', '24.99'],
  ])('has no detectable WCAG violations in the %s view', async (_view, amount) => {
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: amount, numberOfItems: '2' });
    const element = render();

    const results = await axe.run(element, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      // JSDOM does not render colours, so contrast needs a browser-based check.
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(results.passes.length).toBeGreaterThan(0);
    expect(results.violations).toEqual([]);
  });

  it('compares fractional fee amounts exactly', () => {
    store.setCourtFeeDraft({ courtFeeId: 2, amountPaid: '0.301', numberOfItems: '3' });

    const element = render();

    expect(element.querySelector('.moj-alert--information')?.textContent).toContain(
      'This amount contains a £0.001 overpayment.',
    );
    expect(element.querySelectorAll('.govuk-summary-list__row')[1].textContent).toContain('£0.301');
  });

  it('shows a loading message until court fees arrive', () => {
    const response = new Subject<{ court_fees: typeof courtFees }>();
    getCourtFees.mockReturnValue(response.asObservable());
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '30', numberOfItems: '2' });

    const element = render();
    expect(element.querySelector('output.govuk-body')?.textContent).toContain('Loading court fee payment details');

    response.next({ court_fees: courtFees });
    fixture.detectChanges();
    expect(element.querySelector('output.govuk-body')).toBeNull();
    expect(element.querySelector('.moj-alert--information')).not.toBeNull();
  });

  it('shows an error when the court fee draft is missing', () => {
    const element = render();

    expect(getCourtFees).not.toHaveBeenCalled();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('could not be loaded');
  });

  it('shows an error when the selected fee is unavailable', () => {
    store.setCourtFeeDraft({ courtFeeId: 999, amountPaid: '30', numberOfItems: '2' });

    const element = render();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('could not be loaded');
  });

  it('shows an error when court fees cannot be loaded', () => {
    getCourtFees.mockReturnValue(throwError(() => new Error('Unavailable')));
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '30', numberOfItems: '2' });

    const element = render();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('could not be loaded');
  });

  it('shows an error if the amounts no longer differ', () => {
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' });

    const element = render();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('could not be loaded');
  });

  it('shows Confirm and Cancel for an overpayment and continues with the draft', () => {
    const draft = { courtFeeId: 1, amountPaid: '30', numberOfItems: '2' };
    store.setCourtFeeDraft(draft);
    const element = render();

    expect(element.querySelector('#confirm-overpayment')?.textContent).toContain('Confirm');
    expect(element.querySelector('#cancel-overpayment')?.textContent).toContain('Cancel');
    expect(element.textContent).not.toContain('Cancel and return to till');

    element.querySelector<HTMLButtonElement>('#confirm-overpayment')!.click();

    expect(router.navigate).toHaveBeenCalledWith(['../court-fee-payment-details'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
    expect(store.courtFeeDraft()).toEqual(draft);
    expect(store.draftJourney()).toBe('courtFee');
  });

  it('returns to court fee details with the draft when overpayment is cancelled', () => {
    const draft = { courtFeeId: 1, amountPaid: '30', numberOfItems: '2' };
    store.setCourtFeeDraft(draft);
    const element = render();

    element.querySelector<HTMLAnchorElement>('#cancel-overpayment')!.click();

    expect(router.navigate).toHaveBeenCalledWith(['../court-fee-details'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
    expect(store.courtFeeDraft()).toEqual(draft);
  });

  it.each(['30', '24.99'])('returns to court fee details from the Back link for amount %s', (amount) => {
    const draft = { courtFeeId: 1, amountPaid: amount, numberOfItems: '2' };
    store.setCourtFeeDraft(draft);
    const element = render();

    const backLink = element.querySelector<HTMLAnchorElement>('.govuk-back-link')!;
    expect(backLink.textContent?.trim()).toBe('Back');
    backLink.click();

    expect(router.navigate).toHaveBeenCalledWith(['../court-fee-details'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
    expect(store.courtFeeDraft()).toEqual(draft);
  });

  it('returns to the till and clears only the payment draft for an underpayment', async () => {
    const tillId = store.ensureTill();
    store.addPayment(tillId, 'criminal');
    store.setDraftJourney('courtFee');
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '24.99', numberOfItems: '2' });
    const element = render();

    expect(element.querySelector('#confirm-overpayment')).toBeNull();
    const returnLink = element.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!;
    expect(returnLink.textContent).toContain('Cancel and return to till');
    returnLink.click();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['../details'], { relativeTo: TestBed.inject(ActivatedRoute) });
    expect(store.courtFeeDraft()).toBeNull();
    expect(store.draftJourney()).toBeNull();
    expect(store.businessUnit()).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    expect(store.tills()[0].payments).toHaveLength(1);
  });

  it('preserves the underpayment draft if navigation to the till is cancelled', async () => {
    const draft = { courtFeeId: 1, amountPaid: '24.99', numberOfItems: '2' };
    store.setCourtFeeDraft(draft);
    vi.mocked(router.navigate).mockResolvedValue(false);
    const element = render();

    element.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
    await fixture.whenStable();

    expect(store.courtFeeDraft()).toEqual(draft);
    expect(store.draftJourney()).toBe('courtFee');
  });

  it('does not continue an underpayment to payment details', () => {
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '24.99', numberOfItems: '2' });
    render();

    fixture.componentInstance.handleConfirm();

    expect(router.navigate).not.toHaveBeenCalled();
  });
});

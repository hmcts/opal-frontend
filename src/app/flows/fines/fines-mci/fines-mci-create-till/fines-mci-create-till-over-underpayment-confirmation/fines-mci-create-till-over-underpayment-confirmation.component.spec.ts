import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillOverUnderpaymentConfirmationComponent } from './fines-mci-create-till-over-underpayment-confirmation.component';

describe('FinesMciCreateTillOverUnderpaymentConfirmationComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillOverUnderpaymentConfirmationComponent>;
  let store: InstanceType<typeof FinesMciStore>;
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
      providers: [FinesMciStore, { provide: OpalFines, useValue: { getCourtFees } }],
    }).compileComponents();
    store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setDraftJourney('courtFee');
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
});

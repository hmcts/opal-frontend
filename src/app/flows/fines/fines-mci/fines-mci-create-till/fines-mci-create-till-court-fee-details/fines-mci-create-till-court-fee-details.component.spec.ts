import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeeDetailsComponent } from './fines-mci-create-till-court-fee-details.component';
import { FinesMciCreateTillCourtFeeDetailsFormComponent } from './fines-mci-create-till-court-fee-details-form/fines-mci-create-till-court-fee-details-form.component';

describe('FinesMciCreateTillCourtFeeDetailsComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillCourtFeeDetailsComponent>;
  let store: InstanceType<typeof FinesMciStore>;
  let router: Router;
  const courtFees = [
    { court_fee_id: 1, court_fee_code: 'CF001', description: 'Application', amount: 12.5 },
    { court_fee_id: 2, court_fee_code: 'CF002', description: 'Issue', amount: 0.1 },
  ];
  const getCourtFees = vi.fn(() => of({ court_fees: courtFees }));

  beforeEach(async () => {
    getCourtFees.mockClear();
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeeDetailsComponent],
      providers: [provideRouter([]), FinesMciStore, { provide: OpalFines, useValue: { getCourtFees } }],
    }).compileComponents();
    store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    vi.spyOn(TestBed.inject(UtilsService), 'scrollToTop').mockImplementation(() => {});
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  function render(): FinesMciCreateTillCourtFeeDetailsComponent {
    fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeDetailsComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function courtFeeForm(): FinesMciCreateTillCourtFeeDetailsFormComponent {
    return fixture.debugElement.query(By.directive(FinesMciCreateTillCourtFeeDetailsFormComponent)).componentInstance;
  }

  function submitForm(): void {
    (fixture.nativeElement as HTMLElement)
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  function enterCourtFeeText(value: string): HTMLInputElement {
    const autocomplete = (fixture.nativeElement as HTMLElement).querySelector(
      'opal-lib-alphagov-accessible-autocomplete',
    );
    const input = document.createElement('input');
    input.id = 'courtFeeId-autocomplete';
    autocomplete!.appendChild(input);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return input;
  }

  it('displays the selected business unit and Court Fee fields', () => {
    const component = render();
    const element = fixture.nativeElement as HTMLElement;

    expect(getCourtFees).toHaveBeenCalledWith(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id);
    expect(element.textContent).toContain('Historical Debt');
    expect(element.querySelector('h1')?.textContent).toContain('Court fee');
    expect(element.textContent).toContain('Search using court fee code or description');
    expect(element.textContent).toContain('Amount');
    expect(element.textContent).toContain('Number of items');
    expect(element.textContent).toContain('Continue');
    expect(element.textContent).toContain('Cancel');
    expect(component['courtFeeItems']()).toContainEqual({ value: 1, name: 'CF001 - Application (£12.50)' });
  });

  it('shows the required court fee error when Continue is selected without a fee', () => {
    render();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter court fee code');
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')?.textContent).toContain(
      'Enter court fee code',
    );
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter an amount');
    expect(element.querySelector('#amountPaid-error-message')?.textContent).toContain('Enter an amount');
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter number of items');
    expect(element.querySelector('#numberOfItems-error-message')?.textContent).toContain('Enter number of items');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(store.courtFeeDraft()).toBeNull();
    expect(courtFeeForm().form.valid).toBe(false);
    expect(document.activeElement).toBe(element.querySelector('.govuk-error-summary'));
    expect(TestBed.inject(UtilsService).scrollToTop).toHaveBeenCalledOnce();
  });

  it('shows the invalid court fee error for text that was not selected from the list', () => {
    render();
    enterCourtFeeText('NOT_A_FEE');
    submitForm();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter a valid court fee');
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')?.textContent).toContain(
      'Enter a valid court fee',
    );
    expect(courtFeeForm().form.controls['courtFeeId'].invalid).toBe(true);
  });

  it('ignores input events from other fields inside the autocomplete', () => {
    const component = render();
    const unrelatedInput = document.createElement('input');
    unrelatedInput.value = 'unknown fee';
    (fixture.nativeElement as HTMLElement)
      .querySelector('opal-lib-alphagov-accessible-autocomplete')!
      .appendChild(unrelatedInput);
    unrelatedInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(component.handleBeforeUnload()).toBe(true);
    submitForm();
    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-summary')?.textContent).toContain(
      'Enter court fee code',
    );
  });

  it('keeps the invalid error when the autocomplete clears typed text on blur', () => {
    render();
    const input = enterCourtFeeText('NOT_A_FEE');
    input.value = '';
    submitForm();

    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-summary')?.textContent).toContain(
      'Enter a valid court fee',
    );
  });

  it('rejects unmatched autocomplete text when a fee ID remains selected', () => {
    render();
    const input = enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    courtFeeForm().form.controls['numberOfItems'].setValue('1');

    input.value = 'NOT_A_FEE';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    submitForm();

    expect(courtFeeForm().form.controls['courtFeeId'].invalid).toBe(true);
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('#courtFeeId-autocomplete-error-message')?.textContent,
    ).toContain('Enter a valid court fee');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('rejects a cleared autocomplete label while its previous fee ID remains selected', () => {
    render();
    const input = enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    courtFeeForm().form.controls['numberOfItems'].setValue('1');

    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    submitForm();

    expect(courtFeeForm().form.controls['courtFeeId'].invalid).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('clears the court fee error while retaining an amount error', () => {
    render();
    courtFeeForm().form.controls['numberOfItems'].setValue('1');
    const input = enterCourtFeeText('NOT_A_FEE');
    submitForm();

    input.value = 'CF001 - Application (£12.50)';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    submitForm();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter an amount');
    expect(element.querySelector('.govuk-error-summary')?.textContent).not.toContain('Enter court fee code');
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')).toBeNull();
  });

  it('clears the court fee error as soon as a suggestion is selected, before its label appears', () => {
    render();
    const input = enterCourtFeeText('CF001');
    submitForm();
    expect(courtFeeForm().form.controls['courtFeeId'].invalid).toBe(true);

    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(input.value).toBe('CF001');
    expect(courtFeeForm().form.controls['courtFeeId'].valid).toBe(true);
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')).toBeNull();
    expect(element.querySelector('.govuk-error-summary')?.textContent).not.toContain('Enter a valid court fee');
  });

  it('shows the required amount error when a fee is selected but Amount is blank', () => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['numberOfItems'].setValue('1');
    submitForm();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter an amount');
    expect(element.querySelector('#amountPaid-error-message')?.textContent).toContain('Enter an amount');
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')).toBeNull();
  });

  it.each(['abc', '12x', '12.3.4', '£12'])('shows the numeric amount error for %s', (amount) => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue(amount);
    courtFeeForm().form.controls['numberOfItems'].setValue('1');
    submitForm();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter numbers only');
    expect(element.querySelector('#amountPaid-error-message')?.textContent).toContain('Enter numbers only');
  });

  it.each(['12', '12.50', '0.5'])('accepts the numeric amount %s', (amount) => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue(amount);
    courtFeeForm().form.controls['numberOfItems'].setValue('1');
    submitForm();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-summary')).toBeNull();
  });

  it('keeps the court fee error when Amount is corrected', () => {
    render();
    courtFeeForm().form.controls['numberOfItems'].setValue('1');
    submitForm();
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter court fee code');
    expect(element.querySelector('.govuk-error-summary')?.textContent).not.toContain('Enter an amount');
    expect(element.querySelector('#amountPaid-error-message')).toBeNull();
  });

  it('shows the required number of items error when a fee and amount are entered', () => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    submitForm();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter number of items');
    expect(element.querySelector('#numberOfItems-error-message')?.textContent).toContain('Enter number of items');
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')).toBeNull();
    expect(element.querySelector('#amountPaid-error-message')).toBeNull();
  });

  it.each(['two', '1.5', '-1'])('shows the number of items numeric error for %s', (numberOfItems) => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    courtFeeForm().form.controls['numberOfItems'].setValue(numberOfItems);
    submitForm();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter numbers only');
    expect(element.querySelector('#numberOfItems-error-message')?.textContent).toContain('Enter numbers only');
  });

  it.each(['0', '00'])('rejects %s items and updates the existing error', (numberOfItems) => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    submitForm();

    courtFeeForm().form.controls['numberOfItems'].setValue(numberOfItems);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('#numberOfItems-error-message')?.textContent).toContain(
      'Enter a number of items greater than 0',
    );

    submitForm();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain(
      'Enter a number of items greater than 0',
    );
    expect(element.querySelector('#numberOfItems-error-message')?.textContent).toContain(
      'Enter a number of items greater than 0',
    );
    expect(router.navigate).not.toHaveBeenCalled();
    expect(store.courtFeeDraft()).toBeNull();
    expect(courtFeeForm().form.controls['numberOfItems'].invalid).toBe(true);
  });

  it.each(['1', '12'])('accepts the whole number of items %s', (numberOfItems) => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    courtFeeForm().form.controls['numberOfItems'].setValue(numberOfItems);
    submitForm();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-summary')).toBeNull();
  });

  it.each([
    ['25.00', '2', 'court-fee-payment-details'],
    ['25.01', '2', 'over-underpayment-confirmation'],
    ['24.99', '2', 'over-underpayment-confirmation'],
    ['25.001', '2', 'over-underpayment-confirmation'],
  ])('routes a £%s payment for %s items to %s', (amount, numberOfItems, destination) => {
    render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.controls['courtFeeId'].setValue(1);
    courtFeeForm().form.controls['amountPaid'].setValue(amount);
    courtFeeForm().form.controls['numberOfItems'].setValue(numberOfItems);

    submitForm();

    expect(router.navigate).toHaveBeenCalledWith([`../${destination}`], expect.any(Object));
    expect(store.courtFeeDraft()).toEqual({ courtFeeId: 1, amountPaid: amount, numberOfItems });
    expect(courtFeeForm().form.valid).toBe(true);
  });

  it('uses pence when comparing a decimal court fee for multiple items', () => {
    render();
    enterCourtFeeText('CF002 - Issue (£0.10)');
    courtFeeForm().form.controls['courtFeeId'].setValue(2);
    courtFeeForm().form.controls['amountPaid'].setValue('0.30');
    courtFeeForm().form.controls['numberOfItems'].setValue('3');

    submitForm();

    expect(router.navigate).toHaveBeenCalledWith(['../court-fee-payment-details'], expect.any(Object));
  });

  it('keeps other field errors when Number of items is corrected', () => {
    render();
    submitForm();
    courtFeeForm().form.controls['numberOfItems'].setValue('2');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter court fee code');
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter an amount');
    expect(element.querySelector('.govuk-error-summary')?.textContent).not.toContain('Enter number of items');
    expect(element.querySelector('#numberOfItems-error-message')).toBeNull();
  });

  it('waits for fee data before rendering the typeahead', () => {
    const response = new Subject<{ court_fees: typeof courtFees }>();
    getCourtFees.mockReturnValueOnce(response);
    render();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Loading court fees');
    expect((fixture.nativeElement as HTMLElement).querySelector('form')).toBeNull();

    response.next({ court_fees: courtFees });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('form')).not.toBeNull();
  });

  it('restores draft form values when returning to the screen', () => {
    const draft = { courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' };
    store.setCourtFeeDraft(draft);

    const component = render();

    expect(courtFeeForm().form.getRawValue()).toEqual(draft);
    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('allows leaving without a warning when no Court Fee Details have been entered', () => {
    const component = render();

    expect(component.handleBeforeUnload()).toBe(true);
  });

  it.each([
    ['court fee', { courtFeeId: 1, amountPaid: null, numberOfItems: null }],
    ['amount', { courtFeeId: null, amountPaid: '12.50', numberOfItems: null }],
    ['number of items', { courtFeeId: null, amountPaid: null, numberOfItems: '2' }],
  ])('warns before leaving when only the %s is entered', (_field, values) => {
    const component = render();
    courtFeeForm().form.setValue(values);

    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('warns before leaving when an unmatched court fee search was typed', () => {
    const component = render();
    enterCourtFeeText('unknown fee');

    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('prevents browser exit or refresh while Court Fee Details are entered', () => {
    render();
    courtFeeForm().form.controls['amountPaid'].setValue('12.50');
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
    expect(courtFeeForm().form.controls['amountPaid'].value).toBe('12.50');
  });

  it('allows a valid Continue without a warning and keeps the draft for the next screen', () => {
    const component = render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.setValue({ courtFeeId: 1, amountPaid: '12.50', numberOfItems: '1' });

    submitForm();
    fixture.destroy();

    expect(component.handleBeforeUnload()).toBe(true);
    expect(store.courtFeeDraft()).toEqual({ courtFeeId: 1, amountPaid: '12.50', numberOfItems: '1' });
  });

  it.each(['cancelled', 'rejected'])('protects the form again if Continue navigation is %s', async (outcome) => {
    if (outcome === 'rejected') {
      vi.mocked(router.navigate).mockRejectedValueOnce(new Error('Failed to load the next screen'));
    } else {
      vi.mocked(router.navigate).mockResolvedValueOnce(false);
    }
    const component = render();
    enterCourtFeeText('CF001 - Application (£12.50)');
    courtFeeForm().form.setValue({ courtFeeId: 1, amountPaid: '12.50', numberOfItems: '1' });

    submitForm();
    await fixture.whenStable();

    expect(component.handleBeforeUnload()).toBe(false);
    expect(store.courtFeeDraft()).toEqual({ courtFeeId: 1, amountPaid: '12.50', numberOfItems: '1' });
    courtFeeForm().form.controls['amountPaid'].setValue('13.00');
    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('shows an error when court fee reference data cannot load', () => {
    getCourtFees.mockReturnValueOnce(throwError(() => new Error('unavailable')));
    render();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Court fees could not be loaded');
  });

  it('does not request court fees when no business unit is selected', () => {
    store.reset();
    render();

    const element = fixture.nativeElement as HTMLElement;
    expect(getCourtFees).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Court fees could not be loaded');
    expect(element.querySelector('form')).toBeNull();
  });

  it('does not save or navigate when a fee is no longer available', () => {
    const component = render();

    component.handleSubmit({
      formData: { courtFeeId: 999, amountPaid: '12.50', numberOfItems: '1' },
      nestedFlow: false,
    });

    expect(store.courtFeeDraft()).toBeNull();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('explains when the selected business unit has no court fees', () => {
    getCourtFees.mockReturnValueOnce(of({ court_fees: [] }));
    render();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('No court fees are available for this business unit.');
    expect(element.querySelector('form')).toBeNull();
  });

  it('returns to Till Details and clears the selected journey on Cancel', async () => {
    store.setDraftJourney('courtFee');
    const component = render();

    component.handleCancel();
    await Promise.resolve();

    expect(router.navigate).toHaveBeenCalledWith(['../details'], expect.any(Object));
    expect(store.draftJourney()).toBeNull();
  });

  it('retains entered data and the draft when Cancel is declined', async () => {
    const draft = { courtFeeId: 1, amountPaid: '12.50', numberOfItems: '1' };
    store.setCourtFeeDraft(draft);
    store.setDraftJourney('courtFee');
    vi.mocked(router.navigate).mockResolvedValueOnce(false);
    const component = render();

    component.handleCancel();
    await Promise.resolve();

    expect(component.handleBeforeUnload()).toBe(false);
    expect(courtFeeForm().form.getRawValue()).toEqual(draft);
    expect(store.courtFeeDraft()).toEqual(draft);
    expect(store.draftJourney()).toBe('courtFee');
  });

  it('discards entered data and the draft after Cancel is confirmed', async () => {
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '12.50', numberOfItems: '1' });
    store.setDraftJourney('courtFee');
    const component = render();

    component.handleCancel();
    await Promise.resolve();

    expect(store.courtFeeDraft()).toBeNull();
    expect(store.draftJourney()).toBeNull();
  });
});

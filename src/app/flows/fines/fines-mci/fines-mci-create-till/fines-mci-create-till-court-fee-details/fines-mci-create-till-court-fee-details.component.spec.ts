import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeeDetailsComponent } from './fines-mci-create-till-court-fee-details.component';

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
    router = TestBed.inject(Router);
  });

  function render(): FinesMciCreateTillCourtFeeDetailsComponent {
    fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeDetailsComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
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
  });

  it('shows the invalid court fee error for text that was not selected from the list', () => {
    const component = render();
    enterCourtFeeText('NOT_A_FEE');
    component.handleSubmit();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter a valid court fee');
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')?.textContent).toContain(
      'Enter a valid court fee',
    );
  });

  it('keeps the invalid error when the autocomplete clears typed text on blur', () => {
    const component = render();
    const input = enterCourtFeeText('NOT_A_FEE');
    input.value = '';
    component.handleSubmit();

    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-summary')?.textContent).toContain(
      'Enter a valid court fee',
    );
  });

  it('clears the court fee error after selecting a listed fee', () => {
    const component = render();
    const input = enterCourtFeeText('NOT_A_FEE');
    component.handleSubmit();

    input.value = 'CF001 - Application (£12.50)';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    component['form'].controls.courtFeeId.setValue(1);
    component.handleSubmit();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary')).toBeNull();
    expect(element.querySelector('#courtFeeId-autocomplete-error-message')).toBeNull();
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

    expect(component['form'].getRawValue()).toEqual(draft);
  });

  it('shows an error when court fee reference data cannot load', () => {
    getCourtFees.mockReturnValueOnce(throwError(() => new Error('unavailable')));
    render();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Court fees could not be loaded');
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
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.handleCancel();
    await Promise.resolve();

    expect(navigateSpy).toHaveBeenCalledWith(['../details'], expect.any(Object));
    expect(store.draftJourney()).toBeNull();
  });
});

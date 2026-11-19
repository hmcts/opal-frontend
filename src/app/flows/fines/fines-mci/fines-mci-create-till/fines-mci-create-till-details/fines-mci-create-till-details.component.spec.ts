import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillDetailsComponent } from './fines-mci-create-till-details.component';

describe('FinesMciCreateTillDetailsComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillDetailsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillDetailsComponent],
      providers: [provideRouter([]), FinesMciStore],
    }).compileComponents();

    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciCreateTillDetailsComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should display the selected business unit and empty till content', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent).toContain('Till details');
    expect(nativeElement.textContent).toContain('Business unit');
    expect(nativeElement.textContent).toContain('Historical Debt');
    expect(nativeElement.textContent).toContain('Payments');
    expect(nativeElement.textContent).toContain('There are no payments');
    expect(nativeElement.textContent).toContain('Create till');
    expect(nativeElement.textContent).toContain('You must add at least 1 payment to the till.');
    expect(nativeElement.querySelector('#fines-mci-add-payment')?.classList).toContain('govuk-button--secondary');
    const deleteTillLink = nativeElement.querySelector('#fines-mci-delete-till');
    expect(deleteTillLink?.tagName).toBe('A');
    expect(deleteTillLink?.classList).toContain('govuk-error-colour');
    expect(deleteTillLink?.textContent?.trim()).toBe('Delete till');
  });

  it('shows a saved court fee payment on the till', () => {
    const store = TestBed.inject(FinesMciStore);
    const tillId = store.ensureTill();
    store.saveCourtFeePayment(tillId, {
      courtFeeId: 1,
      amountPaid: '25',
      numberOfItems: '2',
      courtFeeLabel: 'C01 – Court fee (£12.50)',
      amountLabel: '£25.00',
      paymentDetails: {
        paymentReceivedFrom: 'applicant',
        paymentMethod: 'NC',
        payerType: 'company',
        companyName: 'Example Ltd',
        addressLine1: null,
        addressLine2: null,
        addressLine3: null,
        postcode: null,
      },
      suspenseNote: 'Payment note',
    });
    fixture.detectChanges();
    const content = (fixture.nativeElement as HTMLElement).textContent!;
    expect(content).toContain('C01 – Court fee (£12.50)');
    expect(content).toContain('£25.00');
    expect(content).not.toContain('There are no payments');
    expect(content).not.toContain('You must add at least 1 payment');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.govuk-summary-list__actions a')?.textContent,
    ).toContain('Change');
  });

  it.each([
    ['cancelled', false],
    ['rejected', false],
    ['cancelled', true],
    ['rejected', true],
  ] as const)(
    'restores the previous draft when opening a payment is %s (review started: %s)',
    async (outcome, reviewStarted) => {
      const store = TestBed.inject(FinesMciStore);
      const tillId = store.ensureTill();
      store.saveCourtFeePayment(tillId, {
        courtFeeId: 1,
        amountPaid: '25',
        numberOfItems: '2',
        courtFeeLabel: 'C01',
        amountLabel: '£25.00',
        paymentDetails: {
          paymentReceivedFrom: 'applicant',
          paymentMethod: 'NC',
          payerType: 'company',
          companyName: 'Example Ltd',
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          postcode: null,
        },
        suspenseNote: 'Saved note',
      });
      const paymentId = store.tills()[0].payments[0].paymentId;
      store.setDraftJourney('courtFee');
      store.setCourtFeeDraft({ courtFeeId: 2, amountPaid: '10', numberOfItems: '1' });
      store.setCourtFeeSuspenseNote('Previous draft');
      if (reviewStarted) store.startCourtFeeReview();
      const navigate = vi.spyOn(router, 'navigate');
      if (outcome === 'cancelled') navigate.mockResolvedValue(false);
      else navigate.mockRejectedValue(new Error('Navigation failed'));
      fixture.componentInstance.handleEditPayment(paymentId);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(store.courtFeeDraft()).toEqual({ courtFeeId: 2, amountPaid: '10', numberOfItems: '1' });
      expect(store.courtFeeSuspenseNote()).toBe('Previous draft');
      expect(store.courtFeeReviewStarted()).toBe(reviewStarted);
      expect(store.editingCourtFeePaymentId()).toBeNull();
      expect(store.tills()[0].payments[0].courtFee?.suspenseNote).toBe('Saved note');
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('The payment could not be opened');
    },
  );

  it('should block navigation away from the till details page', () => {
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });

  it('should block browser refresh, reload, and exit', () => {
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });

  it('should navigate back to select business unit and preserve the selected business unit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const store = TestBed.inject(FinesMciStore);
    const selectedBusinessUnit = store.businessUnit();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();

    expect(store.businessUnit()).toEqual(selectedBusinessUnit);
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'select-bu'], {
      state: { preserveBusinessUnit: true },
    });
  });

  it('should navigate to payment category when Add payment is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.debugElement.query(By.css('opal-lib-govuk-button')).triggerEventHandler('buttonClickEvent');

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/', 'fines', 'manual-cash-input', 'create', 'till', 'payment-category'],
      undefined,
    );
  });

  it('should navigate to cancel till creation when Delete till is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.debugElement.query(By.css('#fines-mci-delete-till')).triggerEventHandler('click', new Event('click'));

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/', 'fines', 'manual-cash-input', 'create', 'till', 'cancel'],
      undefined,
    );
  });
});

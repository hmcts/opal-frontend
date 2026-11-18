import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillCourtFeeCheckComponent } from './fines-mci-create-till-court-fee-check.component';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

describe('FinesMciCreateTillCourtFeeCheckComponent', () => {
  const paymentDetails = {
    paymentReceivedFrom: 'applicant',
    paymentMethod: 'NC',
    payerType: 'company',
    companyName: 'Example Ltd',
    addressLine1: null,
    addressLine2: null,
    addressLine3: null,
    postcode: null,
  };
  /** Prepares a complete payment and its resolved display data. */
  function preparePayment(): InstanceType<typeof FinesMciStore> {
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.ensureTill();
    store.setDraftJourney('courtFee');
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '25', numberOfItems: '2' });
    store.setCourtFeePaymentDetails(paymentDetails);
    store.setCourtFeeSuspenseNote('Payment note');
    TestBed.inject(ActivatedRoute).snapshot.data['courtFees'] = {
      court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }],
    };
    TestBed.inject(ActivatedRoute).snapshot.data['paymentMappings'] = {
      methods: [{ code: 'NC', display_name: 'Notes and coins' }],
      sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
    };
    return store;
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeeCheckComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('protects the in-memory till from unintended navigation and browser unload', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
  });

  it('displays resolved fee, mapped payment and individual details', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '1030', numberOfItems: '2' });
    store.setCourtFeePaymentDetails({
      paymentReceivedFrom: 'thirdParty',
      paymentMethod: 'CT',
      paymentSource: 'ALLPAY',
      paymentReference: 'REF-1',
      payerType: 'individual',
      title: 'Ms',
      firstNames: 'Alex',
      lastName: 'Smith',
      addressLine1: '12 Example Street',
      addressLine2: null,
      addressLine3: 'London',
      postcode: 'SW1A 1AA',
    });
    TestBed.inject(ActivatedRoute).snapshot.data['courtFees'] = {
      court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }],
    };
    TestBed.inject(ActivatedRoute).snapshot.data['paymentMappings'] = {
      methods: [{ code: 'CT', display_name: 'Credit transfer' }],
      sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
    };
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Check payment');
    expect(element.querySelector('.govuk-caption-l')?.textContent).toContain(store.businessUnit()!.business_unit_name);
    expect(element.querySelector('.govuk-summary-card__title')?.textContent).toContain('Court fee payment');
    const rows = Array.from(element.querySelectorAll('.govuk-summary-list__row')).map((row) => row.textContent?.trim());
    expect(rows).toEqual([
      expect.stringContaining('C01 – Court fee (£12.50)'),
      expect.stringContaining('£1,030.00'),
      expect.stringContaining('Number of items2'),
      expect.stringContaining('Third party'),
      expect.stringContaining('Credit transfer'),
      expect.stringContaining('allpay'),
      expect.stringContaining('REF-1'),
      expect.stringContaining('Individual'),
      expect.stringContaining('Ms Alex Smith'),
      expect.stringContaining('12 Example Street, London, SW1A 1AA'),
    ]);
    const links = Array.from(element.querySelectorAll('.govuk-summary-list__actions a'));
    expect(links).toHaveLength(rows.length);
    expect(links[0].textContent).toContain('Change Court fee');
    expect(links[links.length - 1].textContent).toContain('Change Address');
  });

  it('shows em dashes for optional fields and omits source for a company cheque payment', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '25', numberOfItems: '2' });
    store.setCourtFeePaymentDetails({
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'CQ',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    });
    TestBed.inject(ActivatedRoute).snapshot.data['courtFees'] = {
      court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }],
    };
    TestBed.inject(ActivatedRoute).snapshot.data['paymentMappings'] = {
      methods: [{ code: 'CQ', display_name: 'Cheque' }],
      sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
    };
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    const rows = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.govuk-summary-list__row'));
    expect(rows.map((row) => row.querySelector('dt')?.textContent?.trim())).not.toContain('Source');
    expect(
      rows
        .find((row) => row.querySelector('dt')?.textContent?.trim() === 'Payment reference')
        ?.querySelector('dd')
        ?.textContent?.trim(),
    ).toBe('—');
    expect(
      rows
        .find((row) => row.querySelector('dt')?.textContent?.trim() === 'Address')
        ?.querySelector('dd')
        ?.textContent?.trim(),
    ).toBe('—');
    expect(
      rows
        .find((row) => row.querySelector('dt')?.textContent?.trim() === 'Payer name')
        ?.querySelector('dd')
        ?.textContent?.trim(),
    ).toBe('Example Ltd');
  });

  it('shows an error when reference data is unavailable', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')?.textContent).toContain(
      'could not be loaded',
    );
  });

  it.each([
    ['30', 'This amount contains a £5.00 overpayment.'],
    ['25.001', 'This amount contains a £0.001 overpayment.'],
    ['25', null],
    ['24.99', null],
  ])('shows the overpayment information only when the amount is above the total: £%s', (amountPaid, message) => {
    const store = TestBed.inject(FinesMciStore);
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid, numberOfItems: '2' });
    store.setCourtFeePaymentDetails({
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'CQ',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    });
    TestBed.inject(ActivatedRoute).snapshot.data['courtFees'] = {
      court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }],
    };
    TestBed.inject(ActivatedRoute).snapshot.data['paymentMappings'] = {
      methods: [{ code: 'CQ', display_name: 'Cheque' }],
      sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
    };
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const alert = element.querySelector('.moj-alert--information');
    if (message) {
      expect(alert?.textContent).toContain(message);
      expect(element.querySelector('.govuk-summary-card')).not.toBeNull();
    } else {
      expect(alert).toBeNull();
    }
  });

  it.each(['cancelled', 'rejected'])('restores leave protection if Back navigation is %s', async (outcome) => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    if (outcome === 'cancelled') navigate.mockResolvedValue(false);
    else navigate.mockRejectedValue(new Error('Navigation failed'));
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    fixture.componentInstance.handleBack();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['../court-fee-payment-details'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
    await fixture.whenStable();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });

  it.each([
    ['court-fee', 'court-fee-details'],
    ['amount', 'court-fee-details'],
    ['number-of-items', 'court-fee-details'],
    ['payment-received-from', 'court-fee-payment-details'],
    ['payment-method', 'court-fee-payment-details'],
    ['source', 'court-fee-payment-details'],
    ['payment-reference', 'court-fee-payment-details'],
    ['payer-type', 'court-fee-payment-details'],
    ['payer-name', 'court-fee-payment-details'],
    ['address', 'court-fee-payment-details'],
  ])('opens the appropriate form when changing %s', async (rowId, destination) => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    fixture.componentInstance.handleChange(rowId);
    expect(navigate).toHaveBeenCalledWith([`../${destination}`], {
      relativeTo: TestBed.inject(ActivatedRoute),
      ...(destination === 'court-fee-details' && { state: { editCourtFeeFromCheck: true } }),
    });
    await fixture.whenStable();
  });

  it.each(['cancelled', 'rejected'])('retains the saved drafts if Change navigation is %s', async (outcome) => {
    const store = TestBed.inject(FinesMciStore);
    const fee = { courtFeeId: 1, amountPaid: '25', numberOfItems: '2' };
    const details = {
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    };
    store.setCourtFeeDraft(fee);
    store.setCourtFeePaymentDetails(details);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    if (outcome === 'cancelled') navigate.mockResolvedValue(false);
    else navigate.mockRejectedValue(new Error('Navigation failed'));
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    fixture.componentInstance.handleChange('amount');
    await fixture.whenStable();
    expect(store.courtFeeDraft()).toEqual(fee);
    expect(store.courtFeePaymentDetails()).toEqual(details);
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });

  it.each(['cancelled', 'rejected'])('keeps the payment draft when save navigation is %s', async (outcome) => {
    const store = preparePayment();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    if (outcome === 'cancelled') navigate.mockResolvedValue(false);
    else navigate.mockRejectedValue(new Error('Navigation failed'));
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    fixture.componentInstance.handleSave('review');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(store.tills()[0].payments).toEqual([]);
    expect(store.courtFeePaymentDetails()).toEqual(paymentDetails);
    expect(store.courtFeeSuspenseNote()).toBe('Payment note');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('The payment could not be saved');
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });

  it.each(['cancelled', 'rejected'])('keeps the payment draft when Cancel navigation is %s', async (outcome) => {
    const store = preparePayment();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    if (outcome === 'cancelled') navigate.mockResolvedValue(false);
    else navigate.mockRejectedValue(new Error('Navigation failed'));
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    fixture.componentInstance.handleCancel();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(store.courtFeeDraft()).toEqual({ courtFeeId: 1, amountPaid: '25', numberOfItems: '2' });
    expect(store.courtFeePaymentDetails()).toEqual(paymentDetails);
    expect(store.courtFeeSuspenseNote()).toBe('Payment note');
    expect((fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>('#suspenseNote')?.value).toBe(
      'Payment note',
    );
  });

  it('does not create duplicate payments while navigation is pending', async () => {
    const store = preparePayment();
    let complete!: (value: boolean) => void;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    fixture.componentInstance.handleSave('review');
    fixture.componentInstance.handleSave('review');
    expect(navigate).toHaveBeenCalledOnce();
    complete(true);
    await fixture.whenStable();
    expect(store.tills()[0].payments).toHaveLength(1);
  });
});

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillCourtFeeCheckComponent } from './fines-mci-create-till-court-fee-check.component';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

describe('FinesMciCreateTillCourtFeeCheckComponent', () => {
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
});

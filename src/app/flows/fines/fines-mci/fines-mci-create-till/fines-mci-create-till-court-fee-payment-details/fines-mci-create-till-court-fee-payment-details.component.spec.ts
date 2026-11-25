import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeePaymentDetailsComponent } from './fines-mci-create-till-court-fee-payment-details.component';
import { FinesMciPaymentMappingsService } from '../../services/fines-mci-payment-mappings.service';
import { IFinesMciPaymentMappings } from '../../routing/interfaces/fines-mci-payment-mappings.interface';

describe('FinesMciCreateTillCourtFeePaymentDetailsComponent', () => {
  const loadMappings = vi.fn();
  const mappings = {
    methods: [{ code: 'NC', display_name: 'Notes and coins' }],
    sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
  };

  beforeEach(async () => {
    loadMappings.mockReset().mockReturnValue(of(mappings));
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeePaymentDetailsComponent],
      providers: [
        FinesMciStore,
        { provide: FinesMciPaymentMappingsService, useValue: { load: loadMappings } },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                paymentMappings: {
                  methods: [{ code: 'NC', display_name: 'Notes and coins' }],
                  sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it.each(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData.slice(0, 2))(
    'displays Payment details for the selected business unit: $business_unit_name',
    (businessUnit) => {
      const store = TestBed.inject(FinesMciStore);
      const courtFeeDraft = { courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' };
      store.setBusinessUnit(businessUnit);
      store.setDraftJourney('courtFee');
      store.setCourtFeeDraft(courtFeeDraft);

      const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('h1')?.textContent?.trim()).toBe('Payment details');
      expect(element.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe(businessUnit.business_unit_name);
      expect(store.courtFeeDraft()).toEqual(courtFeeDraft);
    },
  );

  it('shows an error instead of the form when payment mappings cannot be loaded', () => {
    TestBed.inject(ActivatedRoute).snapshot.data['paymentMappings'] = null;
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Payment options could not be loaded');
    expect(element.querySelector('form')).toBeNull();
  });

  it('retries a failed mapping load and restores the saved payment draft', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setDraftJourney('courtFee');
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '25', numberOfItems: '2' });
    const draft = {
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: 'SW1A 1AA',
    };
    store.setCourtFeePaymentDetails(draft);
    TestBed.inject(ActivatedRoute).snapshot.data['paymentMappings'] = null;
    const request = new Subject<IFinesMciPaymentMappings | null>();
    loadMappings.mockReturnValueOnce(request.asObservable());
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector<HTMLButtonElement>('#retry-payment-options')!.click();
    fixture.detectChanges();
    expect(element.textContent).toContain('Loading payment options');
    expect(element.querySelector('#retry-payment-options')).toBeNull();
    expect(store.courtFeePaymentDetails()).toEqual(draft);
    fixture.componentInstance.handleRetry();
    expect(loadMappings).toHaveBeenCalledOnce();
    expect(loadMappings).toHaveBeenCalledWith(true);

    request.next(mappings);
    request.complete();
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(element.querySelector<HTMLInputElement>('#companyName')?.value).toBe('Example Ltd');
    expect(element.querySelector<HTMLInputElement>('#postcode')?.value).toBe('SW1A 1AA');
    expect(document.activeElement).toBe(element.querySelector('h1'));
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
    expect(store.courtFeePaymentDetails()).toEqual(draft);
  });

  it('keeps the retry available and retains the draft if loading fails again', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setCourtFeePaymentDetails({
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    });
    TestBed.inject(ActivatedRoute).snapshot.data['paymentMappings'] = null;
    loadMappings.mockReturnValue(of(null));
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector<HTMLButtonElement>('#retry-payment-options')!.click();
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Payment options could not be loaded');
    expect(element.querySelector('#retry-payment-options')).not.toBeNull();
    expect(store.courtFeePaymentDetails()?.companyName).toBe('Example Ltd');
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
  });

  it('warns before leaving after entering data', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component['canDeactivate']()).toBe(true);

    (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    expect(component['canDeactivate']()).toBe(false);
  });

  it('retains the draft and restores leave protection when Continue navigation fails', async () => {
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(false);
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    element.querySelector<HTMLInputElement>('input[value="NC"]')!.click();
    element.querySelector<HTMLInputElement>('input[value="company"]')!.click();
    fixture.detectChanges();
    const companyName = element.querySelector<HTMLInputElement>('#companyName')!;
    companyName.value = 'Example Ltd';
    companyName.dispatchEvent(new Event('input', { bubbles: true }));
    element.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
    expect(TestBed.inject(FinesMciStore).courtFeePaymentDetails()?.companyName).toBe('Example Ltd');
  });

  it('preserves the form while navigation is pending and restores it if navigation fails', async () => {
    let finishNavigation!: (navigated: boolean) => void;
    vi.spyOn(TestBed.inject(Router), 'navigate').mockReturnValue(
      new Promise((resolve) => (finishNavigation = resolve)),
    );
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();

    fixture.componentInstance.handleBack();
    fixture.detectChanges();
    expect(element.textContent).toContain('Loading next screen');
    expect(element.querySelector('form')?.parentElement?.parentElement?.hasAttribute('hidden')).toBe(true);
    expect(element.querySelector<HTMLInputElement>('input[value="applicant"]')!.checked).toBe(true);

    finishNavigation(false);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Loading next screen');
    expect(element.querySelector<HTMLInputElement>('input[value="applicant"]')!.checked).toBe(true);
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
  });
});

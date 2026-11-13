import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeePaymentDetailsComponent } from './fines-mci-create-till-court-fee-payment-details.component';

describe('FinesMciCreateTillCourtFeePaymentDetailsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeePaymentDetailsComponent],
      providers: [
        FinesMciStore,
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

  it('protects the till on refresh and warns before leaving after entering data', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.handleBeforeUnload()).toBe(false);
    expect(component['canDeactivate']()).toBe(true);

    (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    expect(component['canDeactivate']()).toBe(false);
  });

  it('continues to protect entered data after validating the current form', () => {
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

    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
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
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);

    finishNavigation(false);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Loading next screen');
    expect(element.querySelector<HTMLInputElement>('input[value="applicant"]')!.checked).toBe(true);
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
  });
});

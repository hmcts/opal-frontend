import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciSuspensePayment } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillSuspenseDetailsComponent } from './fines-mci-create-till-suspense-details.component';

const SUSPENSE_PAYMENT: IFinesMciSuspensePayment = {
  amount: '25.00',
  payerType: 'defendant',
  methodOfPayment: 'creditTransfer',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: 'ref-02',
  source: 'allpay',
  reason: 'unidentified',
  relevantDetails: 'payment details',
};

describe('FinesMciCreateTillSuspenseDetailsComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillSuspenseDetailsComponent>;
  let router: Router;
  let store: InstanceType<typeof FinesMciStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSuspenseDetailsComponent],
      providers: [provideRouter([]), FinesMciStore, { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();

    store = TestBed.inject(FinesMciStore);
    router = TestBed.inject(Router);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciCreateTillSuspenseDetailsComponent);
  });

  it('shows the selected business unit and form title', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name);
    expect(element.querySelector('h1')?.textContent).toContain('Suspense details');
  });

  it('starts without leave protection when no suspense data is stored', () => {
    fixture.detectChanges();

    expect(fixture.componentInstance['canDeactivate']()).toBe(true);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(true);
  });

  it('restores leave protection for saved suspense details', () => {
    store.setSuspensePayment(SUSPENSE_PAYMENT);
    fixture.detectChanges();

    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
  });

  it.each([
    ['unidentified', 'check-suspense-payment'],
    ['overpayment', 'payer-details'],
  ] as const)('stores valid suspense details and routes %s to %s', (reason, target) => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const data = { ...SUSPENSE_PAYMENT, reason } as IFinesMciSuspensePayment;

    fixture.componentInstance.handleSubmit({ formData: data, nestedFlow: false });

    expect(store.suspensePayment()).toEqual(data);
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith([target], { relativeTo: null });
  });

  it('tracks unsaved child form values for route and browser leave protection', () => {
    const component = fixture.componentInstance;
    component.handleUnsavedChanges(true);
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(component['canDeactivate']()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });

  it('retains leave protection when suspense state is present even if the child is pristine', () => {
    store.setSuspensePayment(SUSPENSE_PAYMENT);
    fixture.detectChanges();

    fixture.componentInstance.handleUnsavedChanges(false);

    expect(fixture.componentInstance.stateUnsavedChanges).toBe(true);
  });

  it('clears suspense data after Cancel navigation succeeds', async () => {
    store.setDraftJourney('suspense');
    store.setSuspensePayment(SUSPENSE_PAYMENT);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.handleCancel();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
    expect(store.draftJourney()).toBeNull();
    expect(store.suspensePayment()).toBeNull();
  });

  it('retains suspense data when Cancel navigation is rejected', async () => {
    store.setDraftJourney('suspense');
    store.setSuspensePayment(SUSPENSE_PAYMENT);
    vi.spyOn(router, 'navigate').mockResolvedValue(false);

    fixture.componentInstance.handleCancel();
    await fixture.whenStable();

    expect(store.draftJourney()).toBe('suspense');
    expect(store.suspensePayment()).toEqual(SUSPENSE_PAYMENT);
  });
});

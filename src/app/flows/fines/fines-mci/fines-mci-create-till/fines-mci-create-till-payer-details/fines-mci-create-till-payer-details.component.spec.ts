import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciSuspensePayerDetails, IFinesMciSuspensePayment } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillPayerDetailsComponent } from './fines-mci-create-till-payer-details.component';

const PAYMENT: IFinesMciSuspensePayment = {
  amount: '25.00',
  payerType: 'thirdParty',
  methodOfPayment: 'notesCoins',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: '',
  source: null,
  reason: 'overpayment',
  relevantDetails: '',
};
const PAYER: IFinesMciSuspensePayerDetails = {
  payerType: 'individual',
  title: null,
  firstNames: '',
  lastName: 'Smith',
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  postcode: '',
};

describe('FinesMciCreateTillPayerDetailsComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillPayerDetailsComponent>;
  let store: InstanceType<typeof FinesMciStore>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillPayerDetailsComponent],
      providers: [provideRouter([]), FinesMciStore, { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
    store = TestBed.inject(FinesMciStore);
    router = TestBed.inject(Router);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciCreateTillPayerDetailsComponent);
  });

  it('shows the selected business unit and restores saved payer details', () => {
    store.setSuspensePayerDetails(PAYER);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name);
    expect(element.querySelector('h1')?.textContent).toContain('Payer details');
    expect((element.querySelector('#lastName') as HTMLInputElement).value).toBe('Smith');
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
  });

  it('protects entered payer details when leaving the route or browser tab', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(true);
    expect(component.handleBeforeUnload()).toBe(true);

    component.handleUnsavedChanges(true);
    expect(component['canDeactivate']()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });
    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);

    store.setSuspensePayerDetails(PAYER);
    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(false);
  });

  it('stores valid details and navigates to check suspense payment', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.handleSubmit({ formData: PAYER, nestedFlow: false });
    expect(store.suspensePayerDetails()).toEqual(PAYER);
    expect(navigate).toHaveBeenCalledWith(['check-suspense-payment'], { relativeTo: null });
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(false);
  });

  it.each([
    ['handleBack', 'suspense-details', false],
    ['handleCancel', 'details', true],
  ] as const)('%s retains only the appropriate payment draft after navigation', async (action, target, cancel) => {
    store.setSuspensePayment(PAYMENT);
    store.setSuspensePayerDetails(PAYER);
    store.setDraftJourney('suspense');
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance[action]();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', target]);
    expect(store.suspensePayment()).toEqual(cancel ? null : PAYMENT);
    expect(store.suspensePayerDetails()).toBeNull();
    expect(store.draftJourney()).toBe(cancel ? null : 'suspense');
  });

  it('uses the Back link to return to Suspense Details', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('opal-lib-govuk-back-link')).triggerEventHandler('clickEvent');
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'suspense-details']);
  });

  it('keeps payer and suspense details when Back navigation is cancelled', async () => {
    store.setSuspensePayment(PAYMENT);
    store.setSuspensePayerDetails(PAYER);
    vi.spyOn(router, 'navigate').mockResolvedValue(false);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('opal-lib-govuk-back-link')).triggerEventHandler('clickEvent');
    await fixture.whenStable();

    expect(store.suspensePayment()).toEqual(PAYMENT);
    expect(store.suspensePayerDetails()).toEqual(PAYER);
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
  });

  it('restores all entered data when the leave confirmation is cancelled', async () => {
    store.setSuspensePayment(PAYMENT);
    store.setSuspensePayerDetails(PAYER);
    store.setDraftJourney('suspense');
    vi.spyOn(router, 'navigate').mockResolvedValue(false);
    fixture.detectChanges();
    fixture.componentInstance.handleCancel();
    await fixture.whenStable();
    expect(store.suspensePayment()).toEqual(PAYMENT);
    expect(store.suspensePayerDetails()).toEqual(PAYER);
    expect(store.draftJourney()).toBe('suspense');
    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
  });
});

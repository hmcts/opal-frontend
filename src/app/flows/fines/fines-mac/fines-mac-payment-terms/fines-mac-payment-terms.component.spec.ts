import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPaymentTermsComponent } from './fines-mac-payment-terms.component';
import { IFinesMacPaymentTermsForm } from './interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from './mocks/fines-mac-payment-terms-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';

describe('FinesMacPaymentTermsComponent', () => {
  let component: FinesMacPaymentTermsComponent;
  let fixture: ComponentFixture<FinesMacPaymentTermsComponent>;
  let formSubmit: IFinesMacPaymentTermsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacPaymentTermsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacPaymentTermsComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handlePaymentTermsSubmit(formSubmit);

    expect(finesMacStore.paymentTerms()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handlePaymentTermsSubmit(formSubmit);

    expect(finesMacStore.paymentTerms()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route with number data', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;
    formSubmit.formData.fm_payment_terms_default_days_in_jail = 1;
    formSubmit.formData.fm_payment_terms_lump_sum_amount = 1;
    formSubmit.formData.fm_payment_terms_instalment_amount = 1;

    component.handlePaymentTermsSubmit(formSubmit);

    expect(finesMacStore.paymentTerms()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route with number data', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;
    formSubmit.formData.fm_payment_terms_default_days_in_jail = null;
    formSubmit.formData.fm_payment_terms_lump_sum_amount = null;
    formSubmit.formData.fm_payment_terms_instalment_amount = null;

    component.handlePaymentTermsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.paymentTerms).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});

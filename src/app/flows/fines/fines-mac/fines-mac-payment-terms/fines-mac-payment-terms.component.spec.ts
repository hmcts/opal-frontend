import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacPaymentTermsComponent } from './fines-mac-payment-terms.component';
import { FinesService } from '@services/fines';
import { IFinesMacPaymentTermsForm, IFinesMacPaymentTermsState } from './interfaces';
import { FINES_MAC_STATE_MOCK } from '../mocks';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK, FINES_MAC_PAYMENT_TERMS_STATE_MOCK } from './mocks';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';

describe('FinesMacPaymentTermsComponent', () => {
  let component: FinesMacPaymentTermsComponent;
  let fixture: ComponentFixture<FinesMacPaymentTermsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacPaymentTermsForm;
  let formData: IFinesMacPaymentTermsState;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_PAYMENT_TERMS_FORM_MOCK;
    formData = FINES_MAC_PAYMENT_TERMS_STATE_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacPaymentTermsComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handlePaymentTermsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.paymentTerms).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handlePaymentTermsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.paymentTerms).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form.component';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../../constants/fines-mac-offence-details-draft-state.constant';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../mocks/fines-mac-offence-details-minor-creditor-form.mock';

describe('FinesMacOffenceDetailsMinorCreditorFormComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorFormComponent>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = { ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE };

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorFormComponent],
      providers: [
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsMinorCreditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Ensure that the ngUnsubscribe subject is completed after each test
    component['ngUnsubscribe'].next();
    component['ngUnsubscribe'].complete();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set individual validators for forenames and surname controls', () => {
    const forenamesControl = component.form.controls['fm_offence_details_minor_creditor_forenames'];
    const surnameControl = component.form.controls['fm_offence_details_minor_creditor_surname'];

    // Call the method to set validators
    component['setIndividualValidators']();
    fixture.detectChanges();

    // Test max length validator on forenames
    forenamesControl.setValue('A very long name exceeding twenty characters');
    expect(forenamesControl.errors?.['maxlength']).toBeTruthy();

    // Test alphabetical text validator on forenames
    forenamesControl.setValue('/$£');
    expect(forenamesControl.errors?.['alphabeticalTextPattern']).toBeTruthy();

    // Test required validator on surname
    surnameControl.setValue('');
    expect(surnameControl.errors?.['required']).toBeTruthy();

    // Test max length validator on surname
    surnameControl.setValue('A very long surname exceeding thirty characters');
    expect(surnameControl.errors?.['maxlength']).toBeTruthy();

    // Test alphabetical text validator on surname
    surnameControl.setValue('/$£');
    expect(surnameControl.errors?.['alphabeticalTextPattern']).toBeTruthy();
  });

  it('should set validators for company name control', () => {
    const companyNameControl = component.form.controls['fm_offence_details_minor_creditor_company_name'];

    // Call the method to set validators
    component['setCompanyValidators']();
    fixture.detectChanges();

    // Test required validator on company name
    companyNameControl.setValue('');
    expect(companyNameControl.errors?.['required']).toBeTruthy();

    // Test max length validator on company name
    companyNameControl.setValue('A very long company name exceeding fifty characters');
    expect(companyNameControl.errors?.['maxlength']).toBeTruthy();

    // Test alphabetical text validator on company name
    companyNameControl.setValue('/$£');
    expect(companyNameControl.errors?.['alphabeticalTextPattern']).toBeTruthy();
  });

  it('should set validators for payment detail controls', () => {
    const nameOnAccountControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_name'];
    const sortCodeControl = component.form.controls['fm_offence_details_minor_creditor_bank_sort_code'];
    const accountNumberControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_number'];
    const paymentReferenceControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_ref'];

    // Call the method to set validators
    component['setPaymentDetailValidators']();
    fixture.detectChanges();

    // Test validators for name on account
    nameOnAccountControl.setValue('1234567890123456789'); // Exceeds 18 characters
    expect(nameOnAccountControl.errors?.['maxlength']).toBeTruthy();

    nameOnAccountControl.setValue('Invalid@Name'); // Invalid characters
    expect(nameOnAccountControl.errors?.['alphabeticalTextPattern']).toBeTruthy();

    nameOnAccountControl.setValue('Valid Name'); // Valid input
    expect(nameOnAccountControl.valid).toBeTruthy();

    // Test validators for sort code
    sortCodeControl.setValue('1234567'); // Exceeds 6 characters
    expect(sortCodeControl.errors?.['maxlength']).toBeTruthy();

    sortCodeControl.setValue('ABC123'); // Non-numeric input
    expect(sortCodeControl.errors?.['numericalTextPattern']).toBeTruthy();

    sortCodeControl.setValue('123456'); // Valid input
    expect(sortCodeControl.valid).toBeTruthy();

    // Test validators for account number
    accountNumberControl.setValue('123456789'); // Exceeds 8 characters
    expect(accountNumberControl.errors?.['maxlength']).toBeTruthy();

    accountNumberControl.setValue('ABC12345'); // Non-numeric input
    expect(accountNumberControl.errors?.['numericalTextPattern']).toBeTruthy();

    accountNumberControl.setValue('12345678'); // Valid input
    expect(accountNumberControl.valid).toBeTruthy();

    // Test validators for payment reference
    paymentReferenceControl.setValue('1234567890123456789'); // Exceeds 18 characters
    expect(paymentReferenceControl.errors?.['maxlength']).toBeTruthy();

    paymentReferenceControl.setValue('Invalid@Reference'); // Invalid characters
    expect(paymentReferenceControl.errors?.['alphabeticalTextPattern']).toBeTruthy();

    paymentReferenceControl.setValue('Valid Reference'); // Valid input
    expect(paymentReferenceControl.valid).toBeTruthy();
  });

  it('should reset and clear validators for name-related controls', () => {
    const titleControl = component.form.controls['fm_offence_details_minor_creditor_title'];
    const forenamesControl = component.form.controls['fm_offence_details_minor_creditor_forenames'];
    const surnameControl = component.form.controls['fm_offence_details_minor_creditor_surname'];
    const companyNameControl = component.form.controls['fm_offence_details_minor_creditor_company_name'];

    // Call the method to reset and clear validators
    component['resetNameValidators']();
    fixture.detectChanges();

    // Check if the controls are reset (the value should be null after reset)
    expect(titleControl.value).toBeNull();
    expect(forenamesControl.value).toBeNull();
    expect(surnameControl.value).toBeNull();
    expect(companyNameControl.value).toBeNull();

    // Check if validators are cleared
    forenamesControl.setValue(''); // Empty string to trigger required validation
    expect(forenamesControl.errors).toBeNull(); // Should not have required error after clearValidators

    surnameControl.setValue(''); // Empty string to trigger required validation
    expect(surnameControl.errors).toBeNull(); // Should not have required error after clearValidators

    companyNameControl.setValue(''); // Empty string to trigger required validation
    expect(companyNameControl.errors).toBeNull(); // Should not have required error after clearValidators
  });

  it('should reset and clear validators for payment detail controls', () => {
    const nameOnAccountControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_name'];
    const sortCodeControl = component.form.controls['fm_offence_details_minor_creditor_bank_sort_code'];
    const accountNumberControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_number'];
    const paymentReferenceControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_ref'];

    // Call the method to reset and clear validators
    component['resetPaymentDetailValidators']();
    fixture.detectChanges();

    // Check if the controls are reset (the value should be null after reset)
    expect(nameOnAccountControl.value).toBeNull();
    expect(sortCodeControl.value).toBeNull();
    expect(accountNumberControl.value).toBeNull();
    expect(paymentReferenceControl.value).toBeNull();

    // Check if validators are cleared
    nameOnAccountControl.setValue(''); // Empty string to trigger required validation
    expect(nameOnAccountControl.errors).toBeNull(); // Should not have required error after clearValidators

    sortCodeControl.setValue(''); // Empty string to trigger required validation
    expect(sortCodeControl.errors).toBeNull(); // Should not have required error after clearValidators

    accountNumberControl.setValue(''); // Empty string to trigger required validation
    expect(accountNumberControl.errors).toBeNull(); // Should not have required error after clearValidators

    paymentReferenceControl.setValue(''); // Empty string to trigger required validation
    expect(paymentReferenceControl.errors).toBeNull(); // Should not have required error after clearValidators
  });

  it('should reset and set validators based on hasPaymentDetails true value', () => {
    const hasPaymentDetailsControl = component.form.controls['fm_offence_details_minor_creditor_pay_by_bacs'];
    const nameOnAccountControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_name'];
    const sortCodeControl = component.form.controls['fm_offence_details_minor_creditor_bank_sort_code'];
    const accountNumberControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_number'];
    const paymentReferenceControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_ref'];

    // Spy on resetPaymentDetailValidators and setPaymentDetailValidators methods

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetPaymentDetailValidatorsSpy = spyOn<any>(component, 'resetPaymentDetailValidators').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setPaymentDetailValidatorsSpy = spyOn<any>(component, 'setPaymentDetailValidators').and.callThrough();

    // Spy on updateValueAndValidity for the payment detail controls
    const nameOnAccountUpdateSpy = spyOn(nameOnAccountControl, 'updateValueAndValidity').and.callThrough();
    const sortCodeUpdateSpy = spyOn(sortCodeControl, 'updateValueAndValidity').and.callThrough();
    const accountNumberUpdateSpy = spyOn(accountNumberControl, 'updateValueAndValidity').and.callThrough();
    const paymentReferenceUpdateSpy = spyOn(paymentReferenceControl, 'updateValueAndValidity').and.callThrough();

    // Call the listener method
    component['hasPaymentDetailsListener']();
    fixture.detectChanges();

    // Simulate value change in hasPaymentDetails to true (payment details provided)
    hasPaymentDetailsControl.setValue(true);

    // Check that resetPaymentDetailValidators was called
    expect(resetPaymentDetailValidatorsSpy).toHaveBeenCalled();

    // Check that setPaymentDetailValidators was called when hasPaymentDetails is true
    expect(setPaymentDetailValidatorsSpy).toHaveBeenCalled();

    // Check that updateValueAndValidity was called for all payment detail controls
    expect(nameOnAccountUpdateSpy).toHaveBeenCalled();
    expect(sortCodeUpdateSpy).toHaveBeenCalled();
    expect(accountNumberUpdateSpy).toHaveBeenCalled();
    expect(paymentReferenceUpdateSpy).toHaveBeenCalled();
  });

  it('should reset and set validators based on hasPaymentDetails false value', () => {
    const hasPaymentDetailsControl = component.form.controls['fm_offence_details_minor_creditor_pay_by_bacs'];
    const nameOnAccountControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_name'];
    const sortCodeControl = component.form.controls['fm_offence_details_minor_creditor_bank_sort_code'];
    const accountNumberControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_number'];
    const paymentReferenceControl = component.form.controls['fm_offence_details_minor_creditor_bank_account_ref'];

    // Spy on resetPaymentDetailValidators and setPaymentDetailValidators methods
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetPaymentDetailValidatorsSpy = spyOn<any>(component, 'resetPaymentDetailValidators').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setPaymentDetailValidatorsSpy = spyOn<any>(component, 'setPaymentDetailValidators').and.callThrough();

    // Spy on updateValueAndValidity for the payment detail controls
    const nameOnAccountUpdateSpy = spyOn(nameOnAccountControl, 'updateValueAndValidity').and.callThrough();
    const sortCodeUpdateSpy = spyOn(sortCodeControl, 'updateValueAndValidity').and.callThrough();
    const accountNumberUpdateSpy = spyOn(accountNumberControl, 'updateValueAndValidity').and.callThrough();
    const paymentReferenceUpdateSpy = spyOn(paymentReferenceControl, 'updateValueAndValidity').and.callThrough();

    // Call the listener method
    component['hasPaymentDetailsListener']();
    fixture.detectChanges();

    // Simulate value change in hasPaymentDetails to true (payment details provided)
    hasPaymentDetailsControl.setValue(false);

    // Check that resetPaymentDetailValidators was called
    expect(resetPaymentDetailValidatorsSpy).toHaveBeenCalled();

    // Check that setPaymentDetailValidators was called when hasPaymentDetails is true
    expect(setPaymentDetailValidatorsSpy).not.toHaveBeenCalled();

    // Check that updateValueAndValidity was called for all payment detail controls
    expect(nameOnAccountUpdateSpy).toHaveBeenCalled();
    expect(sortCodeUpdateSpy).toHaveBeenCalled();
    expect(accountNumberUpdateSpy).toHaveBeenCalled();
    expect(paymentReferenceUpdateSpy).toHaveBeenCalled();
  });

  it('should reset and set individual validators when creditorType is individual', () => {
    const creditorTypeControl = component.form.controls['fm_offence_details_minor_creditor_creditor_type'];
    const companyNameControl = component.form.controls['fm_offence_details_minor_creditor_company_name'];
    const forenamesControl = component.form.controls['fm_offence_details_minor_creditor_forenames'];
    const surnameControl = component.form.controls['fm_offence_details_minor_creditor_surname'];

    // Spy on resetNameValidators and setIndividualValidators methods
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetNameValidatorsSpy = spyOn<any>(component, 'resetNameValidators').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setIndividualValidatorsSpy = spyOn<any>(component, 'setIndividualValidators').and.callThrough();

    // Spy on updateValueAndValidity for form controls
    const companyNameUpdateSpy = spyOn(companyNameControl, 'updateValueAndValidity').and.callThrough();
    const forenamesUpdateSpy = spyOn(forenamesControl, 'updateValueAndValidity').and.callThrough();
    const surnameUpdateSpy = spyOn(surnameControl, 'updateValueAndValidity').and.callThrough();

    // Call the listener method
    component['creditorTypeListener']();
    fixture.detectChanges();

    // Simulate value change in creditorType to 'individual'
    creditorTypeControl.setValue('individual');

    // Check that resetNameValidators was called
    expect(resetNameValidatorsSpy).toHaveBeenCalled();

    // Check that setIndividualValidators was called
    expect(setIndividualValidatorsSpy).toHaveBeenCalled();

    // Check that updateValueAndValidity was called for the form controls
    expect(companyNameUpdateSpy).toHaveBeenCalled();
    expect(forenamesUpdateSpy).toHaveBeenCalled();
    expect(surnameUpdateSpy).toHaveBeenCalled();
  });

  it('should reset and set company validators when creditorType is company', () => {
    const creditorTypeControl = component.form.controls['fm_offence_details_minor_creditor_creditor_type'];
    const companyNameControl = component.form.controls['fm_offence_details_minor_creditor_company_name'];
    const forenamesControl = component.form.controls['fm_offence_details_minor_creditor_forenames'];
    const surnameControl = component.form.controls['fm_offence_details_minor_creditor_surname'];

    // Spy on resetNameValidators and setCompanyValidators methods
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetNameValidatorsSpy = spyOn<any>(component, 'resetNameValidators').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setCompanyValidatorsSpy = spyOn<any>(component, 'setCompanyValidators').and.callThrough();

    // Spy on updateValueAndValidity for form controls
    const companyNameUpdateSpy = spyOn(companyNameControl, 'updateValueAndValidity').and.callThrough();
    const forenamesUpdateSpy = spyOn(forenamesControl, 'updateValueAndValidity').and.callThrough();
    const surnameUpdateSpy = spyOn(surnameControl, 'updateValueAndValidity').and.callThrough();

    // Call the listener method
    component['creditorTypeListener']();
    fixture.detectChanges();

    // Simulate value change in creditorType to 'company'
    creditorTypeControl.setValue('company');

    // Check that resetNameValidators was called
    expect(resetNameValidatorsSpy).toHaveBeenCalled();

    // Check that setCompanyValidators was called
    expect(setCompanyValidatorsSpy).toHaveBeenCalled();

    // Check that updateValueAndValidity was called for the form controls
    expect(companyNameUpdateSpy).toHaveBeenCalled();
    expect(forenamesUpdateSpy).toHaveBeenCalled();
    expect(surnameUpdateSpy).toHaveBeenCalled();
  });

  it('should handle editing a minor creditor', () => {
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData = [
      FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK,
    ];
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupMinorCreditorForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'creditorTypeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'hasPaymentDetailsListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');

    component['initialMinorCreditorSetup']();

    expect(component['setupMinorCreditorForm']).toHaveBeenCalled();
    expect(component['creditorTypeListener']).toHaveBeenCalled();
    expect(component['hasPaymentDetailsListener']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(
      FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData,
    );
  });
});

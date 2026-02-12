import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsMinorCreditorFormComponent } from './fines-mac-offence-details-minor-creditor-form.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FinesMacOffenceDetailsStoreType } from '../../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../../stores/fines-mac-offence-details.store';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacOffenceDetailsMinorCreditorFormComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorFormComponent>;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;
  let originalInitOuterRadios: () => void;

  beforeAll(() => {
    originalInitOuterRadios = GovukRadioComponent.prototype['initOuterRadios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(GovukRadioComponent.prototype, 'initOuterRadios').mockImplementation(() => {});
  });

  afterAll(() => {
    GovukRadioComponent.prototype['initOuterRadios'] = originalInitOuterRadios;
  });

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorFormComponent],
      providers: [
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

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);

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

  it('should set individual validators for title, forenames and surname controls', () => {
    component.form.get('fm_offence_details_minor_creditor_creditor_type')?.setValue('individual');
    fixture.detectChanges();

    const titleControl = component.form.controls['fm_offence_details_minor_creditor_title'];
    const forenamesControl = component.form.controls['fm_offence_details_minor_creditor_forenames'];
    const surnameControl = component.form.controls['fm_offence_details_minor_creditor_surname'];

    // Call the method to set validators
    component['setIndividualValidators']();
    fixture.detectChanges();

    // Test required validator on forenames
    titleControl.setValue('');
    expect(titleControl.errors?.['required']).toBeTruthy();

    // Test required validator on forenames
    forenamesControl.setValue('');
    expect(forenamesControl.errors?.['required']).toBeTruthy();

    // Test max length validator on forenames
    forenamesControl.setValue('A very long name exceeding twenty characters');
    expect(forenamesControl.errors?.['maxlength']).toBeTruthy();

    // Test pattern invalid validator on forenames
    forenamesControl.setValue('/$£');
    expect(forenamesControl.errors?.['lettersWithSpacesPattern']).toBeTruthy();

    // Test required validator on surname
    surnameControl.setValue('');
    expect(surnameControl.errors?.['required']).toBeTruthy();

    // Test max length validator on surname
    surnameControl.setValue('A very long surname exceeding thirty characters');
    expect(surnameControl.errors?.['maxlength']).toBeTruthy();

    // Test pattern invalid validator on surname
    surnameControl.setValue('/$£');
    expect(surnameControl.errors?.['lettersWithSpacesPattern']).toBeTruthy();
  });

  it('should set validators for company name control', () => {
    component.form.get('fm_offence_details_minor_creditor_creditor_type')?.setValue('company');
    fixture.detectChanges();

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

    // Test alphanumeric text pattern validator on company name
    companyNameControl.setValue('/$£');
    expect(companyNameControl.errors?.['alphanumericWithHyphensSpacesApostrophesDotPattern']).toBeTruthy();
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
    expect(nameOnAccountControl.errors?.['lettersWithSpacesPattern']).toBeTruthy();

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
    expect(paymentReferenceControl.errors?.['alphanumericTextPattern']).toBeTruthy();

    paymentReferenceControl.setValue('Valid Reference'); // Valid input
    expect(paymentReferenceControl.valid).toBeTruthy();
  });

  it('should reset and clear validators for name-related controls', () => {
    component.form.get('fm_offence_details_minor_creditor_creditor_type')?.setValue('individual');
    fixture.detectChanges();

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

  it('should skip missing controls when toggling enabled state', () => {
    const titleControl = component.form.controls['fm_offence_details_minor_creditor_title'];
    titleControl.disable({ emitEvent: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).setControlsEnabled(['missing_control', 'fm_offence_details_minor_creditor_title'], true);

    expect(titleControl.enabled).toBe(true);
  });

  it('should toggle conditional panels and enable the correct controls', async () => {
    await fixture.whenStable();
    const individualConditional = fixture.nativeElement.querySelector(`#${component.individualConditionalId}`);
    const companyConditional = fixture.nativeElement.querySelector(`#${component.companyConditionalId}`);

    expect(individualConditional.classList.contains('govuk-radios__conditional--hidden')).toBe(true);
    expect(companyConditional.classList.contains('govuk-radios__conditional--hidden')).toBe(true);

    const individualInput = fixture.nativeElement.querySelector('input[value="individual"]');
    individualInput.click();
    fixture.detectChanges();

    expect(component.form.get('fm_offence_details_minor_creditor_title')?.enabled).toBe(true);
    expect(component.form.get('fm_offence_details_minor_creditor_company_name')?.disabled).toBe(true);

    const companyInput = fixture.nativeElement.querySelector('input[value="company"]');
    companyInput.click();
    fixture.detectChanges();

    expect(component.form.get('fm_offence_details_minor_creditor_company_name')?.enabled).toBe(true);
    expect(component.form.get('fm_offence_details_minor_creditor_title')?.disabled).toBe(true);
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
    const resetPaymentDetailValidatorsSpy = vi.spyOn<any, any>(component, 'resetPaymentDetailValidators');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setPaymentDetailValidatorsSpy = vi.spyOn<any, any>(component, 'setPaymentDetailValidators');

    // Spy on updateValueAndValidity for the payment detail controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nameOnAccountUpdateSpy = vi.spyOn<any, any>(nameOnAccountControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortCodeUpdateSpy = vi.spyOn<any, any>(sortCodeControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accountNumberUpdateSpy = vi.spyOn<any, any>(accountNumberControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentReferenceUpdateSpy = vi.spyOn<any, any>(paymentReferenceControl, 'updateValueAndValidity');

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
    const resetPaymentDetailValidatorsSpy = vi.spyOn<any, any>(component, 'resetPaymentDetailValidators');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setPaymentDetailValidatorsSpy = vi.spyOn<any, any>(component, 'setPaymentDetailValidators');

    // Spy on updateValueAndValidity for the payment detail controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nameOnAccountUpdateSpy = vi.spyOn<any, any>(nameOnAccountControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortCodeUpdateSpy = vi.spyOn<any, any>(sortCodeControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accountNumberUpdateSpy = vi.spyOn<any, any>(accountNumberControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentReferenceUpdateSpy = vi.spyOn<any, any>(paymentReferenceControl, 'updateValueAndValidity');

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
    const titleControl = component.form.controls['fm_offence_details_minor_creditor_title'];
    const forenamesControl = component.form.controls['fm_offence_details_minor_creditor_forenames'];
    const surnameControl = component.form.controls['fm_offence_details_minor_creditor_surname'];

    // Spy on resetNameValidators and setIndividualValidators methods
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetNameValidatorsSpy = vi.spyOn<any, any>(component, 'resetNameValidators');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setIndividualValidatorsSpy = vi.spyOn<any, any>(component, 'setIndividualValidators');

    // Spy on updateValueAndValidity for form controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const companyNameUpdateSpy = vi.spyOn<any, any>(companyNameControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titleUpdateSpy = vi.spyOn<any, any>(titleControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const forenamesUpdateSpy = vi.spyOn<any, any>(forenamesControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const surnameUpdateSpy = vi.spyOn<any, any>(surnameControl, 'updateValueAndValidity');

    // Call the listener method
    component['creditorTypeListener']();
    fixture.detectChanges();

    // Simulate value change in creditorType to 'individual'
    creditorTypeControl.markAsDirty();
    creditorTypeControl.setValue('individual');

    // Check that resetNameValidators was called
    expect(resetNameValidatorsSpy).toHaveBeenCalled();

    // Check that setIndividualValidators was called
    expect(setIndividualValidatorsSpy).toHaveBeenCalled();

    // Check that updateValueAndValidity was called for the form controls
    expect(companyNameUpdateSpy).toHaveBeenCalled();
    expect(titleUpdateSpy).toHaveBeenCalled();
    expect(forenamesUpdateSpy).toHaveBeenCalled();
    expect(surnameUpdateSpy).toHaveBeenCalled();
  });

  it('should reset and set company validators when creditorType is company', () => {
    const creditorTypeControl = component.form.controls['fm_offence_details_minor_creditor_creditor_type'];
    const companyNameControl = component.form.controls['fm_offence_details_minor_creditor_company_name'];
    const titleControl = component.form.controls['fm_offence_details_minor_creditor_title'];
    const forenamesControl = component.form.controls['fm_offence_details_minor_creditor_forenames'];
    const surnameControl = component.form.controls['fm_offence_details_minor_creditor_surname'];

    // Spy on resetNameValidators and setCompanyValidators methods
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resetNameValidatorsSpy = vi.spyOn<any, any>(component, 'resetNameValidators');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setCompanyValidatorsSpy = vi.spyOn<any, any>(component, 'setCompanyValidators');

    // Spy on updateValueAndValidity for form controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const companyNameUpdateSpy = vi.spyOn<any, any>(companyNameControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titleUpdateSpy = vi.spyOn<any, any>(titleControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const forenamesUpdateSpy = vi.spyOn<any, any>(forenamesControl, 'updateValueAndValidity');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const surnameUpdateSpy = vi.spyOn<any, any>(surnameControl, 'updateValueAndValidity');

    // Call the listener method
    component['creditorTypeListener']();
    fixture.detectChanges();

    // Simulate value change in creditorType to 'company'
    creditorTypeControl.markAsDirty();
    creditorTypeControl.setValue('company');

    // Check that resetNameValidators was called
    expect(resetNameValidatorsSpy).toHaveBeenCalled();

    // Check that setCompanyValidators was called
    expect(setCompanyValidatorsSpy).toHaveBeenCalled();

    // Check that updateValueAndValidity was called for the form controls
    expect(companyNameUpdateSpy).toHaveBeenCalled();
    expect(titleUpdateSpy).toHaveBeenCalled();
    expect(forenamesUpdateSpy).toHaveBeenCalled();
    expect(surnameUpdateSpy).toHaveBeenCalled();
  });

  it('should handle editing a minor creditor', () => {
    const offenceWithMinorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    offenceWithMinorCreditor[0].childFormData = [FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(offenceWithMinorCreditor);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupMinorCreditorForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'creditorTypeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'hasPaymentDetailsListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');

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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillPayerDetailsFormComponent } from './fines-mci-create-till-payer-details-form.component';

describe('FinesMciCreateTillPayerDetailsFormComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillPayerDetailsFormComponent>;
  let component: FinesMciCreateTillPayerDetailsFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillPayerDetailsFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesMciCreateTillPayerDetailsFormComponent);
    component = fixture.componentInstance;
  });

  function submit(): void {
    component.handleFormSubmit(new SubmitEvent('submit'));
    fixture.detectChanges();
  }

  it('requires a payer type', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('#firstNames')).toBeNull();
    expect(element.querySelector('#companyName')).toBeNull();
    submit();
    expect(element.textContent).toContain('Select payer type');
  });

  it('only displays the fields for the selected payer type', () => {
    component.initialValue = {
      payerType: 'individual',
      title: null,
      firstNames: '',
      lastName: '',
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    };
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('input[value="individual"]')?.getAttribute('aria-controls')).toBe(
      'individual-payer-conditional',
    );
    expect(element.querySelector('input[value="company"]')?.getAttribute('aria-controls')).toBe(
      'company-payer-conditional',
    );
    expect(element.querySelector('#individual-payer-conditional #firstNames-hint')?.textContent).toContain(
      'Include their middle names',
    );
    expect(element.querySelector('#individual-payer-conditional #lastName')).not.toBeNull();
    expect(element.querySelector('#company-payer-conditional #companyName')).toBeNull();

    element.querySelector<HTMLInputElement>('input[value="company"]')?.click();
    fixture.detectChanges();
    expect(element.querySelector('#company-payer-conditional #companyName')).not.toBeNull();
    expect(element.querySelector('#individual-payer-conditional #lastName')).toBeNull();
  });

  it('keeps the address fields optional', () => {
    fixture.detectChanges();
    component.form.patchValue({ payerType: 'individual', lastName: 'Smith' });
    expect(component.form.valid).toBe(true);
  });

  it.each([
    ['individual', 'lastName', 'Enter last name'],
    ['company', 'companyName', 'Enter company name'],
  ])('requires %s payer name', (type, field, message) => {
    fixture.detectChanges();
    component.form.controls['payerType'].setValue(type);
    submit();
    expect(component.form.controls[field].hasError('required')).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(message);
  });

  it.each([
    ['firstNames', '20', 'First names'],
    ['lastName', '30', 'Last name'],
    ['companyName', '50', 'Company name'],
    ['addressLine1', '30', 'Address line 1'],
    ['addressLine2', '30', 'Address line 2'],
    ['addressLine3', '30', 'Address line 3'],
    ['postcode', '8', 'Post code'],
  ])('rejects overlong %s', (field, length, label) => {
    fixture.detectChanges();
    component.form.controls['payerType'].setValue(field === 'companyName' ? 'company' : 'individual');
    component.form.controls[field].setValue('a'.repeat(Number(length) + 1));
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      `${label} must be ${length} characters or fewer`,
    );
  });

  it('validates names, company, address and post code characters', () => {
    fixture.detectChanges();
    component.form.controls['payerType'].setValue('individual');
    component.form.controls['firstNames'].setValue('A1');
    component.form.controls['lastName'].setValue('Smith!');
    component.form.controls['addressLine1'].setValue('Street!');
    component.form.controls['postcode'].setValue('SW! 1AA');
    submit();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('First names must only include letters a to z');
    expect(text).toContain('Last name must only include letters a to z');
    expect(text).toContain('Address line 1 must only include letters a to z');
    expect(text).toContain('Post code must only include letters a to z, numbers and spaces');

    component.form.controls['payerType'].setValue('company');
    component.form.controls['companyName'].setValue('Company!');
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Company name must only include letters a to z',
    );
  });

  it('accepts an optional alphanumeric post code using the shared postcode rules', () => {
    fixture.detectChanges();
    component.form.patchValue({ payerType: 'individual', lastName: 'Smith', postcode: 'ABC 123' });

    expect(component.form.controls['postcode'].valid).toBe(true);
    expect(component.form.valid).toBe(true);

    component.form.controls['postcode'].setValue('');
    expect(component.form.controls['postcode'].valid).toBe(true);
  });

  it.each([
    ['individual', 'lastName', 'Enter last name'],
    ['company', 'companyName', 'Enter company name'],
  ])('rejects a whitespace-only %s name', (payerType, field, message) => {
    fixture.detectChanges();
    component.form.controls['payerType'].setValue(payerType);
    component.form.controls[field].setValue('   ');

    submit();

    expect(component.form.controls[field].hasError('required')).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(message);
  });

  it.each([
    ['individual', 'lastName', 'Enter last name'],
    ['company', 'companyName', 'Enter company name'],
  ])('rejects a null %s name', (payerType, field, message) => {
    fixture.detectChanges();
    component.form.controls['payerType'].setValue(payerType);
    component.form.controls[field].setValue(null);

    submit();

    expect(component.form.controls[field].hasError('required')).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(message);
  });

  it.each([
    ['individual', 'lastName'],
    ['company', 'companyName'],
  ])('trims the %s name on focusout and before submission', (payerType, field) => {
    fixture.detectChanges();
    component.form.controls['payerType'].setValue(payerType);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const control = component.form.controls[field];
    control.setValue('  Example Name  ');
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLInputElement>(`#${field}`)
      ?.dispatchEvent(new Event('focusout', { bubbles: true }));
    expect(control.value).toBe('Example Name');

    const emit = vi.spyOn(component['formSubmit'], 'emit');
    control.setValue('  Another Name  ');
    submit();
    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({ formData: expect.objectContaining({ [field]: 'Another Name' }) }),
    );
  });

  it('removes the last-name error when switching to company', () => {
    component.initialValue = {
      payerType: 'individual',
      title: null,
      firstNames: '',
      lastName: '',
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    };
    fixture.detectChanges();
    submit();
    expect(component.formErrorSummaryMessage.some((error) => error.fieldId === 'lastName')).toBe(true);

    component.form.controls['payerType'].setValue('company');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(component.formControlErrorMessages['lastName']).toBeUndefined();
    expect(component.formErrorSummaryMessage.some((error) => error.fieldId === 'lastName')).toBe(false);
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Enter last name');
  });

  it('removes first-name validation errors when switching to company', () => {
    component.initialValue = {
      payerType: 'individual',
      title: null,
      firstNames: '',
      lastName: '',
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    };
    fixture.detectChanges();
    component.form.controls['firstNames'].setValue('A1');
    component.form.controls['lastName'].setValue('Smith');
    submit();
    expect(component.formControlErrorMessages['firstNames']).toBeDefined();
    expect(component.formErrorSummaryMessage.some((error) => error.fieldId === 'firstNames')).toBe(true);

    component.form.controls['companyName'].setValue('Example Ltd');
    component.form.controls['payerType'].setValue('company');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(component.form.controls['firstNames'].errors).toBeNull();
    expect(component.formControlErrorMessages['firstNames']).toBeUndefined();
    expect(component.formErrorSummaryMessage.some((error) => error.fieldId === 'firstNames')).toBe(false);
    expect(element.querySelector('#firstNames')).toBeNull();
    expect(element.querySelector('.govuk-error-summary a[href="#firstNames"]')).toBeNull();
    expect(element.textContent).not.toContain('First names must only include letters a to z');
  });

  it('emits valid individual details and clears fields for the other payer type', () => {
    fixture.detectChanges();
    const emit = vi.spyOn(component['formSubmit'], 'emit');
    component.form.patchValue({
      payerType: 'individual',
      title: 'Ms',
      firstNames: 'Anne',
      lastName: "O'Neil",
      postcode: 'SW1A 1AA',
      companyName: 'Old company',
    });
    submit();
    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({ payerType: 'individual', companyName: '', postcode: 'SW1A 1AA' }),
      }),
    );
  });

  it('retains entered values when validation fails', () => {
    fixture.detectChanges();
    component.form.patchValue({ payerType: 'company', addressLine1: '10 High Street' });
    submit();
    expect(component.form.controls['addressLine1'].value).toBe('10 High Street');
    expect(component['hasUnsavedChanges']()).toBe(true);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { FinesAccMinorCreditorAddAmendConvertFormComponent } from './fines-acc-minor-creditor-add-amend-convert-form.component';
import { IFinesAccMinorCreditorAddAmendConvertForm } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';
import { FinesAccountStore } from '../../stores/fines-acc.store';

describe('FinesAccMinorCreditorAddAmendConvertFormComponent', () => {
  let component: FinesAccMinorCreditorAddAmendConvertFormComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorAddAmendConvertFormComponent>;
  let originalInitOuterRadios: () => void;

  const companyFormData: IFinesAccMinorCreditorAddAmendConvertForm = {
    formData: {
      facc_minor_creditor_creditor_type: 'company',
      facc_minor_creditor_title: null,
      facc_minor_creditor_forenames: null,
      facc_minor_creditor_surname: null,
      facc_minor_creditor_company_name: 'Test Organisation',
      facc_minor_creditor_address_line_1: '123 Main Street',
      facc_minor_creditor_address_line_2: 'Apt 4',
      facc_minor_creditor_address_line_3: null,
      facc_minor_creditor_address_line_4: null,
      facc_minor_creditor_address_line_5: null,
      facc_minor_creditor_post_code: 'AB12 3CD',
      facc_minor_creditor_pay_by_bacs: true,
      facc_minor_creditor_bank_account_name: 'Test Account',
      facc_minor_creditor_bank_sort_code: '123456',
      facc_minor_creditor_bank_account_number: '12345678',
      facc_minor_creditor_bank_account_reference: 'REF-001',
    },
    nestedFlow: false,
  };

  const individualFormData: IFinesAccMinorCreditorAddAmendConvertForm = {
    formData: {
      ...companyFormData.formData,
      facc_minor_creditor_creditor_type: 'individual',
      facc_minor_creditor_title: 'Mr',
      facc_minor_creditor_forenames: 'John',
      facc_minor_creditor_surname: 'SMITH',
      facc_minor_creditor_company_name: null,
      facc_minor_creditor_pay_by_bacs: false,
      facc_minor_creditor_bank_account_name: null,
      facc_minor_creditor_bank_sort_code: null,
      facc_minor_creditor_bank_account_number: null,
      facc_minor_creditor_bank_account_reference: null,
    },
    nestedFlow: false,
  };

  beforeAll(() => {
    originalInitOuterRadios = GovukRadioComponent.prototype['initOuterRadios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(GovukRadioComponent.prototype, 'initOuterRadios').mockImplementation(() => {});
  });

  afterAll(() => {
    GovukRadioComponent.prototype['initOuterRadios'] = originalInitOuterRadios;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorAddAmendConvertFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {},
            snapshot: {},
          },
        },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: UtilsService, useValue: { scrollToTop: vi.fn(), upperCaseAllLetters: (value: string) => value.toUpperCase() } },
        {
          provide: FinesAccountStore,
          useValue: {
            getAccountNumber: vi.fn().mockReturnValue('ACC123'),
            party_name: vi.fn().mockReturnValue('Test Creditor'),
          },
        },
      ],
    }).compileComponents();
  });

  const createComponent = (initialFormData: IFinesAccMinorCreditorAddAmendConvertForm = companyFormData): void => {
    fixture = TestBed.createComponent(FinesAccMinorCreditorAddAmendConvertFormComponent);
    component = fixture.componentInstance;
    component.initialFormData = initialFormData;
    fixture.detectChanges();
  };

  const getControl = (controlName: string) => component.form.get(controlName)!;

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should initialise the form controls from company initial form data', () => {
    createComponent();

    expect(component.form.get(component.controls.creditorType)?.value).toBe('company');
    expect(component.form.get(component.controls.companyName)?.value).toBe('Test Organisation');
    expect(component.form.get(component.controls.addressLine1)?.value).toBe('123 Main Street');
    expect(component.form.get(component.controls.payByBacs)?.value).toBe(true);
    expect(component.form.get(component.controls.bankAccountNumber)?.value).toBe('12345678');
  });

  it('should render the header and BACS controls when BACS details are provided', () => {
    createComponent();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('ACC123 - Test Creditor');
    expect(element.textContent).toContain('Minor creditor details');
    expect(element.textContent).toContain('Company name');
    expect(element.textContent).toContain('Name on account');
  });

  it('should render individual controls and hide BACS controls when BACS details are not provided', () => {
    createComponent(individualFormData);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Title');
    expect(element.textContent).toContain('First names');
    expect(element.textContent).toContain('Last name');
    expect(element.textContent).not.toContain('Name on account');
  });

  it('should initialise company controls as active and individual controls as inactive', () => {
    createComponent();

    expect(getControl(component.controls.companyName).enabled).toBe(true);
    expect(getControl(component.controls.title).disabled).toBe(true);
    expect(getControl(component.controls.forenames).disabled).toBe(true);
    expect(getControl(component.controls.surname).disabled).toBe(true);

    getControl(component.controls.companyName).setValue('');

    expect(getControl(component.controls.companyName).hasError('required')).toBe(true);
  });

  it('should switch to individual controls and clear the company name', () => {
    createComponent();

    getControl(component.controls.creditorType).setValue('individual');
    fixture.detectChanges();

    expect(getControl(component.controls.companyName).value).toBeNull();
    expect(getControl(component.controls.companyName).disabled).toBe(true);
    expect(getControl(component.controls.title).enabled).toBe(true);
    expect(getControl(component.controls.forenames).enabled).toBe(true);
    expect(getControl(component.controls.surname).enabled).toBe(true);
    expect(getControl(component.controls.forenames).hasError('required')).toBe(true);
    expect(getControl(component.controls.surname).hasError('required')).toBe(true);
  });

  it('should clear BACS fields and remove validators when payment details are unticked', () => {
    createComponent();

    getControl(component.controls.payByBacs).setValue(false);
    fixture.detectChanges();

    expect(getControl(component.controls.bankAccountName).value).toBeNull();
    expect(getControl(component.controls.bankSortCode).value).toBeNull();
    expect(getControl(component.controls.bankAccountNumber).value).toBeNull();
    expect(getControl(component.controls.bankAccountReference).value).toBeNull();
    expect(getControl(component.controls.bankAccountName).disabled).toBe(true);

    getControl(component.controls.bankAccountName).setValue('');

    expect(getControl(component.controls.bankAccountName).errors).toBeNull();
  });

  it('should apply BACS required, length and numeric validators when payment details are ticked', () => {
    createComponent(individualFormData);

    getControl(component.controls.payByBacs).setValue(true);
    fixture.detectChanges();

    expect(getControl(component.controls.bankAccountName).enabled).toBe(true);
    expect(getControl(component.controls.bankAccountName).hasError('required')).toBe(true);

    getControl(component.controls.bankSortCode).setValue('12345');
    expect(getControl(component.controls.bankSortCode).hasError('minlength')).toBe(true);

    getControl(component.controls.bankSortCode).setValue('12345A');
    expect(getControl(component.controls.bankSortCode).hasError('numericalTextPattern')).toBe(true);

    getControl(component.controls.bankAccountNumber).setValue('12345');
    expect(getControl(component.controls.bankAccountNumber).hasError('minlength')).toBe(true);

    getControl(component.controls.bankAccountNumber).setValue('123456789');
    expect(getControl(component.controls.bankAccountNumber).hasError('maxlength')).toBe(true);

    getControl(component.controls.bankAccountNumber).setValue('ABC12345');
    expect(getControl(component.controls.bankAccountNumber).hasError('numericalTextPattern')).toBe(true);
  });

  it('should show the add minor creditor details error until the selected type has details', () => {
    createComponent({
      formData: {
        ...individualFormData.formData,
        facc_minor_creditor_title: null,
        facc_minor_creditor_forenames: null,
        facc_minor_creditor_surname: null,
      },
      nestedFlow: false,
    });

    expect(getControl(component.controls.creditorType).hasError('minorCreditorDetailsMissing')).toBe(true);

    getControl(component.controls.forenames).setValue('Ada');

    expect(getControl(component.controls.creditorType).hasError('minorCreditorDetailsMissing')).toBe(false);
  });

  it('should surface validation errors in the form error summary on submit', () => {
    createComponent({
      formData: {
        ...individualFormData.formData,
        facc_minor_creditor_title: null,
        facc_minor_creditor_forenames: null,
        facc_minor_creditor_surname: null,
      },
      nestedFlow: false,
    });

    component.handleFormSubmit({ submitter: null } as SubmitEvent);

    expect(component.formControlErrorMessages[component.controls.creditorType]).toBe('Add minor creditor details');
    expect(component.formErrorSummaryMessage).toContainEqual({
      fieldId: component.controls.creditorType,
      message: 'Add minor creditor details',
    });
  });

  it('should apply optional address validators', () => {
    createComponent();

    getControl(component.controls.addressLine1).setValue('A'.repeat(31));
    expect(getControl(component.controls.addressLine1).hasError('maxlength')).toBe(true);

    getControl(component.controls.postCode).setValue('AB12-3CD');
    expect(getControl(component.controls.postCode).hasError('alphanumericTextPattern')).toBe(true);
  });
});

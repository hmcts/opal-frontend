import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
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
});

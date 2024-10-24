import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent } from './fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list.component';
import { UtilsService } from '@services/utils/utils.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK } from './mocks/fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list-stripped-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_INCOMING_DATA_MOCK } from './mocks/fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list-incoming-data.mock';
import { FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList } from './enums/fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list.enum';

describe('FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'removeIndexFromData',
      'formatSortCode',
      'upperCaseFirstLetter',
    ]);
    mockUtilsService.removeIndexFromData.and.returnValue(
      FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
    );
    mockUtilsService.formatSortCode.and.returnValue('12-34-56');

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent],
      providers: [
        { provide: UtilsService, useValue: mockUtilsService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent);
    component = fixture.componentInstance;

    component.minorCreditor =
      FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_INCOMING_DATA_MOCK;
    component.index = 0;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set name to formatted individual name if creditor_type is individual', () => {
    // Set minorCreditorData with individual type and names
    component.minorCreditorData =
      FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK;

    // Call the method
    component['getName']();

    // Check that name is formatted correctly
    expect(component.name).toBe('Test Tester');
  });

  it('should set name to company name if creditor_type is company', () => {
    // Set minorCreditorData with company type
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_creditor_type: 'company',
      fm_offence_details_minor_creditor_forenames: null,
      fm_offence_details_minor_creditor_surname: null,
      fm_offence_details_minor_creditor_company_name: 'Acme Corp',
    };

    // Call the method
    component['getName']();

    // Check that name is set to company name
    expect(component.name).toBe('Acme Corp');
  });

  it('should handle null or empty forenames and surnames correctly for individual type', () => {
    // Set minorCreditorData with individual type but no forenames or surname
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_creditor_type: 'individual',
      fm_offence_details_minor_creditor_forenames: null,
      fm_offence_details_minor_creditor_surname: null,
      fm_offence_details_minor_creditor_company_name: null,
    };

    // Call the method
    component['getName']();

    // Check that name is an empty string
    expect(component.name).toBe('');
  });

  it('should handle missing company name correctly for company type', () => {
    // Set minorCreditorData with company type but no company name
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_creditor_type: 'company',
      fm_offence_details_minor_creditor_forenames: null,
      fm_offence_details_minor_creditor_surname: null,
      fm_offence_details_minor_creditor_company_name: null,
    };

    // Call the method
    component['getName']();

    // Check that name is an empty string
    expect(component.name).toBe('');
  });

  it('should set address with all address lines and post code', () => {
    // Set minorCreditorData with full address details
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_address_line_1: '123 Main St',
      fm_offence_details_minor_creditor_address_line_2: 'Apt 4B',
      fm_offence_details_minor_creditor_address_line_3: 'District 9',
      fm_offence_details_minor_creditor_post_code: 'AB12 3CD',
    };

    // Call the method
    component['getAddress']();

    // Check that address is formatted correctly
    expect(component.address).toBe('123 Main St<br>Apt 4B<br>District 9<br>AB12 3CD');
  });

  it('should set address with missing address line 2 and line 3', () => {
    // Set minorCreditorData with only address line 1 and post code
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_address_line_1: '123 Main St',
      fm_offence_details_minor_creditor_address_line_2: null,
      fm_offence_details_minor_creditor_address_line_3: null,
      fm_offence_details_minor_creditor_post_code: 'AB12 3CD',
    };

    // Call the method
    component['getAddress']();

    // Check that address is formatted correctly without missing lines
    expect(component.address).toBe('123 Main St<br>AB12 3CD');
  });

  it('should set address to "Not Provided" if all address fields are missing', () => {
    // Set minorCreditorData with no address details
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_address_line_1: null,
      fm_offence_details_minor_creditor_address_line_2: null,
      fm_offence_details_minor_creditor_address_line_3: null,
      fm_offence_details_minor_creditor_post_code: null,
    };

    // Call the method
    component['getAddress']();

    // Check that address is set to "Not Provided"
    expect(component.address).toBe(FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList.defaultNotProvided);
  });

  it('should set address with only post code provided', () => {
    // Set minorCreditorData with only post code
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_address_line_1: null,
      fm_offence_details_minor_creditor_address_line_2: null,
      fm_offence_details_minor_creditor_address_line_3: null,
      fm_offence_details_minor_creditor_post_code: 'AB12 3CD',
    };

    // Call the method
    component['getAddress']();

    // Check that address is formatted with only post code
    expect(component.address).toBe('AB12 3CD');
  });

  it('should set payment details when payment details are provided', () => {
    // Set minorCreditorData with payment details
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_has_payment_details: true,
      fm_offence_details_minor_creditor_name_on_account: 'John Doe',
      fm_offence_details_minor_creditor_sort_code: '123456',
      fm_offence_details_minor_creditor_account_number: '98765432',
      fm_offence_details_minor_creditor_payment_reference: 'REF12345',
    };

    // Call the method
    component['getPaymentDetails']();

    // Check that paymentMethod is set to the default payment method
    expect(component.paymentMethod).toBe(
      FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList.defaultPaymentMethod,
    );

    // Check that accountName, sortCode, accountNumber, and paymentReference are set correctly
    expect(component.accountName).toBe('John Doe');
    expect(component.sortCode).toBe('12-34-56');
    expect(component.accountNumber).toBe('98765432');
    expect(component.paymentReference).toBe('REF12345');
  });

  it('should set default "Not Provided" when payment details are not available', () => {
    // Set minorCreditorData without payment details
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_has_payment_details: false,
      fm_offence_details_minor_creditor_name_on_account: null,
      fm_offence_details_minor_creditor_sort_code: null,
      fm_offence_details_minor_creditor_account_number: null,
      fm_offence_details_minor_creditor_payment_reference: null,
    };

    // Call the method
    component['getPaymentDetails']();

    // Check that paymentMethod is set to "Not Provided"
    expect(component.paymentMethod).toBe(
      FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList.defaultNotProvided,
    );

    // Check that accountName, sortCode, accountNumber, and paymentReference are empty strings
    expect(component.accountName).toBe('');
    expect(component.sortCode).toBe('');
    expect(component.accountNumber).toBe('');
    expect(component.paymentReference).toBe('');
  });

  it('should handle missing payment details gracefully', () => {
    // Set minorCreditorData with partial payment details
    component.minorCreditorData = {
      ...FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK,
      fm_offence_details_minor_creditor_has_payment_details: true,
      fm_offence_details_minor_creditor_name_on_account: null, // No account name
      fm_offence_details_minor_creditor_sort_code: '123456', // Only sort code provided
      fm_offence_details_minor_creditor_account_number: null, // No account number
      fm_offence_details_minor_creditor_payment_reference: null, // No payment reference
    };

    // Call the method
    component['getPaymentDetails']();

    // Check that paymentMethod is set to the default payment method
    expect(component.paymentMethod).toBe(
      FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList.defaultPaymentMethod,
    );

    // Check that accountName is empty, but sortCode is formatted, and other fields are empty
    expect(component.accountName).toBe('');
    expect(component.sortCode).toBe('12-34-56');
    expect(component.accountNumber).toBe('');
    expect(component.paymentReference).toBe('');
  });
});

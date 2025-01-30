import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsMinorCreditorInformationComponent } from './fines-mac-offence-details-minor-creditor-information.component';
import { FinesMacOffenceDetailsDefaultValues } from '../enums/fines-mac-offence-details-default-values.enum';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK } from '../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-state.mock';

describe('FinesMacOffenceDetailsMinorCreditorInformationComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorInformationComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorInformationComponent>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatSortCode', 'upperCaseFirstLetter']);
    mockUtilsService.formatSortCode.and.returnValue('12-34-56');

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorInformationComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsMinorCreditorInformationComponent);
    component = fixture.componentInstance;

    component.minorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set name to formatted individual name if creditor_type is individual', () => {
    component.minorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK);

    // Call the method
    component['setName']();

    // Check that name is formatted correctly
    expect(component.name).toBe('John Doe');
  });

  it('should set name to company name if creditor_type is company', () => {
    // Set minorCreditor with company type
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_creditor_type: 'company',
      fm_offence_details_minor_creditor_forenames: null,
      fm_offence_details_minor_creditor_surname: null,
      fm_offence_details_minor_creditor_company_name: 'Acme Corp',
    };

    // Call the method
    component['setName']();

    // Check that name is set to company name
    expect(component.name).toBe('Acme Corp');
  });

  it('should handle null or empty forenames and surnames correctly for individual type', () => {
    // Set minorCreditor with individual type but no forenames or surname
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_creditor_type: 'individual',
      fm_offence_details_minor_creditor_forenames: null,
      fm_offence_details_minor_creditor_surname: 'Doe',
      fm_offence_details_minor_creditor_company_name: null,
    };

    // Call the method
    component['setName']();

    // Check that name is an empty string
    expect(component.name).toBe('Doe');
  });

  it('should set address with all address lines and post code', () => {
    // Set minorCreditor with full address details
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_address_line_1: '123 Main St',
      fm_offence_details_minor_creditor_address_line_2: 'Apt 4B',
      fm_offence_details_minor_creditor_address_line_3: 'District 9',
      fm_offence_details_minor_creditor_post_code: 'AB12 3CD',
    };

    // Call the method
    component['setAddress']();

    // Check that address is formatted correctly
    expect(component.address).toBe('123 Main St<br>Apt 4B<br>District 9<br>AB12 3CD');
  });

  it('should set address with missing address line 2 and line 3', () => {
    // Set minorCreditor with only address line 1 and post code
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_address_line_1: '123 Main St',
      fm_offence_details_minor_creditor_address_line_2: null,
      fm_offence_details_minor_creditor_address_line_3: null,
      fm_offence_details_minor_creditor_post_code: 'AB12 3CD',
    };

    // Call the method
    component['setAddress']();

    // Check that address is formatted correctly without missing lines
    expect(component.address).toBe('123 Main St<br>AB12 3CD');
  });

  it('should set address to "Not Provided" if all address fields are missing', () => {
    // Set minorCreditor with no address details
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_address_line_1: null,
      fm_offence_details_minor_creditor_address_line_2: null,
      fm_offence_details_minor_creditor_address_line_3: null,
      fm_offence_details_minor_creditor_post_code: null,
    };

    // Call the method
    component['setAddress']();

    // Check that address is set to "Not Provided"
    expect(component.address).toBe(FinesMacOffenceDetailsDefaultValues.defaultNotProvided);
  });

  it('should set address with only post code provided', () => {
    // Set minorCreditor with only post code
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_address_line_1: null,
      fm_offence_details_minor_creditor_address_line_2: null,
      fm_offence_details_minor_creditor_address_line_3: null,
      fm_offence_details_minor_creditor_post_code: 'AB12 3CD',
    };

    // Call the method
    component['setAddress']();

    // Check that address is formatted with only post code
    expect(component.address).toBe('AB12 3CD');
  });

  it('should set payment details when payment details are provided', () => {
    // Set minorCreditor with payment details
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_pay_by_bacs: true,
      fm_offence_details_minor_creditor_bank_account_name: 'John Doe',
      fm_offence_details_minor_creditor_bank_sort_code: '123456',
      fm_offence_details_minor_creditor_bank_account_number: '98765432',
      fm_offence_details_minor_creditor_bank_account_ref: 'REF12345',
    };

    // Call the method
    component['setPaymentDetails']();

    // Check that paymentMethod is set to the default payment method
    expect(component.paymentMethod).toBe(FinesMacOffenceDetailsDefaultValues.defaultPaymentMethod);

    // Check that accountName, sortCode, accountNumber, and paymentReference are set correctly
    expect(component.accountName).toBe('John Doe');
    expect(component.sortCode).toBe('12-34-56');
    expect(component.accountNumber).toBe('98765432');
    expect(component.paymentReference).toBe('REF12345');
  });

  it('should set default "Not Provided" when payment details are not available', () => {
    // Set minorCreditor without payment details
    component.minorCreditor = {
      ...component.minorCreditor,
      fm_offence_details_minor_creditor_pay_by_bacs: false,
      fm_offence_details_minor_creditor_bank_account_name: null,
      fm_offence_details_minor_creditor_bank_sort_code: null,
      fm_offence_details_minor_creditor_bank_account_number: null,
      fm_offence_details_minor_creditor_bank_account_ref: null,
    };

    // Call the method
    component['setPaymentDetails']();

    // Check that paymentMethod is set to "Not Provided"
    expect(component.paymentMethod).toBe(FinesMacOffenceDetailsDefaultValues.defaultNotProvided);

    // Check that accountName, sortCode, accountNumber, and paymentReference are empty strings
    expect(component.accountName).toBe('');
    expect(component.sortCode).toBe('');
    expect(component.accountNumber).toBe('');
    expect(component.paymentReference).toBe('');
  });

  it('should emit actionClicked event with correct action and index', () => {
    const action = 'remove';
    spyOn(component.actionClicked, 'emit');

    component.summaryListActionClick(action);

    expect(component.actionClicked.emit).toHaveBeenCalledWith({ action, index: 0 });
  });
});

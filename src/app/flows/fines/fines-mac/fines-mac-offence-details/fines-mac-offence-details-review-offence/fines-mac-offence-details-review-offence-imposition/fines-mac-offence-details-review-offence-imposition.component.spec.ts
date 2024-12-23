import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewOffenceImpositionComponent } from './fines-mac-offence-details-review-offence-imposition.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../../mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from '../../mocks/fines-mac-offence-details-state.mock';
import { FinesMacOffenceDetailsReviewOffenceImpositionDefaultCreditor } from './enums/fines-mac-offence-details-review-offence-imposition-default-creditor.enum';
import { FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK } from './mocks/fines-mac-offence-details-review-offence-imposition-data.mock';

describe('FinesMacOffenceDetailsReviewOffenceImpositionComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceImpositionComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceImpositionComponent> | null;
  let mockOpalFinesService: Partial<OpalFines> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let mockUtilsService: jasmine.SpyObj<UtilsService> | null;

  beforeEach(async () => {
    mockOpalFinesService = {
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
    };

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    mockFinesService!.finesMacState.offenceDetails[0].childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
    ];

    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'convertToMonetaryString',
      'formatAddress',
      'formatSortCode',
    ]);

    mockUtilsService!.formatAddress.and.returnValue(['Test Address']);
    mockUtilsService!.formatSortCode.and.returnValue('12-34-56');

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceImpositionComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesService, useValue: mockFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceImpositionComponent);
    component = fixture.componentInstance;

    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.impositions = [structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0])];
    component.offenceIndex = 0;
    component.isReadOnly = false;

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    mockUtilsService = null;
    mockOpalFinesService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set impositionsTotalsData with converted monetary strings', () => {
    if (!component || !mockUtilsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const expectedTotal = '£100.00';
    mockUtilsService.convertToMonetaryString.and.returnValue(expectedTotal);

    component['getImpositionsTotalData']();

    expect(component.impositionsTotalsData.totalAmountImposed).toBe(expectedTotal);
    expect(component.impositionsTotalsData.totalAmountPaid).toBe(expectedTotal);
    expect(component.impositionsTotalsData.totalBalanceRemaining).toBe(expectedTotal);
  });

  it('should set impositionTableData with correct values', () => {
    if (!component || !mockUtilsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const expectedTotal = '£100.00';
    mockUtilsService.convertToMonetaryString.and.returnValue(expectedTotal);
    const expectedImpositionTableData = [
      {
        impositionId: 0,
        impositionDescription: OPAL_FINES_RESULTS_REF_DATA_MOCK.refData.find(
          (result) =>
            result.result_id === FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0].fm_offence_details_result_id!,
        )!.result_title,
        creditor: 'HM Courts & Tribunals Service (HMCTS)',
        minorCreditor: {
          address: ['Test Address'],
          paymentMethod: 'Pay by BACS',
          nameOnAccount: 'John Doe',
          sortCode: '12-34-56',
          accountNumber: '12345678',
          paymentReference: 'Testing',
        },
        showMinorCreditorData: false,
        amountImposed: expectedTotal,
        amountPaid: expectedTotal,
        balanceRemaining: expectedTotal,
      },
    ];

    component.impositions = [structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0])];
    component['getImpositionData']();

    expect(component.impositionTableData).toEqual(expectedImpositionTableData);
  });

  it('should return minor creditor - Any resultCodeCreditor', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.offenceDetails[0].childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
    ];
    const {
      fm_offence_details_minor_creditor_title: title,
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
    } = FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData;
    const expectedCreditorText = `${title} ${forenames} ${surname}`;

    const actualCreditorText = component['getCreditorInformation'](null, null, 'Any', 0);

    expect(actualCreditorText).toBe(expectedCreditorText);
  });

  it('should return minor creditor no title or forenames - Any resultCodeCreditor', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.offenceDetails[0] = {
      ...structuredClone(mockFinesService.finesMacState.offenceDetails[0]),
      childFormData: [
        {
          ...structuredClone(mockFinesService.finesMacState.offenceDetails[0].childFormData![0]),
          formData: {
            ...structuredClone(mockFinesService.finesMacState.offenceDetails[0].childFormData![0].formData),
            fm_offence_details_minor_creditor_title: null,
            fm_offence_details_minor_creditor_forenames: null,
          },
        },
      ],
    };

    const { fm_offence_details_minor_creditor_surname: surname } =
      FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData;
    const expectedCreditorText = `${surname}`;

    const actualCreditorText = component['getCreditorInformation'](null, null, 'Any', 0);

    expect(actualCreditorText).toBe(expectedCreditorText);
  });

  it('should return minor creditor no title or forenames - Any resultCodeCreditor', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.offenceDetails[0] = {
      ...structuredClone(mockFinesService.finesMacState.offenceDetails[0]),
      childFormData: [
        {
          ...structuredClone(mockFinesService.finesMacState.offenceDetails[0].childFormData![0]),
          formData: {
            ...structuredClone(mockFinesService.finesMacState.offenceDetails[0].childFormData![0].formData),
            fm_offence_details_minor_creditor_creditor_type: 'company',
            fm_offence_details_minor_creditor_company_name: 'Test Ltd',
            fm_offence_details_minor_creditor_title: null,
            fm_offence_details_minor_creditor_forenames: null,
            fm_offence_details_minor_creditor_surname: null,
          },
        },
      ],
    };

    const actualCreditorText = component['getCreditorInformation'](null, null, 'Any', 0);

    expect(actualCreditorText).toBe('Test Ltd');
  });

  it('should return default minor creditor if minor creditor does not exist - Any resultCodeCreditor', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.offenceDetails[0] = {
      ...structuredClone(mockFinesService.finesMacState.offenceDetails[0]),
      childFormData: [],
    };
    const expectedCreditorText = FinesMacOffenceDetailsReviewOffenceImpositionDefaultCreditor;

    const actualCreditorText = component['getCreditorInformation'](null, null, 'Any', 0);

    expect(actualCreditorText).toBe(expectedCreditorText.defaultMinorCreditor);
  });

  it('should return major creditor if creditor is major', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const actualCreditorText = component['getCreditorInformation']('major', 3856, '!CPS', 0);

    expect(actualCreditorText).toBe('Aldi Stores Ltd (ALDI)');
  });

  it('should return empty string if creditor is null - CPS resultCodeCreditor', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const expectedCreditorText = FinesMacOffenceDetailsReviewOffenceImpositionDefaultCreditor;

    const actualCreditorText = component['getCreditorInformation'](null, null, 'CPS', 0);

    expect(actualCreditorText).toBe(expectedCreditorText.defaultCpsCreditor);
  });

  it('should sort impositions by allocation order and result title', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.impositions = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK)];
    const expected = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK[2]),
      structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK[0]),
      structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK[1]),
    ];

    component['sortImpositionsByAllocationOrder']();

    expect(component.impositions).toEqual(expected);
  });

  it('should invert showMinorCreditorData', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.impositions = [structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0])];
    component['getImpositionData']();
    const impositionId = component.impositionTableData[0].impositionId;

    component.invertShowMinorCreditorData(impositionId);

    expect(component.impositionTableData[0].showMinorCreditorData).toBe(true);

    component.invertShowMinorCreditorData(impositionId);

    expect(component.impositionTableData[0].showMinorCreditorData).toBe(false);
  });

  it('should return null for address and payment method for minor creditor', () => {
    if (!component || !mockFinesService || !mockUtilsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.offenceDetails[0].childFormData![0] = {
      ...structuredClone(mockFinesService.finesMacState.offenceDetails[0].childFormData![0]),
      formData: {
        ...structuredClone(mockFinesService.finesMacState.offenceDetails[0].childFormData![0].formData),
        fm_offence_details_minor_creditor_pay_by_bacs: false,
        fm_offence_details_minor_creditor_bank_sort_code: null,
        fm_offence_details_minor_creditor_address_line_1: null,
        fm_offence_details_minor_creditor_address_line_2: null,
        fm_offence_details_minor_creditor_address_line_3: null,
        fm_offence_details_minor_creditor_post_code: null,
      },
    };

    mockUtilsService.formatAddress.and.returnValue([]);

    const minorCreditorData = component['getMinorCreditorData'](0);

    expect(minorCreditorData).toBeDefined();
    expect(minorCreditorData!.address).toEqual([]);
    expect(minorCreditorData!.paymentMethod).toBeNull();
    expect(minorCreditorData!.sortCode).toBeNull();
  });

  it('should return null as no minor creditor exists', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    expect(component['getMinorCreditorData'](99)).toBeNull();
  });
});

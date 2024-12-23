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
import { IFinesMacOffenceDetailsReviewSummaryImpositionTableData } from './interfaces/fines-mac-offence-details-review-offence-imposition-data.interface';

describe('FinesMacOffenceDetailsReviewOffenceImpositionComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceImpositionComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceImpositionComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
    };

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);

    mockFinesService.finesMacState.offenceDetails = [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK }];
    mockFinesService.finesMacState.offenceDetails[0].childFormData = [
      { ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK },
    ];

    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'convertToMonetaryString',
      'formatAddress',
      'formatSortCode',
    ]);

    mockUtilsService.formatAddress.and.returnValue(['Test Address']);
    mockUtilsService.formatSortCode.and.returnValue('12-34-56');

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
    component.impositions = [{ ...FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0] }];
    component.offenceIndex = 0;
    component.isReadOnly = false;

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.impositions = [{ ...FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0] }];
    component.offenceIndex = 0;
    mockFinesService.finesMacState.offenceDetails = [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK }];
    mockFinesService.finesMacState.offenceDetails[0].childFormData = [
      { ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK },
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set impositionsTotalsData with converted monetary strings', () => {
    const expectedTotal = '£100.00';
    mockUtilsService.convertToMonetaryString.and.returnValue(expectedTotal);

    component['getImpositionsTotalData']();

    expect(component.impositionsTotalsData.totalAmountImposed).toBe(expectedTotal);
    expect(component.impositionsTotalsData.totalAmountPaid).toBe(expectedTotal);
    expect(component.impositionsTotalsData.totalBalanceRemaining).toBe(expectedTotal);
  });

  it('should set impositionTableData with correct values', () => {
    const expectedTotal = '£100.00';
    mockUtilsService.convertToMonetaryString.and.returnValue(expectedTotal);
    const imposition = { ...FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0] };
    const expectedImpositionTableData: IFinesMacOffenceDetailsReviewSummaryImpositionTableData[] = [
      {
        impositionId: 0,
        impositionDescription: OPAL_FINES_RESULTS_REF_DATA_MOCK.refData.find(
          (result) => result.result_id === imposition.fm_offence_details_result_id!,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getMinorCreditorData').and.returnValue(expectedImpositionTableData[0].minorCreditor);

    component.impositions = [imposition];
    component['getImpositionData']();

    expect(component.impositionTableData).toEqual(expectedImpositionTableData);
  });

  it('should return minor creditor - Any resultCodeCreditor', () => {
    mockFinesService.finesMacState.offenceDetails[0].childFormData = [
      { ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK },
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
    mockFinesService.finesMacState.offenceDetails[0] = {
      ...mockFinesService.finesMacState.offenceDetails[0],
      childFormData: [
        {
          ...mockFinesService.finesMacState.offenceDetails[0].childFormData![0],
          formData: {
            ...mockFinesService.finesMacState.offenceDetails[0].childFormData![0].formData,
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
    mockFinesService.finesMacState.offenceDetails[0] = {
      ...mockFinesService.finesMacState.offenceDetails[0],
      childFormData: [
        {
          ...mockFinesService.finesMacState.offenceDetails[0].childFormData![0],
          formData: {
            ...mockFinesService.finesMacState.offenceDetails[0].childFormData![0].formData,
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
    mockFinesService.finesMacState.offenceDetails[0] = {
      ...mockFinesService.finesMacState.offenceDetails[0],
      childFormData: [],
    };
    const expectedCreditorText = FinesMacOffenceDetailsReviewOffenceImpositionDefaultCreditor;

    const actualCreditorText = component['getCreditorInformation'](null, null, 'Any', 0);

    expect(actualCreditorText).toBe(expectedCreditorText.defaultMinorCreditor);
  });

  it('should return major creditor if creditor is major', () => {
    const actualCreditorText = component['getCreditorInformation']('major', 3856, '!CPS', 0);

    expect(actualCreditorText).toBe('Aldi Stores Ltd (ALDI)');
  });

  it('should return empty string if creditor is null - CPS resultCodeCreditor', () => {
    const expectedCreditorText = FinesMacOffenceDetailsReviewOffenceImpositionDefaultCreditor;

    const actualCreditorText = component['getCreditorInformation'](null, null, 'CPS', 0);

    expect(actualCreditorText).toBe(expectedCreditorText.defaultCpsCreditor);
  });

  it('should sort impositions by allocation order and result title', () => {
    component.impositions = [...FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK];
    const expected = [
      { ...FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK[2] },
      { ...FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK[0] },
      { ...FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_OFFENCE_IMPOSITION_DATA_MOCK[1] },
    ];

    component['sortImpositionsByAllocationOrder']();

    expect(component.impositions).toEqual(expected);
  });

  it('should invert showMinorCreditorData', () => {
    component.impositions = [{ ...FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0] }];
    component['getImpositionData']();
    const impositionId = component.impositionTableData[0].impositionId;

    component.invertShowMinorCreditorData(impositionId);

    expect(component.impositionTableData[0].showMinorCreditorData).toBe(true);

    component.invertShowMinorCreditorData(impositionId);

    expect(component.impositionTableData[0].showMinorCreditorData).toBe(false);
  });

  it('should return null for address and payment method for minor creditor', () => {
    mockFinesService.finesMacState.offenceDetails[0].childFormData![0] = {
      ...mockFinesService.finesMacState.offenceDetails[0].childFormData![0],
      formData: {
        ...mockFinesService.finesMacState.offenceDetails[0].childFormData![0].formData,
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
    expect(component['getMinorCreditorData'](99)).toBeNull();
  });
});

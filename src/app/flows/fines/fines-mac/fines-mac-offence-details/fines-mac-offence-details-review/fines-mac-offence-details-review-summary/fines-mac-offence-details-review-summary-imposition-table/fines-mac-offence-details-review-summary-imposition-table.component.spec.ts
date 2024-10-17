import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryImpositionTableComponent } from './fines-mac-offence-details-review-summary-imposition-table.component';
import { UtilsService } from '@services/utils/utils.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from '../../../mocks/fines-mac-offence-details-state.mock';
import { FinesMacOffenceDetailsReviewSummaryImpositionTableDefaultCreditor } from './enums/fines-mac-offence-details-review-summary-imposition-table-default-creditor.enum';
import { FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_SUMMARY_IMPOSITION_TABLE_IMPOSITIONS_MOCK } from './mocks/fines-mac-offence-details-review-summary-imposition-table-impositions.mock';

describe('FinesMacOffenceDetailsReviewSummaryImpositionTableComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryImpositionTableComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryImpositionTableComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
    };

    mockUtilsService = jasmine.createSpyObj(UtilsService, ['convertToMonetaryString']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryImpositionTableComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryImpositionTableComponent);
    component = fixture.componentInstance;

    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.impositions = [FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0]];

    fixture.detectChanges();
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
    const expectedImpositionTableData = [
      {
        impositionDescription: OPAL_FINES_RESULTS_REF_DATA_MOCK.refData.find(
          (x) => x.result_id === FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0].fm_offence_details_result_code!,
        )!.result_title,
        creditor: 'Aldi Stores Ltd (ALDI)',
        amountImposed: expectedTotal,
        amountPaid: expectedTotal,
        balanceRemaining: expectedTotal,
      },
    ];

    component.impositions = [FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0]];
    component['getImpositionData']();

    expect(component.impositionTableData).toEqual(expectedImpositionTableData);
  });

  it('should return empty string if creditor is null', () => {
    const expectedCreditorText = FinesMacOffenceDetailsReviewSummaryImpositionTableDefaultCreditor;

    const actualCreditorText = component['getCreditorInformation'](null, null);

    expect(actualCreditorText).toBe(expectedCreditorText.defaultCreditor);
  });

  it('should return defaultMinorCreditor if creditor is not "major"', () => {
    const expectedCreditorText = FinesMacOffenceDetailsReviewSummaryImpositionTableDefaultCreditor;

    const actualCreditorText = component['getCreditorInformation']('minor', null);

    expect(actualCreditorText).toBe(expectedCreditorText.defaultMinorCreditor);
  });

  it('should sort impositions by allocation order and result title', () => {
    component.impositions = FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_SUMMARY_IMPOSITION_TABLE_IMPOSITIONS_MOCK;

    // Act
    component['sortImpositionsByAllocationOrder']();

    // Assert
    expect(component.impositions).toEqual(
      FINES_MAC_OFFENCE_DETAILS_STATE_REVIEW_SUMMARY_IMPOSITION_TABLE_IMPOSITIONS_MOCK,
    );
  });
});

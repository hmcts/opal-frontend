import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent } from './fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list.component';
import { UtilsService } from '@services/utils/utils.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_STRIPPED_DATA_MOCK } from './mocks/fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list-stripped-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_ADD_AN_OFFENCE_FORM_MINOR_CREDITOR_SUMMARY_LIST_INCOMING_DATA_MOCK } from './mocks/fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list-incoming-data.mock';

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
});

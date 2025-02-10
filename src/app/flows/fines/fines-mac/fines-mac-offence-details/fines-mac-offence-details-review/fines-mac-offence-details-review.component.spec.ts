import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewComponent } from './fines-mac-offence-details-review.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@services/date-service/date.service';
import { of } from 'rxjs';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from './mocks/fines-mac-offence-details-review-summary-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from '../mocks/fines-mac-offence-details-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../constants/fines-mac-offence-details-form.constant';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_SERVICE_FORM } from './mocks/fines-mac-offence-details-review-summary-service-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsStoreType } from '../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';

describe('FinesMacOffenceDetailsReviewComponent', () => {
  let component: FinesMacOffenceDetailsReviewComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let finesMacStore: FinesMacStoreType;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getMajorCreditors: jasmine
        .createSpy('getMajorCreditors')
        .and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK)),
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK)),
    };
    mockDateService = jasmine.createSpyObj(DateService, ['getFromFormat']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: DateService, mockDateService },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj(UtilsService, [
            'checkFormValues',
            'getFormStatus',
            'upperCaseFirstLetter',
            'convertToMonetaryString',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewComponent);
    component = fixture.componentInstance;

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM)];
    finesMacState.offenceDetails[0].formData.fm_offence_details_impositions = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0]),
    ];
    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(finesMacState);

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set offencesImpositions and sort offences by date', () => {
    finesMacStore.setOffenceDetails([...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_SERVICE_FORM)]);

    component['getOffencesImpositions']();

    expect(component.offencesImpositions).toEqual(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK);
    expect(finesMacOffenceDetailsStore.emptyOffences()).toBe(false);
  });

  it('should set emptyOffences to true when offencesImpositions is empty', () => {
    finesMacStore.setOffenceDetails([]);

    component['getOffencesImpositions']();

    expect(component.offencesImpositions).toEqual([]);
    expect(finesMacOffenceDetailsStore.emptyOffences()).toBe(true);
  });

  it('should sort offences by date in ascending order', () => {
    component.offencesImpositions = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK)];

    component['sortOffencesByDate']();

    expect(component.offencesImpositions).toEqual(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK);
  });

  it('should reset addedOffenceCode and offenceDetailsDraft on ngOnDestroy', () => {
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRowIndex(0);
    finesMacOffenceDetailsStore.setAddedOffenceCode('Testing');
    finesMacOffenceDetailsStore.setMinorCreditorAdded(true);
    finesMacOffenceDetailsStore.setOffenceRemoved(true);

    component.ngOnDestroy();

    expect(finesMacOffenceDetailsStore.addedOffenceCode()).toEqual('');
    expect(finesMacOffenceDetailsStore.minorCreditorAdded()).toBe(false);
    expect(finesMacOffenceDetailsStore.offenceRemoved()).toBe(false);
    expect(finesMacOffenceDetailsStore.offenceDetailsDraft()).toEqual([]);
  });
});

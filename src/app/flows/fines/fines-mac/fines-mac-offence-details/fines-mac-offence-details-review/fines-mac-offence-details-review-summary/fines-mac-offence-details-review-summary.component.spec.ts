import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary.component';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from '../mocks/fines-mac-offence-details-review-summary-form.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { of } from 'rxjs';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_STATE_MOCK } from '../../../mocks/fines-mac-state.mock';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { FINES_MAC_STATUS } from '../../../constants/fines-mac-status';
import { FinesMacOffenceDetailsStoreType } from '../../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../../stores/fines-mac-offence-details.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../../constants/fines-mac-defendant-types-keys';

describe('FinesMacOffenceDetailsReviewSummaryComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryComponent>;
  let finesMacStore: FinesMacStoreType;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'checkFormValues',
      'getFormStatus',
      'upperCaseFirstLetter',
      'convertToMonetaryString',
    ]);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
            snapshot: {
              data: {
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
            },
          },
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryComponent);
    component = fixture.componentInstance;

    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.offencesImpositions = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK)];

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE_MOCK));

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);

    mockUtilsService.getFormStatus.and.returnValue(FINES_MAC_STATUS.PROVIDED);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the maximum offence ID', () => {
    const result = component['getMaxOffenceId']();

    expect(result).toBe(1);
  });

  it('should return 0 if offencesImpositions is empty', () => {
    component.offencesImpositions = [];

    const result = component['getMaxOffenceId']();

    expect(result).toBe(0);
  });

  it('should set the offenceIndex and navigate to addOffence route when actionName is "Change"', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const action = { actionName: 'change', offenceId: 1 };

    component.offenceAction(action);

    expect(finesMacOffenceDetailsStore.offenceIndex()).toBe(action.offenceId);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should not set the offenceIndex and navigate to addOffence route when actionName is not "Change"', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const action = { actionName: 'remove', offenceId: 1 };

    component.offenceAction(action);

    expect(finesMacOffenceDetailsStore.offenceIndex()).toBe(action.offenceId);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should toggle the offencesHidden value when the action name is not "Change" or "Remove"', () => {
    const action = { actionName: 'hide', offenceId: 1 };

    component.offenceAction(action);

    expect(component.offencesHidden[action.offenceId]).toBe(false);

    action.actionName = 'show';

    component.offenceAction(action);

    expect(component.offencesHidden[action.offenceId]).toBe(true);
  });

  it('should set the offenceIndex and navigate to addOffence route when addAnotherOffence is called', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const maxOffenceId = component['getMaxOffenceId']();
    const expectedOffenceIndex = maxOffenceId + 1;

    component.addAnotherOffence();

    expect(finesMacOffenceDetailsStore.offenceIndex()).toBe(expectedOffenceIndex);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should navigate to relative route with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith([`${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/test`]);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test ngOnInit when offencesImpositions is empty', () => {
    const addAnotherOffenceSpy = spyOn(component, 'addAnotherOffence');
    component.offencesImpositions = [];

    component.ngOnInit();

    expect(addAnotherOffenceSpy).toHaveBeenCalled();
  });

  it('should return the value of finesService.finesMacState.personalDetails.status when isAdultOrYouthOnly returns true', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.accountDetails = {
      ...structuredClone(FINES_MAC_STATE_MOCK.accountDetails),
      formData: {
        ...structuredClone(FINES_MAC_STATE_MOCK.accountDetails.formData),
        fm_create_account_defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly,
      },
    };
    finesMacState.personalDetails = {
      ...structuredClone(FINES_MAC_STATE_MOCK.personalDetails),
    };
    finesMacStore.setFinesMacStore(finesMacState);

    const result = component.checkSubNavigationButton();

    expect(result).toBe(true);
  });

  it('should return the value of finesService.finesMacState.personalDetails.status when isAdultOrYouthOnly returns true', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.accountDetails = {
      ...structuredClone(FINES_MAC_STATE_MOCK.accountDetails),
      formData: {
        ...structuredClone(FINES_MAC_STATE_MOCK.accountDetails.formData),
        fm_create_account_defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay,
      },
      nestedFlow: false,
    };
    finesMacStore.setFinesMacStore(finesMacState);

    const result = component.checkSubNavigationButton();

    expect(result).toBe(true);
  });
});

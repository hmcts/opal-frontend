import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary.component';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from '../mocks/fines-mac-offence-details-review-summary-form.mock';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { of } from 'rxjs';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../../../mocks/fines-mac-state.mock';
import { FINES_MAC_STATUS } from '../../../constants/fines-mac-status';

describe('FinesMacOffenceDetailsReviewSummaryComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService> | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'offenceCodeMessage',
      'offenceIndex',
    ]);
    mockFinesMacOffenceDetailsService!.offenceCodeMessage = 'Offence AK123456 added';

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryComponent);
    component = fixture.componentInstance;

    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.offencesImpositions = [...FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK];

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    mockFinesMacOffenceDetailsService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the maximum offence ID', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const result = component['getMaxOffenceId']();

    expect(result).toBe(1);
  });

  it('should return 0 if offencesImpositions is empty', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.offencesImpositions = [];

    const result = component['getMaxOffenceId']();

    expect(result).toBe(0);
  });

  it('should set the offenceIndex and navigate to addOffence route when actionName is "Change"', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const action = { actionName: 'change', offenceId: 1 };

    component.offenceAction(action);

    expect(mockFinesMacOffenceDetailsService.offenceIndex).toBe(action.offenceId);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should not set the offenceIndex and navigate to addOffence route when actionName is not "Change"', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const action = { actionName: 'remove', offenceId: 1 };

    component.offenceAction(action);

    expect(mockFinesMacOffenceDetailsService.offenceIndex).toBe(action.offenceId);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should toggle the offencesHidden value when the action name is not "Change" or "Remove"', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const action = { actionName: 'hide', offenceId: 1 };

    component.offenceAction(action);

    expect(component.offencesHidden[action.offenceId]).toBe(false);

    action.actionName = 'show';

    component.offenceAction(action);

    expect(component.offencesHidden[action.offenceId]).toBe(true);
  });

  it('should set the offenceIndex and navigate to addOffence route when addAnotherOffence is called', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const maxOffenceId = component['getMaxOffenceId']();
    const expectedOffenceIndex = maxOffenceId + 1;

    component.addAnotherOffence();

    expect(mockFinesMacOffenceDetailsService.offenceIndex).toBe(expectedOffenceIndex);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should navigate to relative route with event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith([`${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/test`]);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test ngOnInit when offencesImpositions is empty', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const addAnotherOffenceSpy = spyOn(component, 'addAnotherOffence');
    component.offencesImpositions = [];

    component.ngOnInit();

    expect(addAnotherOffenceSpy).toHaveBeenCalled();
  });

  it('should return the value of finesService.finesMacState.personalDetails.status when isAdultOrYouthOnly returns true', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState = {
      ...FINES_MAC_STATE_MOCK,
      accountDetails: {
        ...FINES_MAC_STATE_MOCK.accountDetails,
        formData: {
          ...FINES_MAC_STATE_MOCK.accountDetails.formData,
          fm_create_account_defendant_type: 'adultOrYouthOnly',
        },
      },
      personalDetails: {
        ...FINES_MAC_STATE_MOCK.personalDetails,
        status: FINES_MAC_STATUS.PROVIDED,
      },
    };

    const result = component.checkSubNavigationButton();

    expect(result).toBe(true);
  });

  it('should return the value of finesService.finesMacState.personalDetails.status when isAdultOrYouthOnly returns true', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState = {
      ...FINES_MAC_STATE_MOCK,
      accountDetails: {
        ...FINES_MAC_STATE_MOCK.accountDetails,
        formData: {
          ...FINES_MAC_STATE_MOCK.accountDetails.formData,
          fm_create_account_defendant_type: 'parentOrGuardianToPay',
        },
        nestedFlow: false,
      },
    };

    const result = component.checkSubNavigationButton();

    expect(result).toBe(true);
  });
});

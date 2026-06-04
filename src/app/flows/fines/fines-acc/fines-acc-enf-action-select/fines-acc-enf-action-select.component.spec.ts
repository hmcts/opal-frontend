import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccEnfActionSelectComponent } from './fines-acc-enf-action-select.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_ACC_ENF_ACTION_SELECT_ACTION_OPTIONS_MOCK } from './mocks/fines-acc-enf-action-select-action-options.mock';
import { FINES_ACC_ENF_ACTION_SELECT_DEFENDANT_ACCOUNT_HEADING_DATA_MOCK } from './mocks/fines-acc-enf-action-select-defendant-account-heading-data.mock';
import { FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK } from './mocks/fines-acc-enf-action-select-enforcement-status.mock';
import { FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK } from './mocks/fines-acc-enf-action-select-next-permitted-enf-actions.mock';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES } from './constants/fines-acc-enf-action-select-warning-messages.constant';

describe('FinesAccEnfActionSelectComponent', () => {
  let component: FinesAccEnfActionSelectComponent;
  let fixture: ComponentFixture<FinesAccEnfActionSelectComponent>;
  let activatedRouteStub: {
    snapshot: {
      data: {
        defendantAccountHeadingData: IOpalFinesAccountDefendantDetailsHeader;
        enforcementStatus: IOpalFinesAccountDefendantDetailsEnforcementTabRefData;
        nextPermittedEnfActions: IOpalFinesResultsRefData;
      };
    };
  };

  const mockAccountStore = {
    getAccountNumber: signal<string | null>('123456'),
    party_name: signal<string | null>('Test Company Ltd'),
    successMessage: signal<string | null>(null),
    clearSuccessMessage: vi.fn(),
  };

  const mockOpalFinesService = {
    getResult: vi.fn((resultId: string) => {
      if (resultId === 'WOC') {
        return of({
          result_id: 'WOC',
          result_title: 'Warrant of Control',
          requires_employment_data: true,
        });
      }

      if (resultId === 'WOA') {
        return of({
          result_id: 'WOA',
          result_title: 'Warrant of Arrest',
          requires_employment_data: false,
        });
      }

      return of({
        requires_employment_data: true,
      });
    }),
    getResultPrettyName: vi.fn((result: { result_title: string; result_id: string }) => {
      return `${result.result_title} (${result.result_id})`;
    }),
  };

  const mockUtilsService = {
    scrollToTop: vi.fn(),
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(FinesAccEnfActionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    activatedRouteStub = {
      snapshot: {
        data: {
          defendantAccountHeadingData: structuredClone(FINES_ACC_ENF_ACTION_SELECT_DEFENDANT_ACCOUNT_HEADING_DATA_MOCK),
          enforcementStatus: structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK),
          nextPermittedEnfActions: structuredClone(FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionSelectComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default accountNumber and partyName to empty strings when the store values are null', () => {
    mockAccountStore.getAccountNumber.set(null);
    mockAccountStore.party_name.set(null);

    createComponent();

    expect(component.accountNumber).toBe('');
    expect(component.partyName).toBe('');
  });

  it('should build warning messages for collection order, youth and company accounts', () => {
    expect(component.warningMessages).toEqual([
      FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES.collectionOrderMissing,
      FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES.youthAccount,
      FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES.companyAccount,
    ]);
  });

  it('should not add warning messages when collection order exists and the account is neither youth nor company', () => {
    activatedRouteStub.snapshot.data.defendantAccountHeadingData = {
      ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_DEFENDANT_ACCOUNT_HEADING_DATA_MOCK),
      is_youth: false,
      party_details: {
        ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_DEFENDANT_ACCOUNT_HEADING_DATA_MOCK.party_details),
        organisation_flag: false,
      },
    };
    activatedRouteStub.snapshot.data.enforcementStatus = {
      ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK),
      enforcement_overview: {
        ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK.enforcement_overview),
        collection_order: {
          collection_order_date: '2025-12-10',
          collection_order_flag: true,
        },
      },
    };

    createComponent();

    expect(component.warningMessages).toEqual([]);
  });

  it('should not show the youth account warning for parent guardian to pay accounts', () => {
    activatedRouteStub.snapshot.data.defendantAccountHeadingData = {
      ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_DEFENDANT_ACCOUNT_HEADING_DATA_MOCK),
      debtor_type: 'Parent/Guardian',
      is_youth: true,
      party_details: {
        ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_DEFENDANT_ACCOUNT_HEADING_DATA_MOCK.party_details),
        organisation_flag: false,
      },
    };
    activatedRouteStub.snapshot.data.enforcementStatus = {
      ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK),
      enforcement_overview: {
        ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK.enforcement_overview),
        collection_order: {
          collection_order_date: '2025-12-10',
          collection_order_flag: true,
        },
      },
    };

    createComponent();

    expect(component.warningMessages).toEqual([]);
  });

  it('should map next permitted actions into autocomplete options', () => {
    expect(mockOpalFinesService.getResultPrettyName).toHaveBeenCalledTimes(2);
    expect(component.actionOptions).toEqual(FINES_ACC_ENF_ACTION_SELECT_ACTION_OPTIONS_MOCK);
  });

  it('should update stateUnsavedChanges when handleUnsavedChanges is called', () => {
    component.handleUnsavedChanges(true);

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
  });

  it('should navigate back to the enforcement tab when cancel is triggered', () => {
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleUnsavedChanges(true);
    component.handleCancel();

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      'enforcement',
    );
  });

  it('should clear dirty state when processSelectedAction receives a result that does not require employment data', () => {
    const selectedAction = {
      result_id: 'WOA',
      result_title: 'Warrant of Arrest',
      requires_employment_data: false,
    } as IOpalFinesResultRefData;

    component.handleUnsavedChanges(true);

    (
      component as unknown as { processSelectedAction: (result: IOpalFinesResultRefData) => void }
    ).processSelectedAction(selectedAction);

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(false);
  });

  it('should clear dirty state when processSelectedAction receives a result that requires employment data and employer data exists', () => {
    const selectedAction = {
      result_id: 'WOC',
      result_title: 'Warrant of Control',
      requires_employment_data: true,
    } as IOpalFinesResultRefData;

    activatedRouteStub.snapshot.data.enforcementStatus = {
      ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK),
      employer_flag: true,
    };
    createComponent();
    component.handleUnsavedChanges(true);

    (
      component as unknown as { processSelectedAction: (result: IOpalFinesResultRefData) => void }
    ).processSelectedAction(selectedAction);

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(false);
  });

  it('should clear dirty state when processSelectedAction receives a result that requires employment data and employer data does not exist', () => {
    const selectedAction = {
      result_id: 'WOC',
      result_title: 'Warrant of Control',
      requires_employment_data: true,
    } as IOpalFinesResultRefData;

    component.handleUnsavedChanges(true);

    (
      component as unknown as { processSelectedAction: (result: IOpalFinesResultRefData) => void }
    ).processSelectedAction(selectedAction);

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(false);
  });

  it('should fetch the selected action and delegate processing when handleSubmit is called', () => {
    const processSelectedActionSpy = vi.spyOn(
      component as unknown as { processSelectedAction: (result: IOpalFinesResultRefData) => void },
      'processSelectedAction',
    );

    component.handleSubmit({
      formData: { facc_enf_action: 'WOC' },
      nestedFlow: false,
    });

    expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('WOC');
    expect(processSelectedActionSpy).toHaveBeenCalledWith({
      result_id: 'WOC',
      result_title: 'Warrant of Control',
      requires_employment_data: true,
    });
  });

  it('should scroll to top when fetching the selected action fails', () => {
    mockOpalFinesService.getResult = vi.fn().mockReturnValue(throwError(() => new Error('fail')));

    createComponent();

    component.handleSubmit({
      formData: { facc_enf_action: 'WOC' },
      nestedFlow: false,
    });

    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  });
});

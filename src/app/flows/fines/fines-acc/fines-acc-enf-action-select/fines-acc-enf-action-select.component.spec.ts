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
    getAccountNumber: signal('123456'),
    party_name: signal('Test Company Ltd'),
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

  it('should build warning messages for collection order, youth and company accounts', () => {
    expect(component.warningMessages).toEqual([
      'There is no collection order on this account',
      'This is a youth account',
      'This is a company account',
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

  it('should clear dirty state after a valid submit when employment data is required but not present', () => {
    component.handleUnsavedChanges(true);

    component.handleSubmit({
      formData: { facc_enf_action: 'WOC' },
      nestedFlow: false,
    });

    expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('WOC');
    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(false);
  });

  it('should clear dirty state after a valid submit when employment data is not required', () => {
    component.handleUnsavedChanges(true);

    component.handleSubmit({
      formData: { facc_enf_action: 'WOA' },
      nestedFlow: false,
    });

    expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('WOA');
    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(false);
  });

  it('should clear dirty state after a valid submit when employment data is required and present', () => {
    activatedRouteStub.snapshot.data.enforcementStatus = {
      ...structuredClone(FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK),
      employer_flag: true,
    };
    createComponent();
    component.handleUnsavedChanges(true);

    component.handleSubmit({
      formData: { facc_enf_action: 'WOC' },
      nestedFlow: false,
    });

    expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('WOC');
    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(false);
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

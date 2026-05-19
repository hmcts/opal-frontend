import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { FinesAccEnfActionDeniedComponent } from './fines-acc-enf-action-denied.component';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';

describe('FinesAccEnfActionDeniedComponent', () => {
  let component: FinesAccEnfActionDeniedComponent;
  let fixture: ComponentFixture<FinesAccEnfActionDeniedComponent>;

  const mockAccountStore = {
    getAccountState: vi.fn().mockReturnValue(FINES_ACCOUNT_STATE),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: new Map([['type', 'permission']]),
      data: {
        defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
        enforcementStatus: structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
      },
    },
    parent: {
      snapshot: {
        paramMap: new Map(),
      },
      parent: {
        snapshot: {
          paramMap: new Map([['accountId', '123']]),
        },
      },
    },
  };

  beforeEach(async () => {
    mockActivatedRoute.snapshot.paramMap = new Map([['type', 'permission']]);
    mockActivatedRoute.snapshot.data = {
      defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      enforcementStatus: structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
    };
    mockRouter.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionDeniedComponent],
      providers: [
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to the enforcement tab fragment', () => {
    component.navigateBackToAccountSummary();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`../../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`],
      {
        relativeTo: mockActivatedRoute,
        fragment: 'enforcement',
      },
    );
  });

  it('should render the go back cancel link text', () => {
    expect(fixture.nativeElement.textContent).toContain('Go back');
  });

  it('should render the enforcement hold message', () => {
    mockActivatedRoute.snapshot.paramMap = new Map([['type', 'enforcement-hold']]);
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('You must first remove the enforcement hold on the account.');
  });

  it('should use the last enforcement action from enforcement status for the no-next-actions message', () => {
    mockActivatedRoute.snapshot.paramMap = new Map([['type', 'no-next-actions']]);
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      `${OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.last_enforcement_action!.enforcement_action.result_title} (${OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.last_enforcement_action!.enforcement_action.result_id})`,
    );
  });

  it('should set last enforcement action to null when enforcement status has no last action', () => {
    mockActivatedRoute.snapshot.paramMap = new Map([['type', 'no-next-actions']]);
    mockActivatedRoute.snapshot.data.enforcementStatus = {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
      last_enforcement_action: null,
    };
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.lastEnforcementAction).toBeNull();
  });
});

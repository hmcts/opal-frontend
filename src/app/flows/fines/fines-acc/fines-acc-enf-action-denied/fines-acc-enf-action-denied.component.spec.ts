import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { FinesAccEnfActionDeniedComponent } from './fines-acc-enf-action-denied.component';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_DENIED_TYPES } from './constants/fines-acc-enf-action-denied-types.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';

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
      paramMap: new Map<string, string>([['type', FINES_ACC_ENF_ACTION_DENIED_TYPES.permission]]),
      data: {
        defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
        enforcementStatus: structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
        enforcementActionResult: null,
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
    mockActivatedRoute.snapshot.paramMap = new Map<string, string>([
      ['type', FINES_ACC_ENF_ACTION_DENIED_TYPES.permission],
    ]);
    mockActivatedRoute.snapshot.data = {
      defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      enforcementStatus: structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
      enforcementActionResult: null,
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
    mockActivatedRoute.snapshot.paramMap = new Map<string, string>([
      ['type', FINES_ACC_ENF_ACTION_DENIED_TYPES.enforcementHold],
    ]);
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('You must first remove the enforcement hold on the account.');
  });

  it('should use the last enforcement action from enforcement status for the no-next-actions message', () => {
    mockActivatedRoute.snapshot.paramMap = new Map<string, string>([
      ['type', FINES_ACC_ENF_ACTION_DENIED_TYPES.noNextActions],
    ]);
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      `${OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.last_enforcement_action!.enforcement_action.result_title} (${OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.last_enforcement_action!.enforcement_action.result_id})`,
    );
  });

  it('should set last enforcement action to null when enforcement status has no last action', () => {
    mockActivatedRoute.snapshot.paramMap = new Map<string, string>([
      ['type', FINES_ACC_ENF_ACTION_DENIED_TYPES.noNextActions],
    ]);
    mockActivatedRoute.snapshot.data.enforcementStatus = {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
      last_enforcement_action: null,
    };
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.lastEnforcementAction).toBeNull();
  });

  it('should render the missing employment data message with selected enforcement action details', () => {
    mockActivatedRoute.snapshot.paramMap = new Map<string, string>([
      ['type', FINES_ACC_ENF_ACTION_DENIED_TYPES.employmentData],
    ]);
    mockActivatedRoute.snapshot.data.enforcementActionResult = {
      result_title: 'Attachment of earnings order with collection order',
      result_id: 'AEOC',
    } as never;
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('You cannot add this enforcement action');
    expect(fixture.nativeElement.textContent).toContain('Attachment of earnings order with collection order (AEOC)');
    expect(fixture.nativeElement.textContent).toContain('The account has missing or incomplete employment details.');
  });

  it('should navigate back to the select enforcement action screen for the missing employment data message', () => {
    mockActivatedRoute.snapshot.paramMap = new Map<string, string>([
      ['type', FINES_ACC_ENF_ACTION_DENIED_TYPES.employmentData],
    ]);
    fixture = TestBed.createComponent(FinesAccEnfActionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.navigateBackToAccountSummary();

    expect(mockRouter.navigate).toHaveBeenCalledWith([`../${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`], {
      relativeTo: mockActivatedRoute,
    });
  });
});

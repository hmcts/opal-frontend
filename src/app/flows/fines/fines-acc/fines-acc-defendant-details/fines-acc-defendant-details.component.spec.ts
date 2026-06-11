import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsComponent } from './fines-acc-defendant-details.component';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab/fines-acc-defendant-details-at-a-glance-tab.component';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from './mocks/fines-acc-defendant-details-header.mock';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions.mock';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-parent-or-guardian-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-fixed-penalty.mock';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccDefendantDetailsComponent', () => {
  let component: FinesAccDefendantDetailsComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let routerSpy: any;
  let activatedRouteStub: Partial<ActivatedRoute>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPayloadService: any;

  beforeEach(async () => {
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
    };
    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
        },
        fragment: 'at-a-glance',
        paramMap: convertToParamMap({ accountId: '123' }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as ActivatedRouteSnapshot, // Using 'as any' to avoid type issues
    };

    mockPayloadService = {
      transformDefendantAccountHeaderForStore: vi
        .fn()
        .mockName('FinesAccPayloadService.transformDefendantAccountHeaderForStore'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
    };
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockPayloadService.transformPayload.mockImplementation((...args: any[]) => {
      return args[0]; // returns the first argument = payload
    });

    mockOpalFinesService = {
      getDefendantAccountHeadingData: vi.fn().mockName('OpalFines.getDefendantAccountHeadingData'),
      getDefendantAccountAtAGlance: vi.fn().mockName('OpalFines.getDefendantAccountAtAGlance'),
      getDefendantAccountImpositionsTabData: vi.fn().mockName('OpalFines.getDefendantAccountImpositionsTabData'),
      getDefendantAccountHistoryAndNotesTabData: vi
        .fn()
        .mockName('OpalFines.getDefendantAccountHistoryAndNotesTabData'),
      getDefendantAccountEnforcementStatus: vi.fn().mockName('OpalFines.getDefendantAccountEnforcementStatus'),
      getDefendantAccountPaymentTermsLatest: vi.fn().mockName('OpalFines.getDefendantAccountPaymentTermsLatest'),
      getDefendantAccountParty: vi.fn().mockName('OpalFines.getDefendantAccountParty'),
      getParentOrGuardianAccountParty: vi.fn().mockName('OpalFines.getParentOrGuardianAccountParty'),
      clearCache: vi.fn().mockName('OpalFines.clearCache'),
      getResult: vi.fn().mockName('OpalFines.getResult'),
      getDefendantAccountFixedPenalty: vi.fn().mockName('OpalFines.getDefendantAccountFixedPenalty'),
    };
    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK));
    mockOpalFinesService.getDefendantAccountAtAGlance.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK),
    );
    mockOpalFinesService.getDefendantAccountParty.mockReturnValue(of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK));
    mockOpalFinesService.getParentOrGuardianAccountParty.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountFixedPenalty.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK),
    );
    mockOpalFinesService.getDefendantAccountEnforcementStatus.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK),
    );
    mockOpalFinesService.getDefendantAccountHistoryAndNotesTabData.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getDefendantAccountImpositionsTabData.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK),
    );
    mockOpalFinesService.getResult.mockReturnValue(of(OPAL_FINES_RESULT_REF_DATA_MOCK));

    await TestBed.configureTestingModule({
      imports: [
        FinesAccDefendantDetailsComponent,
        FinesAccDefendantDetailsAtAGlanceTabComponent,
        MojSubNavigationComponent,
        MojSubNavigationItemComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to at-a-glance tab if no fragment is present', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.fragment = null; // Simulate no fragment
    component['getHeaderDataFromRoute']();
    expect(component.activeTab).toBe('at-a-glance');
  });

  it('should initialize accountData and activeTab from route data', () => {
    expect(component.accountData).toEqual(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    expect(component.activeTab).toBe('at-a-glance');
  });

  it('should allow adding parent or guardian details for a youth debtor account with no parent guardian', () => {
    component.accountData = {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      is_youth: true,
      debtor_type: component.debtorTypes.defendant,
      parent_guardian_party_id: null,
    };

    expect(component.canAddParentOrGuardianDetails).toBe(true);
  });

  it('should not allow adding parent or guardian details when a parent guardian already exists', () => {
    component.accountData = {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      is_youth: true,
      debtor_type: component.debtorTypes.defendant,
      parent_guardian_party_id: '123',
    };

    expect(component.canAddParentOrGuardianDetails).toBe(false);
  });

  it('should not allow adding parent or guardian details for non-youth accounts', () => {
    component.accountData = {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      is_youth: false,
      debtor_type: component.debtorTypes.defendant,
      parent_guardian_party_id: null,
    };

    expect(component.canAddParentOrGuardianDetails).toBe(false);
  });

  it('should not allow adding parent or guardian details when the parent guardian is the debtor', () => {
    component.accountData = {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      is_youth: true,
      debtor_type: component.debtorTypes.parentGuardian,
      parent_guardian_party_id: null,
    };

    expect(component.canAddParentOrGuardianDetails).toBe(false);
  });

  it('should show parent or guardian details when the parent guardian is the debtor', () => {
    component.accountData = {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      debtor_type: component.debtorTypes.parentGuardian,
      parent_guardian_party_id: null,
    };

    expect(component.hasParentOrGuardianDetails).toBe(true);
  });

  it('should show parent or guardian details when a parent guardian party exists', () => {
    component.accountData = {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      debtor_type: component.debtorTypes.defendant,
      parent_guardian_party_id: '123',
    };

    expect(component.hasParentOrGuardianDetails).toBe(true);
  });

  it('should not show parent or guardian details when no parent guardian exists', () => {
    component.accountData = {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      debtor_type: component.debtorTypes.defendant,
      parent_guardian_party_id: null,
    };

    expect(component.hasParentOrGuardianDetails).toBe(false);
  });

  it('should handle tab switch', () => {
    component.handleTabSwitch('details');
    expect(component.activeTab).toBe('details');
  });

  it('should call router.navigate when navigateToAddAccountNotePage is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(true);
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`], {
      relativeTo: component['activatedRoute'],
    });
  });

  it('should fetch the defendant tab data when fragment is changed to defendant', () => {
    component['refreshFragment$'].next('defendant');
    // Subscribe to trigger the pipe execution
    component.tabDefendant$.subscribe();
    expect(mockOpalFinesService.getDefendantAccountParty).toHaveBeenCalled();
    expect(mockPayloadService.transformPayload).toHaveBeenCalled();
  });

  it('should fetch the parent or guardian tab data when fragment is changed to parent-or-guardian', () => {
    component['refreshFragment$'].next('parent-or-guardian');
    // Subscribe to trigger the pipe execution
    component.tabParentOrGuardian$.subscribe();
    expect(mockOpalFinesService.getParentOrGuardianAccountParty).toHaveBeenCalled();
    expect(mockPayloadService.transformPayload).toHaveBeenCalled();
  });

  it('should fetch the fixed penalty tab data when fragment is changed to fixed-penalty', () => {
    component['refreshFragment$'].next('fixed-penalty');
    // Subscribe to trigger the pipe execution
    component.tabFixedPenalty$.subscribe();
    expect(mockOpalFinesService.getDefendantAccountFixedPenalty).toHaveBeenCalled();
    expect(mockPayloadService.transformPayload).toHaveBeenCalled();
  });

  it('should fetch the enforcement tab data when fragment is changed to enforcement', () => {
    component['refreshFragment$'].next('enforcement');
    // Subscribe to trigger the pipe execution
    component.tabEnforcement$.subscribe();
    expect(mockOpalFinesService.getDefendantAccountEnforcementStatus).toHaveBeenCalled();
    expect(mockPayloadService.transformPayload).toHaveBeenCalled();
  });

  it('should fetch the payment terms tab data when fragment is changed to payment-terms', () => {
    component['refreshFragment$'].next('payment-terms');
    component.tabPaymentTerms$.subscribe();
    expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalled();
    expect(mockOpalFinesService.getResult).toHaveBeenCalled();
  });

  it('should not fetch the enforcement result when payment terms has no last enforcement', () => {
    mockOpalFinesService.getResult.mockClear();
    mockOpalFinesService.getDefendantAccountPaymentTermsLatest.mockReturnValue(
      of({
        ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK),
        last_enforcement: null,
      }),
    );

    component['refreshFragment$'].next('payment-terms');
    component.tabPaymentTerms$.subscribe();

    expect(mockOpalFinesService.getDefendantAccountPaymentTermsLatest).toHaveBeenCalled();
    expect(mockOpalFinesService.getResult).not.toHaveBeenCalled();
    expect(component.lastEnforcement).toBeNull();
  });

  it('should fetch the history and notes tab data when fragment is changed to history-and-notes', () => {
    component['refreshFragment$'].next('history-and-notes');
    expect(mockOpalFinesService.getDefendantAccountHistoryAndNotesTabData).toHaveBeenCalled();
  });

  it('should fetch the impositions tab data when fragment is changed to impositions', () => {
    component['refreshFragment$'].next('impositions');
    expect(mockOpalFinesService.getDefendantAccountImpositionsTabData).toHaveBeenCalledWith(
      MOCK_FINES_ACCOUNT_STATE.account_id,
    );
  });

  it('should refresh the data for the header and current tab when refreshPage is called', () => {
    component.accountStore.setAccountState(MOCK_FINES_ACCOUNT_STATE);
    component.refreshPage();
    expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(
      Number(MOCK_FINES_ACCOUNT_STATE.account_id),
    );
  });

  it('should navigate to access-denied if user lacks permission for the add account note page', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
    component.navigateToAddAccountNotePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/access-denied'], {
      relativeTo: component['activatedRoute'],
    });
  });

  describe('should get the relevant denied type from getRequestPaymentCardDeniedType', () => {
    it('for an enforcement with prevent_payment_card should return "enforcement"', () => {
      component.lastEnforcement = structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK);
      component.lastEnforcement.prevent_payment_card = true;
      const deniedType = component['getRequestPaymentCardDeniedType']();
      expect(deniedType).toBe('enforcement');
    });

    it('for a lack of permission with a BU should return "permission"', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
      const deniedType = component['getRequestPaymentCardDeniedType']();
      expect(deniedType).toBe('permission');
    });
  });

  describe('should get the relevant denied type from getAmendPaymentTermsDeniedType', () => {
    it('for a balance of 0 should return "balance"', () => {
      component.accountData.payment_state_summary.account_balance = 0;
      const deniedType = component['getAmendPaymentTermsDeniedType']();
      expect(deniedType).toBe('balance');
    });

    it('for an enforcement with extend_ttp_disallow should return "enforcement"', () => {
      component.lastEnforcement = structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK);
      component.lastEnforcement.extend_ttp_disallow = true;
      const deniedType = component['getAmendPaymentTermsDeniedType']();
      expect(deniedType).toBe('enforcement');
    });

    it('for a lack of permission with a BU should return "permission"', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
      const deniedType = component['getAmendPaymentTermsDeniedType']();
      expect(deniedType).toBe('permission');
    });

    it('for an invalid account status shouldreturn "account-status"', () => {
      component.accountData.account_status_reference.account_status_code = 'REW';
      const deniedType = component['getAmendPaymentTermsDeniedType']();
      expect(deniedType).toBe('account-status');
    });
  });

  describe('should get the correct response from canRequestPaymentCard', () => {
    it('when the user has amend-payment-terms permisson and the prevent_payment_card flag is set to false', () => {
      component.lastEnforcement = structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK);
      component.lastEnforcement.prevent_payment_card = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(true);
      const canRequest = component['canRequestPaymentCard']();
      expect(canRequest).toBe(true);
    });
    it('when the user has amend-payment-terms permisson and the prevent_payment_card flag is set to true', () => {
      component.lastEnforcement = structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK);
      component.lastEnforcement.prevent_payment_card = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(true);
      const canRequest = component['canRequestPaymentCard']();
      expect(canRequest).toBe(false);
    });
    it('when the user does not have amend-payment-terms permisson and the prevent_payment_card flag is set to true', () => {
      component.lastEnforcement = structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK);
      component.lastEnforcement.prevent_payment_card = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
      const canRequest = component['canRequestPaymentCard']();
      expect(canRequest).toBe(false);
    });
    it('when the user does not have amend-payment-terms permisson and the prevent_payment_card flag is set to false', () => {
      component.lastEnforcement = structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK);
      component.lastEnforcement.prevent_payment_card = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn<any, any>(component['permissionsService'], 'hasBusinessUnitPermissionAccess').mockReturnValue(false);
      const canRequest = component['canRequestPaymentCard']();
      expect(canRequest).toBe(false);
    });
  });
});

import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinesAccPartyAddAmendConvert } from './fines-acc-party-add-amend-convert.component';
import { MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA } from './mocks/fines-acc-party-add-amend-convert-form-empty.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK } from '../services/mocks/opal-fines-account-defendant-account-party-null-data.mock';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-party-details.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES } from './constants/fines-acc-party-add-amend-convert-modes.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from './constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT } from './constants/fines-acc-party-add-amend-convert-text.constant';

describe('FinesAccPartyAddAmendConvert', () => {
  let component: FinesAccPartyAddAmendConvert;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvert>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPayloadService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let mockFinesAccStore: {
    account_id: Mock;
    party_id: Mock;
    pg_party_id: Mock;
    base_version: Mock;
    business_unit_id: Mock;
    account_number: Mock;
    party_name: Mock;
    welsh_speaking: Mock;
    setSuccessMessage: Mock;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  let createComponent: (
    routeParams?: Partial<{
      partyType: string;
      accountId: string;
      mode: string;
    }>,
  ) => void;
  let mockActivatedRoute: {
    snapshot: {
      data: {
        partyAddAmendConvertData: typeof OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK & {
          version: string;
        };
      };
      params: {
        partyType: string;
        accountId: string;
        mode: string;
      };
    };
  };

  beforeEach(async () => {
    mockPayloadService = {
      mapDebtorAccountPartyPayload: vi.fn().mockName('FinesAccPayloadService.mapDebtorAccountPartyPayload'),
      buildAccountPartyPayload: vi.fn().mockName('FinesAccPayloadService.buildAccountPartyPayload'),
      buildAddDefendantAccountPayload: vi.fn().mockName('FinesAccPayloadService.buildAddDefendantAccountPayload'),
    };
    mockOpalFinesService = {
      putDefendantAccountParty: vi.fn().mockName('OpalFines.putDefendantAccountParty'),
      postDefendantAccountParty: vi.fn().mockName('OpalFines.postDefendantAccountParty'),
      clearCache: vi.fn().mockName('OpalFines.clearCache'),
    };
    mockFinesAccStore = {
      account_id: vi.fn().mockReturnValue(123),
      party_id: vi.fn().mockReturnValue('party-123'),
      pg_party_id: vi.fn().mockReturnValue('pg-party-123'),
      base_version: vi.fn().mockReturnValue('1'),
      business_unit_id: vi.fn().mockReturnValue('bu-123'),
      account_number: vi.fn().mockReturnValue('12345ABC'),
      party_name: vi.fn().mockReturnValue('John Doe'),
      welsh_speaking: vi.fn().mockReturnValue('Yes'),
      setSuccessMessage: vi.fn(),
    };
    mockUtilsService = {
      scrollToTop: vi.fn().mockName('UtilsService.scrollToTop'),
    };
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };
    mockActivatedRoute = {
      snapshot: {
        data: {
          partyAddAmendConvertData: {
            ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
            version: '1',
          },
        },
        params: {
          partyType: 'individual',
          accountId: '123',
          mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.AMEND,
        },
      },
    };

    // Set up default return values
    mockPayloadService.mapDebtorAccountPartyPayload.mockReturnValue(
      MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
    );
    mockPayloadService.buildAccountPartyPayload.mockReturnValue({} as IOpalFinesAccountPartyDetails);
    mockPayloadService.buildAddDefendantAccountPayload.mockReturnValue({
      defendant_account_party: {} as IOpalFinesAccountPartyDetails,
    });
    mockOpalFinesService.putDefendantAccountParty.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK),
    );
    mockOpalFinesService.postDefendantAccountParty.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK),
    );

    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvert],
      providers: [
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccountStore, useValue: mockFinesAccStore },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    createComponent = (routeParams = {}) => {
      mockActivatedRoute.snapshot.params = {
        ...mockActivatedRoute.snapshot.params,
        ...routeParams,
      };
      fixture = TestBed.createComponent(FinesAccPartyAddAmendConvert);
      component = fixture.componentInstance;
      fixture.detectChanges();
    };

    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read amend mode from the route by default', () => {
    expect(component['mode']).toBe(FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.AMEND);
  });

  it('should read convert mode from the route', () => {
    createComponent({ mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT });

    expect(component['mode']).toBe(FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT);
  });

  it('should read add mode from the route', () => {
    mockPayloadService.mapDebtorAccountPartyPayload.mockClear();
    createComponent({
      mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.ADD,
      partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN,
    });

    expect(component['mode']).toBe(FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.ADD);
    expect(component['isDebtor']).toBe(false);
    expect(mockPayloadService.mapDebtorAccountPartyPayload).not.toHaveBeenCalled();
  });

  it('should handle form submission for individual party type', () => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Act
    component.handleFormSubmit(mockFormData);

    // Assert
    expect(mockOpalFinesService.putDefendantAccountParty).toHaveBeenCalledWith(
      123, // account_id
      'party-123', // party_id (for individual)
      expect.any(Object), // payload
      expect.any(String), // version
      'bu-123',
    );
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPartyCache$');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'defendant',
    });
  });

  it('should handle form submission for parentGuardian party type', () => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    createComponent({ partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN });

    // Act
    component.handleFormSubmit(mockFormData);

    // Assert
    expect(mockOpalFinesService.putDefendantAccountParty).toHaveBeenCalledWith(
      123, // account_id
      'pg-party-123', // pg_party_id (for parentGuardian)
      expect.any(Object), // payload
      expect.any(String), // version
      'bu-123',
    );
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPartyCache$');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'parent-or-guardian',
    });
  });

  it('should post a wrapped parentGuardian payload in add mode', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    createComponent({
      mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.ADD,
      partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN,
    });
    mockFinesAccStore.pg_party_id.mockReturnValue(null);

    component.handleFormSubmit(mockFormData);

    expect(mockPayloadService.buildAddDefendantAccountPayload).toHaveBeenCalledWith(
      mockFormData.formData,
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN,
      false,
      '',
    );
    expect(mockPayloadService.buildAccountPartyPayload).not.toHaveBeenCalled();
    expect(mockOpalFinesService.postDefendantAccountParty).toHaveBeenCalledWith(123, expect.any(Object), '1', 'bu-123');
    expect(mockOpalFinesService.putDefendantAccountParty).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'parent-or-guardian',
    });
  });

  it('should initialise the parent guardian fragment from route party type', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvert],
      providers: [
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccountStore, useValue: mockFinesAccStore },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                partyAddAmendConvertData: {
                  ...OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK,
                  version: '1',
                },
              },
              params: {
                partyType: 'parentGuardian',
                accountId: '123',
              },
            },
          },
        },
      ],
    }).compileComponents();

    const freshFixture = TestBed.createComponent(FinesAccPartyAddAmendConvert);
    const freshComponent = freshFixture.componentInstance;
    freshFixture.detectChanges();

    expect(freshComponent['fragment']).toBe('parent-or-guardian');
  });

  it('should call utilsService.scrollToTop on API call failure and reset unsaved changes', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Reset the existing spy and set up error response
    mockUtilsService.scrollToTop.mockClear();
    mockOpalFinesService.putDefendantAccountParty.mockReturnValue(throwError(() => new Error('API Error')));

    component.handleFormSubmit(mockFormData);

    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(component.stateUnsavedChanges).toBe(true);
  });

  it('should navigate to details page on successful API call', () => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Reset router spy and setup successful response
    mockRouter.navigate.mockClear();
    mockOpalFinesService.putDefendantAccountParty.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK),
    );

    // Act
    component.handleFormSubmit(mockFormData);

    // Assert
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPartyCache$');
    expect(mockFinesAccStore.setSuccessMessage).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'defendant',
    });
  });

  it('should navigate with parent-or-guardian fragment for parentGuardian party type on success', () => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    createComponent({ partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN });

    // Reset router spy and setup successful response
    mockRouter.navigate.mockClear();
    mockOpalFinesService.putDefendantAccountParty.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK),
    );

    // Act
    component.handleFormSubmit(mockFormData);

    // Assert
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPartyCache$');
    expect(mockFinesAccStore.setSuccessMessage).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'parent-or-guardian',
    });
  });

  it('should set a success message when converting to a company account', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    createComponent({
      mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT,
      partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY,
    });

    component.handleFormSubmit(mockFormData);

    expect(mockFinesAccStore.setSuccessMessage).toHaveBeenCalledWith(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY].successMessage,
    );
  });

  it('should set a success message when converting to an individual account', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    createComponent({
      mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT,
      partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL,
    });

    component.handleFormSubmit(mockFormData);

    expect(mockFinesAccStore.setSuccessMessage).toHaveBeenCalledWith(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL].successMessage,
    );
  });

  it('should not set a success message when convert mode is used with an unsupported party type', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    createComponent({
      mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT,
      partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN,
    });

    component.handleFormSubmit(mockFormData);

    expect(mockFinesAccStore.setSuccessMessage).not.toHaveBeenCalled();
  });

  it('should not require pg_party_id when parentGuardian party type is in add mode', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    createComponent({
      mode: FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.ADD,
      partyType: FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN,
    });
    mockFinesAccStore.pg_party_id.mockReturnValue(null);
    mockRouter.navigate.mockClear();

    component.handleFormSubmit(mockFormData);

    expect(mockOpalFinesService.postDefendantAccountParty).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'parent-or-guardian',
    });
  });

  it('should proceed with API call when all store values are present and valid', () => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Ensure all store values are valid
    mockFinesAccStore.account_id.mockReturnValue(123);
    mockFinesAccStore.business_unit_id.mockReturnValue('bu-123');
    mockFinesAccStore.party_id.mockReturnValue('party-123');
    mockRouter.navigate.mockClear();

    // Act
    component.handleFormSubmit(mockFormData);

    // Assert
    expect(mockOpalFinesService.putDefendantAccountParty).toHaveBeenCalled();
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPartyCache$');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'defendant',
    });
  });

  it('should correctly set stateUnsavedChanges based on input value', () => {
    // Test with true
    component.handleUnsavedChanges(true);
    expect(component.stateUnsavedChanges).toBe(true);

    // Test with false
    component.handleUnsavedChanges(false);
    expect(component.stateUnsavedChanges).toBe(false);

    // Test toggling
    component.handleUnsavedChanges(true);
    expect(component.stateUnsavedChanges).toBe(true);
  });
});

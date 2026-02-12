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
    business_unit_id: Mock;
    account_number: Mock;
    party_name: Mock;
    welsh_speaking: Mock;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(async () => {
    mockPayloadService = {
      mapDebtorAccountPartyPayload: vi.fn().mockName('FinesAccPayloadService.mapDebtorAccountPartyPayload'),
      buildAccountPartyPayload: vi.fn().mockName('FinesAccPayloadService.buildAccountPartyPayload'),
    };
    mockOpalFinesService = {
      putDefendantAccountParty: vi.fn().mockName('OpalFines.putDefendantAccountParty'),
      clearCache: vi.fn().mockName('OpalFines.clearCache'),
    };
    mockFinesAccStore = {
      account_id: vi.fn().mockReturnValue(123),
      party_id: vi.fn().mockReturnValue('party-123'),
      pg_party_id: vi.fn().mockReturnValue('pg-party-123'),
      business_unit_id: vi.fn().mockReturnValue('bu-123'),
      account_number: vi.fn().mockReturnValue('12345ABC'),
      party_name: vi.fn().mockReturnValue('John Doe'),
      welsh_speaking: vi.fn().mockReturnValue('Yes'),
    };
    mockUtilsService = {
      scrollToTop: vi.fn().mockName('UtilsService.scrollToTop'),
    };
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    // Set up default return values
    mockPayloadService.mapDebtorAccountPartyPayload.mockReturnValue(
      MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
    );
    mockPayloadService.buildAccountPartyPayload.mockReturnValue({} as IOpalFinesAccountPartyDetails);
    mockOpalFinesService.putDefendantAccountParty.mockReturnValue(
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
                partyType: 'individual',
                accountId: '123',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    // Override partyType for this test
    Object.defineProperty(component, 'partyType', { value: 'parentGuardian', writable: true });
    Object.defineProperty(component, 'fragment', { value: 'parent-or-guardian', writable: true });

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

    // Override partyType for this test
    Object.defineProperty(component, 'partyType', { value: 'parentGuardian', writable: true });
    Object.defineProperty(component, 'fragment', { value: 'parent-or-guardian', writable: true });

    // Reset router spy and setup successful response
    mockRouter.navigate.mockClear();
    mockOpalFinesService.putDefendantAccountParty.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK),
    );

    // Act
    component.handleFormSubmit(mockFormData);

    // Assert
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountPartyCache$');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'parent-or-guardian',
    });
  });

  it('should redirect to details page when required store values are missing', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    const testCases = [
      { description: 'account_id is null', account_id: null, business_unit_id: 'bu-123', party_id: 'party-123' },
      { description: 'business_unit_id is null', account_id: 123, business_unit_id: null, party_id: 'party-123' },
      { description: 'party_id is null', account_id: 123, business_unit_id: 'bu-123', party_id: null },
      {
        description: 'account_id is undefined',
        account_id: undefined,
        business_unit_id: 'bu-123',
        party_id: 'party-123',
      },
      { description: 'account_id is empty string', account_id: '', business_unit_id: 'bu-123', party_id: 'party-123' },
    ];

    testCases.forEach((testCase) => {
      mockFinesAccStore.account_id.mockReturnValue(testCase.account_id);
      mockFinesAccStore.business_unit_id.mockReturnValue(testCase.business_unit_id);
      mockFinesAccStore.party_id.mockReturnValue(testCase.party_id);
      mockRouter.navigate.mockClear();

      component.handleFormSubmit(mockFormData);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
        relativeTo: undefined,
        fragment: 'defendant',
      });
      expect(mockOpalFinesService.putDefendantAccountParty).not.toHaveBeenCalled();
    });
  });

  it('should redirect to details page when pg_party_id is missing for parentGuardian party type', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    Object.defineProperty(component, 'partyType', { value: 'parentGuardian', writable: true });
    mockFinesAccStore.pg_party_id.mockReturnValue(null);
    mockRouter.navigate.mockClear();

    component.handleFormSubmit(mockFormData);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: undefined,
      fragment: 'defendant',
    });
    expect(mockOpalFinesService.putDefendantAccountParty).not.toHaveBeenCalled();
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

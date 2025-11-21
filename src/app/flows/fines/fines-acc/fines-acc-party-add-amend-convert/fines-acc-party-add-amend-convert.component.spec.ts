import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinesAccPartyAddAmendConvert } from './fines-acc-party-add-amend-convert.component';
import { MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA } from './mocks/fines-acc-party-add-amend-convert-form.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK } from '../services/mocks/opal-fines-account-defendant-account-party-null-data.mock';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

describe('FinesAccPartyAddAmendConvert', () => {
  let component: FinesAccPartyAddAmendConvert;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvert>;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockFinesAccStore: {
    account_id: jasmine.Spy;
    party_id: jasmine.Spy;
    pg_party_id: jasmine.Spy;
    business_unit_id: jasmine.Spy;
    account_number: jasmine.Spy;
    party_name: jasmine.Spy;
    welsh_speaking: jasmine.Spy;
  };
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPayloadService = jasmine.createSpyObj('FinesAccPayloadService', [
      'mapDebtorAccountPartyPayload',
      'buildAccountPartyPayload',
    ]);
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['putDefendantAccountParty', 'clearAccountDetailsCache']);
    mockFinesAccStore = {
      account_id: jasmine.createSpy().and.returnValue(123),
      party_id: jasmine.createSpy().and.returnValue('party-123'),
      pg_party_id: jasmine.createSpy().and.returnValue('pg-party-123'),
      business_unit_id: jasmine.createSpy().and.returnValue('bu-123'),
      account_number: jasmine.createSpy().and.returnValue('12345ABC'),
      party_name: jasmine.createSpy().and.returnValue('John Doe'),
      welsh_speaking: jasmine.createSpy().and.returnValue('Yes'),
    };
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['scrollToTop']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up default return values
    mockPayloadService.mapDebtorAccountPartyPayload.and.returnValue(
      MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
    );
    mockPayloadService.buildAccountPartyPayload.and.returnValue({} as IOpalFinesAccountPartyDetails);
    mockOpalFinesService.putDefendantAccountParty.and.returnValue(
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

  it('should handle form submission for individual party type', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Act
    component.handleFormSubmit(mockFormData);
    tick(); // Allow async operations to complete

    // Assert
    expect(mockOpalFinesService.putDefendantAccountParty).toHaveBeenCalledWith(
      123, // account_id
      'party-123', // party_id (for individual)
      jasmine.any(Object), // payload
      jasmine.any(String), // version
      'bu-123', // business_unit_id
    );
    expect(mockOpalFinesService.clearAccountDetailsCache).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
      relativeTo: jasmine.any(Object),
      fragment: 'defendant',
    });
  }));

  it('should handle form submission for parentGuardian party type', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Override partyType for this test
    Object.defineProperty(component, 'partyType', { value: 'parentGuardian', writable: true });

    // Act
    component.handleFormSubmit(mockFormData);
    tick(); // Allow async operations to complete

    // Assert
    expect(mockOpalFinesService.putDefendantAccountParty).toHaveBeenCalledWith(
      123, // account_id
      'pg-party-123', // pg_party_id (for parentGuardian)
      jasmine.any(Object), // payload
      jasmine.any(String), // version
      'bu-123', // business_unit_id
    );
    expect(mockOpalFinesService.clearAccountDetailsCache).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
      relativeTo: jasmine.any(Object),
      fragment: 'parent-or-guardian',
    });
  }));

  it('should call utilsService.scrollToTop on API call failure and reset unsaved changes', fakeAsync(() => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Reset the existing spy and set up error response
    mockUtilsService.scrollToTop.calls.reset();
    mockOpalFinesService.putDefendantAccountParty.and.returnValue(throwError(() => new Error('API Error')));

    component.handleFormSubmit(mockFormData);
    tick(); // Wait for error to be handled

    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(component.stateUnsavedChanges).toBeTrue();
  }));

  it('should navigate to details page on successful API call', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Reset router spy and setup successful response
    mockRouter.navigate.calls.reset();
    mockOpalFinesService.putDefendantAccountParty.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK),
    );

    // Act
    component.handleFormSubmit(mockFormData);
    tick(); // Wait for observable to complete

    // Assert
    expect(mockOpalFinesService.clearAccountDetailsCache).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
      relativeTo: jasmine.any(Object),
      fragment: 'defendant',
    });
  }));

  it('should navigate with parent-or-guardian fragment for parentGuardian party type on success', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Override partyType for this test
    Object.defineProperty(component, 'partyType', { value: 'parentGuardian', writable: true });

    // Reset router spy and setup successful response
    mockRouter.navigate.calls.reset();
    mockOpalFinesService.putDefendantAccountParty.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK),
    );

    // Act
    component.handleFormSubmit(mockFormData);
    tick(); // Wait for observable to complete

    // Assert
    expect(mockOpalFinesService.clearAccountDetailsCache).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
      relativeTo: jasmine.any(Object),
      fragment: 'parent-or-guardian',
    });
  }));

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
      mockFinesAccStore.account_id.and.returnValue(testCase.account_id);
      mockFinesAccStore.business_unit_id.and.returnValue(testCase.business_unit_id);
      mockFinesAccStore.party_id.and.returnValue(testCase.party_id);
      mockRouter.navigate.calls.reset();

      component.handleFormSubmit(mockFormData);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
        relativeTo: jasmine.any(Object),
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
    mockFinesAccStore.pg_party_id.and.returnValue(null);
    mockRouter.navigate.calls.reset();

    component.handleFormSubmit(mockFormData);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
      relativeTo: jasmine.any(Object),
    });
    expect(mockOpalFinesService.putDefendantAccountParty).not.toHaveBeenCalled();
  });

  it('should proceed with API call when all store values are present and valid', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
      nestedFlow: false,
    };

    // Ensure all store values are valid
    mockFinesAccStore.account_id.and.returnValue(123);
    mockFinesAccStore.business_unit_id.and.returnValue('bu-123');
    mockFinesAccStore.party_id.and.returnValue('party-123');
    mockRouter.navigate.calls.reset();

    // Act
    component.handleFormSubmit(mockFormData);
    tick(); // Wait for observable to complete

    // Assert
    expect(mockOpalFinesService.putDefendantAccountParty).toHaveBeenCalled();
    expect(mockOpalFinesService.clearAccountDetailsCache).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../details'], {
      relativeTo: jasmine.any(Object),
      fragment: 'defendant',
    });
  }));

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

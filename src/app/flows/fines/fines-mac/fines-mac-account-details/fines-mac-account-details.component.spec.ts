import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountDetailsComponent } from './fines-mac-account-details.component';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from './constants/fines-mac-account-details-state';
import { of } from 'rxjs';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../fines-mac-personal-details/constants/fines-mac-personal-details-form';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { FINES_DRAFT_STATE } from '../../fines-draft/constants/fines-draft-state.constant';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { IFetchMapFinesMacPayload } from '../routing/resolvers/fetch-map-fines-mac-payload-resolver/interfaces/fetch-map-fines-mac-payload.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FinesDraftStoreType } from '../../fines-draft/stores/types/fines-draft.type';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../constants/fines-mac-defendant-types-keys';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { FINES_MAC_ACCOUNT_TYPES } from '../constants/fines-mac-account-types';

describe('FinesMacAccountDetailsComponent', () => {
  let component: FinesMacAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacAccountDetailsComponent>;
  let finesMacStore: FinesMacStoreType;
  let finesDraftStore: FinesDraftStoreType;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'checkFormValues',
      'checkFormArrayValues',
      'upperCaseFirstLetter',
      'getFormStatus',
      'getFormArrayStatus',
    ]);
    mockDateService = jasmine.createSpyObj(DateService, [
      'getFromFormatToFormat',
      'calculateAge',
      'getFromFormat',
      'isValidDate',
    ]);
    mockFinesMacPayloadService = jasmine.createSpyObj(FinesMacPayloadService, ['mapAccountPayload']);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountDetailsComponent],
      providers: [
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacAccountDetailsComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE);

    finesDraftStore = TestBed.inject(FinesDraftStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    finesDraftStore.setAmend(true);
    finesDraftStore.setFragment('rejected');
    component.navigateBack();

    expect(routerSpy).toHaveBeenCalledWith(
      [
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}/${component['finesDraftCreateAndManageRoutes'].children.tabs}`,
      ],
      {
        relativeTo: jasmine.any(Object),
        state: { fragment: 'rejected' },
      },
    );
  });

  it('should navigate back on navigateBack when fragment is empty', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    finesDraftStore.setAmend(true);
    finesDraftStore.setFragment('');
    component.navigateBack();

    expect(routerSpy).toHaveBeenCalledWith(
      [
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}/${component['finesDraftCreateAndManageRoutes'].children.tabs}`,
      ],
      {
        relativeTo: jasmine.any(Object),
      },
    );
  });

  it('should set defendantType and accountType to be empty string', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState.accountDetails.formData = {
      ...structuredClone(FINES_MAC_ACCOUNT_DETAILS_STATE),
      fm_create_account_defendant_type: '',
    };
    finesMacStore.setFinesMacStore(finesMacState);
    component.defendantType = '';

    component['setDefendantType']();
    component['setAccountType']();

    expect(component.defendantType).toEqual('');
    expect(component.accountType).toEqual('');
  });

  it('should set defendantType and accountType to values', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState.accountDetails.formData = {
      ...structuredClone(FINES_MAC_ACCOUNT_DETAILS_STATE),
      fm_create_account_defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly,
      fm_create_account_account_type: FINES_MAC_ACCOUNT_TYPES['Conditional Caution'],
    };
    finesMacStore.setFinesMacStore(finesMacState);

    component['setDefendantType']();
    component['setAccountType']();

    expect(component.defendantType).toEqual('Adult or youth only');
    expect(component.accountType).toEqual(FINES_MAC_ACCOUNT_TYPES['Conditional Caution']);
  });

  it('should set documentLanguage and courtHearingLanguage correctly', () => {
    const documentLanguage = 'CY';
    const hearingLanguage = 'EN';
    const finesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState.languagePreferences.formData = {
      ...structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK),
      fm_language_preferences_document_language: documentLanguage,
      fm_language_preferences_hearing_language: hearingLanguage,
    };
    finesMacStore.setFinesMacStore(finesMacState);

    component['setLanguage']();

    expect(component.documentLanguage).toEqual(
      component['languageOptions'][documentLanguage as keyof IFinesMacLanguagePreferencesOptions],
    );
    expect(component.courtHearingLanguage).toEqual(
      component['languageOptions'][hearingLanguage as keyof IFinesMacLanguagePreferencesOptions],
    );
  });

  it('should set documentLanguage and courtHearingLanguage to empty strings if the provided languages are not in the languages list', () => {
    const documentLanguage = 'german';
    const hearingLanguage = 'french';
    const finesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState.languagePreferences.formData = {
      ...structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK),
      fm_language_preferences_document_language: documentLanguage,
      fm_language_preferences_hearing_language: hearingLanguage,
    };
    finesMacStore.setFinesMacStore(finesMacState);

    component['setLanguage']();

    expect(component.documentLanguage).toBe('');
    expect(component.courtHearingLanguage).toBe('');
  });

  it('should call setDefendantType and setAccountType on initialAccountDetailsSetup', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'accountDetailsFetchedMappedPayload');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'fetchTimelineData');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountDetailsStatus');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setDefendantType');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountType');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setLanguage');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'checkMandatorySections');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'routerListener');

    component['initialAccountDetailsSetup']();

    expect(component['accountDetailsFetchedMappedPayload']).toHaveBeenCalled();
    expect(component['fetchTimelineData']).toHaveBeenCalled();
    expect(component['setAccountDetailsStatus']).toHaveBeenCalled();
    expect(component['setDefendantType']).toHaveBeenCalled();
    expect(component['setAccountType']).toHaveBeenCalled();
    expect(component['setLanguage']).toHaveBeenCalled();
    expect(component['checkMandatorySections']).toHaveBeenCalled();
    expect(component['routerListener']).toHaveBeenCalled();
  });

  it('should navigate back on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.pageNavigation = true;

    component.navigateBack();

    expect(component.pageNavigation).toBe(false);
    expect(routerSpy).toHaveBeenCalledWith([component['fineMacRoutes'].children.createAccount], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should set pageNavigation to true if URL does not include createAccount', () => {
    component['routerListener']();
    component.navigateBack();

    expect(component.pageNavigation).toBeTrue();
  });

  it('should set pageNavigation to false if URL includes createAccount', () => {
    component['routerListener']();
    // Simulate navigating to a route that includes createAccount
    const routerSpy = spyOn(component['router'], 'navigate');
    component.navigateBack();

    expect(routerSpy).toHaveBeenCalled();
  });

  it('should call canDeactivate ', () => {
    component['pageNavigation'] = true;
    expect(component['canDeactivate']()).toBeTruthy();

    component['pageNavigation'] = false;
    expect(component['canDeactivate']()).toBeFalsy();
  });

  it('should return true if personalDetails is true', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState.accountDetails.formData = {
      ...structuredClone(FINES_MAC_ACCOUNT_DETAILS_STATE),
      fm_create_account_defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay,
      fm_create_account_account_type: FINES_MAC_ACCOUNT_TYPES.Fine,
      fm_create_account_business_unit_id: 1,
    };
    finesMacState.personalDetails = structuredClone(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK);
    finesMacStore.setFinesMacStore(finesMacState);

    mockUtilsService.getFormStatus.and.returnValue(FINES_MAC_STATUS.PROVIDED);

    const result = component['canAccessPaymentTerms']();

    expect(result).toBe(true);
  });

  it('should return true if defendantType is in paymentTermsBypassDefendantTypes', () => {
    finesMacStore.setPersonalDetails(FINES_MAC_PERSONAL_DETAILS_FORM);
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay;
    component.paymentTermsBypassDefendantTypes = [
      FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay,
      FINES_MAC_DEFENDANT_TYPES_KEYS.company,
    ];

    const result = component['canAccessPaymentTerms']();

    expect(result).toBe(true);
  });

  it('should return false if personalDetails is false and defendantType is not in paymentTermsBypassDefendantTypes', () => {
    finesMacStore.setPersonalDetails(FINES_MAC_PERSONAL_DETAILS_FORM);
    component.defendantType = 'test';
    component.paymentTermsBypassDefendantTypes = [
      FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay,
      FINES_MAC_DEFENDANT_TYPES_KEYS.company,
    ];

    const result = component['canAccessPaymentTerms']();

    expect(result).toBe(false);
  });

  it('should test checkMandatorySections with the different defendant types', () => {
    const adultOrYouthOnly = structuredClone(FINES_MAC_STATE);
    adultOrYouthOnly.accountDetails.formData = {
      ...adultOrYouthOnly.accountDetails.formData,
      fm_create_account_defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly,
    };
    finesMacStore.setFinesMacStore(adultOrYouthOnly);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const parentOrGuardianToPay = structuredClone(adultOrYouthOnly);
    parentOrGuardianToPay.accountDetails.formData = {
      ...parentOrGuardianToPay.accountDetails.formData,
      fm_create_account_defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay,
    };
    finesMacStore.setFinesMacStore(parentOrGuardianToPay);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const company = structuredClone(parentOrGuardianToPay);
    company.accountDetails.formData = {
      ...company.accountDetails.formData,
      fm_create_account_defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.company,
    };
    finesMacStore.setFinesMacStore(company);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const defaultCase = structuredClone(company);
    defaultCase.accountDetails.formData = {
      ...defaultCase.accountDetails.formData,
      fm_create_account_defendant_type: 'defaultCase',
    };
    finesMacStore.setFinesMacStore(defaultCase);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();
  });

  it('should test accountDetailsFetchedMappedPayload', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountDetailsStatus');
    const snapshotData: IFetchMapFinesMacPayload = {
      finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
      finesMacDraft: { ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT), account_status: 'Rejected' },
      courts: OPAL_FINES_COURT_REF_DATA_MOCK,
      localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
      majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
      results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
      prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
    };
    component['activatedRoute'].snapshot = {
      data: {
        accountDetailsFetchMap: snapshotData,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component['accountDetailsFetchedMappedPayload']();

    expect(finesDraftStore.getFinesDraftState()).toEqual(snapshotData.finesMacDraft);
    expect(finesMacStore.getFinesMacStore()).toEqual(snapshotData.finesMacState);
    expect(component['setAccountDetailsStatus']).toHaveBeenCalled();
  });

  it('should test accountDetailsFetchedMappedPayload', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountDetailsStatus');
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE));
    finesDraftStore.setFinesDraftState(structuredClone(FINES_DRAFT_STATE));
    const snapshotData: IFetchMapFinesMacPayload = {
      finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
      finesMacDraft: structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
      courts: OPAL_FINES_COURT_REF_DATA_MOCK,
      localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
      majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
      results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
      prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
    };
    component['activatedRoute'].snapshot = {
      data: {
        test: snapshotData,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component['accountDetailsFetchedMappedPayload']();

    expect(finesMacStore.getFinesMacStore()).toEqual(FINES_MAC_STATE);
    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
    expect(component['setAccountDetailsStatus']).not.toHaveBeenCalled();
  });

  it('should test fetchTimelineData when timeline_data is null', () => {
    finesDraftStore.setFinesDraftState(structuredClone(FINES_DRAFT_STATE));
    component['fetchTimelineData']();
    expect(component.timelineData).toEqual([]);
  });

  it('should test fetchTimelineData when timeline_data is populated', () => {
    const timelineData = [
      {
        status: 'Submitted',
        username: 'opal-test',
        reason_text: null,
        status_date: '2025-05-28',
      },
      {
        status: 'Rejected',
        username: 'opal-test-10',
        reason_text: 'Please add defendant contact details',
        status_date: '2025-05-28',
      },
    ];
    finesDraftStore.setFinesDraftState({ ...structuredClone(FINES_DRAFT_STATE), timeline_data: timelineData });
    component['fetchTimelineData']();
    expect(component.timelineData).toEqual(timelineData.reverse());
  });

  it('should test setAccountDetailsStatus when draft state is null', () => {
    finesDraftStore.setFinesDraftState(structuredClone(FINES_DRAFT_STATE));
    component['setAccountDetailsStatus']();
    expect(component.accountDetailsStatus).toBeUndefined();
  });

  it('should test setAccountDetailsStatus when draft state is populated', () => {
    finesDraftStore.setFinesDraftState({ ...structuredClone(FINES_DRAFT_STATE), account_status: 'Rejected' });
    component['setAccountDetailsStatus']();
    expect(component.accountDetailsStatus).toEqual('Rejected');
  });

  it('should test setAccountDetailsStatus when draft state is unknown', () => {
    finesDraftStore.setFinesDraftState({ ...structuredClone(FINES_DRAFT_STATE), account_status: 'Test' });
    component['setAccountDetailsStatus']();
    expect(component.accountDetailsStatus).toEqual('');
  });
});

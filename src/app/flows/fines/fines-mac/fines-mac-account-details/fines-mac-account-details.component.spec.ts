import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountDetailsComponent } from './fines-mac-account-details.component';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { ActivatedRoute } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from './constants/fines-mac-account-details-state';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from './mocks/fines-mac-account-details-state.mock';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { signal } from '@angular/core';
import { FINES_DRAFT_STATE } from '../../fines-draft/constants/fines-draft-state.constant';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { IFetchMapFinesMacPayload } from '../routing/resolvers/fetch-map-fines-mac-payload-resolver/interfaces/fetch-map-fines-mac-payload.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';

describe('FinesMacAccountDetailsComponent', () => {
  let component: FinesMacAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacAccountDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;

  beforeEach(async () => {
    const mockFinesDraftAmend = signal<boolean>(false);
    mockFinesService = jasmine.createSpyObj(
      'FinesService',
      ['finesMacState', 'checkMandatorySections', 'finesDraftFragment', 'finesDraftAmend'],
      {
        finesDraftAmend: mockFinesDraftAmend,
      },
    );
    mockFinesService.finesMacState = structuredClone(FINES_MAC_STATE);
    mockFinesService.finesDraftState = structuredClone(FINES_DRAFT_STATE);
    mockFinesService.checkMandatorySections.and.returnValue(false);
    mockFinesService.finesDraftFragment.and.returnValue('rejected');

    mockDateService = jasmine.createSpyObj(DateService, [
      'getFromFormatToFormat',
      'calculateAge',
      'getFromFormat',
      'isValidDate',
    ]);
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'upperCaseAllLetters',
      'upperCaseFirstLetter',
      'formatAddress',
      'convertToMonetaryString',
    ]);

    mockFinesMacPayloadService = jasmine.createSpyObj(FinesMacPayloadService, ['mapAccountPayload']);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountDetailsComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacAccountDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test');

    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should navigate on handleRoute with relative to', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test', true);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should navigate on handleRoute with fragment', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test', false, undefined, 'rejected');

    expect(routerSpy).toHaveBeenCalledWith(['test'], { fragment: 'rejected' });
  });

  it('should navigate on handleRoute with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj(Event, ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should navigate back on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    mockFinesService.finesDraftAmend.set(true);
    component.navigateBack();

    expect(routerSpy).toHaveBeenCalledWith(
      [
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}`,
      ],
      {
        fragment: 'rejected',
      },
    );
  });

  it('should set defendantType and accountType to be empty string', () => {
    mockFinesService.finesMacState.accountDetails.formData = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE,
      fm_create_account_defendant_type: '',
    };
    component.defendantType = '';

    component['setDefendantType']();
    component['setAccountType']();

    expect(component.defendantType).toEqual('');
    expect(component.accountType).toEqual('');
  });

  it('should set defendantType and accountType to values', () => {
    mockFinesService.finesMacState.accountDetails.formData = {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'adultOrYouthOnly',
    };

    component['setDefendantType']();
    component['setAccountType']();

    expect(component.defendantType).toEqual('Adult or youth only');
    expect(component.accountType).toEqual('Conditional Caution');
  });

  it('should set documentLanguage and courtHearingLanguage correctly', () => {
    const documentLanguage = 'CY';
    const hearingLanguage = 'EN';
    mockFinesService.finesMacState.languagePreferences.formData = {
      ...mockFinesService.finesMacState.languagePreferences.formData,
      fm_language_preferences_document_language: documentLanguage,
      fm_language_preferences_hearing_language: hearingLanguage,
    };

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

    mockFinesService.finesMacState.languagePreferences.formData = {
      ...mockFinesService.finesMacState.languagePreferences.formData,
      fm_language_preferences_document_language: documentLanguage,
      fm_language_preferences_hearing_language: hearingLanguage,
    };

    component['setLanguage']();

    expect(component.documentLanguage).toBe('');
    expect(component.courtHearingLanguage).toBe('');
  });

  it('should call setDefendantType and setAccountType on initialAccountDetailsSetup', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'accountDetailsFetchedMappedPayload');
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
    component.handleRoute(FINES_MAC_ROUTING_PATHS.children.courtDetails);

    expect(component.pageNavigation).toBeTruthy();
  });

  it('should call canDeactivate ', () => {
    component['pageNavigation'] = true;
    expect(component.canDeactivate()).toBeTruthy();

    component['pageNavigation'] = false;
    expect(component.canDeactivate()).toBeFalsy();
  });

  it('should return true if personalDetails is true', () => {
    mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.PROVIDED;
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(true);
  });

  it('should return true if defendantType is in paymentTermsBypassDefendantTypes', () => {
    mockFinesService.finesMacState.personalDetails = {
      ...FINES_MAC_STATE.personalDetails,
      status: FINES_MAC_STATUS.NOT_PROVIDED,
    };
    component.defendantType = 'parentOrGuardianToPay';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(true);
  });

  it('should return false if personalDetails is false and defendantType is not in paymentTermsBypassDefendantTypes', () => {
    mockFinesService.finesMacState.personalDetails = {
      ...FINES_MAC_STATE.personalDetails,
      status: FINES_MAC_STATUS.NOT_PROVIDED,
    };
    component.defendantType = 'test';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(false);
  });

  it('should test accountDetailsFetchedMappedPayload', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountDetailsStatus');
    const snapshotData: IFetchMapFinesMacPayload = {
      finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
      finesMacDraft: { ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT), account_status: 'Rejected' },
    };
    component['activatedRoute'].snapshot = {
      data: {
        accountDetailsFetchMap: snapshotData,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component['accountDetailsFetchedMappedPayload']();

    expect(component['finesService'].finesDraftState).toEqual(snapshotData.finesMacDraft);
    expect(component['finesService'].finesMacState).toEqual(snapshotData.finesMacState);
    expect(component['setAccountDetailsStatus']).toHaveBeenCalled();
  });

  it('should test accountDetailsFetchedMappedPayload', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountDetailsStatus');
    mockFinesService.finesMacState = structuredClone(FINES_MAC_STATE);
    mockFinesService.finesDraftState = structuredClone(FINES_DRAFT_STATE);
    const snapshotData: IFetchMapFinesMacPayload = {
      finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
      finesMacDraft: structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
    };
    component['activatedRoute'].snapshot = {
      data: {
        test: snapshotData,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component['accountDetailsFetchedMappedPayload']();

    expect(component['finesService'].finesMacState).toEqual(FINES_MAC_STATE);
    expect(component['finesService'].finesDraftState).toEqual(FINES_DRAFT_STATE);
    expect(component['setAccountDetailsStatus']).not.toHaveBeenCalled();
  });

  it('should test setAccountDetailsStatus when draft state is null', () => {
    mockFinesService.finesDraftState = structuredClone(FINES_DRAFT_STATE);
    component['setAccountDetailsStatus']();
    expect(component.accountDetailsStatus).toBeUndefined();
  });

  it('should test setAccountDetailsStatus when draft state is populated', () => {
    mockFinesService.finesDraftState = { ...structuredClone(FINES_DRAFT_STATE), account_status: 'Rejected' };
    component['setAccountDetailsStatus']();
    expect(component.accountDetailsStatus).toEqual('Rejected');
  });

  it('should test setAccountDetailsStatus when draft state is unknown', () => {
    mockFinesService.finesDraftState = { ...structuredClone(FINES_DRAFT_STATE), account_status: 'Test' };
    component['setAccountDetailsStatus']();
    expect(component.accountDetailsStatus).toEqual('');
  });
});

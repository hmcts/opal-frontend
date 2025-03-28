import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountDetailsComponent } from './fines-mac-account-details.component';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from './constants/fines-mac-account-details-state';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../fines-mac-personal-details/constants/fines-mac-personal-details-form';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { UtilsService } from '@hmcts/opal-frontend-common/core/services';

describe('FinesMacAccountDetailsComponent', () => {
  let component: FinesMacAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacAccountDetailsComponent>;
  let finesMacStore: FinesMacStoreType;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'checkFormValues',
      'checkFormArrayValues',
      'upperCaseFirstLetter',
      'getFormStatus',
      'getFormArrayStatus',
    ]);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountDetailsComponent],
      providers: [
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

  it('should navigate on handleRoute with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj(Event, ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
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
      fm_create_account_defendant_type: 'adultOrYouthOnly',
      fm_create_account_account_type: 'conditionalCaution',
    };
    finesMacStore.setFinesMacStore(finesMacState);

    component['setDefendantType']();
    component['setAccountType']();

    expect(component.defendantType).toEqual('Adult or youth only');
    expect(component.accountType).toEqual('Conditional Caution');
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
    const finesMacState = structuredClone(FINES_MAC_STATE);
    finesMacState.accountDetails.formData = {
      ...structuredClone(FINES_MAC_ACCOUNT_DETAILS_STATE),
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
      fm_create_account_account_type: 'fine',
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
    component.defendantType = 'parentOrGuardianToPay';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];

    const result = component['canAccessPaymentTerms']();

    expect(result).toBe(true);
  });

  it('should return false if personalDetails is false and defendantType is not in paymentTermsBypassDefendantTypes', () => {
    finesMacStore.setPersonalDetails(FINES_MAC_PERSONAL_DETAILS_FORM);
    component.defendantType = 'test';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];

    const result = component['canAccessPaymentTerms']();

    expect(result).toBe(false);
  });

  it('should test checkMandatorySections with the different defendant types', () => {
    const adultOrYouthOnly = structuredClone(FINES_MAC_STATE);
    adultOrYouthOnly.accountDetails.formData = {
      ...adultOrYouthOnly.accountDetails.formData,
      fm_create_account_defendant_type: 'adultOrYouthOnly',
    };
    finesMacStore.setFinesMacStore(adultOrYouthOnly);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const parentOrGuardianToPay = structuredClone(adultOrYouthOnly);
    parentOrGuardianToPay.accountDetails.formData = {
      ...parentOrGuardianToPay.accountDetails.formData,
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
    };
    finesMacStore.setFinesMacStore(parentOrGuardianToPay);
    component['checkMandatorySections']();
    expect(component.mandatorySectionsCompleted).toBeFalse();

    const company = structuredClone(parentOrGuardianToPay);
    company.accountDetails.formData = {
      ...company.accountDetails.formData,
      fm_create_account_defendant_type: 'company',
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
});

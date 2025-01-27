import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountDetailsComponent } from './fines-mac-account-details.component';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { ActivatedRoute } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from './constants/fines-mac-account-details-state';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from './mocks/fines-mac-account-details-state.mock';

describe('FinesMacAccountDetailsComponent', () => {
  let component: FinesMacAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacAccountDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState', 'checkMandatorySections']);
    mockFinesService.finesMacState = structuredClone(FINES_MAC_STATE);
    mockFinesService.checkMandatorySections.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountDetailsComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
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

  it('should navigate on handleRoute with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj(Event, ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
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
});

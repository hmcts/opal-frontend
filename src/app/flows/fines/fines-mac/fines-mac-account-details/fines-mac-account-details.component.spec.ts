import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountDetailsComponent } from './fines-mac-account-details.component';
import { FINES_MAC_STATE, FINES_MAC_STATUS } from '../constants';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { IFinesMacAccountTypes, IFinesMacDefendantTypes } from '../interfaces';
import { FinesService } from '@services/fines';
import {
  FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES,
  FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES,
  FINES_MAC_ACCOUNT_DETAILS_STATE,
} from './constants';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces';

describe('FinesMacAccountDetailsComponent', () => {
  let component: FinesMacAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacAccountDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FineService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE;

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountDetailsComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        provideRouter([]),
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

  beforeEach(() => {
    mockFinesService.finesMacState.accountDetails.formData = FINES_MAC_ACCOUNT_DETAILS_STATE;
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
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set defendantType correctly', () => {
    mockFinesService.finesMacState.accountDetails.formData.DefendantType = 'adultOrYouthOnly';

    component['setDefendantType']();

    expect(component.defendantType).toEqual(
      FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES[
        mockFinesService.finesMacState.accountDetails.formData.DefendantType as keyof IFinesMacDefendantTypes
      ],
    );
  });

  it('should set defendantType to be empty', () => {
    mockFinesService.finesMacState.accountDetails.formData.DefendantType = 'test';

    component['setDefendantType']();

    expect(component.defendantType).toBe('');
  });

  it('should not set defendantType', () => {
    component.defendantType = '';
    mockFinesService.finesMacState.accountDetails.formData.DefendantType = null;

    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });

  it('should set accountType correctly', () => {
    mockFinesService.finesMacState.accountDetails.formData.AccountType = 'fine';

    component['setAccountType']();

    expect(component.accountType).toEqual(
      FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES[
        mockFinesService.finesMacState.accountDetails.formData.AccountType as keyof IFinesMacAccountTypes
      ],
    );
  });

  it('should set accountType to be empty', () => {
    mockFinesService.finesMacState.accountDetails.formData.AccountType = 'test';

    component['setAccountType']();

    expect(component.accountType).toBe('');
  });

  it('should not set accountType', () => {
    component.accountType = '';
    mockFinesService.finesMacState.accountDetails.formData.AccountType = null;

    component['setAccountType']();
    expect(component.accountType).toBe('');
  });

  it('should set documentLanguage and courtHearingLanguage correctly', () => {
    const documentLanguage = 'CY';
    const courtHearingLanguage = 'EN';
    component['finesService'].finesMacState.languagePreferences.formData = {
      documentLanguage,
      courtHearingLanguage,
    };

    component['setLanguage']();

    expect(component.documentLanguage).toEqual(
      component['languageOptions'][documentLanguage as keyof IFinesMacLanguagePreferencesOptions],
    );
    expect(component.courtHearingLanguage).toEqual(
      component['languageOptions'][courtHearingLanguage as keyof IFinesMacLanguagePreferencesOptions],
    );
  });

  it('should set documentLanguage and courtHearingLanguage to empty strings if the provided languages are not in the languages list', () => {
    const documentLanguage = 'german';
    const courtHearingLanguage = 'french';
    component['finesService'].finesMacState.languagePreferences.formData = {
      documentLanguage,
      courtHearingLanguage,
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
    spyOn<any>(component, 'routerListener');

    component['initialAccountDetailsSetup']();

    expect(component['setDefendantType']).toHaveBeenCalled();
    expect(component['setAccountType']).toHaveBeenCalled();
    expect(component['setLanguage']).toHaveBeenCalled();
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
    mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
    component.defendantType = 'parentOrGuardianToPay';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(true);
  });

  it('should return false if personalDetails is false and defendantType is not in paymentTermsBypassDefendantTypes', () => {
    mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
    component.defendantType = 'test';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(false);
  });
});

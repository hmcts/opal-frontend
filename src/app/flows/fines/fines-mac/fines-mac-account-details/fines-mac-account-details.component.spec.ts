import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountDetailsComponent } from './fines-mac-account-details.component';
import { FINES_MAC_STATE } from '../constants';
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
    mockFinesService.finesMacState.accountDetails = FINES_MAC_ACCOUNT_DETAILS_STATE;
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
    mockFinesService.finesMacState.accountDetails.DefendantType = 'adultOrYouthOnly';

    component['setDefendantType']();

    expect(component.defendantType).toEqual(
      FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES[
        mockFinesService.finesMacState.accountDetails.DefendantType as keyof IFinesMacDefendantTypes
      ],
    );
  });

  it('should set defendantType to be empty', () => {
    mockFinesService.finesMacState.accountDetails.DefendantType = 'test';

    component['setDefendantType']();

    expect(component.defendantType).toBe('');
  });

  it('should not set defendantType', () => {
    component.defendantType = '';
    mockFinesService.finesMacState.accountDetails.DefendantType = null;

    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });

  it('should set accountType correctly', () => {
    mockFinesService.finesMacState.accountDetails.AccountType = 'fine';

    component['setAccountType']();

    expect(component.accountType).toEqual(
      FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES[
        mockFinesService.finesMacState.accountDetails.AccountType as keyof IFinesMacAccountTypes
      ],
    );
  });

  it('should set accountType to be empty', () => {
    mockFinesService.finesMacState.accountDetails.AccountType = 'test';

    component['setAccountType']();

    expect(component.accountType).toBe('');
  });

  it('should not set accountType', () => {
    component.accountType = '';
    mockFinesService.finesMacState.accountDetails.AccountType = null;

    component['setAccountType']();
    expect(component.accountType).toBe('');
  });

  it('should correctly update accountCreationStatus based on manualAccountCreation state', () => {
    mockFinesService.finesMacState = FINES_MAC_STATE;
    mockFinesService.finesMacState.accountDetails.AccountType = 'Test';

    component['checkStatus']();

    expect(component.accountCreationStatus['employerDetails']).toBeFalsy();
    expect(component.accountCreationStatus['accountDetails']).toBeTruthy();
    expect(component.accountCreationStatus['contactDetails']).toBeFalsy();
    expect(component.accountCreationStatus['parentGuardianDetails']).toBeFalsy();
    expect(component.accountCreationStatus['personalDetails']).toBeFalsy();
    expect(component.accountCreationStatus['companyDetails']).toBeFalsy();
    expect(component.accountCreationStatus['courtDetails']).toBeFalsy();
    expect(component.accountCreationStatus['accountCommentsNotes']).toBeFalsy();
    expect(component.accountCreationStatus['offenceDetails']).toBeFalsy();
    expect(component.accountCreationStatus['paymentTerms']).toBeFalsy();

    mockFinesService.finesMacState.accountDetails.AccountType = 'Test';
    mockFinesService.finesMacState.employerDetails.EmployerCompanyName = 'Test';
    mockFinesService.finesMacState.contactDetails.EmailAddress1 = 'Test';
    mockFinesService.finesMacState.parentGuardianDetails.Forenames = 'Test';
    mockFinesService.finesMacState.personalDetails.Forenames = 'Test';
    mockFinesService.finesMacState.companyDetails.CompanyName = 'Test';
    mockFinesService.finesMacState.courtDetails.SendingCourt = 'Test';
    mockFinesService.finesMacState.accountCommentsNotes.notes = 'Test';
    mockFinesService.finesMacState.offenceDetails.offenceDetails = 'Test';
    mockFinesService.finesMacState.paymentTerms.paymentTerms = 'Test';

    component['checkStatus']();

    expect(component.accountCreationStatus['employerDetails']).toBeTruthy();
    expect(component.accountCreationStatus['accountDetails']).toBeTruthy();
    expect(component.accountCreationStatus['contactDetails']).toBeTruthy();
    expect(component.accountCreationStatus['parentGuardianDetails']).toBeTruthy();
    expect(component.accountCreationStatus['personalDetails']).toBeTruthy();
    expect(component.accountCreationStatus['companyDetails']).toBeTruthy();
    expect(component.accountCreationStatus['courtDetails']).toBeTruthy();
    expect(component.accountCreationStatus['accountCommentsNotes']).toBeTruthy();
    expect(component.accountCreationStatus['offenceDetails']).toBeTruthy();
    expect(component.accountCreationStatus['paymentTerms']).toBeTruthy();
  });

  it('should call setDefendantType and setAccountType on initialAccountDetailsSetup', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setDefendantType');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountType');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'checkStatus');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'routerListener');

    component['initialAccountDetailsSetup']();

    expect(component['setDefendantType']).toHaveBeenCalled();
    expect(component['setAccountType']).toHaveBeenCalled();
    expect(component['checkStatus']).toHaveBeenCalled();
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
    component.accountCreationStatus['personalDetails'] = true;
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(true);
  });

  it('should return true if defendantType is in paymentTermsBypassDefendantTypes', () => {
    component.accountCreationStatus['personalDetails'] = false;
    component.defendantType = 'parentOrGuardianToPay';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(true);
  });

  it('should return false if personalDetails is false and defendantType is not in paymentTermsBypassDefendantTypes', () => {
    component.accountCreationStatus['personalDetails'] = false;
    component.defendantType = 'test';
    component.paymentTermsBypassDefendantTypes = ['parentOrGuardianToPay', 'company'];
    const result = component['canAccessPaymentTerms']();
    expect(result).toBe(false);
  });
});

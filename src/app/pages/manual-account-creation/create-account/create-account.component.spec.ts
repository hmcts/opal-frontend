import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountComponent } from './create-account.component';
import {
  DEFENDANT_TYPES_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
} from '@constants';
import { MacStateService } from '@services';
import { provideRouter } from '@angular/router';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [CreateAccountComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    mockMacStateService = TestBed.inject(MacStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should set defendantType correctly', () => {
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';

    component['setDefendantType']();

    expect(component.defendantType).toEqual(
      DEFENDANT_TYPES_STATE[mockMacStateService.manualAccountCreation.accountDetails.defendantType],
    );
  });

  it('should set defendantType to be empty', () => {
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = 'test';
    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });

  it('should not set defendantType', () => {
    component.defendantType = '';
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = null;

    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from '@services';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
} from '@constants';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['manualAccountCreation']);

    mockStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [CreateAccountComponent, RouterTestingModule],
      providers: [{ provide: StateService, useValue: mockStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
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

  it('should test isParentOrGuardianDefendantType to be true', () => {
    mockStateService.manualAccountCreation.accountDetails.defendantType = 'parentOrGuardianToPay';
    expect(component.isParentOrGuardianDefendantType()).toBeTruthy();
  });

  it('should test isParentOrGuardianDefendantType to be false', () => {
    mockStateService.manualAccountCreation.accountDetails.defendantType = 'company';
    expect(component.isParentOrGuardianDefendantType()).toBeFalsy();
  });

  it('should test isAdultOrYouthOnlyDefendantType to be true', () => {
    mockStateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';
    expect(component.isAdultOrYouthOnlyDefendantType()).toBeTruthy();
  });

  it('should test isParentOrGuardianDefendantType to be false', () => {
    mockStateService.manualAccountCreation.accountDetails.defendantType = 'company';
    expect(component.isAdultOrYouthOnlyDefendantType()).toBeFalsy();
  });

  it('should test isCompanyType to be true', () => {
    mockStateService.manualAccountCreation.accountDetails.defendantType = 'company';
    expect(component.isCompanyType()).toBeTruthy();
  });

  it('should test isCompanyType to be false', () => {
    mockStateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';
    expect(component.isCompanyType()).toBeFalsy();
  });
});

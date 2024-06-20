import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';
import { RouterTestingModule } from '@angular/router/testing';

import { DEFENDANT_TYPES_STATE } from '@constants';
import { StateService } from '@services';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
} from '@constants';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let stateService: StateService;
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
    stateService = TestBed.inject(StateService);
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
    stateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';

    component['setDefendantType']();

    expect(component.defendantType).toEqual(
      DEFENDANT_TYPES_STATE[stateService.manualAccountCreation.accountDetails.defendantType],
    );
  });

  it('should set defendantType to be empty', () => {
    stateService.manualAccountCreation.accountDetails.defendantType = 'test';
    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });

  it('should not set defendantType', () => {
    component.defendantType = '';
    stateService.manualAccountCreation.accountDetails.defendantType = null;

    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });
});

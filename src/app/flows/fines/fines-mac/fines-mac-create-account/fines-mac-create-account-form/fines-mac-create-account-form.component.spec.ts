import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form.component';
import { FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@mocks/fines';
import { Validators } from '@angular/forms';
import { FinesService } from '@services/fines';
import { FINES_MAC_STATE_MOCK } from '@mocks/fines/mac';
import { FINES_MAC_CREATE_ACCOUNT_STATE_MOCK } from '../mocks';

describe('FinesMacCreateAccountFormComponent', () => {
  let component: FinesMacCreateAccountFormComponent;
  let fixture: ComponentFixture<FinesMacCreateAccountFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountFormComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCreateAccountFormComponent);
    component = fixture.componentInstance;

    component.autoCompleteItems = FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup account type listener', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component.ngOnInit();
    component.form.controls['AccountType'].setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should call handleAccountTypeChange when accountType value changes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component['setupAccountTypeListener']();
    component.form.get('AccountType')!.setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should emit form submit event with form value', () => {
    const formValue = FINES_MAC_CREATE_ACCOUNT_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });

  it('should unsubscribe from account type listener on ngOnDestroy', () => {
    spyOn(component['accountTypeSubject'], 'next');
    spyOn(component['accountTypeSubject'], 'complete');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'ngOnDestroy').and.callThrough();

    component.ngOnDestroy();

    expect(component['accountTypeSubject'].next).toHaveBeenCalled();
    expect(component['accountTypeSubject'].complete).toHaveBeenCalled();
    expect(component['ngOnDestroy']).toHaveBeenCalled();
  });

  it('should handle account type change - fine', () => {
    const accountType = 'fine';
    const fieldName = 'FineDefendantType';
    const validators = [Validators.required];
    const fieldsToRemove = ['FixedPenaltyDefendantType'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');

    component['handleAccountTypeChange'](accountType);

    expect(component['removeControl']).toHaveBeenCalledTimes(fieldsToRemove.length);
    fieldsToRemove.forEach((field) => {
      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).toHaveBeenCalledWith(fieldName, validators);
  });

  it('should handle account type change - fixed penalty', () => {
    const accountType = 'fixedPenalty';
    const fieldName = 'FixedPenaltyDefendantType';
    const validators = [Validators.required];
    const fieldsToRemove = ['FineDefendantType'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');

    component['handleAccountTypeChange'](accountType);

    expect(component['removeControl']).toHaveBeenCalledTimes(fieldsToRemove.length);
    fieldsToRemove.forEach((field) => {
      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).toHaveBeenCalledWith(fieldName, validators);
  });

  it('should handle account type change - conditional caution', () => {
    const accountType = 'conditionalCaution';
    const fieldsToRemove = ['FineDefendantType', 'FixedPenaltyDefendantType'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');

    component['handleAccountTypeChange'](accountType);

    expect(component['removeControl']).toHaveBeenCalledTimes(fieldsToRemove.length);
    fieldsToRemove.forEach((field) => {
      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).not.toHaveBeenCalled();
  });

  it('should set defendant type based on account type - fixed penalty', () => {
    const accountType = 'fixedPenalty';
    const fieldName = 'FixedPenaltyDefendantType';
    const fieldValue = 'adultOrYouthOnly';

    component.form.get('AccountType')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).toEqual(fieldValue);
  });

  it('should set defendant type based on account type - fine', () => {
    const accountType = 'fine';
    const fieldName = 'FineDefendantType';
    const fieldValue = 'adultOrYouthOnly';

    component.form.get('AccountType')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).toEqual(fieldValue);
  });

  it('should set defendant type to default for conditional caution account type', () => {
    const accountType = 'conditionalCaution';
    const defaultDefendantType = component.conditionalCautionPenaltyDefendantTypes[0].key;

    component.form.get('AccountType')?.setValue(accountType);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).toEqual(defaultDefendantType);
  });

  it('should not do anything as the account, fieldName, and fieldValue are not real', () => {
    const accountType = 'test';
    const fieldName = 'test';
    const fieldValue = 'test';

    component.form.get('AccountType')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).not.toBeDefined();
  });

  it('should call initialSetup method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupCreateAccountForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAccountTypeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');

    component['initialSetup']();

    expect(component['setupCreateAccountForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['setupAccountTypeListener']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(component['finesService'].finesMacState.accountDetails);
  });
});

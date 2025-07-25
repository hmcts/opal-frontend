import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form.component';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { Validators } from '@angular/forms';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK } from '../mocks/fines-mac-create-account-form.mock';
import { ActivatedRoute } from '@angular/router';
import { IFinesMacAccountDetailsForm } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { of } from 'rxjs';
import { FINES_MAC_ACCOUNT_TYPES_KEYS } from '../../constants/fines-mac-account-types-keys';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';

describe('FinesMacCreateAccountFormComponent', () => {
  let component: FinesMacCreateAccountFormComponent;
  let fixture: ComponentFixture<FinesMacCreateAccountFormComponent>;
  let formSubmit: IFinesMacAccountDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_CREATE_ACCOUNT_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCreateAccountFormComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.autoCompleteItems = OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup account type listener', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component.ngOnInit();
    component.form.controls['fm_create_account_account_type'].setValue(FINES_MAC_ACCOUNT_TYPES_KEYS.fine);

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should call handleAccountTypeChange when accountType value changes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component['setupAccountTypeListener']();
    component.form.get('fm_create_account_account_type')!.setValue(FINES_MAC_ACCOUNT_TYPES_KEYS.fine);

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
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
    const accountType = FINES_MAC_ACCOUNT_TYPES_KEYS.fine;
    const fieldName = 'fm_create_account_fine_defendant_type';
    const validators = [Validators.required];
    const fieldsToRemove = ['fm_create_account_fixed_penalty_defendant_type'];
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
    const accountType = FINES_MAC_ACCOUNT_TYPES_KEYS.fixedPenalty;
    const fieldName = 'fm_create_account_fixed_penalty_defendant_type';
    const validators = [Validators.required];
    const fieldsToRemove = ['fm_create_account_fine_defendant_type'];
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
    const accountType = FINES_MAC_ACCOUNT_TYPES_KEYS.conditionalCaution;
    const fieldsToRemove = ['fm_create_account_fine_defendant_type', 'fm_create_account_fixed_penalty_defendant_type'];
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
    const accountType = FINES_MAC_ACCOUNT_TYPES_KEYS.fixedPenalty;
    const fieldName = 'fm_create_account_fixed_penalty_defendant_type';
    const fieldValue = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(fieldValue);
  });

  it('should set defendant type based on account type - fine', () => {
    const accountType = FINES_MAC_ACCOUNT_TYPES_KEYS.fine;
    const fieldName = 'fm_create_account_fine_defendant_type';
    const fieldValue = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(fieldValue);
  });

  it('should set defendant type to default for conditional caution account type', () => {
    const accountType = FINES_MAC_ACCOUNT_TYPES_KEYS.conditionalCaution;
    const defaultDefendantType = component.conditionalCautionPenaltyDefendantTypes[0].key;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(defaultDefendantType);
  });

  it('should not do anything as the account, fieldName, and fieldValue are not real', () => {
    const accountType = 'test';
    const fieldName = 'test';
    const fieldValue = 'test';

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).not.toBeDefined();
  });

  it('should call initialCreateAccountSetup method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupCreateAccountForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAccountTypeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');

    component['initialCreateAccountSetup']();

    expect(component['setupCreateAccountForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['setupAccountTypeListener']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.accountDetails().formData);
  });
});

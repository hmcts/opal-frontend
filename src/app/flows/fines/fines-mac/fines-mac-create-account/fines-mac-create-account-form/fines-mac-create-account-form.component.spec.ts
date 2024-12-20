import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form.component';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { Validators } from '@angular/forms';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK } from '../mocks/fines-mac-create-account-form.mock';
import { ActivatedRoute } from '@angular/router';
import { IFinesMacAccountDetailsForm } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { of } from 'rxjs';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';

describe('FinesMacCreateAccountFormComponent', () => {
  let component: FinesMacCreateAccountFormComponent | null;
  let fixture: ComponentFixture<FinesMacCreateAccountFormComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacAccountDetailsForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', [], {
      finesMacState: structuredClone(FINES_MAC_STATE),
    });

    formSubmit = structuredClone(FINES_MAC_CREATE_ACCOUNT_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountFormComponent],
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

    fixture = TestBed.createComponent(FinesMacCreateAccountFormComponent);
    component = fixture.componentInstance;

    component.autoCompleteItems = structuredClone(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK);

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    formSubmit = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup account type listener', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component.ngOnInit();
    component.form.controls['fm_create_account_account_type'].setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should call handleAccountTypeChange when accountType value changes', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component['setupAccountTypeListener']();
    component.form.get('fm_create_account_account_type')!.setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should unsubscribe from account type listener on ngOnDestroy', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

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
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const accountType = 'fine';
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
      if (!component || !formSubmit || !mockFinesService || !fixture) {
        fail('Required properties not properly initialised');
        return;
      }

      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).toHaveBeenCalledWith(fieldName, validators);
  });

  it('should handle account type change - fixed penalty', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const accountType = 'fixedPenalty';
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
      if (!component || !formSubmit || !mockFinesService || !fixture) {
        fail('Required properties not properly initialised');
        return;
      }

      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).toHaveBeenCalledWith(fieldName, validators);
  });

  it('should handle account type change - conditional caution', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const accountType = 'conditionalCaution';
    const fieldsToRemove = ['fm_create_account_fine_defendant_type', 'fm_create_account_fixed_penalty_defendant_type'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');

    component['handleAccountTypeChange'](accountType);

    expect(component['removeControl']).toHaveBeenCalledTimes(fieldsToRemove.length);
    fieldsToRemove.forEach((field) => {
      if (!component || !formSubmit || !mockFinesService || !fixture) {
        fail('Required properties not properly initialised');
        return;
      }

      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).not.toHaveBeenCalled();
  });

  it('should set defendant type based on account type - fixed penalty', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const accountType = 'fixedPenalty';
    const fieldName = 'fm_create_account_fixed_penalty_defendant_type';
    const fieldValue = 'adultOrYouthOnly';

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(fieldValue);
  });

  it('should set defendant type based on account type - fine', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const accountType = 'fine';
    const fieldName = 'fm_create_account_fine_defendant_type';
    const fieldValue = 'adultOrYouthOnly';

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(fieldValue);
  });

  it('should set defendant type to default for conditional caution account type', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const accountType = 'conditionalCaution';
    const defaultDefendantType = component.conditionalCautionPenaltyDefendantTypes[0].key;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(defaultDefendantType);
  });

  it('should not do anything as the account, fieldName, and fieldValue are not real', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const accountType = 'test';
    const fieldName = 'test';
    const fieldValue = 'test';

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).not.toBeDefined();
  });

  it('should call initialCreateAccountSetup method', () => {
    if (!component || !formSubmit || !mockFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

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
    expect(component['rePopulateForm']).toHaveBeenCalledWith(
      component['finesService'].finesMacState.accountDetails.formData,
    );
  });
});

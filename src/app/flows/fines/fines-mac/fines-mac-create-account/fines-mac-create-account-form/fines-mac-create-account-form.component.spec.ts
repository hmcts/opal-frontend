import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form.component';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK } from '../mocks/fines-mac-create-account-form.mock';
import { ActivatedRoute } from '@angular/router';
import { IFinesMacAccountDetailsForm } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { of } from 'rxjs';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { FINES_ACCOUNT_TYPES } from '../../../constants/fines-account-types.constant';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacCreateAccountFormComponent', () => {
  let component: FinesMacCreateAccountFormComponent;
  let fixture: ComponentFixture<FinesMacCreateAccountFormComponent>;
  let formSubmit: IFinesMacAccountDetailsForm;
  let finesMacStore: FinesMacStoreType;
  let originalInitOuterRadios: () => void;

  beforeAll(() => {
    originalInitOuterRadios = GovukRadioComponent.prototype['initOuterRadios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(GovukRadioComponent.prototype, 'initOuterRadios').mockImplementation(() => {});
  });

  afterAll(() => {
    GovukRadioComponent.prototype['initOuterRadios'] = originalInitOuterRadios;
  });

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
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
    vi.spyOn<any, any>(component, 'handleAccountTypeChange');

    component.ngOnInit();
    component.form.controls['fm_create_account_account_type'].setValue(FINES_ACCOUNT_TYPES.Fine);

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should call handleAccountTypeChange when accountType value changes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'handleAccountTypeChange');

    component['setupAccountTypeListener']();
    component.form.get('fm_create_account_account_type')!.setValue(FINES_ACCOUNT_TYPES.Fine);

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should emit form submit event with form value', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should unsubscribe from account type listener on ngOnDestroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['accountTypeSubject'], 'next');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['accountTypeSubject'], 'complete');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'ngOnDestroy');

    component.ngOnDestroy();

    expect(component['accountTypeSubject'].next).toHaveBeenCalled();
    expect(component['accountTypeSubject'].complete).toHaveBeenCalled();
    expect(component['ngOnDestroy']).toHaveBeenCalled();
  });

  it('should handle account type change - fine', () => {
    component['handleAccountTypeChange'](FINES_ACCOUNT_TYPES.Fine);

    const fineControl = component.form.get('fm_create_account_fine_defendant_type');
    const fixedControl = component.form.get('fm_create_account_fixed_penalty_defendant_type');

    expect(fineControl?.enabled).toBe(true);
    expect(fixedControl?.disabled).toBe(true);
  });

  it('should handle account type change - fixed penalty', () => {
    component['handleAccountTypeChange'](FINES_ACCOUNT_TYPES['Fixed Penalty']);

    const fineControl = component.form.get('fm_create_account_fine_defendant_type');
    const fixedControl = component.form.get('fm_create_account_fixed_penalty_defendant_type');

    expect(fixedControl?.enabled).toBe(true);
    expect(fineControl?.disabled).toBe(true);
  });

  it('should handle account type change - conditional caution', () => {
    component['handleAccountTypeChange'](FINES_ACCOUNT_TYPES['Conditional Caution']);

    const fineControl = component.form.get('fm_create_account_fine_defendant_type');
    const fixedControl = component.form.get('fm_create_account_fixed_penalty_defendant_type');

    expect(fineControl?.disabled).toBe(true);
    expect(fixedControl?.disabled).toBe(true);
  });

  it('should ignore missing defendant type controls', () => {
    const fineControl = component.form.get('fm_create_account_fine_defendant_type');
    fineControl?.disable({ emitEvent: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).updateDefendantTypeControl('missing_control', true);

    expect(fineControl?.disabled).toBe(true);
  });

  it('should set defendant type based on account type - fixed penalty', () => {
    const accountType = FINES_ACCOUNT_TYPES['Fixed Penalty'];
    const fieldName = 'fm_create_account_fixed_penalty_defendant_type';
    const fieldValue = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component['handleAccountTypeChange'](accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(fieldValue);
  });

  it('should set defendant type based on account type - fine', () => {
    const accountType = FINES_ACCOUNT_TYPES.Fine;
    const fieldName = 'fm_create_account_fine_defendant_type';
    const fieldValue = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component['handleAccountTypeChange'](accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(fieldValue);
  });

  it('should keep account type selected when choosing a defendant type', () => {
    const accountType = FINES_ACCOUNT_TYPES.Fine;
    const fieldValue = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);
    component['handleAccountTypeChange'](accountType);
    component.form.get('fm_create_account_fine_defendant_type')?.setValue(fieldValue);

    expect(component.form.get('fm_create_account_account_type')?.value).toEqual(accountType);
  });

  it('should set defendant type to default for conditional caution account type', () => {
    const accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];
    const defaultDefendantType = component.conditionalCautionPenaltyDefendantTypes[0].key;

    component.form.get('fm_create_account_account_type')?.setValue(accountType);

    component['setDefendantType']();

    expect(component.form.get('fm_create_account_defendant_type')?.value).toEqual(defaultDefendantType);
  });

  it('should render conditional panels hidden by default', () => {
    const finePanel = fixture.nativeElement.querySelector(`#${component.fineDefendantConditionalId}`);
    const fixedPanel = fixture.nativeElement.querySelector(`#${component.fixedPenaltyDefendantConditionalId}`);

    expect(finePanel).toBeTruthy();
    expect(fixedPanel).toBeTruthy();
    expect(finePanel.classList.contains('govuk-radios__conditional--hidden')).toBe(true);
    expect(fixedPanel.classList.contains('govuk-radios__conditional--hidden')).toBe(true);
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
    vi.spyOn<any, any>(component, 'setupCreateAccountForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAccountTypeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');

    component['initialCreateAccountSetup']();

    expect(component['setupCreateAccountForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['setupAccountTypeListener']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.accountDetails().formData);
  });
});

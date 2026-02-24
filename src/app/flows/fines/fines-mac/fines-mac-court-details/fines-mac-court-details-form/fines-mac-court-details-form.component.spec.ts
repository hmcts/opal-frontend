import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCourtDetailsFormComponent } from './fines-mac-court-details-form.component';
import { IFinesMacCourtDetailsForm } from '../interfaces/fines-mac-court-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-autocomplete-items.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-autocomplete-items.mock';
import { FINES_MAC_COURT_DETAILS_FORM_MOCK } from '../mocks/fines-mac-court-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { of } from 'rxjs';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACCOUNT_TYPES } from '@app/flows/fines/constants/fines-account-types.constant';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK } from '../../fines-mac-create-account/mocks/fines-mac-create-account-form.mock';
import { FINES_MAC_CREATE_ACCOUNT_STATE_MOCK } from '../../fines-mac-create-account/mocks/fines-mac-create-account-state.mock';
import { FINES_MAC_BUSINESS_UNIT_STATE } from '../../constants/fines-mac-business-unit-state';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../../fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE } from '../../constants/fines-mac-court-details-copy.constant';

describe('FinesMacCourtDetailsFormComponent', () => {
  let component: FinesMacCourtDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacCourtDetailsFormComponent>;
  let formSubmit: IFinesMacCourtDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_COURT_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCourtDetailsFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCourtDetailsFormComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.localJusticeAreas = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    component.sendingCourtAutoCompleteItems = OPAL_FINES_LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK;
    component.enforcingCourtAutoCompleteItems = OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should get originator name based on originator ID', () => {
    const originatorName = component['getOriginatorName']('9985');
    expect(originatorName).toBe('Asylum & Immigration Tribunal');
  });

  it('should return empty string if originator ID is not found', () => {
    const originatorName = component['getOriginatorName']('999');
    expect(originatorName).toBe('');
  });

  it('should set originator name based on sending court details', () => {
    component['setupCourtDetailsForm']();
    component.form.get('fm_court_details_originator_id')?.setValue('9985');
    component['setOriginatorName']();
    expect(component.form.get('fm_court_details_originator_name')?.value).toBe('Asylum & Immigration Tribunal');
  });

  it('should validate the label text and hint text for conditional caution and fines', () => {
    finesMacStore.setAccountDetails(
      {
        ...FINES_MAC_CREATE_ACCOUNT_FORM_MOCK,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE_MOCK,
          fm_create_account_account_type: FINES_ACCOUNT_TYPES['Conditional Caution'],
        },
      },
      FINES_MAC_BUSINESS_UNIT_STATE,
      FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    );
    expect(component.sectionHeading).toBe('Police and court details');
    expect(component.originatorIdLabelText).toBe('Sending police force');
    expect(component.originatorHintText).toBe(
      'Search using the code or name of the sending police force that sent the caution',
    );

    finesMacStore.setAccountDetails(
      {
        ...FINES_MAC_CREATE_ACCOUNT_FORM_MOCK,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE_MOCK,
          fm_create_account_account_type: FINES_ACCOUNT_TYPES['Fine'],
        },
      },
      FINES_MAC_BUSINESS_UNIT_STATE,
      FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    );
    expect(component.sectionHeading).toBe('Court details');
    expect(component.originatorIdLabelText).toBe('Sending area or Local Justice Area (LJA)');
    expect(component.originatorHintText).toBe('Search using the code or name of the area that sent the transfer');
  });

  it('should set field errors with conditional caution message', () => {
    finesMacStore.setAccountDetails(
      {
        ...FINES_MAC_CREATE_ACCOUNT_FORM_MOCK,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE_MOCK,
          fm_create_account_account_type: FINES_ACCOUNT_TYPES['Conditional Caution'],
        },
      },
      FINES_MAC_BUSINESS_UNIT_STATE,
      FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    );
    component['setFieldErrors']();
    expect(component['fieldErrors']['fm_court_details_originator_id']['required']['message']).toBe(
      'Enter a sending police force',
    );
  });

  it('should set field errors with fine message', () => {
    finesMacStore.setAccountDetails(
      {
        ...FINES_MAC_CREATE_ACCOUNT_FORM_MOCK,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE_MOCK,
          fm_create_account_account_type: FINES_ACCOUNT_TYPES['Fine'],
        },
      },
      FINES_MAC_BUSINESS_UNIT_STATE,
      FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    );
    component['setFieldErrors']();
    expect(component['fieldErrors']['fm_court_details_originator_id']['required']['message']).toBe(
      'Enter a sending area or Local Justice Area',
    );
  });

  it('should setup court details form with all required controls', () => {
    component['setupCourtDetailsForm']();
    expect(component.form.get('fm_court_details_originator_id')).toBeTruthy();
    expect(component.form.get('fm_court_details_prosecutor_case_reference')).toBeTruthy();
    expect(component.form.get('fm_court_details_imposing_court_id')).toBeTruthy();
    expect(component.form.get('fm_court_details_originator_name')).toBeTruthy();
  });

  it('should test currentCourtDetailsCopy getter for non-existent account type', () => {
    finesMacStore.setAccountDetails(
      {
        ...FINES_MAC_CREATE_ACCOUNT_FORM_MOCK,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE_MOCK,
          fm_create_account_account_type: 'NonExistentAccountType',
        },
      },
      FINES_MAC_BUSINESS_UNIT_STATE,
      FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    );
    const copy = component['currentCourtDetailsCopy'];
    expect(copy).toEqual(
      FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE[FINES_ACCOUNT_TYPES['Fine'] as keyof typeof FINES_ACCOUNT_TYPES],
    );
  });
});

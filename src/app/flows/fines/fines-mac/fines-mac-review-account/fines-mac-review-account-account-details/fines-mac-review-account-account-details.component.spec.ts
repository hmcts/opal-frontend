import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountAccountDetailsComponent } from './fines-mac-review-account-account-details.component';
import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../fines-mac-account-details/mocks/fines-mac-account-details-state.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES } from '../../fines-mac-account-details/constants/fines-mac-account-details-account-types';
import { FINES_MAC_DEFENDANT_TYPES } from '../../constants/fines-mac-defendant-types';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesMacLanguagePreferencesOptions } from '../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { IFinesAccountTypes } from '../../../interfaces/fines-account-types.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesOriginatorTypes } from '@app/flows/fines/interfaces/fines-originator-types.interface';
import { FINES_ORIGINATOR_TYPES } from '@app/flows/fines/constants/fines-originator-types.constant';
import { FINES_MAC_ORIGINATOR_TYPE_STATE_MOCK } from '../../fines-mac-originator-type/mocks/fines-mac-originator-type-state.mock';

describe('FinesMacReviewAccountAccountDetailsComponent', () => {
  let component: FinesMacReviewAccountAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountAccountDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountAccountDetailsComponent);
    component = fixture.componentInstance;

    component.accountDetails = structuredClone(FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK);
    component.businessUnit = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    component.languagePreferences = structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK);
    component.originatorTypeState = structuredClone(FINES_MAC_ORIGINATOR_TYPE_STATE_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set accountType correctly', () => {
    component['getAccountType']();

    expect(component.accountType).toBe(
      FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES[
        component.accountDetails.fm_create_account_account_type as keyof IFinesAccountTypes
      ],
    );
  });

  it('should set originatorType correctly', () => {
    component['getOriginatorType']();

    expect(component.originatorType).toBe(
      FINES_ORIGINATOR_TYPES[
        component.originatorTypeState.fm_originator_type_originator_type as keyof IFinesOriginatorTypes
      ],
    );
    expect(component.showEntryType).toBe(true);
  });

  it('should hide entry type when originator type is fixed penalty', () => {
    component.originatorTypeState.fm_originator_type_originator_type = 'FP';
    component.accountDetails.fm_create_account_account_type = FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES['Fixed Penalty'];

    component['getOriginatorType']();

    expect(component.originatorType).toBe('');
    expect(component.showEntryType).toBe(false);
  });

  it('should set defendantType correctly', () => {
    component['getDefendantType']();

    expect(component.defendantType).toBe(
      FINES_MAC_DEFENDANT_TYPES[
        component.accountDetails.fm_create_account_defendant_type as keyof IFinesMacDefendantTypes
      ],
    );
  });

  it('should set documentLanguage correctly', () => {
    component['getDocumentLanguage']();

    expect(component.documentLanguage).toBe(
      FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS[
        component.languagePreferences
          .fm_language_preferences_document_language as keyof IFinesMacLanguagePreferencesOptions
      ],
    );
  });

  it('should set courtHearingLanguage correctly', () => {
    component['getHearingLanguage']();

    expect(component.courtHearingLanguage).toBe(
      FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS[
        FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK.fm_language_preferences_hearing_language as keyof IFinesMacLanguagePreferencesOptions
      ],
    );
  });

  it('should call getAccountDetailsData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getAccountDetailsData');

    component.ngOnInit();

    expect(component['getAccountDetailsData']).toHaveBeenCalled();
  });
});

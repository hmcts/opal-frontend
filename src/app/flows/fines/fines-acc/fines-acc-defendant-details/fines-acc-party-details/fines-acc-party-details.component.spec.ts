import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpperCasePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { FinesAccPartyDetails } from './fines-acc-party-details.component';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import type { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-party-details.interface';
import type { IOpalFinesDefendantAccountLanguagePreference } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-language-preference.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_SECTION_FRAGMENTS } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-fragments.constant';
import { beforeEach, describe, expect, it } from 'vitest';

const ENGLISH_LANGUAGE_PREFERENCE_MOCK = OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK.language_preferences!
  .document_language_preference as IOpalFinesDefendantAccountLanguagePreference;
const WELSH_LANGUAGE_PREFERENCE_MOCK = OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party
  .language_preferences!.document_language_preference as IOpalFinesDefendantAccountLanguagePreference;

describe('FinesAccPartyDetails', () => {
  let component: FinesAccPartyDetails;
  let fixture: ComponentFixture<FinesAccPartyDetails>;
  let mockPartyDetails: IOpalFinesAccountPartyDetails;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FinesAccPartyDetails,
        FinesNotProvidedComponent,
        UpperCasePipe,
        GovukSummaryCardListComponent,
        GovukSummaryListComponent,
        GovukSummaryListRowComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyDetails);
    component = fixture.componentInstance;
    mockPartyDetails = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party);
  });

  const setupComponent = (
    party: IOpalFinesAccountPartyDetails = mockPartyDetails,
    isParentGuardianAccount: boolean = false,
    hasAccountMaintenancePermissionInBU: boolean = false,
  ) => {
    fixture.componentRef.setInput('party', party);
    fixture.componentRef.setInput('cardTitle', 'Party Details');
    fixture.componentRef.setInput('summaryCardListId', 'party-card');
    fixture.componentRef.setInput('summaryListId', 'party-list');
    fixture.componentRef.setInput('isParentGuardianAccount', isParentGuardianAccount);
    fixture.componentRef.setInput('hasAccountMaintenancePermissionInBU', hasAccountMaintenancePermissionInBU);
    fixture.detectChanges();
  };

  const setLanguagePreferences = (
    documentLanguagePreference: IOpalFinesDefendantAccountLanguagePreference,
    hearingLanguagePreference: IOpalFinesDefendantAccountLanguagePreference,
  ) => {
    mockPartyDetails.language_preferences = {
      document_language_preference: structuredClone(documentLanguagePreference),
      hearing_language_preference: structuredClone(hearingLanguagePreference),
    };
  };

  it('should create the component', () => {
    setupComponent();

    expect(component).toBeTruthy();
  });

  it('should accept required inputs', () => {
    fixture.componentRef.setInput('party', mockPartyDetails);
    fixture.componentRef.setInput('cardTitle', 'Party Details');
    fixture.componentRef.setInput('summaryCardListId', 'party-card');
    fixture.componentRef.setInput('summaryListId', 'party-list');
    fixture.detectChanges();

    expect(component.party).toEqual(mockPartyDetails);
    expect(component.cardTitle).toBe('Party Details');
    expect(component.summaryCardListId).toBe('party-card');
    expect(component.summaryListId).toBe('party-list');
  });

  it('should initialize language preferences constants', () => {
    setupComponent();

    expect(component.languages).toBeDefined();
  });

  it('should handle organisation party details', () => {
    const organisationParty = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party);
    organisationParty.party_details.organisation_flag = true;
    organisationParty.party_details.organisation_details = {
      organisation_name: 'Test Company Ltd',
      organisation_aliases: [
        {
          alias_id: 'TRADING_NAME',
          sequence_number: 1,
          organisation_name: 'Test Co',
        },
      ],
    };

    fixture.componentRef.setInput('party', organisationParty);
    fixture.componentRef.setInput('cardTitle', 'Organisation');
    fixture.componentRef.setInput('summaryCardListId', 'org-card');
    fixture.componentRef.setInput('summaryListId', 'org-list');
    fixture.detectChanges();

    expect(component.party.party_details.organisation_flag).toBe(true);
    expect(component.party.party_details.organisation_details?.organisation_name).toBe('Test Company Ltd');
  });

  it('should use the reduced parent or guardian display for non-debtors', () => {
    mockPartyDetails.is_debtor = false;
    setupComponent(mockPartyDetails, true);

    expect(component.isParentGuardianNonDebtor).toBe(true);
    expect(component.showIndividualAdditionalFields).toBe(false);
    expect(component.showIndividualVehicleDetails).toBe(false);
    expect(component.showContactDetails).toBe(true);
  });

  it('should not use the reduced parent or guardian display for debtor parent or guardian accounts', () => {
    mockPartyDetails.is_debtor = true;
    setupComponent(mockPartyDetails, true);

    expect(component.isParentGuardianNonDebtor).toBe(false);
    expect(component.showIndividualAdditionalFields).toBe(true);
    expect(component.showIndividualVehicleDetails).toBe(true);
    expect(component.showContactDetails).toBe(true);
  });

  it('should not show contact details for non-debtor non-parent or guardian accounts', () => {
    mockPartyDetails.is_debtor = false;
    setupComponent();

    expect(component.isParentGuardianNonDebtor).toBe(false);
    expect(component.showContactDetails).toBe(false);
  });

  it('should show language preferences when document language is Welsh', () => {
    setLanguagePreferences(WELSH_LANGUAGE_PREFERENCE_MOCK, ENGLISH_LANGUAGE_PREFERENCE_MOCK);
    setupComponent();

    expect(component.showLanguagePreferences).toBe(true);
  });

  it('should show language preferences when only hearing language is Welsh', () => {
    setLanguagePreferences(ENGLISH_LANGUAGE_PREFERENCE_MOCK, WELSH_LANGUAGE_PREFERENCE_MOCK);
    setupComponent();

    expect(component.showLanguagePreferences).toBe(true);
  });

  it('should not show language preferences when neither language preference is Welsh', () => {
    setLanguagePreferences(ENGLISH_LANGUAGE_PREFERENCE_MOCK, ENGLISH_LANGUAGE_PREFERENCE_MOCK);
    setupComponent();

    expect(component.showLanguagePreferences).toBe(false);
  });

  it('should not show language preferences for non-debtors with a Welsh language preference', () => {
    mockPartyDetails.is_debtor = false;
    setupComponent();

    expect(component.showLanguagePreferences).toBe(false);
  });

  it('should resolve the parent guardian amend route when viewing a parent guardian account', () => {
    setupComponent(mockPartyDetails, true);

    expect(component.setLinkPartyType).toBe(component.partyTypes.PARENT_GUARDIAN);
  });

  it('should resolve the individual amend route when viewing a defendant account', () => {
    setupComponent();

    expect(component.setLinkPartyType).toBe(component.partyTypes.INDIVIDUAL);
  });

  it('should resolve the company amend route when viewing a company defendant account', () => {
    mockPartyDetails.party_details.organisation_flag = true;
    mockPartyDetails.party_details.organisation_details = {
      organisation_name: 'Test Company Ltd',
      organisation_aliases: [],
    };
    setupComponent(mockPartyDetails);

    expect(component.setLinkPartyType).toBe(component.partyTypes.COMPANY);
  });

  it('should route employer details to access denied when BU permission is missing', () => {
    setupComponent();

    expect(component.sectionChangeLink()).toBe('/access-denied');
  });

  it('should route employer details to the amend page when BU permission is present', () => {
    setupComponent(mockPartyDetails, true, true);

    expect(component.sectionChangeLink()).toBe('../party/parentGuardian/amend');
  });

  it('should only return a section fragment when BU permission is present', () => {
    setupComponent();

    expect(component.sectionChangeFragment(component.sectionFragments.partyDetails)).toBeUndefined();

    setupComponent(mockPartyDetails, false, true);

    expect(component.sectionChangeFragment(component.sectionFragments.partyDetails)).toBe(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_SECTION_FRAGMENTS.partyDetails,
    );
  });
});

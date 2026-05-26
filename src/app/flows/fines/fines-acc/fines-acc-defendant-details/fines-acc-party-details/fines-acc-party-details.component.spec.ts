import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpperCasePipe } from '@angular/common';
import { FinesAccPartyDetails } from './fines-acc-party-details.component';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-party-details.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { beforeEach, describe, expect, it } from 'vitest';

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
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyDetails);
    component = fixture.componentInstance;
    mockPartyDetails = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party);
  });

  const setupComponent = (
    party: IOpalFinesAccountPartyDetails = mockPartyDetails,
    isParentGuardianAccount: boolean = false,
  ) => {
    fixture.componentRef.setInput('party', party);
    fixture.componentRef.setInput('cardTitle', 'Party Details');
    fixture.componentRef.setInput('summaryCardListId', 'party-card');
    fixture.componentRef.setInput('summaryListId', 'party-list');
    fixture.componentRef.setInput('isParentGuardianAccount', isParentGuardianAccount);
    fixture.detectChanges();
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
    mockPartyDetails.language_preferences = {
      document_language_preference: {
        language_code: 'CY',
        language_display_name: component.languages.CY,
      },
      hearing_language_preference: {
        language_code: 'EN',
        language_display_name: component.languages.EN,
      },
    };
    setupComponent();

    expect(component.showLanguagePreferences).toBe(true);
  });

  it('should show language preferences when only hearing language is Welsh', () => {
    mockPartyDetails.language_preferences = {
      document_language_preference: {
        language_code: 'EN',
        language_display_name: component.languages.EN,
      },
      hearing_language_preference: {
        language_code: 'CY',
        language_display_name: component.languages.CY,
      },
    };
    setupComponent();

    expect(component.showLanguagePreferences).toBe(true);
  });

  it('should not show language preferences when neither language preference is Welsh', () => {
    mockPartyDetails.language_preferences = {
      document_language_preference: {
        language_code: 'EN',
        language_display_name: component.languages.EN,
      },
      hearing_language_preference: {
        language_code: 'EN',
        language_display_name: component.languages.EN,
      },
    };
    setupComponent();

    expect(component.showLanguagePreferences).toBe(false);
  });

  it('should not show language preferences for non-debtors with a Welsh language preference', () => {
    mockPartyDetails.is_debtor = false;
    setupComponent();

    expect(component.showLanguagePreferences).toBe(false);
  });
});

import { Component, Input } from '@angular/core';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-party-details.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { NationalInsurancePipe } from '@hmcts/opal-frontend-common/pipes/national-insurance';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';

@Component({
  selector: 'app-fines-acc-party-details',
  templateUrl: './fines-acc-party-details.component.html',
  imports: [
    FinesNotProvidedComponent,
    UpperCasePipe,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    NgTemplateOutlet,
    NationalInsurancePipe,
    DateFormatPipe,
  ],
})
export class FinesAccPartyDetails {
  @Input({ required: true }) party!: IOpalFinesAccountPartyDetails;
  @Input({ required: true }) cardTitle!: string;
  @Input({ required: true }) summaryCardListId!: string;
  @Input({ required: true }) summaryListId!: string;
  @Input({ required: false }) isParentGuardianAccount: boolean = false;
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;

  /**
   * Determines whether to use the reduced parent/guardian non-debtor display.
   */
  public get isParentGuardianNonDebtor(): boolean {
    return this.isParentGuardianAccount && !this.party.is_debtor;
  }

  /**
   * Determines whether aliases, date of birth and national insurance should be shown.
   */
  public get showIndividualAdditionalFields(): boolean {
    return !this.isParentGuardianNonDebtor;
  }

  /**
   * Determines whether vehicle details should be shown for an individual-style party.
   */
  public get showIndividualVehicleDetails(): boolean {
    return this.party.is_debtor;
  }

  /**
   * Determines whether contact details should be shown.
   */
  public get showContactDetails(): boolean {
    return this.party.is_debtor || this.isParentGuardianNonDebtor;
  }

  /**
   * Determines whether language preferences should be shown.
   */
  public get showLanguagePreferences(): boolean {
    return this.party.is_debtor && this.hasWelshLanguagePreference();
  }

  /**
   * Determines whether employer details should be shown.
   */
  public get showEmployerDetails(): boolean {
    return !this.party.party_details.organisation_flag && this.party.is_debtor && !!this.party.employer_details;
  }

  /**
   * Determines whether company details should be shown.
   */
  public get showCompanyDetails(): boolean {
    return (
      this.party.party_details.organisation_flag &&
      this.party.is_debtor &&
      !!this.party.party_details.organisation_details
    );
  }

  /**
   * Determines whether either language preference is Welsh.
   */
  private hasWelshLanguagePreference(): boolean {
    const documentLanguage = this.party.language_preferences?.document_language_preference?.language_display_name;
    const hearingLanguage = this.party.language_preferences?.hearing_language_preference?.language_display_name;

    return documentLanguage === this.languages.CY || hearingLanguage === this.languages.CY;
  }
}

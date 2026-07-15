import { Component, Input } from '@angular/core';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesAccountPartyDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-party-details.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { NationalInsurancePipe } from '@hmcts/opal-frontend-common/pipes/national-insurance';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import {
  FINES_ACC_PARTY_ADD_AMEND_CONVERT_SECTION_FRAGMENTS,
} from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-fragments.constant';

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
    RouterLink,
  ],
})
export class FinesAccPartyDetails {
  @Input({ required: true }) party!: IOpalFinesAccountPartyDetails;
  @Input({ required: true }) cardTitle!: string;
  @Input({ required: true }) summaryCardListId!: string;
  @Input({ required: true }) summaryListId!: string;
  @Input({ required: false }) isParentGuardianAccount: boolean = false;
  @Input({ required: false }) hasAccountMaintenancePermissionInBU: boolean = false;
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public readonly finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  public readonly partyTypes = FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES;
  public readonly sectionFragments = FINES_ACC_PARTY_ADD_AMEND_CONVERT_SECTION_FRAGMENTS;
  public readonly sectionFragmentValues = Object.values(FINES_ACC_PARTY_ADD_AMEND_CONVERT_SECTION_FRAGMENTS);

  /**
   * Determines whether the party is responsible for paying the account.
   */
  private get isDebtor(): boolean {
    return this.party.is_debtor;
  }

  /**
   * Determines whether either language preference is Welsh.
   */
  private hasWelshLanguagePreference(): boolean {
    const documentLanguage = this.party.language_preferences?.document_language_preference?.language_display_name;
    const hearingLanguage = this.party.language_preferences?.hearing_language_preference?.language_display_name;

    return documentLanguage === this.languages.CY || hearingLanguage === this.languages.CY;
  }

  /**
   * Determines whether to use the reduced parent/guardian non-debtor display.
   */
  public get isParentGuardianNonDebtor(): boolean {
    return this.isParentGuardianAccount && !this.isDebtor;
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
    return this.isDebtor;
  }

  /**
   * Determines whether contact details should be shown.
   */
  public get showContactDetails(): boolean {
    return this.isDebtor || this.isParentGuardianNonDebtor;
  }

  /**
   * Determines whether language preferences should be shown.
   */
  public get showLanguagePreferences(): boolean {
    return this.isDebtor && this.hasWelshLanguagePreference();
  }

  /**
   * Determines whether employer details should be shown.
   */
  public get showEmployerDetails(): boolean {
    return !this.party.party_details.organisation_flag && this.isDebtor && !!this.party.employer_details;
  }

  /**
   * Determines whether company details should be shown.
   */
  public get showCompanyDetails(): boolean {
    return (
      this.party.party_details.organisation_flag && this.isDebtor && !!this.party.party_details.organisation_details
    );
  }

  /**
   * Resolves the amend route party type for change links.
   */
  public get setLinkPartyType(): string {
    if (this.isParentGuardianAccount) {
      return this.partyTypes.PARENT_GUARDIAN;
    }

    return this.party.party_details.organisation_flag ? this.partyTypes.COMPANY : this.partyTypes.INDIVIDUAL;
  }

  /**
   * Resolves the target URL for a change link.
   */
  public sectionChangeLink(): string {
    return this.hasAccountMaintenancePermissionInBU
      ? `../${this.finesDefendantRoutingPaths.children.party}/${this.setLinkPartyType}/amend`
      : '/access-denied';
  }

  /**
   * Resolves the fragment for a change link when BU permission is present.
   * @param section - The amend form section to scroll to.
   */
  public sectionChangeFragment(section: (typeof this.sectionFragmentValues)[number]): string | undefined {
    return this.hasAccountMaintenancePermissionInBU ? section : undefined;
  }
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IFinesMacAccountDetailsState } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES } from '../../fines-mac-account-details/constants/fines-mac-account-details-account-types';
import { IFinesMacAccountTypes } from '../../interfaces/fines-mac-account-types.interface';
import { FINES_MAC_DEFENDANT_TYPES } from '../../constants/fines-mac-defendant-types';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesMacLanguagePreferencesOptions } from '../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { IFinesMacLanguagePreferencesState } from '../../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-state.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';

@Component({
  selector: 'app-fines-mac-review-account-account-details',
  imports: [GovukSummaryCardListComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-review-account-account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountAccountDetailsComponent implements OnInit {
  @Input({ required: true }) public accountDetails!: IFinesMacAccountDetailsState;
  @Input({ required: true }) public businessUnit!: IOpalFinesBusinessUnit;
  @Input({ required: true }) public languagePreferences!: IFinesMacLanguagePreferencesState;

  public accountType!: string;
  public defendantType!: string;
  public documentLanguage!: string;
  public courtHearingLanguage!: string;

  /**
   * Retrieves the account type based on the account details and assigns it to the `accountType` property.
   * The account type is determined by looking up the `fm_create_account_account_type` field in the
   * `FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES` object.
   *
   * @private
   */
  private getAccountType(): void {
    this.accountType =
      FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES[
        this.accountDetails.fm_create_account_account_type! as keyof IFinesMacAccountTypes
      ];
  }

  /**
   * Retrieves the defendant type based on the account details and assigns it to the `defendantType` property.
   * The defendant type is determined by looking up the `fm_create_account_defendant_type` value in the
   * `FINES_MAC_DEFENDANT_TYPES` object.
   *
   * @private
   */
  private getDefendantType(): void {
    this.defendantType =
      FINES_MAC_DEFENDANT_TYPES[this.accountDetails.fm_create_account_defendant_type! as keyof IFinesMacDefendantTypes];
  }

  /**
   * Retrieves the document language based on the user's language preferences.
   * The language preference is fetched from the `FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS`
   * using the `fm_language_preferences_document_language` key.
   *
   * @private
   */
  private getDocumentLanguage(): void {
    this.documentLanguage =
      FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS[
        this.languagePreferences.fm_language_preferences_document_language! as keyof IFinesMacLanguagePreferencesOptions
      ];
  }

  /**
   * Retrieves the court hearing language preference based on the user's language preferences.
   * The language preference is fetched from the `FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS` object
   * using the `fm_language_preferences_hearing_language` property from the `languagePreferences` object.
   * The result is then assigned to the `courtHearingLanguage` property.
   *
   * @private
   */
  private getHearingLanguage(): void {
    this.courtHearingLanguage =
      FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS[
        this.languagePreferences.fm_language_preferences_hearing_language! as keyof IFinesMacLanguagePreferencesOptions
      ];
  }

  /**
   * Retrieves and sets various account details data including account type, defendant type,
   * document language, and hearing language.
   *
   * @private
   */
  private getAccountDetailsData(): void {
    this.getAccountType();
    this.getDefendantType();
    this.getDocumentLanguage();
    this.getHearingLanguage();
  }

  public ngOnInit(): void {
    this.getAccountDetailsData();
  }
}

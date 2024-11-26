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
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';

@Component({
  selector: 'app-fines-mac-review-account-account-details',
  standalone: true,
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

  private getAccountType(): void {
    this.accountType =
      FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES[
        this.accountDetails.fm_create_account_account_type! as keyof IFinesMacAccountTypes
      ];
  }

  private getDefendantType(): void {
    this.defendantType =
      FINES_MAC_DEFENDANT_TYPES[this.accountDetails.fm_create_account_defendant_type! as keyof IFinesMacDefendantTypes];
  }

  private getDocumentLanguage(): void {
    this.documentLanguage =
      FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS[
        this.languagePreferences.fm_language_preferences_document_language! as keyof IFinesMacLanguagePreferencesOptions
      ];
  }

  private getHearingLanguage(): void {
    this.documentLanguage =
      FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS[
        this.languagePreferences.fm_language_preferences_hearing_language! as keyof IFinesMacLanguagePreferencesOptions
      ];
  }

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

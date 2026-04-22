import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-map-transform-items-config.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../constants/fines-acc-debtor-types.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES } from '../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-modes.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT } from '../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-text.constant';

@Component({
  selector: 'app-fines-acc-convert',
  imports: [GovukHeadingWithCaptionComponent, GovukCancelLinkComponent],
  templateUrl: './fines-acc-convert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccConvertComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly payloadService = inject(FinesAccPayloadService);

  public readonly accountStore = inject(FinesAccountStore);
  public readonly partyTypes = FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES;
  public readonly routePartyType = this.activatedRoute.snapshot.paramMap.get('partyType') ?? '';
  public readonly accountId = Number(this.activatedRoute.snapshot.paramMap.get('accountId'));

  public accountData!: IOpalFinesAccountDefendantDetailsHeader;

  /**
   * Hydrates the account header data from the route resolver and syncs it into store state.
   */
  private getHeaderDataFromRoute(): void {
    this.accountData = this.payloadService.transformPayload(
      this.activatedRoute.snapshot.data['defendantAccountHeadingData'],
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    this.accountStore.setAccountState(
      this.payloadService.transformDefendantAccountHeaderForStore(this.accountId, this.accountData),
    );
  }

  /**
   * Indicates whether the source account currently represents a company.
   */
  private get isSourceCompanyAccount(): boolean {
    return this.accountData.party_details.organisation_flag;
  }

  /**
   * Validates whether the requested target party type is a supported conversion from the source account.
   */
  private get canConvertAccount(): boolean {
    if (this.routePartyType === this.partyTypes.COMPANY) {
      return !this.isSourceCompanyAccount && this.accountData.debtor_type !== FINES_ACC_DEBTOR_TYPES.parentGuardian;
    }

    if (this.routePartyType === this.partyTypes.INDIVIDUAL) {
      return this.isSourceCompanyAccount;
    }

    return false;
  }

  /**
   * Builds the account number and party name caption shown above the confirmation prompt.
   */
  public get captionText(): string {
    return `${this.accountStore.account_number() ?? ''} - ${this.accountStore.party_name() ?? ''}`;
  }

  /**
   * Returns the shared conversion copy for the requested target party type when supported.
   */
  private get conversionText() {
    if (this.routePartyType !== this.partyTypes.COMPANY && this.routePartyType !== this.partyTypes.INDIVIDUAL) {
      return null;
    }

    return FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[this.routePartyType];
  }

  /**
   * Returns the confirmation heading for the requested conversion target.
   */
  public get headingText(): string {
    return this.conversionText?.confirmationHeading ?? '';
  }

  /**
   * Returns the warning copy describing which source-specific fields will be removed.
   */
  public get warningText(): string {
    return this.conversionText?.warningText ?? '';
  }

  /**
   * Initializes the page state and redirects back to account details when the requested conversion is not valid.
   */
  public ngOnInit(): void {
    this.getHeaderDataFromRoute();

    if (!this.canConvertAccount) {
      this.navigateBackToAccountSummary();
    }
  }

  /**
   * Continues to the shared convert form for the selected target party type.
   */
  public handleContinue(): void {
    if (!this.canConvertAccount) {
      this.navigateBackToAccountSummary();
      return;
    }

    this.router.navigate(
      [
        '../../',
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party,
        this.routePartyType,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT,
      ],
      {
        relativeTo: this.activatedRoute,
      },
    );
  }

  /**
   * Returns the user to the defendant details tab from the conversion confirmation page.
   */
  public navigateBackToAccountSummary(): void {
    this.router.navigate(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: this.activatedRoute,
      fragment: 'defendant',
    });
  }
}

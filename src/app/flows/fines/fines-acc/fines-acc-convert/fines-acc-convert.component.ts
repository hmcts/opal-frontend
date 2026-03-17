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

  private getHeaderDataFromRoute(): void {
    this.accountData = this.payloadService.transformPayload(
      this.activatedRoute.snapshot.data['defendantAccountHeadingData'],
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    this.accountStore.setAccountState(
      this.payloadService.transformAccountHeaderForStore(this.accountId, this.accountData, 'defendant'),
    );
  }

  private get canConvertToCompanyAccount(): boolean {
    return (
      this.routePartyType === this.partyTypes.COMPANY &&
      !this.accountData.party_details.organisation_flag &&
      this.accountData.debtor_type !== FINES_ACC_DEBTOR_TYPES.parentGuardian
    );
  }

  public get captionText(): string {
    return `${this.accountStore.account_number() ?? ''} - ${this.accountStore.party_name() ?? ''}`;
  }

  public get headingText(): string {
    return 'Are you sure you want to convert this account to a company account?';
  }

  public get warningText(): string {
    return 'Certain data related to individual accounts, such as employment details, will be removed.';
  }

  public ngOnInit(): void {
    this.getHeaderDataFromRoute();

    if (!this.canConvertToCompanyAccount) {
      this.navigateBackToAccountSummary();
    }
  }

  public handleContinue(): void {
    if (!this.canConvertToCompanyAccount) {
      this.navigateBackToAccountSummary();
      return;
    }

    this.router.navigate(
      [
        '../../',
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT,
      ],
      {
        relativeTo: this.activatedRoute,
      },
    );
  }

  public navigateBackToAccountSummary(): void {
    this.router.navigate(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: this.activatedRoute,
      fragment: 'defendant',
    });
  }
}

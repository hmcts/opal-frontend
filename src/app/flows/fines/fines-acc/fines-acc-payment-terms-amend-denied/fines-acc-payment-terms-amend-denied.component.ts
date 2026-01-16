import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FINES_ACC_PAYMENT_TERMS_AMEND_DENIED_ACCOUNT_STATUS_MAP } from './constants/fines-acc-payment-terms-amend-denied-account-status-map.constant';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

@Component({
  selector: 'app-fines-acc-payment-terms-amend-denied',
  imports: [GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-payment-terms-amend-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPaymentTermsAmendDeniedComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly accountStore = inject(FinesAccountStore);
  public readonly deniedType = this.route.snapshot.paramMap.get('type');
  public defendantAccountHeadingData: IOpalFinesAccountDefendantDetailsHeader =
    this.route.snapshot.data['defendantAccountHeadingData'];
  public defendantAccountPaymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest =
    this.route.snapshot.data['defendantAccountPaymentTermsData'].paymentTermsData;
  public readonly accountStatusCode: keyof typeof FINES_ACC_PAYMENT_TERMS_AMEND_DENIED_ACCOUNT_STATUS_MAP = this
    .defendantAccountHeadingData.account_status_reference
    .account_status_code as keyof typeof FINES_ACC_PAYMENT_TERMS_AMEND_DENIED_ACCOUNT_STATUS_MAP;
  public readonly accountStatusDescription: string =
    FINES_ACC_PAYMENT_TERMS_AMEND_DENIED_ACCOUNT_STATUS_MAP[this.accountStatusCode];

  /**
   * Navigates back to the account summary details page.
   * @param event The event triggered by clicking or pressing enter on the back link.
   */
  public navigateBackToAccountSummary(event: Event): void {
    event.preventDefault();
    this.router.navigate([`../../../details`], { relativeTo: this.route });
  }
}

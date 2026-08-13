import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
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
  public defendantAccountPaymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest =
    this.route.snapshot.data['defendantAccountPaymentTermsData'].paymentTermsData;

  /**
   * Navigates back to the account summary details page.
   * @param event The event triggered by clicking or pressing enter on the back link.
   */
  public navigateBackToAccountSummary(event?: Event): void {
    event?.preventDefault();
    this.router.navigate([`../../../details`], { relativeTo: this.route });
  }
}

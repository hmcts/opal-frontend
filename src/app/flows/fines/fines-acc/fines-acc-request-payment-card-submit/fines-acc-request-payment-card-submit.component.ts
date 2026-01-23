import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { Router, ActivatedRoute } from '@angular/router';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';

@Component({
  selector: 'app-fines-acc-request-payment-card-submit',
  templateUrl: './fines-acc-request-payment-card-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GovukHeadingWithCaptionComponent, GovukCancelLinkComponent],
})
export class FinesAccRequestPaymentCardSubmitComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly opalFinesService = inject(OpalFines);
  public readonly accountStore = inject(FinesAccountStore);

  /**
   * Handles the submission of the payment card request.
   */
  private requestPaymentCard(): void {
    const base_version = this.accountStore.base_version();
    const account_id = this.accountStore.account_id();
    const business_unit_id = this.accountStore.business_unit_id();
    const business_unit_user_id = this.accountStore.business_unit_user_id();
    this.opalFinesService
      .addDefendantAccountPaymentCardRequest(account_id!, base_version!, business_unit_id!, business_unit_user_id!)
      .subscribe({
        next: () => {
          this.accountStore.setSuccessMessage('Payment card request submitted successfully');
          this.navigateBackToAccountSummary();
        },
      });
  }

  /**
   * Handles the request payment card action and triggers the request payment card function.
   */
  public handleRequestPaymentCard(): void {
    if (this.isStoreDataPresent()) {
      this.requestPaymentCard();
    }
  }

  /**
   * Navigates back to the account summary page. With the payment terms tab active.
   */
  public navigateBackToAccountSummary(): void {
    this.router.navigate(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: this.activatedRoute,
      fragment: 'payment-terms',
    });
  }

  /**
   * Determines if the store data is present. Used to conditionally enable the request button.
   * Ensuring that the endpoint is not called with missing header data.
   */
  public isStoreDataPresent(): boolean {
    return !!(
      this.accountStore.account_id() &&
      this.accountStore.base_version() &&
      this.accountStore.business_unit_id() &&
      this.accountStore.business_unit_user_id()
    );
  }
}

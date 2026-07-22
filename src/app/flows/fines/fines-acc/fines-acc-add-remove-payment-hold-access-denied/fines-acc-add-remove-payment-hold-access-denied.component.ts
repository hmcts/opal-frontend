import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';

@Component({
  selector: 'app-fines-acc-add-remove-payment-hold-access-denied',
  imports: [GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-add-remove-payment-hold-access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAddRemovePaymentHoldAccessDeniedComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly accountStore = inject(FinesAccountStore);

  /**
   * Navigates back to the account summary details page.
   * @param event The event triggered by clicking or pressing enter on the back link.
   */
  public navigateBackToAccountSummary(event: Event): void {
    event.preventDefault();
    this.router.navigate([`../../details`], { relativeTo: this.route });
  }
}

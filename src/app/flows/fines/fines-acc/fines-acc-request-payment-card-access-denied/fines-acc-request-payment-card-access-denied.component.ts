import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

@Component({
  selector: 'app-fines-acc-request-payment-card-access-denied',
  imports: [GovukHeadingWithCaptionComponent],
  templateUrl: './fines-acc-request-payment-card-access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccRequestPaymentCardAccessDeniedComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly accountStore = inject(FinesAccountStore);
  public readonly deniedType = this.route.snapshot.paramMap.get('type');
  public paymentTermsData!: IOpalFinesAccountDefendantDetailsPaymentTermsLatest;

  /**
   * Navigates back to the account summary details page.
   * @param event The event triggered by clicking or pressing enter on the back link.
   */
  public navigateBackToAccountSummary(event: Event): void {
    event.preventDefault();
    this.router.navigate([`../../../details`], { relativeTo: this.route });
  }

  public ngOnInit(): void {
    this.paymentTermsData = this.route.snapshot.data['defendantAccountPaymentTermsData'].paymentTermsData;
  }
}

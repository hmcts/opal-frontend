import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccountStore } from '../stores/fines-acc.store';

@Component({
  selector: 'app-fines-acc-apr-access-denied',
  imports: [GovukHeadingWithCaptionComponent, GovukButtonComponent],
  templateUrl: './fines-acc-apr-access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAprAccessDeniedComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly accountStore = inject(FinesAccountStore);

  /**
   * Returns to the current defendant account's Payment terms tab.
   */
  public navigateBack(): void {
    void this.router.navigate([`../../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`], {
      relativeTo: this.route,
      fragment: 'payment-terms',
    });
  }
}

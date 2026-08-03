import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';

@Component({
  selector: 'app-fines-reports-business-unit-warning',
  imports: [GovukButtonDirective, GovukCancelLinkComponent],
  templateUrl: './fines-reports-business-unit-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsBusinessUnitWarningComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesReportsStore = inject(FinesReportsStore);
  private readonly router = inject(Router);

  public readonly selectedBusinessUnitCount = computed(() => this.finesReportsStore.selectedBusinessUnitIds().length);

  /**
   * Returns to business unit selection with the stored selections restored.
   */
  public handleGoBack(): void {
    this.router.navigate([`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Continues to the report parameters screen.
   */
  public handleContinue(): void {
    this.router.navigate([`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters}`], {
      relativeTo: this.activatedRoute,
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';

@Component({
  selector: 'app-fines-reports-business-unit-warning',
  imports: [GovukButtonDirective, GovukCancelLinkComponent],
  templateUrl: './fines-reports-business-unit-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsBusinessUnitWarningComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesReportsStore = inject(FinesReportsStore);
  private readonly router = inject(Router);

  public readonly selectedBusinessUnitIds = this.finesReportsStore.selectedBusinessUnitIds;

  /**
   * Returns the warning heading using the current selected business unit count.
   *
   * @returns The warning heading shown on the business unit warning page.
   */
  public get warningHeading(): string {
    return `You have selected ${this.selectedBusinessUnitIds().length} business units`;
  }

  /**
   * Navigates back to the business unit selection screen with the current selections restored.
   */
  public handleGoBack(): void {
    this.router.navigate([`../../${FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits}`], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Logs selected business units while the next create-report screen is out of scope.
   */
  public handleContinue(): void {
    // eslint-disable-next-line no-console
    console.log('PO-2305 selected business unit ids', this.finesReportsStore.selectedBusinessUnitIds());
  }

  /**
   * Redirects back to selection when no selected business unit ids are available in the reports store.
   */
  public ngOnInit(): void {
    if (!this.finesReportsStore.hasSelectedBusinessUnits()) {
      this.router.navigate([`../../${FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}

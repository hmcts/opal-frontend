import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { getFinesReportsSelectedBusinessUnitIdsFromNavigationState } from '../utils/get-fines-reports-selected-business-unit-ids-from-navigation-state.util';

@Component({
  selector: 'app-fines-reports-business-unit-warning',
  imports: [GovukButtonDirective, GovukCancelLinkComponent],
  templateUrl: './fines-reports-business-unit-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsBusinessUnitWarningComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  public selectedBusinessUnitIds: number[] = [];

  /**
   * Returns the warning heading using the current selected business unit count.
   *
   * @returns The warning heading shown on the business unit warning page.
   */
  public get warningHeading(): string {
    return `You have selected ${this.selectedBusinessUnitIds.length} business units`;
  }

  /**
   * Navigates back to the business unit selection screen with the current selections restored.
   */
  public handleGoBack(): void {
    this.router.navigate([`../${FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits}`], {
      relativeTo: this.activatedRoute,
      state: { selectedBusinessUnitIds: this.selectedBusinessUnitIds },
    });
  }

  /**
   * Continues to the parameters screen after the warning has been accepted.
   */
  public handleContinue(): void {
    this.router.navigate([`../${FINES_REPORTS_ROUTING_PATHS.children.parameters}`], {
      relativeTo: this.activatedRoute,
      state: { selectedBusinessUnitIds: this.selectedBusinessUnitIds },
    });
  }

  /**
   * Hydrates the selected business unit ids from navigation or browser history state and redirects back to selection when missing.
   */
  public ngOnInit(): void {
    this.selectedBusinessUnitIds = getFinesReportsSelectedBusinessUnitIdsFromNavigationState(
      this.router,
      this.location,
    );

    if (this.selectedBusinessUnitIds.length === 0) {
      this.router.navigate([`../${FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}

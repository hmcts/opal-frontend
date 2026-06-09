import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { getFinesReportsSelectedBusinessUnitIdsFromNavigationState } from '../utils/get-fines-reports-selected-business-unit-ids-from-navigation-state.util';

@Component({
  selector: 'app-fines-reports-parameters',
  imports: [GovukHeadingWithCaptionComponent],
  templateUrl: './fines-reports-parameters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsParametersComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  /**
   * Report heading resolved from route data for the current report journey.
   */
  public readonly reportHeading = this.activatedRoute.snapshot.data['reportHeading'] as string;
  public selectedBusinessUnitNames: string[] = [];

  /**
   * Loads the selected business unit names from the resolver payload and navigation state.
   *
   * @param selectedBusinessUnitIds - Selected business unit ids restored for the current journey.
   */
  private loadSelectedBusinessUnits(selectedBusinessUnitIds: number[]): void {
    const resolverData = this.activatedRoute.snapshot.data['businessUnits'] as
      | IOpalFinesBusinessUnitRefData
      | undefined;
    const businessUnits = resolverData?.refData ?? [];

    this.selectedBusinessUnitNames = businessUnits
      .filter((businessUnit: IOpalFinesBusinessUnit) => selectedBusinessUnitIds.includes(businessUnit.business_unit_id))
      .map((businessUnit: IOpalFinesBusinessUnit) => businessUnit.business_unit_name)
      .sort((left, right) => left.localeCompare(right));
  }

  /**
   * Redirects back to business unit selection when no selected business units are available in navigation state.
   */
  private redirectToSelectBusinessUnits(): void {
    this.router.navigate([`../../${FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits}`], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Initialises the placeholder parameters screen using the selected business units passed through navigation state.
   */
  public ngOnInit(): void {
    const selectedBusinessUnitIds = getFinesReportsSelectedBusinessUnitIdsFromNavigationState(
      this.router,
      this.location,
    );

    if (selectedBusinessUnitIds.length === 0) {
      this.redirectToSelectBusinessUnits();
      return;
    }

    this.loadSelectedBusinessUnits(selectedBusinessUnitIds);
  }
}

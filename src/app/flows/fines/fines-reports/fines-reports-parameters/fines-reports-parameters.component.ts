import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { IFinesReportsBusinessUnitNavigationState } from '../interfaces/fines-reports-business-unit-navigation-state.interface';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

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
  private readonly routeWithReportId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportId = this.routeWithReportId.snapshot.paramMap.get('reportId') ?? '';

  public selectedBusinessUnitNames: string[] = [];

  /**
   * Returns the heading for the current operational report type.
   *
   * @returns The report heading shown on the parameters screen.
   */
  public get reportHeading(): string {
    const configuredHeading =
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportId)?.heading ?? '';
    const report = this.activatedRoute.snapshot.data['report'] as IOpalFinesReport | null | undefined;

    return configuredHeading || report?.report_title || '';
  }

  /**
   * Reads selected business unit ids from the current navigation state.
   *
   * @returns Selected business unit ids restored from navigation or browser history state, or an empty array when none were supplied.
   */
  private getSelectedBusinessUnitIdsFromNavigation(): number[] {
    const navigationState = this.router.currentNavigation()?.extras.state as
      | IFinesReportsBusinessUnitNavigationState
      | undefined;
    const locationState = this.location.getState() as IFinesReportsBusinessUnitNavigationState | undefined;
    const selectedBusinessUnitIds = navigationState?.selectedBusinessUnitIds ?? locationState?.selectedBusinessUnitIds;

    return Array.isArray(selectedBusinessUnitIds) ? selectedBusinessUnitIds : [];
  }

  /**
   * Loads the selected business unit names from the resolver payload and navigation state.
   */
  private loadSelectedBusinessUnits(): void {
    const resolverData = this.activatedRoute.snapshot.data['businessUnits'] as
      | IOpalFinesBusinessUnitRefData
      | undefined;
    const selectedBusinessUnitIds = this.getSelectedBusinessUnitIdsFromNavigation();
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
    this.router.navigate(['..', FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Initialises the placeholder parameters screen using the selected business units passed through navigation state.
   */
  public ngOnInit(): void {
    if (this.getSelectedBusinessUnitIdsFromNavigation().length === 0) {
      this.redirectToSelectBusinessUnits();
      return;
    }

    this.loadSelectedBusinessUnits();
  }
}

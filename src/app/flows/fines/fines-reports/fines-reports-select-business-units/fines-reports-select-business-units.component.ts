import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../routing/constants/fines-reports-routing-titles.constant';
import { FinesReportsSelectBusinessUnitsFormComponent } from './fines-reports-select-business-units-form/fines-reports-select-business-units-form.component';

@Component({
  selector: 'app-fines-reports-select-business-units',
  imports: [GovukHeadingWithCaptionComponent, FinesReportsSelectBusinessUnitsFormComponent],
  templateUrl: './fines-reports-select-business-units.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSelectBusinessUnitsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routeWithReportId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportId = this.routeWithReportId.snapshot.paramMap.get('reportId') ?? '';

  public readonly pageHeading = FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits;
  public businessUnits: IOpalFinesBusinessUnit[] = [];

  /**
   * Returns the report heading for the selected report type.
   *
   * @returns The operational report heading, or an empty string when the report is not recognised.
   */
  public get reportHeading(): string {
    return FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportId)?.heading ?? '';
  }

  /**
   * Navigates back to the report summary list.
   */
  public handleCancel(): void {
    this.router.navigate(['..', FINES_REPORTS_ROUTING_PATHS.children.summaryList], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Populates the current business unit list from the route resolver and sorts it alphabetically.
   */
  public ngOnInit(): void {
    const resolverData = this.activatedRoute.snapshot.data['businessUnits'] as
      | IOpalFinesBusinessUnitRefData
      | undefined;

    this.businessUnits = [...(resolverData?.refData ?? [])].sort((left, right) =>
      left.business_unit_name.localeCompare(right.business_unit_name),
    );
  }
}

import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_REPORTS_BUSINESS_UNIT_WARNING_THRESHOLD } from '../constants/fines-reports-business-unit-thresholds.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../routing/constants/fines-reports-routing-titles.constant';
import { FinesReportsSelectBusinessUnitsFormComponent } from './fines-reports-select-business-units-form/fines-reports-select-business-units-form.component';
import { IFinesReportsSelectBusinessUnitsFormState } from './interfaces/fines-reports-select-business-units-form-state.interface';

interface IFinesReportsBusinessUnitNavigationState {
  selectedBusinessUnitIds?: number[];
}

@Component({
  selector: 'app-fines-reports-select-business-units',
  imports: [GovukHeadingWithCaptionComponent, FinesReportsSelectBusinessUnitsFormComponent],
  templateUrl: './fines-reports-select-business-units.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSelectBusinessUnitsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly routeWithReportId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportId = this.routeWithReportId.snapshot.paramMap.get('reportId') ?? '';

  public readonly pageHeading = FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits;
  public businessUnits: IOpalFinesBusinessUnit[] = [];
  public selectedBusinessUnitIds: number[] = [];

  /**
   * Returns the report heading for the selected report type.
   *
   * @returns The operational report heading, or an empty string when the report is not recognised.
   */
  public get reportHeading(): string {
    return FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportId)?.heading ?? '';
  }

  /**
   * Gets selected business unit ids from a submitted form.
   *
   * @param formData - The submitted business unit selection form data.
   * @returns The selected business unit ids.
   */
  private getSelectedBusinessUnitIds(formData: IFinesReportsSelectBusinessUnitsFormState): number[] {
    if (this.businessUnits.length === 1) {
      return [this.businessUnits[0].business_unit_id];
    }

    return Object.entries(formData.fines_reports_select_business_unit_ids)
      .filter(([, selected]) => selected)
      .map(([businessUnitId]) => Number(businessUnitId));
  }

  /**
   * Returns whether the selected business unit count needs the timeout warning.
   *
   * @param selectedCount - Number of selected business units.
   * @returns True when the warning threshold has been exceeded.
   */
  private shouldShowBusinessUnitWarning(selectedCount: number): boolean {
    return selectedCount > FINES_REPORTS_BUSINESS_UNIT_WARNING_THRESHOLD;
  }

  /**
   * Reads selected business unit ids from the current navigation state.
   *
   * @returns Selected business unit ids restored from navigation, or an empty array when none were supplied.
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
   * Navigates to the warning screen for a large business unit selection.
   *
   * @param selectedBusinessUnitIds - Selected business unit ids waiting for warning confirmation.
   */
  private navigateToBusinessUnitWarning(selectedBusinessUnitIds: number[]): void {
    this.router.navigate(['..', FINES_REPORTS_ROUTING_PATHS.children.businessUnitWarning], {
      relativeTo: this.activatedRoute,
      state: { selectedBusinessUnitIds },
    });
  }

  /**
   * Stores the selected business unit ids and performs the temporary continue redirect.
   *
   * @param selectedBusinessUnitIds - Selected business unit ids to continue with.
   */
  private proceedWithSelectedBusinessUnits(selectedBusinessUnitIds: number[]): void {
    this.selectedBusinessUnitIds = selectedBusinessUnitIds;
    this.router.navigate(['..', FINES_REPORTS_ROUTING_PATHS.children.summaryList], {
      relativeTo: this.activatedRoute,
    });
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
   * Handles a valid business unit selection from the form.
   *
   * @param form - The submitted select business units form.
   */
  public handleContinue(form: IAbstractFormBaseForm<IFinesReportsSelectBusinessUnitsFormState>): void {
    const selectedBusinessUnitIds = this.getSelectedBusinessUnitIds(form.formData);

    if (this.shouldShowBusinessUnitWarning(selectedBusinessUnitIds.length)) {
      this.navigateToBusinessUnitWarning(selectedBusinessUnitIds);
      return;
    }

    this.proceedWithSelectedBusinessUnits(selectedBusinessUnitIds);
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
    this.selectedBusinessUnitIds = this.getSelectedBusinessUnitIdsFromNavigation();
  }
}

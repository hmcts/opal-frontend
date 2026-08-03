import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';
import { FinesReportsSelectBusinessUnitsFormComponent } from './fines-reports-select-business-units-form/fines-reports-select-business-units-form.component';
import { IFinesReportsSelectBusinessUnitsFormState } from './interfaces/fines-reports-select-business-units-form-state.interface';

@Component({
  selector: 'app-fines-reports-select-business-units',
  imports: [FinesReportsSelectBusinessUnitsFormComponent],
  templateUrl: './fines-reports-select-business-units.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSelectBusinessUnitsComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly finesReportsStore = inject(FinesReportsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reportTypeId = this.route.parent?.snapshot.paramMap.get('reportTypeId') ?? '';
  private readonly report = this.route.snapshot.data['report'] as IOpalFinesReport | null | undefined;

  /**
   * Report heading resolved from route data for the current report journey.
   */
  public readonly reportHeading = this.route.snapshot.data['reportHeading'] as string;
  public readonly businessUnitWarningThreshold = this.report?.report_parameters?.business_unit_warning_threshold;
  public readonly selectedBusinessUnitIds = computed(() =>
    this.finesReportsStore.getSelectedBusinessUnitIdsForReport(this.reportTypeId),
  );
  public businessUnits: IOpalFinesBusinessUnit[] = [];

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
   * Populates the current business unit list from the route resolver and sorts it alphabetically.
   */
  private setBusinessUnitsFromRouteResolver(): void {
    const resolverData = this.route.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | undefined;

    this.businessUnits = [...(resolverData?.refData ?? [])].sort((left, right) =>
      left.business_unit_name.localeCompare(right.business_unit_name),
    );
  }

  /**
   * Returns whether the selected business unit count needs the timeout warning.
   *
   * @param selectedCount - Number of selected business units.
   * @returns True when the API-defined warning threshold has been exceeded.
   */
  private shouldShowBusinessUnitWarning(selectedCount: number): boolean {
    return this.businessUnitWarningThreshold !== undefined && selectedCount > this.businessUnitWarningThreshold;
  }

  /**
   * Opens the warning screen for a large business unit selection.
   */
  private navigateToBusinessUnitWarning(): void {
    this.router.navigate([`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning}`], {
      relativeTo: this.route,
    });
  }

  /**
   * Opens the report parameters screen.
   */
  private navigateToReportParameters(): void {
    this.router.navigate([`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters}`], {
      relativeTo: this.route,
    });
  }

  /**
   * Clears the current selection and returns to the report summary list.
   */
  public handleCancel(): void {
    this.finesReportsStore.clearSelectedBusinessUnitIds();
    this.router.navigate([`../../${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`], {
      relativeTo: this.route,
    });
  }

  /**
   * Updates the page-level unsaved changes state from the child form.
   *
   * @param unsavedChanges - Whether the business unit form currently has unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Stores a valid business unit selection and opens the warning or parameter step.
   *
   * @param form - The submitted select business units form.
   */
  public handleContinue(form: IAbstractFormBaseForm<IFinesReportsSelectBusinessUnitsFormState>): void {
    const selectedBusinessUnitIds = this.getSelectedBusinessUnitIds(form.formData);
    this.finesReportsStore.setSelectedBusinessUnitIds(this.reportTypeId, selectedBusinessUnitIds);

    if (this.shouldShowBusinessUnitWarning(selectedBusinessUnitIds.length)) {
      this.navigateToBusinessUnitWarning();
      return;
    }

    this.navigateToReportParameters();
  }

  /**
   * Populates the current business unit list from the route resolver.
   */
  public ngOnInit(): void {
    this.setBusinessUnitsFromRouteResolver();
  }
}

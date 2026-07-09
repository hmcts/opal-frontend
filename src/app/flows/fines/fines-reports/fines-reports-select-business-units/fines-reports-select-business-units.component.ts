import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../routing/constants/fines-reports-routing-titles.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';
import { FinesReportsSelectBusinessUnitsFormComponent } from './fines-reports-select-business-units-form/fines-reports-select-business-units-form.component';
import { IFinesReportsSelectBusinessUnitsFormState } from './interfaces/fines-reports-select-business-units-form-state.interface';

@Component({
  selector: 'app-fines-reports-select-business-units',
  imports: [GovukHeadingWithCaptionComponent, FinesReportsSelectBusinessUnitsFormComponent],
  templateUrl: './fines-reports-select-business-units.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSelectBusinessUnitsComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly finesReportsStore = inject(FinesReportsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly routerService = inject(Router);
  private readonly reportTypeId = this.route.parent?.snapshot.paramMap.get('reportTypeId') ?? '';
  private readonly report = this.route.snapshot.data['report'] as IOpalFinesReport | null | undefined;

  public readonly pageHeading = FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits;
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
   * Returns whether the selected business unit count needs the timeout warning.
   *
   * @param selectedCount - Number of selected business units.
   * @returns True when the warning threshold has been exceeded.
   */
  private shouldShowBusinessUnitWarning(selectedCount: number): boolean {
    return this.businessUnitWarningThreshold !== undefined && selectedCount > this.businessUnitWarningThreshold;
  }

  /**
   * Navigates to the warning screen for a large business unit selection.
   */
  private navigateToBusinessUnitWarning(): void {
    this.routerService.navigate([`../../${FINES_REPORTS_ROUTING_PATHS.children.businessUnitWarning}`], {
      relativeTo: this.route,
    });
  }

  /**
   * Logs selected business units while the next create-report screen is out of scope.
   */
  private logSelectedBusinessUnitIds(): void {
    // eslint-disable-next-line no-console
    console.log('PO-2305 selected business unit ids', this.finesReportsStore.selectedBusinessUnitIds());
  }

  /**
   * Navigates back to the report summary list.
   */
  public handleCancel(): void {
    this.finesReportsStore.clearSelectedBusinessUnitIds();
    this.routerService.navigate([`../../${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`], {
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
   * Handles a valid business unit selection from the form.
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

    this.logSelectedBusinessUnitIds();
  }

  /**
   * Populates the current business unit list from the route resolver and sorts it alphabetically.
   */
  public ngOnInit(): void {
    const resolverData = this.route.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | undefined;

    this.businessUnits = [...(resolverData?.refData ?? [])].sort((left, right) =>
      left.business_unit_name.localeCompare(right.business_unit_name),
    );
  }
}

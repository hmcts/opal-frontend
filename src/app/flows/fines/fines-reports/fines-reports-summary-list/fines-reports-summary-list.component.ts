import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';
import { FinesReportsSummaryListDateFilter } from './types/fines-reports-summary-list-date-filter.type';
import { FinesReportsSummaryListTableWrapperComponent } from './fines-reports-summary-list-table-wrapper/fines-reports-summary-list-table-wrapper.component';
import { FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-reports-summary-list-table-wrapper/constants/fines-reports-summary-list-table-wrapper-table-sort-default.constant';
import {
  FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
  FINES_REPORTS_SUMMARY_LIST_CUSTOM_DAYS,
  FINES_REPORTS_SUMMARY_LIST_DATE_RANGE,
  FINES_REPORTS_SUMMARY_LIST_FILTER_STATE,
  FINES_REPORTS_SUMMARY_LIST_LAST_7_DAYS,
} from './constants/fines-reports-summary-list-filter-state.constant';
import { IFinesReportsSummaryListFilterState } from './interfaces/fines-reports-summary-list-filter-state.interface';
import { IFinesReportsSummaryListQueryState } from './interfaces/fines-reports-summary-list-query-state.interface';
import { IFinesReportsSummaryListTableData } from './interfaces/fines-reports-summary-list-table-data.interface';
import { FinesReportsSummaryListStore } from './stores/fines-reports-summary-list.store';
import {
  getDefaultReportsSummaryListQuery,
  getReportsSummaryListQueryFromFilters,
  isReportsSummaryListDateFromAfterDateTo,
  isReportsSummaryListDateInFuture,
  isReportsSummaryListDateInvalid,
} from './utils/fines-reports-summary-list-date.utils';
import {
  getReportInstancesFromResponse,
  getReportInstancesLimitFromResponse,
  isReportInstancesOverLimit,
  mapReportInstancesToTableData,
} from './utils/fines-reports-summary-list-table.utils';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

@Component({
  selector: 'app-fines-reports-summary-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    AlphagovAccessibleAutocompleteComponent,
    MojDatePickerComponent,
    CustomPageHeaderComponent,
    FinesReportsSummaryListTableWrapperComponent,
    RouterLink,
  ],
  templateUrl: './fines-reports-summary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSummaryListComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly opalFinesService = inject(OpalFines);
  private readonly globalStore = inject(GlobalStore);
  private readonly store = inject(FinesReportsSummaryListStore);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dateService = inject(DateService);
  private readonly routeWithReportId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportId = toSignal(
    this.routeWithReportId.paramMap.pipe(
      map((paramMap) => paramMap.get('reportTypeId') ?? paramMap.get('reportId') ?? ''),
    ),
    {
      initialValue:
        this.routeWithReportId.snapshot.paramMap.get('reportTypeId') ??
        this.routeWithReportId.snapshot.paramMap.get('reportId') ??
        '',
    },
  );
  private readonly routeData = toSignal(this.activatedRoute.data, {
    initialValue: this.activatedRoute.snapshot.data,
  });
  private readonly reportInstancesResponse = signal<IOpalFinesReportInstancesResponse | null>(
    (this.activatedRoute.snapshot.data['reportInstances'] as IOpalFinesReportInstancesResponse | undefined) ?? null,
  );
  private readonly fieldErrors = signal<Record<string, string>>({});

  @ViewChild('errorSummary', { read: ElementRef }) private errorSummary?: ElementRef<HTMLElement>;

  public readonly tableSort = FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public readonly createReportRoutingPath = `../${FINES_REPORTS_ROUTING_PATHS.children.create}`;
  public readonly dateFilterLast7Days = FINES_REPORTS_SUMMARY_LIST_LAST_7_DAYS;
  public readonly dateFilterCustomDays = FINES_REPORTS_SUMMARY_LIST_CUSTOM_DAYS;
  public readonly dateFilterDateRange = FINES_REPORTS_SUMMARY_LIST_DATE_RANGE;
  public readonly filtersForm = this.formBuilder.group({
    businessUnit: [FINES_REPORTS_SUMMARY_LIST_FILTER_STATE.businessUnit],
    dateFilter: [FINES_REPORTS_SUMMARY_LIST_FILTER_STATE.dateFilter],
    days: [FINES_REPORTS_SUMMARY_LIST_FILTER_STATE.days],
    dateFrom: [FINES_REPORTS_SUMMARY_LIST_FILTER_STATE.dateFrom],
    dateTo: [FINES_REPORTS_SUMMARY_LIST_FILTER_STATE.dateTo],
  });

  public readonly reportMetadata = computed(
    () => (this.routeData()['reportMetadata'] as IOpalFinesReport | null) ?? null,
  );
  public readonly businessUnitRefData = computed(() => {
    const businessUnits = this.routeData()['businessUnits'] as IOpalFinesBusinessUnitRefData | undefined;

    return businessUnits?.refData ?? [];
  });
  public readonly businessUnitOptions = computed<IAlphagovAccessibleAutocompleteItem[]>(() => {
    const options =
      this.businessUnitRefData().map((businessUnit) => ({
        value: businessUnit.business_unit_id.toString(),
        name: businessUnit.business_unit_name,
      })) ?? [];

    return [{ value: FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS, name: 'All business units' }, ...options];
  });
  public readonly tableData = computed<IFinesReportsSummaryListTableData[]>(() =>
    mapReportInstancesToTableData(
      getReportInstancesFromResponse(this.reportInstancesResponse()),
      this.businessUnitRefData(),
      this.dateService,
    ),
  );
  public readonly overLimit = computed(() => isReportInstancesOverLimit(this.reportInstancesResponse()));
  public readonly resultLimit = computed(() => getReportInstancesLimitFromResponse(this.reportInstancesResponse()));
  public readonly errorSummaryMessages = computed<IAbstractFormBaseFormErrorSummaryMessage[]>(() =>
    Object.entries(this.fieldErrors()).map(([fieldId, message]) => ({ fieldId, message })),
  );
  public readonly dateFilter = signal<FinesReportsSummaryListDateFilter>(
    FINES_REPORTS_SUMMARY_LIST_FILTER_STATE.dateFilter,
  );

  public get pageHeading(): string {
    return (
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportId())?.heading ?? ''
    );
  }

  public get showCreateReportButton(): boolean {
    const reportConfiguration = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
      (config) => config.id === this.reportId(),
    );

    return this.reportMetadata()?.can_manually_create ?? reportConfiguration?.canCreate ?? false;
  }

  constructor() {
    this.subscribeToReportIdChanges();
    this.subscribeToReportInstancesData();
    this.subscribeToDateFilterChanges();
  }

  /**
   * Resets filter state when the selected report type route changes.
   */
  private subscribeToReportIdChanges(): void {
    this.routeWithReportId.paramMap
      .pipe(
        map((paramMap) => paramMap.get('reportTypeId') ?? paramMap.get('reportId') ?? ''),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.initialiseFilters();
        this.fieldErrors.set({});
      });
  }

  /**
   * Keeps resolver-provided report instances in sync with component state.
   */
  private subscribeToReportInstancesData(): void {
    this.activatedRoute.data
      .pipe(
        map((data) => (data['reportInstances'] as IOpalFinesReportInstancesResponse | undefined) ?? null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((reportInstances) => {
        this.reportInstancesResponse.set(reportInstances);
      });
  }

  /**
   * Clears conditional date fields when their radio option is no longer selected.
   */
  private subscribeToDateFilterChanges(): void {
    this.filtersForm.controls.dateFilter.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dateFilter) => {
        this.dateFilter.set(
          (dateFilter ?? FINES_REPORTS_SUMMARY_LIST_FILTER_STATE.dateFilter) as FinesReportsSummaryListDateFilter,
        );

        if (dateFilter !== FINES_REPORTS_SUMMARY_LIST_CUSTOM_DAYS) {
          this.filtersForm.controls.days.setValue('', { emitEvent: false });
        }

        if (dateFilter !== FINES_REPORTS_SUMMARY_LIST_DATE_RANGE) {
          this.filtersForm.controls.dateFrom.setValue('', { emitEvent: false });
          this.filtersForm.controls.dateTo.setValue('', { emitEvent: false });
        }
      });
  }

  /**
   * Applies stored filter state for the current report type, or the default query for a new report type.
   */
  private initialiseFilters(): void {
    this.store.resetForReportType(this.reportId());

    const filters = this.store.appliedQuery() ? this.store.filters() : FINES_REPORTS_SUMMARY_LIST_FILTER_STATE;
    this.filtersForm.setValue(filters, { emitEvent: false });
    this.dateFilter.set(filters.dateFilter);

    if (!this.store.appliedQuery()) {
      this.store.setAppliedQuery(getDefaultReportsSummaryListQuery(this.dateService));
    }
  }

  /**
   * Gets the configuration for the current report type route.
   */
  private getReportConfiguration() {
    return FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportId()) ?? null;
  }

  /**
   * Reads the filter form into a normalized filter state object.
   */
  private getFiltersFromForm(): IFinesReportsSummaryListFilterState {
    return {
      businessUnit: this.filtersForm.controls.businessUnit.value ?? FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
      dateFilter: (this.filtersForm.controls.dateFilter.value ??
        FINES_REPORTS_SUMMARY_LIST_LAST_7_DAYS) as FinesReportsSummaryListDateFilter,
      days: this.filtersForm.controls.days.value ?? '',
      dateFrom: this.filtersForm.controls.dateFrom.value ?? '',
      dateTo: this.filtersForm.controls.dateTo.value ?? '',
    };
  }

  /**
   * Builds accessible validation messages for the active filter fields.
   */
  private buildFieldErrors(filters: IFinesReportsSummaryListFilterState): Record<string, string> {
    const errors: Record<string, string> = {};

    if (filters.dateFilter === FINES_REPORTS_SUMMARY_LIST_CUSTOM_DAYS) {
      if (!filters.days || Number.isNaN(Number(filters.days)) || Number(filters.days) < 1) {
        errors['reports-summary-list-days'] = 'Enter number of days';
      }
    }

    if (filters.dateFilter === FINES_REPORTS_SUMMARY_LIST_DATE_RANGE) {
      const hasDateFrom = !!filters.dateFrom;
      const hasDateTo = !!filters.dateTo;

      if (!hasDateFrom && !hasDateTo) {
        errors['reports-summary-list-date-from'] = 'You must enter at least 1 of date from or date to';
      }

      if (hasDateFrom && isReportsSummaryListDateInvalid(filters.dateFrom, this.dateService)) {
        errors['reports-summary-list-date-from'] = 'Date must be in the format DD/MM/YYYY';
      }

      if (hasDateTo && isReportsSummaryListDateInvalid(filters.dateTo, this.dateService)) {
        errors['reports-summary-list-date-to'] = 'Date must be in the format DD/MM/YYYY';
      }

      if (
        !errors['reports-summary-list-date-from'] &&
        hasDateFrom &&
        isReportsSummaryListDateInFuture(filters.dateFrom, this.dateService)
      ) {
        errors['reports-summary-list-date-from'] = 'Date cannot be in the future';
      }

      if (
        !errors['reports-summary-list-date-to'] &&
        hasDateTo &&
        isReportsSummaryListDateInFuture(filters.dateTo, this.dateService)
      ) {
        errors['reports-summary-list-date-to'] = 'Date cannot be in the future';
      }

      if (
        !errors['reports-summary-list-date-from'] &&
        !errors['reports-summary-list-date-to'] &&
        hasDateFrom &&
        hasDateTo &&
        isReportsSummaryListDateFromAfterDateTo(filters.dateFrom, filters.dateTo, this.dateService)
      ) {
        errors['reports-summary-list-date-from'] = 'The Date from cannot be after the Date to';
      }
    }

    return errors;
  }

  /**
   * Moves focus to the error summary after validation errors are rendered.
   */
  private focusErrorSummary(): void {
    setTimeout(() => {
      this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus();
    });
  }

  /**
   * Requests report instances for the current report type and filter query.
   */
  private loadReportInstances(query: IFinesReportsSummaryListQueryState): void {
    const reportConfiguration = this.getReportConfiguration();
    const userState = this.globalStore.userState();
    const params = {
      from_date: query.fromDate,
      to_date: query.toDate,
      business_units: query.businessUnit ? [query.businessUnit] : undefined,
    };

    const request$ = reportConfiguration?.isYourReports
      ? this.opalFinesService.getReportInstances({
          ...params,
          user_id: userState.user_id,
        })
      : this.opalFinesService.getReportInstances({
          ...params,
          report_id: reportConfiguration?.reportTypeId ?? this.reportId(),
        });

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((response) => {
      this.reportInstancesResponse.set(response);
    });
  }

  /**
   * Returns the current validation message for a field.
   */
  public getFieldError(fieldId: string): string | null {
    return this.fieldErrors()[fieldId] ?? null;
  }

  /**
   * Stores the normalized date picker value in the form control.
   */
  public onDateChange(fieldName: 'dateFrom' | 'dateTo', value: string): void {
    this.filtersForm.controls[fieldName].setValue(value);
  }

  /**
   * Focuses the field selected from the error summary.
   */
  public onErrorClick(fieldId: string): void {
    this.document.getElementById(fieldId)?.focus();
  }

  /**
   * Validates filters, stores the applied query, and refreshes the report instances table.
   */
  public onRefresh(): void {
    const filters = this.getFiltersFromForm();
    const errors = this.buildFieldErrors(filters);
    this.fieldErrors.set(errors);

    if (Object.keys(errors).length) {
      this.focusErrorSummary();
      return;
    }

    const query = getReportsSummaryListQueryFromFilters(filters, this.dateService);
    this.store.setFilters(filters);
    this.store.setAppliedQuery(query);
    this.loadReportInstances(query);
  }
}

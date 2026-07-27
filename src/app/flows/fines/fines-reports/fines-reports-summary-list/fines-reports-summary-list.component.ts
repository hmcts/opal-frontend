import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, Observable, Subject, catchError, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { AbstractReportSummaryListBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base';
import {
  ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
  ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
  ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';
import { IAbstractReportSummaryListDateValidationMessages } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/interfaces';
import { AbstractReportSummaryListDateFilter } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/types';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import type { FinesReportsReportInstancesResolverData } from '../routing/resolvers/fines-reports-report-instances/fines-reports-report-instances.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS } from './constants/fines-reports-summary-list-state.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-reports-summary-list-table-wrapper/constants/fines-reports-summary-list-table-wrapper-table-sort-default.constant';
import { FinesReportsSummaryListTableWrapperComponent } from './fines-reports-summary-list-table-wrapper/fines-reports-summary-list-table-wrapper.component';
import { IFinesReportsSummaryListFilterState } from './interfaces/fines-reports-summary-list-filter-state.interface';
import { IFinesReportsSummaryListQueryState } from './interfaces/fines-reports-summary-list-query-state.interface';
import { IFinesReportsSummaryListTableData } from './interfaces/fines-reports-summary-list-table-data.interface';
import { FinesReportsSummaryListStore } from './stores/fines-reports-summary-list.store';
import {
  getReportInstancesFromResponse,
  getReportInstancesLimitFromResponse,
  isReportInstancesOverLimit,
  mapReportInstancesToTableData,
} from './utils/fines-reports-summary-list-table.utils';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

type FinesReportsSummaryListFilterForm = FormGroup<{
  businessUnit: FormControl<string | null>;
  dateFilter: FormControl<AbstractReportSummaryListDateFilter | null>;
  days: FormControl<string | null>;
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
}>;

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
export class FinesReportsSummaryListComponent
  extends AbstractReportSummaryListBaseComponent<FinesReportsSummaryListFilterForm>
  implements OnInit
{
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly opalFinesService = inject(OpalFines);
  private readonly globalStore = inject(GlobalStore);
  private readonly store = inject(FinesReportsSummaryListStore);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refreshReportInstances$ = new Subject<IFinesReportsSummaryListQueryState>();
  private readonly reportTypeChanges$ = new Subject<void>();
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
  private readonly reportInstancesResponse = signal<FinesReportsReportInstancesResolverData | null>(
    (this.activatedRoute.snapshot.data['reportInstances'] as FinesReportsReportInstancesResolverData | undefined) ??
      null,
  );

  @ViewChild('errorSummary', { read: ElementRef }) private readonly errorSummary?: ElementRef<HTMLElement>;

  private readonly reportDateFieldIds = {
    days: 'reports-summary-list-days',
    dateFrom: 'reports-summary-list-date-from',
    dateTo: 'reports-summary-list-date-to',
  };
  protected readonly dateValidationMessages: IAbstractReportSummaryListDateValidationMessages = {
    customDaysRequired: 'Enter number of days',
    dateRangeRequired: 'You must enter at least 1 of date from or date to',
    invalidDate: 'Date must be in the format DD/MM/YYYY',
    futureDate: 'Date cannot be in the future',
    dateFromAfterDateTo: 'The Date from cannot be after the Date to',
  };

  public readonly tableSort = FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public readonly createReportRoutingPath = `../${FINES_REPORTS_ROUTING_PATHS.children.create}`;
  public readonly loading = signal(false);
  public readonly loadError = signal(this.reportInstancesResponse()?.loadError ?? false);
  public readonly filtersForm: FinesReportsSummaryListFilterForm = new FormGroup({
    businessUnit: new FormControl<string | null>(FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS),
    dateFilter: new FormControl<AbstractReportSummaryListDateFilter | null>(
      ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE.dateFilter,
    ),
    days: new FormControl<string | null>(ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE.days),
    dateFrom: new FormControl<string | null>(ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE.dateFrom),
    dateTo: new FormControl<string | null>(ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE.dateTo),
  });

  public readonly reportMetadata = computed(
    () => (this.routeData()['reportMetadata'] as IOpalFinesReport | null) ?? null,
  );
  public readonly businessUnitRefData = computed(() => {
    const businessUnits = this.routeData()['businessUnits'] as IOpalFinesBusinessUnitRefData | undefined;

    return businessUnits?.refData ?? [];
  });
  public readonly businessUnitOptions = computed<IAlphagovAccessibleAutocompleteItem[]>(() => {
    const options = this.businessUnitRefData().map((businessUnit) => ({
      value: businessUnit.business_unit_id.toString(),
      name: businessUnit.business_unit_name,
    }));

    return [{ value: FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS, name: 'All business units' }, ...options];
  });
  public readonly businessUnitAutocompleteOptionSets = computed(() => {
    const items = this.businessUnitOptions();

    return [
      {
        key: JSON.stringify({ reportId: this.reportId(), items }),
        items,
      },
    ];
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
        this.reportTypeChanges$.next();
        this.reportInstancesResponse.set(null);
        this.loading.set(false);
        this.loadError.set(false);
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
        map((data) => (data['reportInstances'] as FinesReportsReportInstancesResolverData | undefined) ?? null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((reportInstances) => {
        this.loadError.set(reportInstances?.loadError ?? false);
        this.reportInstancesResponse.set(reportInstances);
      });
  }

  /**
   * Subscribes to refresh requests, cancelling stale report instance requests when a newer refresh or report type
   * change occurs.
   */
  private subscribeToReportInstanceRefreshes(): void {
    this.refreshReportInstances$
      .pipe(
        switchMap((query) =>
          this.getReportInstancesRequest(query).pipe(
            takeUntil(this.reportTypeChanges$),
            catchError(() => {
              this.loading.set(false);
              this.loadError.set(true);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.loading.set(false);
        this.loadError.set(false);
        this.reportInstancesResponse.set(response);
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
          (dateFilter ?? ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE.dateFilter) as AbstractReportSummaryListDateFilter,
        );
        this.clearInactiveDateFilterFields(this.filtersForm, dateFilter);
      });
  }

  /**
   * Applies stored filter state for the current report type, or the default query for a new report type.
   */
  private initialiseFilters(): void {
    this.store.resetForReportType(this.reportId());

    const filters: IFinesReportsSummaryListFilterState = this.store.appliedQuery()
      ? this.store.filters()
      : {
          businessUnit: FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
          ...ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE,
        };
    this.filtersForm.setValue(filters, { emitEvent: false });
    this.dateFilter.set(filters.dateFilter);

    if (!this.store.appliedQuery()) {
      this.store.setAppliedQuery(this.getFinesReportQueryFromFilters(filters));
    }
  }

  /**
   * Gets the configuration for the current report type route.
   */
  private getReportConfiguration() {
    return FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportId()) ?? null;
  }

  /**
   * Builds a Fines report query from the selected Fines report filters.
   *
   * @param filters - The selected Fines report filter state.
   * @returns A Fines report query state suitable for report instance API requests.
   */
  private getFinesReportQueryFromFilters(
    filters: IFinesReportsSummaryListFilterState,
  ): IFinesReportsSummaryListQueryState {
    const dateQuery = this.getReportQueryFromFilters(filters);
    const businessUnit =
      filters.businessUnit && filters.businessUnit !== FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS
        ? filters.businessUnit
        : null;

    return {
      ...dateQuery,
      businessUnit,
    };
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
   * Builds the report instances request for the current report type and filter query.
   *
   * @param query - The selected Fines report query state.
   * @returns An observable of report instances for the active report type.
   */
  private getReportInstancesRequest(
    query: IFinesReportsSummaryListQueryState,
  ): Observable<IOpalFinesReportInstancesResponse> {
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

    return request$;
  }

  /**
   * Clears Fines report date fields that do not apply to the selected date filter.
   *
   * @param filtersForm - The Fines report filter form to update.
   * @param dateFilter - The selected date filter.
   */
  protected override clearInactiveDateFilterFields(
    filtersForm: FinesReportsSummaryListFilterForm,
    dateFilter: AbstractReportSummaryListDateFilter | null,
  ): void {
    if (dateFilter !== ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS) {
      filtersForm.controls.days.setValue('', { emitEvent: false });
    }

    if (dateFilter !== ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE) {
      filtersForm.controls.dateFrom.setValue('', { emitEvent: false });
      filtersForm.controls.dateTo.setValue('', { emitEvent: false });
    }
  }

  /**
   * Reads the Fines report filter form into a normalized report filter state object.
   *
   * @param filtersForm - The Fines report filter form to read from.
   * @returns A normalized report filter state.
   */
  protected override getFiltersFromForm(
    filtersForm: FinesReportsSummaryListFilterForm,
  ): IFinesReportsSummaryListFilterState {
    return {
      businessUnit: filtersForm.controls.businessUnit.value ?? FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
      dateFilter: filtersForm.controls.dateFilter.value ?? this.dateFilterLast7Days,
      days: filtersForm.controls.days.value ?? '',
      dateFrom: filtersForm.controls.dateFrom.value ?? '',
      dateTo: filtersForm.controls.dateTo.value ?? '',
    };
  }

  /**
   * Sets up report route, resolver, filter, and refresh request subscriptions.
   */
  public ngOnInit(): void {
    this.subscribeToReportInstanceRefreshes();
    this.subscribeToReportIdChanges();
    this.subscribeToReportInstancesData();
    this.subscribeToDateFilterChanges();
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
    const filters = this.getFiltersFromForm(this.filtersForm);
    const errors = this.buildReportDateFieldErrors(filters, this.reportDateFieldIds);
    this.fieldErrors.set(errors);

    if (Object.keys(errors).length) {
      this.focusErrorSummary();
      return;
    }

    const query = this.getFinesReportQueryFromFilters(filters);
    this.store.setFilters(filters);
    this.store.setAppliedQuery(query);
    this.reportInstancesResponse.set(null);
    this.loading.set(true);
    this.loadError.set(false);
    this.refreshReportInstances$.next(query);
  }
}

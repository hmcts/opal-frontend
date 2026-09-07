import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of, shareReplay, switchMap } from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { IOpalFinesInterfaceJobSummary } from '../../services/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { IOpalFinesInterfaceJobsSummaryParams } from '../../services/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-params.interface';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_API_ROUTING_PATHS } from '../routing/constants/fines-api-routing-paths.constant';
import { FinesApiPayloadService } from '../services/fines-api-payload.service';
import { FinesApiStore } from '../stores/fines-api.store';
import { FINES_API_PROCESS_ALLOCATE_CONTENT } from './constants/fines-api-process-allocate-content.constant';
import { FINES_API_PROCESS_ALLOCATE_TABS_KEYS } from './constants/fines-api-process-allocate-tabs-keys.constant';
import { FINES_API_PROCESS_ALLOCATE_TABS } from './constants/fines-api-process-allocate-tabs.constant';
import { FinesApiProcessComponent } from './fines-api-process-tab/fines-api-process.component';
import { IFinesApiProcessData } from './fines-api-process-tab/interfaces/fines-api-process-data.interface';
import { IFinesApiProcessAllocateTabs } from './interfaces/fines-api-process-allocate-tabs.interface';
import { TFinesApiProcessAllocateTabKey } from './types/fines-api-process-allocate-tab-key.type';

type FinesApiProcessDataSource = 'initial' | 'refresh';

@Component({
  selector: 'app-fines-api-process-allocate',
  imports: [
    AsyncPipe,
    FinesApiProcessComponent,
    GovukBackLinkComponent,
    GovukCancelLinkComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
  ],
  templateUrl: './fines-api-process-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiProcessAllocateComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesApiPayloadService = inject(FinesApiPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly router = inject(Router);
  private readonly processDataSource = new BehaviorSubject<FinesApiProcessDataSource>('initial');

  protected readonly finesApiStore = inject(FinesApiStore);
  protected readonly content = FINES_API_PROCESS_ALLOCATE_CONTENT;
  protected readonly tabs: IFinesApiProcessAllocateTabs = FINES_API_PROCESS_ALLOCATE_TABS;
  protected readonly tabKeys = FINES_API_PROCESS_ALLOCATE_TABS_KEYS;
  protected readonly tabProcess$: Observable<IFinesApiProcessData> = this.processDataSource.pipe(
    switchMap((source) => this.resolveProcessData(source)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  /** Maps raw Process jobs into the Process tab view model. */
  private buildProcessData(processInterfaceJobs: IOpalFinesInterfaceJobSummary[]): IFinesApiProcessData {
    return {
      tableData: this.finesApiPayloadService.mapInterfaceJobs(processInterfaceJobs),
    };
  }

  /** Returns retained Process data when it has already been loaded. */
  private getRetainedProcessData(): IFinesApiProcessData | null {
    const processInterfaceJobs = this.finesApiStore.processInterfaceJobs();

    if (processInterfaceJobs === null) {
      return null;
    }

    return this.buildProcessData(processInterfaceJobs);
  }

  /** Builds the Process request from business units selected earlier in the flow. */
  private getProcessRequestParams(): IOpalFinesInterfaceJobsSummaryParams {
    return {
      business_unit_ids: this.finesApiStore.selectedBusinessUnitIds(),
      statuses: ['CREATED'],
      interface_name: 'payments_in',
    };
  }

  /** Loads Process rows and retains the raw response data in flow state. */
  private fetchProcessData(): Observable<IFinesApiProcessData> {
    return this.opalFinesService.getInterfaceJobsSummary(this.getProcessRequestParams()).pipe(
      map((response) => {
        const processInterfaceJobs = this.finesApiPayloadService.extractInterfaceJobs(response);
        this.finesApiStore.setProcessInterfaceJobs(processInterfaceJobs);

        return this.buildProcessData(processInterfaceJobs);
      }),
      // The standard HTTP interceptor presents the error banner. Completing without a new value
      // preserves the last rendered tab data and avoids presenting a failed request as an empty result.
      catchError(() => EMPTY),
    );
  }

  /** Uses retained Process data on tab revisit and fetches only on first load or explicit Refresh. */
  private resolveProcessData(source: FinesApiProcessDataSource): Observable<IFinesApiProcessData> {
    if (source === 'initial') {
      const retainedProcessData = this.getRetainedProcessData();
      if (retainedProcessData) {
        return of(retainedProcessData);
      }
    }

    return this.fetchProcessData();
  }

  /** Builds the absolute Finance dashboard route used when cancelling the journey. */
  private get financeDashboardRoute(): string[] {
    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ];
  }

  /** Keeps the URL fragment aligned with the active tab. */
  private syncTabFragment(tab: TFinesApiProcessAllocateTabKey): void {
    if (this.activatedRoute.snapshot.fragment === tab) {
      return;
    }

    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      fragment: tab,
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });
  }

  /** Returns whether a sub-navigation fragment is a supported Automatic Cash Input tab. */
  private isFinesApiTab(tab: string): tab is TFinesApiProcessAllocateTabKey {
    return Object.values(this.tabKeys).includes(tab as TFinesApiProcessAllocateTabKey);
  }

  /** Loads the selected tab and clears Process-file selections when changing tabs. */
  protected handleTabSwitch(tab: string): void {
    if (!this.isFinesApiTab(tab)) {
      this.syncTabFragment(this.finesApiStore.activeTab());
      return;
    }

    if (tab !== this.finesApiStore.activeTab()) {
      this.finesApiStore.setSelectedFileIds([]);
      this.finesApiStore.setActiveTab(tab);
    }

    this.syncTabFragment(tab);
  }

  /** Reloads the Process tab data in response to its Refresh action. */
  protected refreshProcessData(): void {
    this.processDataSource.next('refresh');
  }

  /** Navigates back to Select Business Units and clears flow state only after navigation succeeds. */
  protected navigateBack(): void {
    void this.router
      .navigate([FINES_API_ROUTING_PATHS.children.selectBusinessUnits], {
        relativeTo: this.activatedRoute.parent,
        state: { resetFinesApiState: true },
      })
      .then((navigated) => {
        if (navigated) {
          this.finesApiStore.resetFinesApiState();
        }
      });
  }

  /** Navigates to the Finance dashboard and clears flow state only after navigation succeeds. */
  protected cancel(): void {
    void this.router.navigate(this.financeDashboardRoute).then((navigated) => {
      if (navigated) {
        this.finesApiStore.resetFinesApiState();
      }
    });
  }

  /** Warns on navigation while Process files are selected. */
  public canDeactivate(): CanDeactivateTypes {
    return !this.finesApiStore.hasSelectedFiles();
  }

  public ngOnInit(): void {
    this.finesApiStore.setUnsavedChanges(this.finesApiStore.hasSelectedFiles());
  }

  public ngOnDestroy(): void {
    this.processDataSource.complete();
  }
}

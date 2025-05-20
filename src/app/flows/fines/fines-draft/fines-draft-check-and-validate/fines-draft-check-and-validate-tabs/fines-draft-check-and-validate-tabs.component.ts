import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { distinctUntilChanged, filter, map, Observable, of, startWith, Subject, takeUntil, tap } from 'rxjs';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ActivatedRoute } from '@angular/router';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort-default.constant';
import { CommonModule } from '@angular/common';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { FinesDraftService } from '../../services/fines-draft.service';

@Component({
  selector: 'app-fines-draft-check-and-validate-tabs',
  imports: [CommonModule, MojSubNavigationComponent, MojSubNavigationItemComponent, FinesDraftTableWrapperComponent],
  templateUrl: './fines-draft-check-and-validate-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndValidateTabsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  protected readonly finesDraftStore = inject(FinesDraftStore);
  private readonly globalStore = inject(GlobalStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly finesDraftService = inject(FinesDraftService);

  private readonly userState = this.globalStore.userState();
  private readonly businessUnitIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_id,
  );
  private readonly businessUnitUserIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_user_id,
  );

  protected readonly finesDraftCheckAndValidateRoutingPaths = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;

  public tabData$: Observable<IFinesDraftTableWrapperTableData[]> = of([]);
  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;

  /**
   * Initializes the tab data stream for the fines draft check and validate tabs component.
   *
   * This method sets up an observable (`tabData$`) that emits tab-specific data based on the current route fragment (tab),
   * initial data, and additional parameters. It listens for changes in the route fragment to update the active tab and
   * fetches corresponding data using the `finesDraftService.createTabDataStream` method.
   *
   * @param initialData - The initial fines draft accounts response data to seed the stream.
   * @param initialTab - The initial tab identifier to be selected.
   *
   * @remarks
   * - The stream reacts to changes in the route fragment, updating the active tab accordingly.
   * - Tab-specific parameters such as `businessUnitIds`, `statuses`, and `notSubmittedBy` are provided for data fetching.
   * - The observable completes when the component is destroyed.
   */
  private setupTabDataStream(initialData: IOpalFinesDraftAccountsResponse, initialTab: string): void {
    this.tabData$ = this.finesDraftService.createTabDataStream(
      initialData,
      initialTab,
      this.activatedRoute.fragment.pipe(
        startWith(initialTab),
        filter((frag): frag is string => !!frag),
        map((tab) => tab!),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((tab) => (this.finesDraftService.activeTab = tab)),
      ),
      (tab) => ({
        businessUnitIds: this.businessUnitIds,
        statuses: FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab)?.statuses,
        notSubmittedBy: this.businessUnitUserIds,
      }),
    );
  }

  public ngOnInit(): void {
    const resolvedDraftAccounts = this.activatedRoute.snapshot.data['draftAccounts'] as IOpalFinesDraftAccountsResponse;
    const initialTab = this.activatedRoute.snapshot.fragment ?? 'to-review';
    this.setupTabDataStream(resolvedDraftAccounts, initialTab);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

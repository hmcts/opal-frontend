import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import {
  catchError,
  defer,
  distinctUntilChanged,
  EMPTY,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_FPU_TAB_FRAGMENTS } from '../constants/fines-fpu-tab-fragments.constant';
import { FinesFpuToPublishComponent } from '../fines-fpu-to-publish/fines-fpu-to-publish.component';
import { IFinesFpuBusinessUnit } from '../interfaces/fines-fpu-business-unit.interface';
import { FinesFpuPayloadService } from '../services/fines-fpu-payload.service';
import { FinesFpuStore } from '../stores/fines-fpu.store';

@Component({
  selector: 'app-fines-fpu-tabs',
  imports: [
    AsyncPipe,
    RouterLink,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    FinesFpuToPublishComponent,
  ],
  templateUrl: './fines-fpu-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFpuTabsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly opalFines = inject(OpalFines);
  private readonly payloadService = inject(FinesFpuPayloadService);
  private readonly destroy$ = new Subject<void>();

  protected readonly finesFpuStore = inject(FinesFpuStore);
  protected readonly fragments = FINES_FPU_TAB_FRAGMENTS;
  protected readonly accountsDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
  ];

  public tabData$!: Observable<IFinesFpuBusinessUnit[] | null>;

  /**
   * Resolves empty or unsupported URL fragments to the default tab.
   *
   * @param fragment - The URL fragment requested by navigation.
   * @returns The supported tab fragment to display.
   */
  private normaliseFragment(fragment: string | null): string {
    return fragment === FINES_FPU_TAB_FRAGMENTS.published || fragment === FINES_FPU_TAB_FRAGMENTS.uploadErrors
      ? fragment
      : FINES_FPU_TAB_FRAGMENTS.toPublish;
  }

  /**
   * Normalises all fragments before deduplication so browser history stays in sync with the displayed tab.
   *
   * @returns Shared business unit summaries, or null while another tab or a request is active.
   */
  private setupTabDataStream(): Observable<IFinesFpuBusinessUnit[] | null> {
    const fragment$ = this.activatedRoute.fragment.pipe(
      map((fragment) => this.normaliseFragment(fragment)),
      distinctUntilChanged(),
    );

    return fragment$.pipe(
      switchMap((fragment): Observable<IFinesFpuBusinessUnit[] | null> => {
        this.activeTab = fragment;
        this.finesFpuStore.setFragment(fragment);
        return fragment === FINES_FPU_TAB_FRAGMENTS.toPublish
          ? this.loadBusinessUnits().pipe(startWith(null))
          : of(null);
      }),
      tap((tabData) => this.finesFpuStore.setTabData(tabData)),
      takeUntil(this.destroy$),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  /**
   * Fetches a fresh summary each time To publish is opened, without submitter or date restrictions.
   *
   * @returns Eligible business unit summaries, leaving request errors to the shared HTTP error handler.
   */
  private loadBusinessUnits(): Observable<IFinesFpuBusinessUnit[]> {
    return defer(() => {
      const userState = this.globalStore.userState();
      const params = this.payloadService.buildDraftAccountParams(userState);

      if (!params.businessUnitIds?.length) {
        return of([]);
      }

      this.opalFines.clearDraftAccountsCache();
      return this.opalFines
        .getDraftAccounts(params)
        .pipe(map((response) => this.payloadService.mapDraftAccountsToBusinessUnits(response, userState)));
    }).pipe(catchError(() => EMPTY));
  }

  /**
   * Requests navigation to a supported tab through the shared tab handler.
   *
   * @param fragment - The tab selected by the user.
   */
  public override handleTabSwitch(fragment: string): void {
    super.handleTabSwitch(this.normaliseFragment(fragment));
  }

  /** Restores the initial tab from the URL and prepares its data stream for the template. */
  public ngOnInit(): void {
    this.activeTab = this.normaliseFragment(this.activatedRoute.snapshot.fragment);
    this.finesFpuStore.setFragment(this.activeTab);
    this.tabData$ = this.setupTabDataStream();
  }

  /** Stops fragment subscriptions and prevents responses from updating a destroyed page. */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

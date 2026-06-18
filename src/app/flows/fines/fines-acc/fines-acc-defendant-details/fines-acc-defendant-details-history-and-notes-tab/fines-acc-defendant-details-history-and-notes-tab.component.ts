import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FinesAccDefendantDetailsHistoryAndNotesFilterComponent } from './fines-acc-defendant-details-history-and-notes-filter/fines-acc-defendant-details-history-and-notes-filter.component';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from './interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { Observable, map, startWith, tap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_EMPTY_TAB_DATA_STREAM } from './constants/fines-acc-defendant-details-history-and-notes-empty-tab-data-stream.constant';

@Component({
  selector: 'app-fines-acc-defendant-details-history-and-notes-tab',
  imports: [AsyncPipe, FinesAccDefendantDetailsHistoryAndNotesFilterComponent],
  templateUrl: './fines-acc-defendant-details-history-and-notes-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsHistoryAndNotesTabComponent implements OnChanges, OnInit {
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly accountStore = inject(FinesAccountStore);
  private latestTabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData | null = null;

  @Input({ required: true }) public accountId!: number;
  @Input({ required: true }) public tabData$: Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> =
    FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_EMPTY_TAB_DATA_STREAM;
  @Input() public style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public filterForm: IFinesAccDefendantDetailsHistoryAndNotesFilterForm | null = null;
  public filterOpen = false;
  public historyAndNotesTabData$: Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> =
    FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_EMPTY_TAB_DATA_STREAM;

  /**
   * Applies the same payload transform used by the account details parent to filtered history responses.
   * The parent still transforms the initial tab stream; this keeps child-owned filtered requests consistent.
   *
   * @param data - The history and notes API response.
   * @returns The transformed history and notes tab payload.
   */
  private transformTabData(
    data: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData {
    return this.payloadService.transformPayload(
      data,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    ) as IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData;
  }

  /**
   * Caches each emitted history payload and starts replacement streams with the latest known data.
   * This keeps the filter form mounted while a filtered request is in flight instead of blanking the tab.
   *
   * @param tabData$ - The source history and notes stream.
   * @returns The display stream for the history and notes tab.
   */
  private keepLatestTabData(
    tabData$: Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData>,
  ): Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> {
    const displayTabData$ = tabData$.pipe(
      tap((data) => {
        this.latestTabData = data;
      }),
    );

    return this.latestTabData ? displayTabData$.pipe(startWith(this.latestTabData)) : displayTabData$;
  }

  /**
   * Sets the display stream back to the parent-provided base tab stream.
   * This runs when the tab is first initialised or when the parent refreshes the tab stream.
   */
  private setBaseTabDataStream(): void {
    this.historyAndNotesTabData$ = this.keepLatestTabData(this.tabData$);
  }

  /**
   * Initialises the history and notes display stream.
   */
  public ngOnInit(): void {
    this.setBaseTabDataStream();
  }

  /**
   * Rebinds the display stream when the parent supplies a refreshed base history stream.
   *
   * @param changes - Input property changes.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabData$'] && !changes['tabData$'].firstChange) {
      this.setBaseTabDataStream();
    }
  }

  /**
   * Stores submitted filter values, keeps the details panel open, and switches the display stream to filtered data.
   * Filtered history requests are owned here so the parent does not need to manage filter UI state.
   *
   * @param filter - The submitted history and notes filter form.
   */
  public handleFilterApplied(filter: IFinesAccDefendantDetailsHistoryAndNotesFilterForm): void {
    this.filterForm = structuredClone(filter);
    this.filterOpen = true;

    const filterParams = this.payloadService.buildHistoryFilterPayload(filter);
    const filteredTabData$ = this.opalFinesService
      .getDefendantAccountHistoryAndNotesTabData(this.accountId, filterParams)
      .pipe(
        map((data) => this.transformTabData(data)),
        tap((data) => this.accountStore.compareVersion(data.version)),
      );

    this.historyAndNotesTabData$ = this.keepLatestTabData(filteredTabData$);
  }

  /**
   * Stores whether the filter details are open.
   *
   * @param open - Whether the filter details are open.
   */
  public handleFilterOpenChange(open: boolean): void {
    this.filterOpen = open;
  }
}

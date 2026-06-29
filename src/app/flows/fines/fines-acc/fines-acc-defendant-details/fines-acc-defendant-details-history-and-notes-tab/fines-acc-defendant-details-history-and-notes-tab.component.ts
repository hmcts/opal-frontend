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
import { THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem } from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEY } from './constants/fines-acc-defendant-details-history-and-notes-tab-history-item-keys.constant';

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
   * Applies the parent-level payload formatting to child-owned filtered responses.
   *
   * @param data - The history and notes API response.
   * @returns The formatted history and notes tab payload.
   */
  private formatTabData(
    data: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData {
    return this.payloadService.transformPayload(
      data,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    ) as IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData;
  }

  /**
   * Transforms raw history item details into the UI details model.
   *
   * @param data - The formatted history and notes tab payload.
   * @returns The history and notes tab payload with transformed history item details.
   */
  private transformHistoryItems(
    data: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData {
    const historyItems = this.getHistoryItems(data);

    if (!historyItems) {
      return data;
    }

    return {
      ...data,
      [FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEY]:
        this.payloadService.transformHistoryAndNotesItems(historyItems),
    };
  }

  /**
   * Formats and transforms a filtered history and notes response owned by this component.
   *
   * @param data - The filtered history and notes API response.
   * @returns The formatted payload with transformed history item details.
   */
  private transformFilteredTabData(
    data: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData {
    return this.transformHistoryItems(this.formatTabData(data));
  }

  /**
   * Finds the history item array and filters it to transformable object items.
   *
   * @param tabData - The raw History and notes tab data returned by the API.
   * @returns The history items, or null when no history item list is present.
   */
  private getHistoryItems(
    tabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): TFinesAccHistoryAndNotesRawItem[] | null {
    const historyItems = tabData[FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEY];

    if (!Array.isArray(historyItems)) {
      return null;
    }

    return historyItems.filter(this.isHistoryItem);
  }

  /**
   * Checks whether a value can be transformed as a raw history item.
   *
   * @param value - A value from the history items array.
   * @returns True when the value is an object record.
   */
  private isHistoryItem(value: unknown): value is TFinesAccHistoryAndNotesRawItem {
    return typeof value === 'object' && value !== null;
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
    this.historyAndNotesTabData$ = this.keepLatestTabData(
      this.tabData$.pipe(map((data) => this.transformHistoryItems(data))),
    );
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
        map((data) => this.transformFilteredTabData(data)),
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

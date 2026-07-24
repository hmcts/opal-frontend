import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FinesAccHistoryAndNotesFilterFormComponent } from '../../fines-acc-history-and-notes/fines-acc-history-and-notes-filter-form/fines-acc-history-and-notes-filter-form.component';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IFinesAccSummaryTabsContentStyles } from '../../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { IFinesAccHistoryAndNotesFilterForm } from '../../fines-acc-history-and-notes/interfaces/fines-acc-history-and-notes-filter-form.interface';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS } from './constants/fines-acc-major-creditor-details-history-and-notes-filter-field-errors.constant';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT } from './constants/fines-acc-major-creditor-details-history-and-notes-filter-summary-text.constant';
import { IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.interface';
import { EMPTY, Observable, startWith, tap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';

@Component({
  selector: 'app-fines-acc-major-creditor-details-history-and-notes-tab',
  imports: [AsyncPipe, FinesAccHistoryAndNotesFilterFormComponent],
  templateUrl: './fines-acc-major-creditor-details-history-and-notes-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent implements OnChanges, OnInit {
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly accountStore = inject(FinesAccountStore);
  private latestTabData: IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData | null = null;

  @Input({ required: true }) public accountId!: number;
  @Input({ required: true })
  public tabData$: Observable<IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData> = EMPTY;
  @Input() public style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  public readonly fieldErrors = FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS;
  public readonly summaryText = FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT;

  public filterForm: IFinesAccHistoryAndNotesFilterForm | null = null;
  public filterOpen = false;
  public historyAndNotesTabData$: Observable<IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData> = EMPTY;

  /**
   * Caches each emitted history payload and starts replacement streams with the latest known data.
   *
   * @param tabData$ - The source history and notes stream.
   * @returns The display stream for the history and notes tab.
   */
  private keepLatestTabData(
    tabData$: Observable<IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData>,
  ): Observable<IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData> {
    const displayTabData$ = tabData$.pipe(
      tap((data) => {
        this.latestTabData = data;
      }),
    );

    return this.latestTabData ? displayTabData$.pipe(startWith(this.latestTabData)) : displayTabData$;
  }

  /**
   * Sets the display stream back to the parent-provided base tab stream.
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
   *
   * @param filter - The submitted history and notes filter form.
   */
  public handleFilterApplied(filter: IFinesAccHistoryAndNotesFilterForm): void {
    this.filterForm = structuredClone(filter);
    this.filterOpen = true;

    const filterParams = this.payloadService.buildMajorCreditorHistoryFilterPayload(filter);
    const filteredTabData$ = this.opalFinesService
      .getMajorCreditorAccountHistoryAndNotesTabData(this.accountId, filterParams)
      .pipe(tap((data) => this.accountStore.compareVersion(data.version)));

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

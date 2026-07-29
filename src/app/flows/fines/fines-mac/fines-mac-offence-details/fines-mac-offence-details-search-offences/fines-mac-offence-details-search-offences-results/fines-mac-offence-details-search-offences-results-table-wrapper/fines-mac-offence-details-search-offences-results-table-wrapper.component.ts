import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, signal, Signal } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData } from './interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.interface';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableSort } from './interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-sort.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS } from './constants/fines-mac-offence-details-search-offences-results-table-wrapper-link-defaults.constant';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-results-table-wrapper',
  standalone: true,
  imports: [
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    DateFormatPipe,
    MojPaginationComponent,
  ],
  templateUrl: './fines-mac-offence-details-search-offences-results-table-wrapper.component.html',
  styles: [
    `
      .copy-code-button {
        margin-left: 0.5rem;
        padding: 0;
        border: 0;
        background: none;
        cursor: pointer;
        font: inherit;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent
  extends AbstractSortableTablePaginationComponent
  implements OnDestroy
{
  private copyCodeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  protected readonly utilsService = inject(UtilsService);
  protected readonly DATE_INPUT_FORMAT = `yyyy-MM-dd'T'HH:mm:ss'Z'`;
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  public readonly copiedCodeSignal = signal<string | null>(null);
  public override displayTableDataSignal = signal<IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]>(
    [],
  );
  public override paginatedTableDataComputed!: Signal<
    IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]
  >;
  public override itemsPerPageSignal = signal(25);
  @Input({ required: true }) set tableData(
    tableData: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[],
  ) {
    this.displayTableDataSignal.set(tableData);
  }
  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }
  public readonly COPY_CODE_TO_CLIPBOARD =
    FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD;
  public readonly COPIED_CODE_TO_CLIPBOARD =
    FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD;

  /**
   * Copies the provided value to the clipboard and provides visual and screen reader feedback.
   *
   * This method updates component state so the copied row can expose visual feedback while
   * keeping the hidden code text in the accessible name for screen readers. After a timeout,
   * the copied state is cleared.
   *
   * @param value - The string value to be copied to the clipboard.
   */
  public copyCodeToClipboard(value: string): void {
    if (this.copyCodeTimeoutId) {
      clearTimeout(this.copyCodeTimeoutId);
    }

    this.utilsService.copyToClipboard(value);
    this.copiedCodeSignal.set(value);

    this.copyCodeTimeoutId = setTimeout(() => {
      this.copiedCodeSignal.set(null);
      this.copyCodeTimeoutId = null;
    }, FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT);
  }

  public getCopyCodeAnnouncement(value: string): string {
    return `${this.COPIED_CODE_TO_CLIPBOARD} ${value}`;
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Clears any pending timeout associated with copying code to prevent memory leaks.
   */
  public ngOnDestroy(): void {
    if (this.copyCodeTimeoutId) {
      clearTimeout(this.copyCodeTimeoutId);
    }
  }
}

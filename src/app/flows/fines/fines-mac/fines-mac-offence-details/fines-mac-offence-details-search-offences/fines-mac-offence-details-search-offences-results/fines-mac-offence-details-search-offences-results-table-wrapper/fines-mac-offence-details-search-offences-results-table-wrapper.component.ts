import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, signal, Signal } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { GovukPaginationComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-pagination';
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
import {
  COPY_CODE_TO_CLIPBOARD,
  COPIED_CODE_TO_CLIPBOARD,
  COPY_CODE_TO_CLIPBOARD_TIMEOUT,
} from './constants/fines-mac-offence-details-search-offences-results-table-wrapper-link-defaults.constant';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-results-table-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    GovukPaginationComponent,
    DateFormatPipe,
  ],
  templateUrl: './fines-mac-offence-details-search-offences-results-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  protected readonly utilsService = inject(UtilsService);
  public override abstractTableDataSignal = signal<IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]>(
    [],
  );
  public override paginatedTableDataComputed!: Signal<
    IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]
  >;
  public override itemsPerPageSignal = signal(25);
  @Input({ required: true }) set tableData(
    tableData: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[],
  ) {
    this.abstractTableDataSignal.set(tableData);
  }

  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  protected readonly DATE_INPUT_FORMAT = `yyyy-MM-dd'T'HH:mm:ss`;
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';
  public readonly COPY_CODE_TO_CLIPBOARD = COPY_CODE_TO_CLIPBOARD;

  /**
   * Copies the provided value to the clipboard and provides visual and screen reader feedback.
   *
   * This method updates the given link element's text to indicate that the code has been copied,
   * and updates a live region for screen readers to announce the action. After a timeout,
   * it restores the original text and ARIA attributes.
   *
   * @param linkElement - The HTML element whose label will be temporarily changed to indicate the copy action.
   * @param liveRegion - The HTML element used as a live region for screen readers to announce the copy action.
   * @param value - The string value to be copied to the clipboard.
   */
  public copyCodeToClipboard(linkElement: HTMLElement, liveRegion: HTMLElement, value: string): void {
    this.utilsService.copyToClipboard(value);

    const originalText = linkElement.innerText;
    const originalAriaLive = linkElement.getAttribute('aria-live');

    // Update visual label
    linkElement.innerText = COPIED_CODE_TO_CLIPBOARD;
    // Update screen reader span
    liveRegion.textContent = COPIED_CODE_TO_CLIPBOARD;
    // Set ARIA live assertive for immediate SR announcement
    linkElement.setAttribute('aria-live', 'assertive');

    setTimeout(() => {
      linkElement.innerText = originalText;
      if (originalAriaLive) {
        linkElement.setAttribute('aria-live', originalAriaLive);
      } else {
        linkElement.removeAttribute('aria-live');
      }
      liveRegion.textContent = '';
    }, COPY_CODE_TO_CLIPBOARD_TIMEOUT);
  }
}

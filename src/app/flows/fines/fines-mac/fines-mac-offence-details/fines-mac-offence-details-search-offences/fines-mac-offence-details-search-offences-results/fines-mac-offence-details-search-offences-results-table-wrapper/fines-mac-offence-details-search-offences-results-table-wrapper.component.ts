import { ChangeDetectionStrategy, Component, computed, inject, Input, OnDestroy, signal, Signal } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../../../constants/release-feature-flags.constant';
import { getFeatureFlagReleaseState } from '../../../../../utils/fines-section-permissions.utils';
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
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';

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
    GovukButtonComponent,
  ],
  templateUrl: './fines-mac-offence-details-search-offences-results-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent
  extends AbstractSortableTablePaginationComponent
  implements OnDestroy
{
  private copyCodeTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly globalStore = inject(GlobalStore);

  protected readonly utilsService = inject(UtilsService);
  protected readonly DATE_INPUT_FORMAT = `yyyy-MM-dd'T'HH:mm:ss'Z'`;
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  public readonly release1a1_2Enabled = computed(
    () => getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true,
  );

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

  /**
   * Copies the provided value to the clipboard and provides visual and screen reader feedback.
   *
   * This method updates the given label element's text to indicate that the code has been copied,
   * and updates a live region for screen readers to announce the action. After a timeout,
   * it restores the original text and clears the live region.
   *
   * @param labelElement - The HTML element whose visible label will be temporarily changed.
   * @param liveRegion - The HTML element used as a live region for screen readers to announce the copy action.
   * @param value - The string value to be copied to the clipboard.
   */
  public copyCodeToClipboard(labelElement: HTMLElement, liveRegion: HTMLElement, value: string): void {
    this.utilsService.copyToClipboard(value);

    const originalText = labelElement.innerText;

    // Update visual label
    labelElement.innerText =
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD;

    // Update screen reader span
    liveRegion.textContent =
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD;

    this.copyCodeTimeoutId = setTimeout(() => {
      labelElement.innerText = originalText;
      liveRegion.textContent = '';
      this.copyCodeTimeoutId = null;
    }, FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT);
  }

  /**
   * Copies an offence code using the original link behaviour.
   * Preserves the existing link-specific ARIA feedback.
   *
   * @param linkElement - The link used to trigger copying.
   * @param labelElement - The visible copy label.
   * @param liveRegion - The screen reader announcement region.
   * @param value - The offence code to copy.
   * @param event - The click event.
   */
  public copyCodeToClipboardFromLink(
    linkElement: HTMLElement,
    labelElement: HTMLElement,
    liveRegion: HTMLElement,
    value: string,
    event: Event,
  ): void {
    event.preventDefault();
    this.utilsService.copyToClipboard(value);

    const originalText = labelElement.innerText;
    const originalAriaLive = linkElement.getAttribute('aria-live');

    labelElement.innerText =
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD;

    liveRegion.textContent =
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPIED_CODE_TO_CLIPBOARD;

    linkElement.setAttribute('aria-live', 'assertive');

    this.copyCodeTimeoutId = setTimeout(() => {
      labelElement.innerText = originalText;

      if (originalAriaLive) {
        linkElement.setAttribute('aria-live', originalAriaLive);
      } else {
        linkElement.removeAttribute('aria-live');
      }

      liveRegion.textContent = '';
      this.copyCodeTimeoutId = null;
    }, FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_LINK_DEFAULTS.COPY_CODE_TO_CLIPBOARD_TIMEOUT);
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

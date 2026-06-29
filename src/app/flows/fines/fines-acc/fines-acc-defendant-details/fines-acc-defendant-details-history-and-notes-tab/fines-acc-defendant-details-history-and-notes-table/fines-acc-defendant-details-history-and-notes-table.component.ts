import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IHistoryDetails as IFinesAccHistoryAndNotesDetails,
  IHistoryDetailsFragment as IFinesAccHistoryAndNotesDetailsFragment,
  IHistoryDetailsPart as IFinesAccHistoryAndNotesDetailsPart,
  THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { FinesAccountHistoryTableComponent } from '../../../fines-account-history-table/fines-account-history-table.component';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../../../fines-account-history-table/constants/fines-account-history-table-display.constant';
import { IFinesAccountHistoryTableLinkClick } from '../../../fines-account-history-table/interfaces/fines-account-history-table-link-click.interface';
import { IFinesAccountHistoryTableRow } from '../../../fines-account-history-table/interfaces/fines-account-history-table-row.interface';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES } from '../../../services/constants/fines-acc-history-and-notes-details-link-types.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEY } from '../constants/fines-acc-defendant-details-history-and-notes-tab-history-item-keys.constant';
import { IFinesAccHistoryAndNotesItemsEntry } from '../interfaces/fines-acc-history-and-notes-items-entry.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY } from './constants/fines-acc-defendant-details-history-and-notes-table-display.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS } from './constants/fines-acc-defendant-details-history-and-notes-table-field-paths.constant';

@Component({
  selector: 'app-fines-acc-defendant-details-history-and-notes-table',
  imports: [FinesAccountHistoryTableComponent],
  templateUrl: './fines-acc-defendant-details-history-and-notes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsHistoryAndNotesTableComponent {
  private readonly router = inject(Router);

  @Input({ required: true }) public tabData!: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData;

  /**
   * Finds the history item array and filters it to transformable object items.
   *
   * @param tabData - The History and notes tab data returned by the API.
   * @returns The history items, or null when no history item list is present.
   */
  private getHistoryItemsEntry(
    tabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): IFinesAccHistoryAndNotesItemsEntry | null {
    const historyItems = tabData[FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEY];

    if (!Array.isArray(historyItems)) {
      return null;
    }

    return {
      key: FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEY,
      items: historyItems.filter(this.isHistoryItem),
    };
  }

  /**
   * Checks whether a value can be mapped as a raw history item.
   *
   * @param value - A value from the history items array.
   * @returns True when the value is an object record.
   */
  private isHistoryItem(value: unknown): value is TFinesAccHistoryAndNotesRawItem {
    return typeof value === 'object' && value !== null;
  }

  /**
   * Checks whether a transformed history details value can be rendered by the table.
   *
   * @param value - The history details value from a transformed history item.
   * @returns True when the value matches the history details model.
   */
  private isHistoryDetails(value: unknown): value is IFinesAccHistoryAndNotesDetails {
    return (
      typeof value === 'object' &&
      value !== null &&
      Array.isArray((value as IFinesAccHistoryAndNotesDetails).line1) &&
      ('line2' in value
        ? Array.isArray((value as IFinesAccHistoryAndNotesDetails).line2) ||
          (value as IFinesAccHistoryAndNotesDetails).line2 === null
        : true)
    );
  }

  /**
   * Maps a transformed defendant account history item to the shared history table row contract.
   *
   * @param item - The transformed defendant account history item.
   * @param index - The item index in the current flow-owned history result.
   * @returns A row ready for display in the shared history table.
   */
  private mapHistoryItemToRow(item: TFinesAccHistoryAndNotesRawItem, index: number): IFinesAccountHistoryTableRow {
    const details = this.isHistoryDetails(item['details']) ? item['details'] : null;
    const amount = this.getNumber(item, FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.amount);
    const dateTimestamp = this.getDateTimestamp(item);
    const rowId = `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}${index}`;

    return {
      id: rowId,
      Date: dateTimestamp,
      displayDate: dateTimestamp,
      User: this.getString(item, FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.user),
      Type: this.getString(item, FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.type),
      Details: details
        ? this.detailsToText(details)
        : FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.emptyDetailsText,
      Amount: amount,
      absoluteAmount: amount === null ? null : Math.abs(amount),
      amountAriaId: `${rowId}${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
      amountDescription:
        amount === null || amount === FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
          ? null
          : amount > FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
            ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit
            : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit,
      amountTag:
        amount === null || amount === FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
          ? null
          : amount > FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
            ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit
            : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit,
      details,
    };
  }

  /**
   * Gets the first present string or number from the supplied account-history item paths.
   *
   * @param item - The raw history item.
   * @param paths - The defendant-account history field paths to inspect.
   * @returns The first present string value.
   */
  private getString(item: TFinesAccHistoryAndNotesRawItem, paths: string[]): string | null {
    for (const path of paths) {
      const value = this.getValue(item, path);

      if (typeof value === 'string' && value.trim()) {
        return value;
      }

      if (typeof value === 'number') {
        return String(value);
      }
    }

    return null;
  }

  /**
   * Gets the first finite number from the supplied account-history item paths.
   *
   * @param item - The raw history item.
   * @param paths - The defendant-account history field paths to inspect.
   * @returns The first finite number value.
   */
  private getNumber(item: TFinesAccHistoryAndNotesRawItem, paths: string[]): number | null {
    for (const path of paths) {
      const value = this.getValue(item, path);

      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === 'string') {
        const parsed = Number(
          value.replace(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.currencySanitisePattern, ''),
        );

        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return null;
  }

  /**
   * Gets the first parseable date timestamp from the defendant-account history item.
   *
   * @param item - The raw history item.
   * @returns The UTC timestamp in milliseconds.
   */
  private getDateTimestamp(item: TFinesAccHistoryAndNotesRawItem): number | null {
    for (const path of FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.date) {
      const value = this.getValue(item, path);
      const timestamp = this.parseDateTimestamp(value);

      if (timestamp !== null) {
        return timestamp;
      }
    }

    return null;
  }

  /**
   * Parses supported defendant-account history date values to sortable timestamps.
   *
   * @param value - The date value.
   * @returns The UTC timestamp in milliseconds.
   */
  private parseDateTimestamp(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value !== 'string' || !value.trim()) {
      return null;
    }

    const trimmedValue = value.trim();
    const govukDateMatch =
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.govukDatePattern.exec(trimmedValue);
    const timestamp = govukDateMatch
      ? Date.parse(
          `${govukDateMatch[3]}-${govukDateMatch[2]}-${govukDateMatch[1]}${FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.govukDateTimeSuffix}`,
        )
      : Date.parse(trimmedValue);

    return Number.isNaN(timestamp) ? null : timestamp;
  }

  /**
   * Gets a value from an object path in a defendant-account history item.
   *
   * @param source - The source history item.
   * @param path - The dot-notated field path.
   * @returns The field value.
   */
  private getValue(source: Record<string, unknown>, path: string): unknown {
    return path
      .split(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fieldPathSeparator)
      .reduce<unknown>((current, key) => {
        if (typeof current !== 'object' || current === null) {
          return undefined;
        }

        return (current as Record<string, unknown>)[key];
      }, source);
  }

  /**
   * Converts transformed history details into text used for details-column sorting.
   *
   * @param details - The transformed details model.
   * @returns Details text.
   */
  private detailsToText(details: IFinesAccHistoryAndNotesDetails): string {
    return [this.partsToText(details.line1), this.partsToText(details.line2 ?? [])]
      .filter(Boolean)
      .join(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.detailsLineSeparator);
  }

  /**
   * Converts transformed history details parts into text used for details-column sorting.
   *
   * @param parts - The transformed details parts.
   * @returns Parts text.
   */
  private partsToText(parts: IFinesAccHistoryAndNotesDetailsPart[]): string {
    return parts
      .map((part) =>
        part.fragments
          .map((fragment, index) => `${this.getFragmentPrefix(fragment, index)}${fragment.text}`)
          .join(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fragmentJoiner)
          .trim(),
      )
      .filter(Boolean)
      .join(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.partSeparator);
  }

  /**
   * Gets the rendered prefix for a details fragment.
   *
   * @param fragment - The details fragment.
   * @param index - The fragment index in its part.
   * @returns The rendered prefix.
   */
  private getFragmentPrefix(fragment: IFinesAccHistoryAndNotesDetailsFragment, index: number): string {
    if (fragment.hyphen) {
      return FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.hyphenPrefix;
    }

    return index > 0
      ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.fragmentSpacePrefix
      : FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fragmentJoiner;
  }

  /**
   * Maps the first recognised defendant-account history item list into reusable history table rows.
   *
   * @param tabData - The transformed history and notes tab payload.
   * @returns History table rows for display.
   */
  public getHistoryRows(
    tabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): IFinesAccountHistoryTableRow[] {
    return (this.getHistoryItemsEntry(tabData)?.items ?? []).map((item, index) =>
      this.mapHistoryItemToRow(item, index),
    );
  }

  /**
   * Opens linked history records from the details column.
   *
   * @param link - Link metadata emitted by the history table.
   */
  public handleHistoryLinkClicked(link: IFinesAccountHistoryTableLinkClick): void {
    if (link.type !== FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account) {
      return;
    }

    const accountId = Number(link.emit);

    if (!Number.isFinite(accountId)) {
      return;
    }

    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        FINES_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.children.defendant,
        accountId,
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      ]),
    );

    window.open(url, FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.windowTarget);
  }
}

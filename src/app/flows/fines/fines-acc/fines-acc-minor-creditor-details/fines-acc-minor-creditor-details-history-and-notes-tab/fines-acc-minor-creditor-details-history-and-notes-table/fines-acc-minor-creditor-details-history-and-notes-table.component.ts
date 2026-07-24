import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  getHistoryMappingDateTimestamp,
  getHistoryMappingDetailsText,
  getHistoryMappingNumber,
  getHistoryMappingRows,
  getHistoryMappingString,
  IHistoryDetails as IFinesAccHistoryAndNotesDetails,
  THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';
import { FinesAccountHistoryTableComponent } from '../../../fines-account-history-table/fines-account-history-table.component';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../../../fines-account-history-table/constants/fines-account-history-table-display.constant';
import { IFinesAccountHistoryTableLinkClick } from '../../../fines-account-history-table/interfaces/fines-account-history-table-link-click.interface';
import { IFinesAccountHistoryTableRow } from '../../../fines-account-history-table/interfaces/fines-account-history-table-row.interface';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES } from '../../../services/constants/fines-acc-history-and-notes-details-link-types.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEYS } from '../constants/fines-acc-minor-creditor-details-history-and-notes-tab-history-item-keys.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY } from './constants/fines-acc-minor-creditor-details-history-and-notes-table-display.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS } from './constants/fines-acc-minor-creditor-details-history-and-notes-table-field-paths.constant';

@Component({
  selector: 'app-fines-acc-minor-creditor-details-history-and-notes-table',
  imports: [FinesAccountHistoryTableComponent],
  templateUrl: './fines-acc-minor-creditor-details-history-and-notes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent {
  private readonly router = inject(Router);

  @Input({ required: true }) public tabData!: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData;

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
   * Maps a transformed minor creditor account history item to the shared history table row contract.
   *
   * @param item - The transformed minor creditor account history item.
   * @param index - The item index in the current flow-owned history result.
   * @returns A row ready for display in the shared history table.
   */
  private mapHistoryItemToRow(item: TFinesAccHistoryAndNotesRawItem, index: number): IFinesAccountHistoryTableRow {
    const details = this.isHistoryDetails(item['details']) ? item['details'] : null;
    const amount = getHistoryMappingNumber(
      item,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.amount,
      {
        fieldPathSeparator: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fieldPathSeparator,
        numberSanitisePattern: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.currencySanitisePattern,
      },
    );
    const dateTimestamp = getHistoryMappingDateTimestamp(
      item,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.date,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.dateFormat,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fieldPathSeparator,
    );
    const rowId = `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}${index}`;

    return {
      id: rowId,
      Date: dateTimestamp,
      displayDate: dateTimestamp,
      User: getHistoryMappingString(
        item,
        FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.user,
        FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fieldPathSeparator,
      ),
      Type: getHistoryMappingString(
        item,
        FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS.type,
        FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fieldPathSeparator,
      ),
      Details: details
        ? getHistoryMappingDetailsText(details, {
            detailsLineSeparator: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.detailsLineSeparator,
            fragmentEmptyPrefix: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fragmentJoiner,
            fragmentJoiner: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.fragmentJoiner,
            fragmentSpacePrefix: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.fragmentSpacePrefix,
            hyphenPrefix: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.hyphenPrefix,
            partSeparator: FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.partSeparator,
          })
        : FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.emptyDetailsText,
      Amount: amount,
      absoluteAmount: amount === null ? null : Math.abs(amount),
      amountAriaId: `${rowId}${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
      amountDescription:
        amount === null || amount === FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
          ? null
          : amount > FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
            ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit
            : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit,
      amountTag:
        amount === null || amount === FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
          ? null
          : amount > FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.zeroAmount
            ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit
            : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit,
      details,
    };
  }

  /**
   * Maps the first recognised minor-creditor-account history item list into reusable history table rows.
   *
   * @param tabData - The transformed history and notes tab payload.
   * @returns History table rows for display.
   */
  public getHistoryRows(
    tabData: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData,
  ): IFinesAccountHistoryTableRow[] {
    return getHistoryMappingRows(
      tabData,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_HISTORY_ITEM_KEYS,
      (item, index) => this.mapHistoryItemToRow(item, index),
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

    window.open(url, FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.windowTarget);
  }
}

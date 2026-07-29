import { Router } from '@angular/router';
import {
  getHistoryMappingDateTimestamp,
  getHistoryMappingDetailsText,
  getHistoryMappingNumber,
  getHistoryMappingRows,
  getHistoryMappingString,
  IHistoryDetails,
  THistoryDetailsRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES } from '../../services/constants/fines-acc-history-and-notes-details-link-types.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../constants/fines-account-history-table-display.constant';
import { IFinesAccountHistoryTableLinkClick } from '../interfaces/fines-account-history-table-link-click.interface';
import { IFinesAccountHistoryTableMappingDisplay } from '../interfaces/fines-account-history-table-mapping-display.interface';
import { IFinesAccountHistoryTableMappingFieldPaths } from '../interfaces/fines-account-history-table-mapping-field-paths.interface';
import { IFinesAccountHistoryTableRow } from '../interfaces/fines-account-history-table-row.interface';

export interface IFinesAccountHistoryTableMappingConfig {
  display: IFinesAccountHistoryTableMappingDisplay;
  fieldPaths: IFinesAccountHistoryTableMappingFieldPaths;
}

export interface IFinesAccountHistoryTableAdapterConfig extends IFinesAccountHistoryTableMappingConfig {
  historyItemKeys: readonly string[];
}

export interface IFinesAccountHistoryTableAdapter {
  getRows: (tabData: Record<string, unknown>) => IFinesAccountHistoryTableRow[];
  openHistoryLink: (link: IFinesAccountHistoryTableLinkClick) => void;
}

function isHistoryDetails(value: unknown): value is IHistoryDetails {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as IHistoryDetails).line1) &&
    ('line2' in value
      ? Array.isArray((value as IHistoryDetails).line2) || (value as IHistoryDetails).line2 === null
      : true)
  );
}

/**
 * Maps a transformed account history item to the shared history table row contract.
 *
 * @param item - The transformed account history item.
 * @param index - The item index in the current flow-owned history result.
 * @param config - Field paths and display options for row mapping.
 * @returns A row ready for display in the shared history table.
 */
export function mapFinesAccountHistoryItemToRow(
  item: THistoryDetailsRawItem,
  index: number,
  config: IFinesAccountHistoryTableMappingConfig,
): IFinesAccountHistoryTableRow {
  const { display, fieldPaths } = config;
  const details = isHistoryDetails(item['details']) ? item['details'] : null;
  const amount = getHistoryMappingNumber(item, fieldPaths.amount, {
    fieldPathSeparator: display.fieldPathSeparator,
    numberSanitisePattern: display.currencySanitisePattern,
  });
  const dateTimestamp = getHistoryMappingDateTimestamp(
    item,
    fieldPaths.date,
    display.dateFormat,
    display.fieldPathSeparator,
  );
  const rowId = `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}${index}`;

  return {
    id: rowId,
    Date: dateTimestamp,
    displayDate: dateTimestamp,
    User: getHistoryMappingString(item, fieldPaths.user, display.fieldPathSeparator),
    Type: getHistoryMappingString(item, fieldPaths.type, display.fieldPathSeparator),
    Details: details
      ? getHistoryMappingDetailsText(details, {
          detailsLineSeparator: display.detailsLineSeparator,
          fragmentEmptyPrefix: display.fragmentJoiner,
          fragmentJoiner: display.fragmentJoiner,
          fragmentSpacePrefix: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.fragmentSpacePrefix,
          hyphenPrefix: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.hyphenPrefix,
          partSeparator: display.partSeparator,
        })
      : display.emptyDetailsText,
    Amount: amount,
    absoluteAmount: amount === null ? null : Math.abs(amount),
    amountAriaId: `${rowId}${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
    amountDescription:
      amount === null || amount === display.zeroAmount
        ? null
        : amount > display.zeroAmount
          ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit
          : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit,
    amountTag:
      amount === null || amount === display.zeroAmount
        ? null
        : amount > display.zeroAmount
          ? FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit
          : FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit,
    details,
  };
}

/**
 * Maps the first recognised account history item list into reusable history table rows.
 *
 * @param tabData - The transformed history and notes tab payload.
 * @param historyItemKeys - Candidate history item collection keys in priority order.
 * @param config - Field paths and display options for row mapping.
 * @returns History table rows for display.
 */
export function getFinesAccountHistoryRows(
  tabData: Record<string, unknown>,
  historyItemKeys: readonly string[],
  config: IFinesAccountHistoryTableMappingConfig,
): IFinesAccountHistoryTableRow[] {
  return getHistoryMappingRows(tabData, historyItemKeys, (item, index) =>
    mapFinesAccountHistoryItemToRow(item, index, config),
  );
}

/**
 * Opens linked defendant account history records from the details column.
 *
 * @param router - The Angular router used to build the target URL.
 * @param link - Link metadata emitted by the history table.
 * @param windowTarget - Browser target for the opened history record.
 */
export function openFinesAccountHistoryLink(
  router: Router,
  link: IFinesAccountHistoryTableLinkClick,
  windowTarget: string,
): void {
  if (link.type !== FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account) {
    return;
  }

  const accountId = Number(link.emit);

  if (!Number.isFinite(accountId)) {
    return;
  }

  const url = router.serializeUrl(
    router.createUrlTree([
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.children.defendant,
      accountId,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    ]),
  );

  window.open(url, windowTarget);
}

/**
 * Creates a small adapter for flow-owned account history table components.
 *
 * @param router - The Angular router used for history link navigation.
 * @param config - History item keys, field paths, and display options for the table.
 * @returns Adapter methods for row mapping and link navigation.
 */
export function createFinesAccountHistoryTableAdapter(
  router: Router,
  config: IFinesAccountHistoryTableAdapterConfig,
): IFinesAccountHistoryTableAdapter {
  return {
    getRows: (tabData) => getFinesAccountHistoryRows(tabData, config.historyItemKeys, config),
    openHistoryLink: (link) => openFinesAccountHistoryLink(router, link, config.display.windowTarget),
  };
}

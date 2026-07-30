import { IFinesAccountHistoryTableLinkClick } from '../../../../fines-account-history-table/interfaces/fines-account-history-table-link-click.interface';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES } from '../../../../services/constants/fines-acc-history-and-notes-details-link-types.constant';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_ACCOUNT_LINK_MOCK: IFinesAccountHistoryTableLinkClick =
  {
    emit: '12345',
    rowId: 'history-and-notes-row-0',
    type: FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account,
  };

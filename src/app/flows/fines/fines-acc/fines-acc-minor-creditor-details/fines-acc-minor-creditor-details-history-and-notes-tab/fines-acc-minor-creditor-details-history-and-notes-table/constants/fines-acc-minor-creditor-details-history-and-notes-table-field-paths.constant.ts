import { IFinesAccMinorCreditorDetailsHistoryAndNotesTableFieldPaths } from '../interfaces/fines-acc-minor-creditor-details-history-and-notes-table-field-paths.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_FIELD_PATHS: IFinesAccMinorCreditorDetailsHistoryAndNotesTableFieldPaths =
  {
    amount: ['amount', 'transaction_amount', 'transactionAmount', 'value'],
    date: [
      'postedDetails.posted_date',
      'posted_details.posted_date',
      'posted_date',
      'date',
      'created_at',
      'createdAt',
      'timestamp',
    ],
    type: ['type', 'item_type', 'itemType', 'history_item_type'],
    user: [
      'postedDetails.posted_by_name',
      'posted_details.posted_by_name',
      'posted_by_name',
      'user_name',
      'username',
      'user',
      'created_by',
      'createdBy',
    ],
  };

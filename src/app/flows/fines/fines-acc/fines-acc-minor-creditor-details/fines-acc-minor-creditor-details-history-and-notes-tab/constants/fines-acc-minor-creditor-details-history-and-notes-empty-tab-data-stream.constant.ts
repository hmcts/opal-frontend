import { Observable, EMPTY } from 'rxjs';
import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';

/**
 * Empty history and notes tab data stream used before the parent supplies an account history request.
 */
export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_EMPTY_TAB_DATA_STREAM: Observable<IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData> =
  EMPTY;

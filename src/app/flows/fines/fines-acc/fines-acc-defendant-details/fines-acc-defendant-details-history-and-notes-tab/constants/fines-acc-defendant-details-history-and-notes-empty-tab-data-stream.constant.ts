import { Observable, EMPTY } from 'rxjs';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';

/**
 * Empty history and notes tab data stream used before the parent supplies an account history request.
 */
export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_EMPTY_TAB_DATA_STREAM: Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> =
  EMPTY;

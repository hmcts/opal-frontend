import { THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export interface IFinesAccMinorCreditorHistoryAndNotesItemsEntry {
  key: string;
  items: TFinesAccHistoryAndNotesRawItem[];
}

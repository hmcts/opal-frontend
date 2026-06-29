import { THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export interface IFinesAccHistoryAndNotesItemsEntry {
  key: string;
  items: TFinesAccHistoryAndNotesRawItem[];
}

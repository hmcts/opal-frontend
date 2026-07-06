import { IHistoryDetailsLink } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export interface IFinesAccountHistoryTableLinkClick extends IHistoryDetailsLink {
  rowId: string;
}

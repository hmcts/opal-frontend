import { IHistoryDetailsDateFormat } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export interface IFinesAccountHistoryTableMappingDisplay {
  currencySanitisePattern: RegExp | null;
  dateFormat: IHistoryDetailsDateFormat;
  detailsLineSeparator: string;
  emptyDetailsText: string;
  fieldPathSeparator: string;
  fragmentJoiner: string | null;
  zeroAmount: number;
  partSeparator: string;
  windowTarget: string;
}

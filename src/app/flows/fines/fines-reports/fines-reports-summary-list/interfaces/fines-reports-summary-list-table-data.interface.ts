import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesReportsSummaryListTableData extends IAbstractTableData<SortableValuesType> {
  'Date and time': number;
  Title: string;
  'Business unit': string;
  'Created by': string;
  Status: string;
  instanceId: string;
  dateTimeDisplay: string;
  isDownloadable: boolean;
  supportedTypes: string;
}

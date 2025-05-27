import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData
  extends IAbstractTableData<SortableValuesType> {
  Code: string;
  'Short title': string;
  'Act and section': string;
  'Used from': string;
  'Used to': string | null;
}

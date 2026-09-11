import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesApiProcessFilesTableWrapperTableSort extends IAbstractSortState {
  'File name': SortDirectionType;
  Source: SortDirectionType;
  'Business unit': SortDirectionType;
  'Date uploaded': SortDirectionType;
}

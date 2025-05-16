import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableSort extends IAbstractSortState {
  Code: SortDirectionType;
  'Short title': SortDirectionType;
  'Act and section': SortDirectionType;
  'Used from': SortDirectionType;
  'Used to': SortDirectionType;
}

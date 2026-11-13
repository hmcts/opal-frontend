import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData } from './fines-mci-payment-category-criminal-matches-table-wrapper-table-data.interface';

export type IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableSort = IAbstractSortState & {
  [K in keyof IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData]: SortDirectionType;
};

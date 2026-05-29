import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IAccountEnquiryImpositionTabTableRow extends IAbstractTableData<SortableValuesType> {
  'Date added': string | null;
  Imposition: string | null;
  Creditor: string | null;
  Imposed: number;
  'Paid/Written off': number;
  Balance: number;
  'Date imposed': string | null;
  Offence: string | null;
  'Imposed by': string | null;
  'Imposition ID': number;
  'Creditor account id': number;
  'Minor creditor party id': number | null;
  'Major creditor id': number | null;
  creditorDetailsRouterLink: string | null;
  hasZeroBalance: boolean;
  rowClasses: string;
}

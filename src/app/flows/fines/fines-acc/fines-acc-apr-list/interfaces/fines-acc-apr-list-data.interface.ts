import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { IFinesAccAprListRow } from './fines-acc-apr-list-row.interface';

export interface IFinesAccAprListData extends IOpalFinesAprsResponse {
  currentReferences: IFinesAccAprListRow[];
  consolidatedReferences: IFinesAccAprListRow[];
  canAdd: boolean;
}

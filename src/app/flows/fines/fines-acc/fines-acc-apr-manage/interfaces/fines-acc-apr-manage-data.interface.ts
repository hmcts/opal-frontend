import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-aprs-response.interface';
import { IFinesAccAprManageRow } from './fines-acc-apr-manage-row.interface';

export interface IFinesAccAprManageData extends IOpalFinesAprsResponse {
  currentReferences: IFinesAccAprManageRow[];
  consolidatedReferences: IFinesAccAprManageRow[];
  canAdd: boolean;
}

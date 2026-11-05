import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';

export interface IFinesAccAprManageRow extends IOpalFinesApr {
  createdDate: string;
  updatedDate: string;
  canChange: boolean;
  canRemove: boolean;
}

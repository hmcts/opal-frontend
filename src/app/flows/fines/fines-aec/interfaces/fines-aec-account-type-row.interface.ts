import { IOpalFinesEnforcementAccountType } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-type.interface';

export interface IFinesAecAccountTypeRow {
  id: number;
  version: number;
  accountType: 'COL' | 'A' | 'Y' | 'CO';
  accountTypeName: string;
  minimumBalance: number | null;
  highValue: number | null;
  lowValueAccountType: IOpalFinesEnforcementAccountType;
  highValueAccountType: IOpalFinesEnforcementAccountType | null;
}

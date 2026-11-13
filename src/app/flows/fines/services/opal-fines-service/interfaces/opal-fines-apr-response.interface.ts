import { IOpalFinesApr } from './opal-fines-apr.interface';

export interface IOpalFinesAprResponse {
  reference: IOpalFinesApr;
  version: string | null;
}

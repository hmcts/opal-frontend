import { IOpalFinesApr } from './opal-fines-apr.interface';

export interface IOpalFinesAprsResponse {
  references: IOpalFinesApr[];
  version: string | null;
}

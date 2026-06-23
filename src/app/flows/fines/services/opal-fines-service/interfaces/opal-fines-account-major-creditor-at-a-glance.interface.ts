import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountMajorCreditorAtAGlance extends IOpalFinesVersion {
  major_creditor: {
    address: {
      line_1: string;
      line_2?: string | null;
      line_3?: string | null;
      line_4?: string | null;
      line_5?: string | null;
      postcode?: string | null;
    };
    code: string;
    creditor_account_id: number;
    name: string;
    pay_by_bacs: boolean;
  };
}

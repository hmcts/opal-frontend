import { IOpalFinesDefendantAccountAddress } from './opal-fines-defendant-account-address.interface';

export interface IOpalFinesDefendantAccountEmployerDetails {
  employer_name: string | null;
  employer_reference: string | null;
  employer_email_address: string | null;
  employer_telephone_number: string | null;
  employer_address: IOpalFinesDefendantAccountAddress | null;
}

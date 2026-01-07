import { IOpalFinesDefendantAccountIndividualAlias } from './opal-fines-defendant-account-individual-alias.interface';

export interface IOpalFinesDefendantAccountIndividualDetails {
  title: string | null;
  forenames: string | null;
  surname: string;
  date_of_birth: string | null;
  age: string | null;
  national_insurance_number: string | null;
  individual_aliases: IOpalFinesDefendantAccountIndividualAlias[] | null;
}

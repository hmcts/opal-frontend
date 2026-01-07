import { IOpalFinesDefendantAccountOrganisationAlias } from './opal-fines-defendant-account-organisation-alias.interface';

export interface IOpalFinesDefendantAccountOrganisationDetails {
  organisation_name: string;
  organisation_aliases: IOpalFinesDefendantAccountOrganisationAlias[] | null;
}

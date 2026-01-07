import { IOpalFinesDefendantAccountIndividualDetails } from './opal-fines-defendant-account-individual-details.interface';
import { IOpalFinesDefendantAccountOrganisationDetails } from './opal-fines-defendant-account-organisation-details.interface';

export interface IOpalFinesDefendantAccountPartyDetails {
  party_id: string;
  organisation_flag: boolean;
  organisation_details: IOpalFinesDefendantAccountOrganisationDetails | null;
  individual_details: IOpalFinesDefendantAccountIndividualDetails | null;
}

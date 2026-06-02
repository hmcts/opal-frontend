import { IOpalFinesAccountDefendantDetailsImposition } from './opal-fines-account-defendant-details-imposition.interface';
import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountDefendantDetailsImpositionsTabRefData extends IOpalFinesVersion {
  impositions: IOpalFinesAccountDefendantDetailsImposition[];
}

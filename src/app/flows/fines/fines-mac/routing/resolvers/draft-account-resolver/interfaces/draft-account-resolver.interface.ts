import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { IFinesMacAddAccountPayload } from '../../../../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';

export interface IDraftAccountResolver {
  draftAccount: IFinesMacAddAccountPayload;
  businessUnit: IOpalFinesBusinessUnitNonSnakeCase;
  offencesData: IOpalFinesOffencesNonSnakeCase[];
}

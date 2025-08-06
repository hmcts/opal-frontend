import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';

export interface IDefendantAccountHeadingResolverResponse {
  headingData: IOpalFinesDefendantAccountHeader;
  businessUnit: IOpalFinesBusinessUnitNonSnakeCase;
}

import { IFinesReportsDefinition } from '../interfaces/fines-reports-definition.interface';
import { FINES_REPORTS_OPERATIONAL_REPORTS_BY_ENFORCEMENT_DEFINITION } from './fines-reports-operational-reports-by-enforcement-definition.constant';
import { FINES_REPORTS_OPERATIONAL_REPORTS_BY_PAYMENTS_DEFINITION } from './fines-reports-operational-reports-by-payments-definition.constant';
import { FINES_REPORTS_YOUR_REPORTS_DEFINITION } from './fines-reports-your-reports-definition.constant';

export const FINES_REPORTS_DEFINITIONS: IFinesReportsDefinition[] = [
  FINES_REPORTS_YOUR_REPORTS_DEFINITION,
  FINES_REPORTS_OPERATIONAL_REPORTS_BY_ENFORCEMENT_DEFINITION,
  FINES_REPORTS_OPERATIONAL_REPORTS_BY_PAYMENTS_DEFINITION,
];

export const findFinesReportsDefinition = (
  reportTypeId: string | null | undefined,
): IFinesReportsDefinition | undefined => FINES_REPORTS_DEFINITIONS.find((report) => report.id === reportTypeId);

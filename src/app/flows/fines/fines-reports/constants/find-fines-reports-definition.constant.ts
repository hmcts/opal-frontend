import { IFinesReportsDefinition } from '../interfaces/fines-reports-definition.interface';
import { FINES_REPORTS_DEFINITIONS } from './fines-reports-definitions.constant';

export const findFinesReportsDefinition = (
  reportTypeId: string | null | undefined,
): IFinesReportsDefinition | undefined => FINES_REPORTS_DEFINITIONS.find((report) => report.id === reportTypeId);

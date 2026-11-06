import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';

export const ENFORCEMENT_RESULT_MOCK: IOpalFinesResultRefData = {
  ...OPAL_FINES_RESULT_REF_DATA_MOCK,
  result_id: 'EA123',
  result_title: 'Enforcement Action Title',
  result_parameters: JSON.stringify([
    { name: 'daysindefault', prompt: 'Days in default', type: 'integer' },
    { name: 'reason', prompt: 'Reason', type: 'text' },
    { name: 'hearingdate', prompt: 'Hearing date', type: 'date' },
  ]),
};

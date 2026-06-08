import { convertToParamMap } from '@angular/router';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';

export const createFinesAccEnfActionAddActivatedRouteMock = () => ({
  snapshot: {
    paramMap: convertToParamMap({ accountId: '12345' }),
    data: {
      defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      enforcementActionResult: {
        ...structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK),
        allow_payment_terms: true,
        allow_additional_action: false,
      } as IOpalFinesResultRefData,
    },
  },
});

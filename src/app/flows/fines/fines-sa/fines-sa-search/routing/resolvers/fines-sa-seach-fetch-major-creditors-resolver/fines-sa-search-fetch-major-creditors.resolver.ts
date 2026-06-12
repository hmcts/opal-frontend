import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { forkJoin, map, of } from 'rxjs';
import { FinesSaStore } from '../../../../stores/fines-sa.store';
import { FinesSaPayloadService } from '../../../../services/fines-sa-payload.service';

export const finesSaSearchFetchMajorCreditorsResolver: ResolveFn<IOpalFinesMajorCreditorRefData> = () => {
  const opalFinesService = inject(OpalFines);
  const finesSaStore = inject(FinesSaStore);
  const finesSaPayloadService = inject(FinesSaPayloadService);

  const businessUnitIds = finesSaStore.searchAccount().fsa_search_account_business_unit_ids;

  // Only fetch major creditors if exactly one business unit is selected
  if (businessUnitIds?.length !== 1) {
    return of({ count: 0, refData: [] } as IOpalFinesMajorCreditorRefData);
  }

  const businessUnitId = businessUnitIds[0];
  return forkJoin({
    majorCreditors: opalFinesService.getMajorCreditors(businessUnitId),
    centralFund: opalFinesService.getCentralFund(businessUnitId),
  }).pipe(
    map(({ majorCreditors, centralFund }) => ({
      count: majorCreditors.count + 1,
      refData: [
        ...majorCreditors.refData,
        finesSaPayloadService.mapCentralFundToMajorCreditor(centralFund, businessUnitId),
      ],
    })),
  );
};

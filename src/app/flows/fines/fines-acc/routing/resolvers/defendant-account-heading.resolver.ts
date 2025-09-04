import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { tap } from 'rxjs';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

export const defendantAccountHeadingResolver: ResolveFn<IOpalFinesAccountDefendantDetailsHeader> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = Number(route.paramMap.get('accountId'));

  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);
  const dateService = inject(DateService);

  /**
   * Fetches the defendant account heading data, transforms it and passes it to the account store.
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the defendant account heading data.
   * If the account ID is not provided, it returns an empty observable.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService.getDefendantAccountHeadingData(accountId).pipe(
    tap((headingData) => {
      // Temporarily calculate debtor type and youth status until endpoint is updated to provide them.
      headingData.debtor_type = headingData.parent_guardian_party_id ? 'Parent/Guardian' : 'Defendant';
      headingData.is_youth = headingData.party_details?.individual_details?.date_of_birth ? dateService.getAgeObject(headingData.party_details.individual_details.date_of_birth)?.group === 'Youth' : false;
      accountStore.setAccountState(payloadService.transformAccountHeaderForStore(headingData));
    }),
  );
};

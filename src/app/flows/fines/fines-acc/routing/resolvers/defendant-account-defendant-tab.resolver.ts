import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map } from 'rxjs';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import {
  IFinesAccDebtorAddAmendForm,
  IFinesAccDebtorAddAmendFormData,
} from '../../fines-acc-debtor-add-amend/interfaces/fines-acc-debtor-add-amend-form.interface';

export const defendantAccountDefendantTabResolver: ResolveFn<IFinesAccDebtorAddAmendFormData> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = route.paramMap.get('accountId');

  if (!accountId) {
    throw new Error('Account ID is required');
  }

  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);

  const accountState = accountStore.getAccountState();
  const { account_id, business_unit_user_id, business_unit_id, party_id } = accountState;

  if (!account_id || !business_unit_user_id || !business_unit_id || !party_id) {
    throw new Error('Account state is not properly initialized');
  }

  /**
   * Fetches the defendant account defendant tab data from cache, transforms it to debtor form structure.
   * This data should already be cached from the "Defendant" tab visit.
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the transformed debtor form data.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService
    .getDefendantAccountDefendantTabData(account_id, business_unit_id, business_unit_user_id, party_id)
    .pipe(
      map((defendantData) => ({
        formData: payloadService.transformDefendantDataToDebtorForm(defendantData),
        nestedFlow: false,
      })),
    );
};

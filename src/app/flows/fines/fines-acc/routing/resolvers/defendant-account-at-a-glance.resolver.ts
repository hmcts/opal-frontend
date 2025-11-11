import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map } from 'rxjs';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { IFinesAccAddCommentsFormState } from '../../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';

export const defendantAccountAtAGlanceResolver: ResolveFn<IFinesAccAddCommentsFormState> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = route.paramMap.get('accountId');

  if (!accountId) {
    throw new Error('Account ID is required');
  }

  const opalFinesService = inject(OpalFines);
  const payloadService = inject(FinesAccPayloadService);

  /**
   * Fetches the defendant account at-a-glance data from cache, transforms it to comment form structure.
   * This data should already be cached from the "At A Glance" tab visit.
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the transformed comment form data.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService
    .getDefendantAccountAtAGlance(Number(accountId))
    .pipe(map((atAGlanceData) => payloadService.transformAtAGlanceDataToCommentsForm(atAGlanceData)));
};

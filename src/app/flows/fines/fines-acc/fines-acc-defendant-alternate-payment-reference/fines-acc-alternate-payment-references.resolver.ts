import { inject } from '@angular/core';
import { createUrlTreeFromSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAlternatePaymentReferencesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-alternate-payment-reference.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS } from '../routing/constants/fines-acc-alternate-payment-reference-routing-paths.constant';
import {
  canAddAlternatePaymentReference,
  canChangeAlternatePaymentReference,
  canRemoveAlternatePaymentReference,
} from './fines-acc-alternate-payment-reference.utils';

export const alternatePaymentReferencesResolver: ResolveFn<IOpalFinesAlternatePaymentReferencesResponse> = (route) => {
  const api = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);
  const router = inject(Router);
  const accountId = Number(route.paramMap.get('accountId'));

  return forkJoin({
    heading: api.getDefendantAccountHeadingData(accountId),
    data: api.getAlternatePaymentReferences(accountId),
  }).pipe(
    map(({ heading, data }) => {
      if (!data.version?.trim()) {
        return new RedirectCommand(router.parseUrl('/error/internal-server'));
      }
      accountStore.setAccountState({
        ...payloadService.transformDefendantAccountHeaderForStore(accountId, heading),
        base_version: data.version,
      });
      const { children } = FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS;
      const path = route.routeConfig?.path;
      const selectedId = Number(route.queryParamMap.get('alternatePaymentReferenceId'));
      const selected = data.references.find((reference) => reference.alternate_payment_reference_id === selectedId);
      const invalidSelection =
        (path === children.edit && (!selected || !canChangeAlternatePaymentReference(selected))) ||
        (path === children.delete && (!selected || !canRemoveAlternatePaymentReference(selected)));
      if (invalidSelection || (path === children.add && !canAddAlternatePaymentReference(data.references))) {
        return new RedirectCommand(createUrlTreeFromSnapshot(route, ['../', children.list]));
      }
      return data;
    }),
  );
};

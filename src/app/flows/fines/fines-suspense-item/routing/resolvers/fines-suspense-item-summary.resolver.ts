import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesSuspenseItemSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-suspense-item-summary.interface';
import { FinesSuspenseItemStore } from '../../stores/fines-suspense-item.store';

/** Resolves a fresh summary; an empty HTTP 200 summary represents no match. */
export const finesSuspenseItemSummaryResolver: ResolveFn<IOpalFinesSuspenseItemSummary | null> = (route) => {
  const opalFines = inject(OpalFines);
  // The results flow-state guard ensures a BU has been selected before resolving.
  const businessUnitId = inject(FinesSuspenseItemStore).selectedBusinessUnitId()!;
  const reference = route.paramMap.get('suspenseItemId')!;
  opalFines.clearCache('suspenseItemSummaryCache$');

  return opalFines
    .getSuspenseItemSummary(businessUnitId, reference)
    .pipe(map((summary) => (summary.suspense_item_id === null ? null : summary)));
};

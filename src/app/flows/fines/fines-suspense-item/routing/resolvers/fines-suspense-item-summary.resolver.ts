import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, tap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesSuspenseItemSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-suspense-item-summary.interface';
import { FinesSuspenseItemStore } from '../../stores/fines-suspense-item.store';

/** Resolves a fresh summary; an empty HTTP 200 summary represents no match. */
export const finesSuspenseItemSummaryResolver: ResolveFn<IOpalFinesSuspenseItemSummary | null> = (route) => {
  const opalFines = inject(OpalFines);
  const store = inject(FinesSuspenseItemStore);
  // The results flow-state guard ensures a BU has been selected before resolving.
  const businessUnitId = store.selectedBusinessUnitId()!;
  const businessUnitName = store.selectedBusinessUnitName();
  const reference = route.paramMap.get('suspenseItemId')!;
  opalFines.clearCache('suspenseItemSummaryCache$');

  return opalFines.getSuspenseItemSummary(businessUnitId, reference).pipe(
    // The user can change business unit while this request is pending. Restore the
    // submitted selection on success so the results caption and retries match this lookup.
    // tap updates the store without changing the response; a failed request keeps any newer selection.
    tap(() => store.setSelectedBusinessUnit(businessUnitId, businessUnitName)),
    map((summary) => (summary.suspense_item_id === null ? null : summary)),
  );
};

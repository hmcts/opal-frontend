import { inject, Injectable } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { IFinesMciPaymentMappings } from '../routing/interfaces/fines-mci-payment-mappings.interface';

@Injectable({ providedIn: 'root' })
export class FinesMciPaymentMappingsService {
  private readonly opalFines = inject(OpalFines);

  /**
   * Loads both payment option lists for the initial screen or a retry.
   *
   * @param forceRefresh Whether to refresh cached source mappings for an explicit retry.
   * @returns The mappings, or null when either request fails or returns no options.
   */
  public load(forceRefresh = false): Observable<IFinesMciPaymentMappings | null> {
    return forkJoin({
      methods: this.opalFines.getMethodOfPaymentMappings(),
      sources: this.opalFines.getSourceMappings(forceRefresh),
    }).pipe(
      map((mappings) => (mappings.methods.length && mappings.sources.length ? mappings : null)),
      catchError(() => of(null)),
    );
  }
}

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { IFinesMciPaymentMappings } from '../interfaces/fines-mci-payment-mappings.interface';

/**
 * Loads payment methods and sources before the payment details form opens.
 *
 * @returns Both mapping lists, or null when a request fails or returns no options.
 */
export const finesMciPaymentMappingsResolver: ResolveFn<IFinesMciPaymentMappings | null> = () => {
  const opalFines = inject(OpalFines);
  return forkJoin({ methods: opalFines.getMethodOfPaymentMappings(), sources: opalFines.getSourceMappings() }).pipe(
    map((mappings) => (mappings.methods.length && mappings.sources.length ? mappings : null)),
    catchError(() => of(null)),
  );
};

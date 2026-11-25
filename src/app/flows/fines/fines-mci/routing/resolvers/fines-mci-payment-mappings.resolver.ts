import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IFinesMciPaymentMappings } from '../interfaces/fines-mci-payment-mappings.interface';
import { FinesMciPaymentMappingsService } from '../../services/fines-mci-payment-mappings.service';

/**
 * Loads payment methods and sources before the payment details form opens.
 *
 * @returns Both mapping lists, or null when a request fails or returns no options.
 */
export const finesMciPaymentMappingsResolver: ResolveFn<IFinesMciPaymentMappings | null> = () =>
  inject(FinesMciPaymentMappingsService).load();

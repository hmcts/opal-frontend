import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesSourceMapping } from '@services/fines/opal-fines-service/interfaces/opal-fines-source-mapping.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

/**
 * Loads cached source mappings before activating a route that displays source labels.
 *
 * @returns The backend source mappings; request errors propagate through the normal HTTP/router handling.
 */
export const fetchSourceMappingsResolver: ResolveFn<IOpalFinesSourceMapping[]> = () =>
  inject(OpalFines).getSourceMappings();

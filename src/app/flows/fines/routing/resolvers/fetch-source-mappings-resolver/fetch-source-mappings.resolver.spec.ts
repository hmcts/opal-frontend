import { TestBed } from '@angular/core/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesSourceMapping } from '@services/fines/opal-fines-service/interfaces/opal-fines-source-mapping.interface';
import { OPAL_FINES_SOURCE_MAPPINGS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-source-mappings.mock';
import { fetchSourceMappingsResolver } from './fetch-source-mappings.resolver';

describe('fetchSourceMappingsResolver', () => {
  const getSourceMappings = vi.fn();
  const resolve = () =>
    firstValueFrom(
      TestBed.runInInjectionContext(() => fetchSourceMappingsResolver({} as never, {} as never)) as Observable<
        IOpalFinesSourceMapping[]
      >,
    );

  beforeEach(() => {
    getSourceMappings.mockReset();
    TestBed.configureTestingModule({ providers: [{ provide: OpalFines, useValue: { getSourceMappings } }] });
  });

  it.each([{ response: OPAL_FINES_SOURCE_MAPPINGS_MOCK }, { response: [] }])(
    'returns the complete response, including an empty mapping',
    async ({ response }) => {
      getSourceMappings.mockReturnValue(of(response));
      expect(await resolve()).toBe(response);
      expect(getSourceMappings).toHaveBeenCalledOnce();
    },
  );

  it('propagates request failures rather than resolving a fabricated mapping', async () => {
    const error = new Error('Mapping request failed');
    getSourceMappings.mockReturnValue(throwError(() => error));
    await expect(resolve()).rejects.toBe(error);
  });
});

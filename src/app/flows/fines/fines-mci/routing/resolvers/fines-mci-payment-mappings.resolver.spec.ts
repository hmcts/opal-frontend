import { TestBed } from '@angular/core/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesMciPaymentMappings } from '../interfaces/fines-mci-payment-mappings.interface';
import { finesMciPaymentMappingsResolver } from './fines-mci-payment-mappings.resolver';

describe('finesMciPaymentMappingsResolver', () => {
  const getMethodOfPaymentMappings = vi.fn();
  const getSourceMappings = vi.fn();
  const methods = [{ code: 'NC', display_name: 'Notes and coins' }];
  const sources = [{ code: 'ALLPAY', display_name: 'allpay' }];
  const resolve = () =>
    firstValueFrom(
      TestBed.runInInjectionContext(() =>
        finesMciPaymentMappingsResolver({} as never, {} as never),
      ) as Observable<IFinesMciPaymentMappings | null>,
    );

  beforeEach(() => {
    getMethodOfPaymentMappings.mockReset().mockReturnValue(of(methods));
    getSourceMappings.mockReset().mockReturnValue(of(sources));
    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: { getMethodOfPaymentMappings, getSourceMappings } }],
    });
  });

  it('loads both lists from their mapping endpoints', async () => {
    expect(await resolve()).toEqual({ methods, sources });
    expect(getMethodOfPaymentMappings).toHaveBeenCalledOnce();
    expect(getSourceMappings).toHaveBeenCalledOnce();
  });

  it.each(['methods', 'sources'])('reports a load failure if %s cannot be retrieved', async (failedList) => {
    const failed = throwError(() => new Error('Unavailable'));
    if (failedList === 'methods') getMethodOfPaymentMappings.mockReturnValue(failed);
    else getSourceMappings.mockReturnValue(failed);
    expect(await resolve()).toBeNull();
  });

  it.each(['methods', 'sources'])('reports a load failure if %s is empty', async (emptyList) => {
    if (emptyList === 'methods') getMethodOfPaymentMappings.mockReturnValue(of([]));
    else getSourceMappings.mockReturnValue(of([]));
    expect(await resolve()).toBeNull();
  });
});

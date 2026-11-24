import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-suspense-item-summary.mock';
import { FinesSuspenseItemStore } from '../../stores/fines-suspense-item.store';
import { finesSuspenseItemSummaryResolver } from './fines-suspense-item-summary.resolver';

describe('finesSuspenseItemSummaryResolver', () => {
  const getSuspenseItemSummary = vi.fn();
  const clearCache = vi.fn();

  beforeEach(() => {
    getSuspenseItemSummary.mockReset().mockReturnValue(of(OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK));
    clearCache.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: { getSuspenseItemSummary, clearCache } }],
    });
    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnit(22, 'Test BU');
  });

  async function resolve() {
    const route = { paramMap: convertToParamMap({ suspenseItemId: '001234' }) } as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      finesSuspenseItemSummaryResolver(route, {} as RouterStateSnapshot),
    );
    return isObservable(result) ? firstValueFrom(result) : result;
  }

  it('fetches a fresh summary with the selected BU and unchanged reference', async () => {
    await expect(resolve()).resolves.toEqual(OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK);
    expect(clearCache).toHaveBeenCalledExactlyOnceWith('suspenseItemSummaryCache$');
    expect(getSuspenseItemSummary).toHaveBeenCalledExactlyOnceWith(22, '001234');
  });

  it('represents only a 404 as no match', async () => {
    getSuspenseItemSummary.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    await expect(resolve()).resolves.toBeNull();
  });

  it.each([0, 400, 401, 403, 500])('propagates status %s rather than treating it as no match', async (status) => {
    const error = new HttpErrorResponse({ status });
    getSuspenseItemSummary.mockReturnValue(throwError(() => error));
    await expect(resolve()).rejects.toBe(error);
  });

  it('propagates non-HTTP failures', async () => {
    const error = new Error('Unexpected lookup failure');
    getSuspenseItemSummary.mockReturnValue(throwError(() => error));
    await expect(resolve()).rejects.toBe(error);
  });
});

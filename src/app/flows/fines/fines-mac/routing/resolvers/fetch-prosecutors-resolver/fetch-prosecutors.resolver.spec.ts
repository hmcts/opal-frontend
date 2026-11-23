import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { fetchProsecutorsResolver } from './fetch-prosecutors.resolver';
import { of, firstValueFrom, Observable } from 'rxjs';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesProsecutorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { APP_MODE_FEATURE_FLAG } from '@app/flows/fines/constants/environment-feature-flags.constant';

describe('fetchIssuingAuthoritiesResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesProsecutorRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchProsecutorsResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let finesMacStore: FinesMacStoreType;
  const initializeFlags = vi.fn();
  const mockBusinessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

  beforeEach(() => {
    initializeFlags.mockReset().mockResolvedValue(undefined);
    mockOpalFinesService = {
      getProsecutors: vi.fn().mockName('OpalFines.getProsecutors'),
    };
    mockOpalFinesService.getProsecutors.mockReturnValue(of(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        {
          provide: LaunchDarklyService,
          useValue: { initializeLaunchDarklyFlags: initializeFlags, initializeLaunchDarklyClient: vi.fn() },
        },
      ],
    });

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setBusinessUnit(mockBusinessUnit);
    TestBed.inject(GlobalStore).setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'opal' });
  });

  it('should resolve courts from the service using the businessUnitId from route data', async () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {};
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesProsecutorRefData>);
    expect(result).toEqual(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK);
    expect(mockOpalFinesService.getProsecutors).toHaveBeenCalledWith(mockBusinessUnit.business_unit_id);
  });

  it('should load app mode before fetching prosecutors for account review', async () => {
    const globalStore = TestBed.inject(GlobalStore);
    globalStore.setFeatureFlags({});
    initializeFlags.mockImplementationOnce(async () => {
      globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'opal' });
    });
    mockOpalFinesService.getProsecutors.mockImplementation(() => {
      expect((globalStore.featureFlags() as Record<string, unknown>)[APP_MODE_FEATURE_FLAG]).toBe('opal');
      return of(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK);
    });

    const result = await firstValueFrom(
      executeResolver(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ) as Observable<IOpalFinesProsecutorRefData>,
    );

    expect(result).toEqual(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK);
    expect(initializeFlags).toHaveBeenCalled();
  });
});

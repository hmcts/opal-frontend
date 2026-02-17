import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable, of } from 'rxjs';
import { fetchSendingCourtsResolver } from './fetch-sending-courts.resolver';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { firstValueFrom } from 'rxjs';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { FINES_MAC_ORIGINATOR_TYPE_FORM_MOCK } from '../../../fines-mac-originator-type/mocks/fines-mac-originator-type-form.mock';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FINES_MAC_ORIGINATOR_TYPE_FORM } from '../../../fines-mac-originator-type/constants/fines-mac-originator-type-form.constant';

describe('fetchSendingCourtsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesLocalJusticeAreaRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchSendingCourtsResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let finesMacStore: FinesMacStoreType;

  beforeEach(() => {
    mockOpalFinesService = {
      getLocalJusticeAreas: vi.fn().mockName('OpalFines.getLocalJusticeAreas'),
    };
    mockOpalFinesService.getLocalJusticeAreas.mockReturnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setOriginatorType(FINES_MAC_ORIGINATOR_TYPE_FORM_MOCK);
  });

  it('should resolve local justice areas from the service', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesLocalJusticeAreaRefData>);
    expect(result).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith(
      FINES_MAC_ORIGINATOR_TYPE_FORM_MOCK.formData.fm_originator_type_originator_type,
    );
  });

  it('should resolve local justice areas from the service with empty form state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    finesMacStore.setOriginatorType(FINES_MAC_ORIGINATOR_TYPE_FORM);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesLocalJusticeAreaRefData>);
    expect(result).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith(
      FINES_MAC_ORIGINATOR_TYPE_FORM.formData.fm_originator_type_originator_type,
    );
  });
});

import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { FINES_ACCOUNT_TYPES } from '@app/flows/fines/constants/fines-account-types.constant';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { IOpalFinesProsecutor } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor.interface';
import { IOpalFinesLocalJusticeArea } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from '../../../fines-mac-account-details/constants/fines-mac-account-details-form';
import { FINES_MAC_BUSINESS_UNIT_STATE } from '../../../constants/fines-mac-business-unit-state';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../../../fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FINES_MAC_ORIGINATOR_TYPE_FORM } from '../../../fines-mac-originator-type/constants/fines-mac-originator-type-form.constant';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FETCH_SENDING_COURTS_LJA_TYPE_MAP } from '../fetch-sending-courts-resolver/constants/fetch-sending-courts-lja-type-map.constant';
import { fetchOriginatorsResolver } from './fetch-originators.resolver';
import { IFinesMacOriginatorRefData } from './interfaces/fines-mac-originator-ref-data.interface';
import {
  FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK,
  FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK,
} from './mocks/fines-mac-originator-ref-data.mock';

describe('fetchOriginatorsResolver', () => {
  const executeResolver: ResolveFn<IFinesMacOriginatorRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchOriginatorsResolver(...resolverParameters));

  let mockOpalFinesService: {
    getProsecutors: ReturnType<typeof vi.fn>;
    getLocalJusticeAreas: ReturnType<typeof vi.fn>;
    getProsecutorPrettyName: ReturnType<typeof vi.fn>;
    getLocalJusticeAreaPrettyName: ReturnType<typeof vi.fn>;
  };
  let finesMacStore: FinesMacStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route: any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state: any = {};

  const setAccountType = (accountType: string): void => {
    const accountDetails = structuredClone(FINES_MAC_ACCOUNT_DETAILS_FORM);
    accountDetails.formData.fm_create_account_account_type = accountType;
    finesMacStore.setAccountDetails(
      accountDetails,
      { ...FINES_MAC_BUSINESS_UNIT_STATE, business_unit_id: 77 },
      FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    );
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getProsecutors: vi.fn().mockReturnValue(of(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK)),
      getLocalJusticeAreas: vi.fn().mockReturnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK)),
      getProsecutorPrettyName: vi.fn(
        (prosecutor: IOpalFinesProsecutor) => `${prosecutor.name} (${prosecutor.prosecutor_code})`,
      ),
      getLocalJusticeAreaPrettyName: vi.fn(
        (localJusticeArea: IOpalFinesLocalJusticeArea) =>
          `${localJusticeArea.name} (${localJusticeArea.local_justice_area_id})`,
      ),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });

    finesMacStore = TestBed.inject(FinesMacStore);
    const originatorTypeForm = structuredClone(FINES_MAC_ORIGINATOR_TYPE_FORM);
    originatorTypeForm.formData.fm_originator_type_originator_type = 'NEW';
    finesMacStore.setOriginatorType(originatorTypeForm);
  });

  it('should resolve prosecutors only for a Conditional Caution account', async () => {
    setAccountType(FINES_ACCOUNT_TYPES['Conditional Caution']);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getProsecutors).toHaveBeenCalledWith(77);
    expect(mockOpalFinesService.getLocalJusticeAreas).not.toHaveBeenCalled();
    expect(result).toEqual(FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK);
  });

  it('should resolve local justice areas only for a Fine account', async () => {
    setAccountType(FINES_ACCOUNT_TYPES.Fine);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith(FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW.Fine);
    expect(mockOpalFinesService.getProsecutors).not.toHaveBeenCalled();
    expect(result).toEqual(FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK);
  });

  it('should resolve local justice areas without filters when the originator type is not set', async () => {
    const originatorTypeForm = structuredClone(FINES_MAC_ORIGINATOR_TYPE_FORM);
    originatorTypeForm.formData.fm_originator_type_originator_type = null;
    finesMacStore.setOriginatorType(originatorTypeForm);
    setAccountType(FINES_ACCOUNT_TYPES.Fine);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith();
    expect(mockOpalFinesService.getProsecutors).not.toHaveBeenCalled();
    expect(result).toEqual(FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK);
  });
});

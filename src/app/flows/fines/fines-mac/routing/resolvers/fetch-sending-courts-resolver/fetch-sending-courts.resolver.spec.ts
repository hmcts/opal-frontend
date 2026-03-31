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
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FINES_MAC_ORIGINATOR_TYPE_FORM } from '../../../fines-mac-originator-type/constants/fines-mac-originator-type-form.constant';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from '../../../fines-mac-account-details/constants/fines-mac-account-details-form';
import { FINES_ACCOUNT_TYPES } from '@app/flows/fines/constants/fines-account-types.constant';
import { FINES_MAC_BUSINESS_UNIT_STATE } from '../../../constants/fines-mac-business-unit-state';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../../../fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FETCH_SENDING_COURTS_LJA_TYPE_MAP } from './constants/fetch-sending-courts-lja-type-map.constant';

describe('fetchSendingCourtsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesLocalJusticeAreaRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchSendingCourtsResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let finesMacStore: FinesMacStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route: any = { data: {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state: any = {};

  const setFinesMacStoreState = (originatorType: string | null, accountType: string | null): void => {
    const originatorTypeForm = structuredClone(FINES_MAC_ORIGINATOR_TYPE_FORM);
    originatorTypeForm.formData.fm_originator_type_originator_type = originatorType;
    finesMacStore.setOriginatorType(originatorTypeForm);

    const accountDetails = structuredClone(FINES_MAC_ACCOUNT_DETAILS_FORM);
    accountDetails.formData.fm_create_account_account_type = accountType;
    finesMacStore.setAccountDetails(accountDetails, FINES_MAC_BUSINESS_UNIT_STATE, FINES_MAC_LANGUAGE_PREFERENCES_FORM);
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getLocalJusticeAreas: vi.fn().mockName('OpalFines.getLocalJusticeAreas'),
    };
    mockOpalFinesService.getLocalJusticeAreas.mockReturnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });

    finesMacStore = TestBed.inject(FinesMacStore);
    setFinesMacStoreState('NEW', FINES_ACCOUNT_TYPES.Fine);
  });

  it.each([
    {
      originatorType: 'NEW',
      accountType: FINES_ACCOUNT_TYPES.Fine,
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW.Fine,
    },
    {
      originatorType: 'NEW',
      accountType: FINES_ACCOUNT_TYPES['Conditional Caution'],
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW['Conditional Caution'],
    },
    {
      originatorType: 'NEW',
      accountType: FINES_ACCOUNT_TYPES['Fixed Penalty'],
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW['Fixed Penalty'],
    },
    {
      originatorType: 'TFO',
      accountType: FINES_ACCOUNT_TYPES.Fine,
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.TFO.Fine,
    },
    {
      originatorType: 'TFO',
      accountType: FINES_ACCOUNT_TYPES['Fixed Penalty'],
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.TFO['Fixed Penalty'],
    },
  ])('should resolve local justice areas from the service for $originatorType + $accountType', async (scenario) => {
    setFinesMacStoreState(scenario.originatorType, scenario.accountType);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesLocalJusticeAreaRefData>);

    expect(result).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith(scenario.expectedLjaTypes);
  });

  it('should resolve local justice areas from the service with empty form state', async () => {
    setFinesMacStoreState(null, null);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesLocalJusticeAreaRefData>);

    expect(result).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith();
  });

  it('should resolve local justice areas from the service with unsupported mapping scenario', async () => {
    setFinesMacStoreState('TFO', FINES_ACCOUNT_TYPES['Conditional Caution']);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesLocalJusticeAreaRefData>);

    expect(result).toEqual(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith();
  });
});

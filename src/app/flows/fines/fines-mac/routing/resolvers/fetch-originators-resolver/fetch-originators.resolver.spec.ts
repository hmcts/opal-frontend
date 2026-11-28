import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { FINES_ACCOUNT_TYPES } from '@app/flows/fines/constants/fines-account-types.constant';
import { APP_MODE_FEATURE_FLAG } from '@app/flows/fines/constants/environment-feature-flags.constant';
import { RELEASE_1A_1_1_FEATURE_FLAG } from '@app/flows/fines/constants/release-feature-flags.constant';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { IOpalFinesProsecutor } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor.interface';
import { IOpalFinesProsecutorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';
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
  FINES_MAC_COMBINED_ORIGINATOR_REF_DATA_MOCK,
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
  let globalStore: GlobalStoreType;
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
      getProsecutorPrettyName: vi.fn(OpalFines.prototype.getProsecutorPrettyName),
      getLocalJusticeAreaPrettyName: vi.fn(
        (localJusticeArea: IOpalFinesLocalJusticeArea) =>
          `${localJusticeArea.name} (${localJusticeArea.local_justice_area_id})`,
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        {
          provide: LaunchDarklyService,
          useValue: {
            initializeLaunchDarklyClient: vi.fn(),
            initializeLaunchDarklyFlags: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    });

    finesMacStore = TestBed.inject(FinesMacStore);
    globalStore = TestBed.inject(GlobalStore);
    const originatorTypeForm = structuredClone(FINES_MAC_ORIGINATOR_TYPE_FORM);
    originatorTypeForm.formData.fm_originator_type_originator_type = 'NEW';
    finesMacStore.setOriginatorType(originatorTypeForm);
  });

  it('should resolve prosecutors only for a Conditional Caution account when release-1a-1-1 is enabled', async () => {
    globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'opal', [RELEASE_1A_1_1_FEATURE_FLAG]: true });
    setAccountType(FINES_ACCOUNT_TYPES['Conditional Caution']);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getProsecutors).toHaveBeenCalledWith(77);
    expect(mockOpalFinesService.getLocalJusticeAreas).not.toHaveBeenCalled();
    expect(result).toEqual(FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK);
  });

  it('should resolve local justice areas for a Conditional Caution account when release-1a-1-1 is disabled', async () => {
    globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'opal', [RELEASE_1A_1_1_FEATURE_FLAG]: false });
    setAccountType(FINES_ACCOUNT_TYPES['Conditional Caution']);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith(
      FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW['Conditional Caution'],
    );
    expect(mockOpalFinesService.getProsecutors).not.toHaveBeenCalled();
    expect(result).toEqual(FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK);
  });

  it('should resolve prosecutors only for a Fixed Penalty account when release-1a-1-1 is enabled', async () => {
    globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'opal', [RELEASE_1A_1_1_FEATURE_FLAG]: true });
    setAccountType(FINES_ACCOUNT_TYPES['Fixed Penalty']);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getProsecutors).toHaveBeenCalledWith(77);
    expect(mockOpalFinesService.getLocalJusticeAreas).not.toHaveBeenCalled();
    expect(result).toEqual(FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK);
  });

  it('should combine prosecutors and local justice areas for a Fixed Penalty account when release-1a-1-1 is disabled', async () => {
    globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'opal', [RELEASE_1A_1_1_FEATURE_FLAG]: false });
    setAccountType(FINES_ACCOUNT_TYPES['Fixed Penalty']);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getProsecutors).toHaveBeenCalledWith(77);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith(
      FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW['Fixed Penalty'],
    );
    expect(result).toEqual(FINES_MAC_COMBINED_ORIGINATOR_REF_DATA_MOCK);
  });

  it('should resolve local justice areas only for a Fine account', async () => {
    setAccountType(FINES_ACCOUNT_TYPES.Fine);

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalledWith(FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW.Fine);
    expect(mockOpalFinesService.getProsecutors).not.toHaveBeenCalled();
    expect(result).toEqual(FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK);
  });

  it.each([true, false])(
    'should use code-only prosecutors for Fixed Penalty when release-1a-1-1 is %s',
    async (releaseEnabled) => {
      globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'opal', [RELEASE_1A_1_1_FEATURE_FLAG]: releaseEnabled });
      setAccountType(FINES_ACCOUNT_TYPES['Fixed Penalty']);
      const response: IOpalFinesProsecutorRefData = {
        count: 2,
        ref_data: ['001X', '0998'].map((code) => {
          const prosecutor: IOpalFinesProsecutor = {
            ...OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.ref_data[0],
            prosecutor_code: code,
          };
          delete prosecutor.prosecutor_id;
          return prosecutor;
        }),
      };
      mockOpalFinesService.getProsecutors.mockReturnValue(of(response));

      const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

      expect(result.refData.slice(0, 2)).toEqual([
        { originatorId: '001X', name: 'Central ticket office', displayName: 'Central ticket office (001X)' },
        { originatorId: '0998', name: 'Central ticket office', displayName: 'Central ticket office (0998)' },
      ]);
      expect(result.count).toBe(2 + (releaseEnabled ? 0 : FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK.count));
      expect(result.refData.slice(2)).toEqual(releaseEnabled ? [] : FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK.refData);
    },
  );

  it.each(['legacy', 'opal'])(
    'should use the %s prosecutor contract for Conditional Caution through the shared API integration',
    async (appMode) => {
      globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: appMode, [RELEASE_1A_1_1_FEATURE_FLAG]: true });
      setAccountType(FINES_ACCOUNT_TYPES['Conditional Caution']);
      const prosecutor: IOpalFinesProsecutor = { ...OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.ref_data[0] };
      if (appMode === 'opal') {
        delete prosecutor.prosecutor_id;
      } else {
        delete prosecutor.prosecutor_code;
      }
      mockOpalFinesService.getProsecutors.mockReturnValue(of({ count: 1, ref_data: [prosecutor] }));

      const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

      expect(result.refData[0].originatorId).toBe(appMode === 'opal' ? '998' : 1865);
      expect(result.refData[0].displayName).toBe(
        appMode === 'opal' ? 'Central ticket office (998)' : 'Central ticket office (1865)',
      );
      expect(mockOpalFinesService.getLocalJusticeAreas).not.toHaveBeenCalled();
    },
  );

  it.each(
    ['legacy', 'opal'].flatMap((appMode) => [true, false].map((releaseEnabled) => ({ appMode, releaseEnabled }))),
  )(
    'should select the $appMode identifier when both fields exist and release-1a-1-1 is $releaseEnabled',
    async ({ appMode, releaseEnabled }) => {
      globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: appMode, [RELEASE_1A_1_1_FEATURE_FLAG]: releaseEnabled });
      setAccountType(FINES_ACCOUNT_TYPES['Fixed Penalty']);
      mockOpalFinesService.getProsecutors.mockReturnValue(
        of({
          count: 1,
          ref_data: [
            { ...OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.ref_data[0], prosecutor_id: 1865, prosecutor_code: '0998' },
          ],
        }),
      );

      const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

      expect(result.refData[0]).toEqual({
        originatorId: appMode === 'opal' ? '0998' : 1865,
        name: 'Central ticket office',
        displayName: 'Central ticket office (0998)',
      });
      expect(result.refData.slice(1)).toEqual(releaseEnabled ? [] : FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK.refData);
      expect(result.count).toBe(result.refData.length);
    },
  );

  it.each([true, false])(
    'should use ID-only prosecutors in Legacy mode when release-1a-1-1 is %s',
    async (releaseEnabled) => {
      globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: 'legacy', [RELEASE_1A_1_1_FEATURE_FLAG]: releaseEnabled });
      setAccountType(FINES_ACCOUNT_TYPES['Fixed Penalty']);
      const prosecutor: IOpalFinesProsecutor = { ...OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.ref_data[0] };
      delete prosecutor.prosecutor_code;
      mockOpalFinesService.getProsecutors.mockReturnValue(of({ count: 1, ref_data: [prosecutor] }));

      const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

      expect(result.refData[0]).toEqual({
        originatorId: 1865,
        name: 'Central ticket office',
        displayName: 'Central ticket office (1865)',
      });
      expect(result.refData.slice(1)).toEqual(releaseEnabled ? [] : FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK.refData);
    },
  );

  it.each([undefined, null, true, false, '', 'unexpected'])(
    'should use Prosecutor Codes when app-mode is %s',
    async (appMode) => {
      globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: appMode, [RELEASE_1A_1_1_FEATURE_FLAG]: true });
      setAccountType(FINES_ACCOUNT_TYPES['Fixed Penalty']);

      const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

      expect(result.refData.map((originator) => originator.originatorId)).toEqual(['998', '123', '433']);
    },
  );

  it.each(['legacy', 'opal'])(
    'should not fall back to the other identifier when the %s identifier is absent',
    async (appMode) => {
      globalStore.setFeatureFlags({ [APP_MODE_FEATURE_FLAG]: appMode, [RELEASE_1A_1_1_FEATURE_FLAG]: true });
      setAccountType(FINES_ACCOUNT_TYPES['Fixed Penalty']);
      const prosecutor: IOpalFinesProsecutor = { ...OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.ref_data[0] };
      if (appMode === 'opal') {
        delete prosecutor.prosecutor_code;
      } else {
        delete prosecutor.prosecutor_id;
      }
      mockOpalFinesService.getProsecutors.mockReturnValue(of({ count: 1, ref_data: [prosecutor] }));

      const result = await firstValueFrom(executeResolver(route, state) as Observable<IFinesMacOriginatorRefData>);

      expect(result).toEqual({ count: 0, refData: [] });
      expect(mockOpalFinesService.getProsecutorPrettyName).not.toHaveBeenCalled();
    },
  );

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

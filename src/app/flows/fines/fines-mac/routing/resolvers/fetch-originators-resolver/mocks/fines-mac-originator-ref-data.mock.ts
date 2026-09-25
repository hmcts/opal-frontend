import { IFinesMacOriginatorRefData } from '../interfaces/fines-mac-originator-ref-data.interface';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';

export const FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK: IFinesMacOriginatorRefData = {
  count: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.count,
  refData: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData.map((localJusticeArea) => ({
    originatorId: localJusticeArea.local_justice_area_id,
    name: localJusticeArea.name,
    displayName: `${localJusticeArea.name} (${localJusticeArea.local_justice_area_id})`,
  })),
};

export const FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK: IFinesMacOriginatorRefData = {
  count: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.count,
  refData: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK.ref_data.map((prosecutor) => ({
    originatorId: prosecutor.prosecutor_id,
    name: prosecutor.name,
    displayName: `${prosecutor.name} (${prosecutor.prosecutor_code})`,
  })),
};

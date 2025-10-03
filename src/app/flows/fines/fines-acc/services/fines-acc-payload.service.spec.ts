import { FinesAccPayloadService } from './fines-acc-payload.service';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { TestBed } from '@angular/core/testing';
import { FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../fines-mac/services/fines-mac-payload/constants/fines-mac-transform-items-config.constant';

describe('FinesAccPayloadService', () => {
  let service: FinesAccPayloadService;
  let mockMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockGlobalStore: jasmine.SpyObj<GlobalStoreType>;

  beforeEach(() => {
    mockMacPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['getBusinessUnitBusinessUserId']);
    mockGlobalStore = jasmine.createSpyObj('GlobalStore', ['userState']);

    mockMacPayloadService.getBusinessUnitBusinessUserId.and.returnValue(
      FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.business_unit_summary.business_unit_id,
    );
    mockGlobalStore.userState.and.returnValue(OPAL_USER_STATE_MOCK);

    TestBed.configureTestingModule({
      providers: [
        FinesAccPayloadService,
        { provide: FinesMacPayloadService, useValue: mockMacPayloadService },
        { provide: GlobalStore, useValue: mockGlobalStore },
      ],
    });
    service = TestBed.inject(FinesAccPayloadService);
  });

  it('should transform account header for store for an individual', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    const account_id = 77;

    const result: IFinesAccountState = service.transformAccountHeaderForStore(account_id, header);

    expect(result).toEqual({
      account_number: header.account_number,
      account_id: account_id,
      party_id: header.defendant_party_id,
      party_type: header.parent_guardian_party_id ? 'Parent/Guardian' : 'Defendant',
      party_name:
        header.party_details.individual_details?.title +
        ' ' +
        header.party_details.individual_details?.forenames +
        ' ' +
        header.party_details.individual_details?.surname?.toUpperCase(),
      base_version: header.version,
      business_unit_id: header.business_unit_summary.business_unit_id,
      business_unit_user_id: header.business_unit_summary.business_unit_id,
      welsh_speaking: header.business_unit_summary.welsh_speaking,
    });

    expect(mockMacPayloadService.getBusinessUnitBusinessUserId).toHaveBeenCalledWith(
      Number(header.business_unit_summary.business_unit_id),
      OPAL_USER_STATE_MOCK,
    );
    expect(mockGlobalStore.userState).toHaveBeenCalled();
  });

  it('should transform account header for store for a company', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    header.party_details.organisation_flag = true;
    const account_id = 77;

    const result: IFinesAccountState = service.transformAccountHeaderForStore(account_id, header);

    expect(result).toEqual({
      account_number: header.account_number,
      account_id: account_id,
      party_id: header.defendant_party_id,
      party_type: header.parent_guardian_party_id ? 'Parent/Guardian' : 'Defendant',
      party_name: header.party_details.organisation_details?.organisation_name ?? '',
      base_version: header.version,
      business_unit_id: header.business_unit_summary.business_unit_id,
      business_unit_user_id: header.business_unit_summary.business_unit_id,
      welsh_speaking: header.business_unit_summary.welsh_speaking,
    });

    expect(mockMacPayloadService.getBusinessUnitBusinessUserId).toHaveBeenCalledWith(
      Number(header.business_unit_summary.business_unit_id),
      OPAL_USER_STATE_MOCK,
    );
    expect(mockGlobalStore.userState).toHaveBeenCalled();
  });

  it('should handle missing surname gracefully', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    const account_id = 77;

    const result = service.transformAccountHeaderForStore(account_id, header);

    expect(result.party_name).toBe(
      header.party_details.individual_details?.title +
        ' ' +
        header.party_details.individual_details?.forenames +
        ' ' +
        header.party_details.individual_details?.surname?.toUpperCase(),
    );
    expect(result.base_version).toBe(header.version);
    expect(result.business_unit_user_id).toBe(header.business_unit_summary.business_unit_id);
  });

  it('should transform payload using the transformation service', () => {
    spyOn(service['transformationService'], 'transformObjectValues').and.callFake((...args) => args[0]);
    const inputPayload = {
      date_of_birth: '2000-09-09',
    };

    const result = service.transformPayload(inputPayload, FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG);

    expect(service['transformationService'].transformObjectValues).toHaveBeenCalledWith(
      inputPayload,
      FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(result).toEqual(inputPayload);
  });
});

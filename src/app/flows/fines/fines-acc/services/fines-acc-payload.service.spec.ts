import { FinesAccPayloadService } from './fines-acc-payload.service';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { TestBed } from '@angular/core/testing';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-at-a-glance-tab-ref-data.mock';
import { IFinesAccAddCommentsFormState } from '../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';

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

  it('should transform at-a-glance data to comments form state', () => {
    const atAGlanceData = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK;

    const result: IFinesAccAddCommentsFormState = service.transformAtAGlanceDataToCommentsForm(atAGlanceData);

    expect(result).toEqual({
      facc_add_comment: atAGlanceData.comments_and_notes?.account_comment || '',
      facc_add_free_text_1: atAGlanceData.comments_and_notes?.free_text_note_1 || '',
      facc_add_free_text_2: atAGlanceData.comments_and_notes?.free_text_note_2 || '',
      facc_add_free_text_3: atAGlanceData.comments_and_notes?.free_text_note_3 || '',
    });
  });

  it('should handle null account notes gracefully', () => {
    const atAGlanceData = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK,
      comments_and_notes: {
        account_comment: null,
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      },
    };

    const result: IFinesAccAddCommentsFormState = service.transformAtAGlanceDataToCommentsForm(atAGlanceData);

    expect(result).toEqual({
      facc_add_comment: '',
      facc_add_free_text_1: '',
      facc_add_free_text_2: '',
      facc_add_free_text_3: '',
    });
  });

  describe('buildCommentsFormPayload', () => {
    it('should transform form state to update payload correctly', () => {
      const formState: IFinesAccAddCommentsFormState = {
        facc_add_comment: 'Updated comment',
        facc_add_free_text_1: 'Updated note 1',
        facc_add_free_text_2: 'Updated note 2',
        facc_add_free_text_3: 'Updated note 3',
      };

      const result = service.buildCommentsFormPayload(formState);

      expect(result).toEqual({
        account_comments_notes: {
          account_comment: 'Updated comment',
          account_free_note_1: 'Updated note 1',
          account_free_note_2: 'Updated note 2',
          account_free_note_3: 'Updated note 3',
        },
      });
    });

    it('should handle null/empty values in form state', () => {
      const formState: IFinesAccAddCommentsFormState = {
        facc_add_comment: '',
        facc_add_free_text_1: null,
        facc_add_free_text_2: '',
        facc_add_free_text_3: null,
      };

      const result = service.buildCommentsFormPayload(formState);

      expect(result).toEqual({
        account_comments_notes: {
          account_comment: null,
          account_free_note_1: null,
          account_free_note_2: null,
          account_free_note_3: null,
        },
      });
    });
  });
});

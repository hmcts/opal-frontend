import { FinesAccPayloadService } from './fines-acc-payload.service';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
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
      FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.business_unit_id,
    );
    mockGlobalStore.userState.and.returnValue(SESSION_USER_STATE_MOCK);

    TestBed.configureTestingModule({
      providers: [
        FinesAccPayloadService,
        { provide: FinesMacPayloadService, useValue: mockMacPayloadService },
        { provide: GlobalStore, useValue: mockGlobalStore },
      ],
    });
    service = TestBed.inject(FinesAccPayloadService);
  });

  it('should transform account header for store', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK;

    const result: IFinesAccountState = service.transformAccountHeaderForStore(header);

    expect(result).toEqual({
      account_number: header.account_number,
      party_id: header.defendant_account_id,
      party_type: header.debtor_type,
      party_name: header.title + ' ' + header.firstnames + ' ' + header.surname?.toUpperCase(),
      base_version: Number(header.version),
      business_unit_user_id: header.business_unit_id,
    });

    expect(mockMacPayloadService.getBusinessUnitBusinessUserId).toHaveBeenCalledWith(
      Number(header.business_unit_id),
      SESSION_USER_STATE_MOCK,
    );
    expect(mockGlobalStore.userState).toHaveBeenCalled();
  });

  it('should handle missing surname gracefully', () => {
    const header: IOpalFinesAccountDefendantDetailsHeader = FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK;

    const result = service.transformAccountHeaderForStore(header);

    expect(result.party_name).toBe(header.title + ' ' + header.firstnames + ' ' + header.surname?.toUpperCase());
    expect(result.base_version).toBe(Number(header.version));
    expect(result.business_unit_user_id).toBe(header.business_unit_id);
  });

  it('should transform at-a-glance data to comments form state', () => {
    const atAGlanceData = OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK;

    const result: IFinesAccAddCommentsFormState = service.transformAtAGlanceDataToCommentsForm(atAGlanceData);

    expect(result).toEqual({
      facc_add_comment: atAGlanceData.account_notes.account_comment,
      facc_add_free_text_1: atAGlanceData.account_notes.free_text_note_1,
      facc_add_free_text_2: atAGlanceData.account_notes.free_text_note_2,
      facc_add_free_text_3: atAGlanceData.account_notes.free_text_note_3,
    });
  });

  it('should handle null account notes gracefully', () => {
    const atAGlanceData = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK,
      account_notes: {
        account_comment: null,
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      },
    };

    const result: IFinesAccAddCommentsFormState = service.transformAtAGlanceDataToCommentsForm(atAGlanceData);

    expect(result).toEqual({
      facc_add_comment: null,
      facc_add_free_text_1: null,
      facc_add_free_text_2: null,
      facc_add_free_text_3: null,
    });
  });
});

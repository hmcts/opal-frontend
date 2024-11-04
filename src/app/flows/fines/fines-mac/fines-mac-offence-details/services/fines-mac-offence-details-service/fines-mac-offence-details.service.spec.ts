import { TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsService } from './fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../../constants/fines-mac-offence-details-draft-state.constant';
import { FINES_MAC_STATUS } from '../../../constants/fines-mac-status';

describe('FinesMacOffenceDetailsService', () => {
  let service: FinesMacOffenceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacOffenceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store offence details draft state', () => {
    service.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
    expect(service.finesMacOffenceDetailsDraftState).toEqual(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE);
  });

  it('should set show_date_of_sentence to true for unique dates', () => {
    const forms = [
      {
        formData: {
          fm_offence_details_id: 0,
          fm_offence_details_offence_code: 'GMMET001',
          fm_offence_details_date_of_offence: '2023-01-01',
          fm_offence_details_impositions: [
            {
              fm_offence_details_imposition_id: 0,
              fm_offence_details_result_code: 'FCC',
              fm_offence_details_amount_imposed: 200,
              fm_offence_details_amount_paid: 50,
              fm_offence_details_balance_remaining: 150,
              fm_offence_details_needs_creditor: true,
              fm_offence_details_creditor: 'major',
              fm_offence_details_major_creditor: 3856,
            },
          ],
        },
        nestedFlow: false,
        status: FINES_MAC_STATUS.PROVIDED,
      },
      {
        formData: {
          fm_offence_details_id: 1,
          fm_offence_details_offence_code: 'GMMET001',
          fm_offence_details_date_of_offence: '2023-01-01',
          fm_offence_details_impositions: [
            {
              fm_offence_details_imposition_id: 0,
              fm_offence_details_result_code: 'FCC',
              fm_offence_details_amount_imposed: 200,
              fm_offence_details_amount_paid: 50,
              fm_offence_details_balance_remaining: 150,
              fm_offence_details_needs_creditor: true,
              fm_offence_details_creditor: 'major',
              fm_offence_details_major_creditor: 3856,
            },
          ],
        },
        nestedFlow: false,
        status: FINES_MAC_STATUS.PROVIDED,
      },
    ];

    const result = service.removeIndexFromImpositionKeys(forms);
    expect(result[0].formData.show_date_of_sentence).toBe(true);
    expect(result[1].formData.show_date_of_sentence).toBe(false);
  });
});

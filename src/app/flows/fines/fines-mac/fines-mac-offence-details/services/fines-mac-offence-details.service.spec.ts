import { TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsService } from './fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';

describe('FinesMacOffenceDetailsService', () => {
  let service: FinesMacOffenceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacOffenceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reorderImpositionKeys - should reorder imposition keys correctly', () => {
    const impositions = [{ key_0: 'value0' }, { key_1: 'value1' }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (service as any).reorderImpositionKeys(impositions);
    expect(result).toEqual([{ key_0: 'value0' }, { key_1: 'value1' }]);
  });

  it('updateChildFormData - should update child form data correctly', () => {
    const offence = {
      childFormData: [
        { formData: { fm_offence_details_imposition_position: 1 } },
        { formData: { fm_offence_details_imposition_position: 2 } },
      ],
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).updateChildFormData(offence, 1);
    expect(offence.childFormData).toEqual([{ formData: { fm_offence_details_imposition_position: 1 } }]);
  });

  it('removeImposition - should remove imposition correctly', () => {
    const data = [
      {
        formData: {
          fm_offence_details_impositions: [{ key_0: 'value0' }, { key_1: 'value1' }],
        },
      },
    ];
    const result = service.removeImposition(data, 0);
    expect(result).toEqual([
      {
        formData: {
          fm_offence_details_impositions: [{ key_0: 'value1' }],
        },
      },
    ]);
  });

  it('removeImposition - should return undefined as data is empty', () => {
    const result = service.removeImposition([], 0);
    expect(result).toBeUndefined();
  });

  it('removeImposition - should return undefined as imposition is empty', () => {
    const data = [
      {
        formData: {
          fm_offence_details_impositions: null,
        },
      },
    ];
    const result = service.removeImposition(data, 0);
    expect(result).toBeUndefined();
  });

  it('removeIndexFromImpositionKey - should remove index from imposition key correctly', () => {
    const expected = FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData.fm_offence_details_impositions[0];
    const offences = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    offences[0].formData.fm_offence_details_impositions = [
      {
        fm_offence_details_imposition_id_0: 0,
        fm_offence_details_result_id_0: 'FCC',
        fm_offence_details_amount_imposed_0: 200,
        fm_offence_details_amount_paid_0: 50,
        fm_offence_details_balance_remaining_0: 150,
        fm_offence_details_needs_creditor_0: true,
        fm_offence_details_creditor_0: 'major',
        fm_offence_details_major_creditor_id_0: 3856,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ];
    const result = service.removeIndexFromImpositionKey(offences);
    expect(result[0].formData.fm_offence_details_impositions[0]).toEqual(expected);
  });
});

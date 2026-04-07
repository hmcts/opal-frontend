import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsService } from './fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../constants/fines-mac-offence-details-default-values.constant';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-duplicate-code.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-multi-result.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacOffenceDetailsService', () => {
  let service: FinesMacOffenceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpalFines, provideHttpClient(), provideHttpClientTesting()],
    });
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

  it('findExactOffenceMatch - should return undefined when duplicate code matches are ambiguous', () => {
    const result = service.findExactOffenceMatch(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK, 'GMMET001');

    expect(result).toBeUndefined();
  });

  it('findExactOffenceMatch - should resolve duplicate code matches using the saved offence id', () => {
    const result = service.findExactOffenceMatch(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK, 'GMMET001', 41800);

    expect(result).toEqual(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK.refData[1]);
  });

  describe('initOffenceListener', () => {
    let form: FormGroup;
    let destroy$: Subject<void>;
    let onResultSpy: Mock;
    let onConfirmChangeSpy: Mock;
    let getOffenceByCjsCode: (code: string) => Observable<IOpalFinesOffencesRefData>;

    const offenceMockResponse: IOpalFinesOffencesRefData = {
      ...OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK,
    };

    beforeEach(() => {
      getOffenceByCjsCode = () => of(offenceMockResponse);

      form = new FormGroup({
        code: new FormControl(''),
        id: new FormControl(null),
      });

      destroy$ = new Subject<void>();
      onResultSpy = vi.fn();
      onConfirmChangeSpy = vi.fn();
    });

    afterEach(() => {
      destroy$.next();
      destroy$.complete();
      vi.useRealTimers();
    });

    it('should call populateHint immediately if initial code is present', () => {
      vi.useFakeTimers();
      form.get('code')?.setValue('ak123456');

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('id')?.value).toBe(314441);
      expect(onResultSpy).toHaveBeenCalledWith(offenceMockResponse);
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should listen for value changes, uppercase input, and trigger populateHint', () => {
      vi.useFakeTimers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uppercaseAllLettersSpy = vi.spyOn<any, any>(service.utilsService, 'upperCaseAllLetters');

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('ak123456');
      form.get('code')?.updateValueAndValidity();

      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(uppercaseAllLettersSpy).toHaveBeenCalledWith('ak123456');
      expect(form.get('code')?.value).toBe('AK123456');
      expect(form.get('id')?.value).toBe(314441);
      expect(onResultSpy).toHaveBeenCalled();
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should mark code as invalid when response count is 0', () => {
      vi.useFakeTimers();
      const invalidResponse = { count: 0, refData: [] };
      getOffenceByCjsCode = () => of(invalidResponse);

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('zz99999');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('code')?.errors).toEqual({ invalidOffenceCode: true });
      expect(form.get('id')?.value).toBeNull();
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should populate the offence id when an exact match exists in a multi-result response', () => {
      vi.useFakeTimers();
      getOffenceByCjsCode = () => of(OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK);

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('cd71039');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('code')?.errors).toBeNull();
      expect(form.get('id')?.value).toBe(41799);
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should mark duplicate exact code matches as invalid when there is no saved offence id', () => {
      vi.useFakeTimers();
      getOffenceByCjsCode = () => of(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK);

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('gmmet001');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('code')?.errors).toEqual({ invalidOffenceCode: true });
      expect(form.get('id')?.value).toBeNull();
    });

    it('should preserve the saved offence id when the original duplicate code is re-entered', () => {
      vi.useFakeTimers();
      form.get('code')?.setValue('GMMET001');
      form.get('id')?.setValue(41800);
      getOffenceByCjsCode = (code: string) => {
        if (code === 'UNIQUE01') {
          return of({
            count: 1,
            refData: [
              {
                offence_id: 99999,
                get_cjs_code: 'UNIQUE01',
                business_unit_id: 52,
                offence_title: 'Unique offence title',
                offence_title_cy: null,
                date_used_from: '1997-11-16T00:00:00Z',
                date_used_to: null,
                offence_oas: 'Unique offence',
                offence_oas_cy: null,
              },
            ],
          });
        }

        return of(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK);
      };

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);
      expect(form.get('id')?.value).toBe(41800);

      form.get('code')?.setValue('UNIQUE01');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);
      expect(form.get('id')?.value).toBe(99999);

      form.get('code')?.setValue('GMMET001');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('code')?.errors).toBeNull();
      expect(form.get('id')?.value).toBe(41800);
    });

    it('should mark code as invalid when results are returned but none match exactly', () => {
      vi.useFakeTimers();
      const nonExactResponse: IOpalFinesOffencesRefData = {
        count: 2,
        refData: [
          {
            offence_id: 1,
            get_cjs_code: 'TEST123A',
            business_unit_id: 52,
            offence_title: 'Test A',
            offence_title_cy: null,
            date_used_from: '1971-01-01T00:00:00Z',
            date_used_to: null,
            offence_oas: 'Test A',
            offence_oas_cy: null,
          },
          {
            offence_id: 2,
            get_cjs_code: 'TEST123B',
            business_unit_id: 52,
            offence_title: 'Test B',
            offence_title_cy: null,
            date_used_from: '1971-01-01T00:00:00Z',
            date_used_to: null,
            offence_oas: 'Test B',
            offence_oas_cy: null,
          },
        ],
      };
      getOffenceByCjsCode = () => of(nonExactResponse);

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('TEST123');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('code')?.errors).toEqual({ invalidOffenceCode: true });
      expect(form.get('id')?.value).toBeNull();
    });

    it('should not call populateHint for short code', () => {
      vi.useFakeTimers();
      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('ab12');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(onConfirmChangeSpy).toHaveBeenCalledWith(false);
    });
  });
});

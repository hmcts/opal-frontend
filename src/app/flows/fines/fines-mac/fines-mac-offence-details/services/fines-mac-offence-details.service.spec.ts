import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsService } from './fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject, throwError } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../constants/fines-mac-offence-details-default-values.constant';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
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

  it('setControlError - should remove one error key and keep remaining errors', () => {
    const control = new FormControl('code');
    control.setErrors({
      invalidOffenceCode: true,
      customError: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).setControlError(control, 'invalidOffenceCode', false);

    expect(control.errors).toEqual({ customError: true });
  });

  it('setControlError - should clear all errors when removing the final error key', () => {
    const control = new FormControl('code');
    control.setErrors({
      invalidOffenceCode: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).setControlError(control, 'invalidOffenceCode', false);

    expect(control.errors).toBeNull();
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
        id: new FormControl(''),
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
      form.get('code')?.setValue('ab12345');

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

      form.get('code')?.setValue('xy98765');
      form.get('code')?.updateValueAndValidity();

      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(uppercaseAllLettersSpy).toHaveBeenCalledWith('xy98765');
      expect(form.get('code')?.value).toBe('XY98765');
      expect(form.get('id')?.value).toBe(314441);
      expect(onResultSpy).toHaveBeenCalled();
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should clear offence id and set confirmation to false immediately when code changes', () => {
      vi.useFakeTimers();
      form.get('id')?.setValue(314441);

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('xy98765');

      expect(form.get('id')?.value).toBeNull();
      expect(form.get('code')?.errors).toEqual({ offenceCodeValidationPending: true });
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(false);
    });

    it('should not set pending validation error immediately for short codes', () => {
      vi.useFakeTimers();
      form.get('id')?.setValue(314441);

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('xy98');

      expect(form.get('id')?.value).toBeNull();
      expect(form.get('code')?.errors).toBeNull();
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(false);
    });

    it('should ignore stale offence lookup responses when code changes quickly', () => {
      vi.useFakeTimers();

      const firstLookup$ = new Subject<IOpalFinesOffencesRefData>();
      const secondLookup$ = new Subject<IOpalFinesOffencesRefData>();
      getOffenceByCjsCode = vi.fn((code: string) => {
        return code === 'AB12345' ? firstLookup$.asObservable() : secondLookup$.asObservable();
      });

      const staleResponse: IOpalFinesOffencesRefData = {
        ...offenceMockResponse,
        refData: [{ ...offenceMockResponse.refData[0], offence_id: 111111, get_cjs_code: 'AB12345' }],
      };
      const latestResponse: IOpalFinesOffencesRefData = {
        ...offenceMockResponse,
        refData: [{ ...offenceMockResponse.refData[0], offence_id: 222222, get_cjs_code: 'CD12345' }],
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

      form.get('code')?.setValue('ab12345');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      form.get('code')?.setValue('cd12345');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      firstLookup$.next(staleResponse);
      expect(form.get('id')?.value).toBeNull();
      expect(onResultSpy).not.toHaveBeenCalled();

      secondLookup$.next(latestResponse);
      expect(form.get('id')?.value).toBe(222222);
      expect(onResultSpy).toHaveBeenCalledTimes(1);
      expect(onResultSpy).toHaveBeenCalledWith(latestResponse);
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

    it('should mark code as invalid when response count is greater than 1', () => {
      vi.useFakeTimers();
      const multipleResponse: IOpalFinesOffencesRefData = {
        count: 2,
        refData: [offenceMockResponse.refData[0], { ...offenceMockResponse.refData[0], offence_id: 123456 }],
      };
      getOffenceByCjsCode = () => of(multipleResponse);

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

    it('should clear pending error and set lookup failed error when offence lookup request fails', () => {
      vi.useFakeTimers();
      getOffenceByCjsCode = () => throwError(() => new Error('request failed'));

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

      expect(form.get('code')?.errors).toEqual({ offenceCodeLookupFailed: true });
      expect(form.get('id')?.value).toBeNull();
      expect(onResultSpy).not.toHaveBeenCalled();
      expect(onConfirmChangeSpy).toHaveBeenLastCalledWith(false);
    });

    it('should ignore stale lookup failures from previous offence code values', () => {
      vi.useFakeTimers();

      const firstLookup$ = new Subject<IOpalFinesOffencesRefData>();
      const secondLookup$ = new Subject<IOpalFinesOffencesRefData>();
      getOffenceByCjsCode = vi.fn((code: string) => {
        return code === 'AB12345' ? firstLookup$.asObservable() : secondLookup$.asObservable();
      });

      service.initOffenceCodeListener(
        form,
        'code',
        'id',
        destroy$,
        getOffenceByCjsCode,
        onResultSpy,
        onConfirmChangeSpy,
      );

      form.get('code')?.setValue('ab12345');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      form.get('code')?.setValue('cd12345');
      vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      firstLookup$.error(new Error('stale failure'));

      expect(form.get('code')?.errors).toEqual({ offenceCodeValidationPending: true });
      expect(onConfirmChangeSpy).toHaveBeenCalledTimes(4);
      expect(onResultSpy).not.toHaveBeenCalled();

      secondLookup$.next(offenceMockResponse);
      expect(form.get('id')?.value).toBe(314441);
      expect(form.get('code')?.errors).toBeNull();
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

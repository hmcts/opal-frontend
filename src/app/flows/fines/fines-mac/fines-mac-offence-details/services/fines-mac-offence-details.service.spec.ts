import { TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsService } from './fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../constants/fines-mac-offence-details-default-values.constant';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';

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

  describe('initOffenceListener', () => {
    let form: FormGroup;
    let destroy$: Subject<void>;
    let onResultSpy: jasmine.Spy;
    let onConfirmChangeSpy: jasmine.Spy;
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
      onResultSpy = jasmine.createSpy('onResult');
      onConfirmChangeSpy = jasmine.createSpy('onConfirmChange');
    });

    afterEach(() => {
      destroy$.next();
      destroy$.complete();
    });

    it('should call populateHint immediately if initial code is present', fakeAsync(() => {
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

      tick(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('id')?.value).toBe(314441);
      expect(onResultSpy).toHaveBeenCalledWith(offenceMockResponse);
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    }));

    it('should listen for value changes, uppercase input, and trigger populateHint', fakeAsync(() => {
      const uppercaseAllLettersSpy = spyOn(service.utilsService, 'upperCaseAllLetters').and.callThrough();

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

      tick(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(uppercaseAllLettersSpy).toHaveBeenCalledWith('xy98765');
      expect(form.get('code')?.value).toBe('XY98765');
      expect(form.get('id')?.value).toBe(314441);
      expect(onResultSpy).toHaveBeenCalled();
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    }));

    it('should mark code as invalid when response count is 0', fakeAsync(() => {
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
      tick(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(form.get('code')?.errors).toEqual({ invalidOffenceCode: true });
      expect(form.get('id')?.value).toBeNull();
      expect(onConfirmChangeSpy).toHaveBeenCalledWith(true);
    }));

    it('should not call populateHint for short code', fakeAsync(() => {
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
      tick(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

      expect(onConfirmChangeSpy).toHaveBeenCalledWith(false);
    }));
  });
});

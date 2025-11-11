import { inject, Injectable } from '@angular/core';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil, tap } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../constants/fines-mac-offence-details-default-values.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';

@Injectable({
  providedIn: 'any',
})
export class FinesMacOffenceDetailsService {
  public utilsService = inject(UtilsService);
  /**
   * Reorders the imposition keys to maintain correct numbering.
   *
   * @param impositions - The array of impositions to be reordered.
   * @returns The reordered array of impositions.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reorderImpositionKeys(impositions: any[]): any[] {
    return impositions.map((imposition, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newImposition: any = {};
      for (const key of Object.keys(imposition)) {
        const newKey = key.replace(/_\d+$/, `_${index}`); // Replace index suffix with new index
        newImposition[newKey] = imposition[key];
      }
      return newImposition;
    });
  }

  /**
   * Updates child form data to adjust imposition positions after an imposition is removed.
   *
   * @param offence - The offence object containing the child form data.
   * @param removedIndex - The index of the removed imposition.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private updateChildFormData(offence: any, removedIndex: number): void {
    if (!offence.childFormData) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const child of offence.childFormData) {
      if (child.formData.fm_offence_details_imposition_position === removedIndex) {
        // Remove the childFormData entry if it matches the removed index
        offence.childFormData = offence.childFormData.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) => c.formData.fm_offence_details_imposition_position !== removedIndex,
        );
      } else if (child.formData.fm_offence_details_imposition_position > removedIndex) {
        // Decrement imposition_position for remaining childFormData
        child.formData.fm_offence_details_imposition_position--;
      }
    }
  }

  /**
   * Removes an imposition from the specified offence in the data array.
   *
   * @param data - The array of offence data objects.
   * @param offenceIndex - The index of the offence in the data array.
   * @param impositionIndex - The index of the imposition to be removed within the offence.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeImposition(data: any[], impositionIndex: number, offenceIndex: number = 0): any {
    if (!data?.length) return;

    const offence = data[offenceIndex];
    const impositions = offence?.formData?.fm_offence_details_impositions;
    if (!impositions || impositionIndex < 0 || impositionIndex >= impositions.length) return;

    // Remove the imposition at the given index
    impositions.splice(impositionIndex, 1);

    // Reorder the remaining impositions by renaming keys to maintain correct numbering
    offence.formData.fm_offence_details_impositions = this.reorderImpositionKeys(impositions);

    // Update childFormData
    this.updateChildFormData(offence, impositionIndex);

    return data;
  }

  public removeIndexFromImpositionKey(forms: IFinesMacOffenceDetailsForm[]) {
    const uniqueDates = new Set<string>(); // Track unique dates of offence
    return forms.map((form) => {
      const dateOfOffence = form.formData.fm_offence_details_date_of_sentence;

      let show_date_of_sentence = false;
      if (dateOfOffence && !uniqueDates.has(dateOfOffence)) {
        show_date_of_sentence = true;
        uniqueDates.add(dateOfOffence);
      }

      return {
        formData: {
          ...form.formData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fm_offence_details_impositions: form.formData.fm_offence_details_impositions.map((imposition: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cleanedImposition: any = {};
            for (const key of Object.keys(imposition)) {
              // Use regex to remove the _{{index}} from the key
              const newKey = key.replace(/_\d+$/, '');
              cleanedImposition[newKey] = imposition[key];
            }
            return cleanedImposition;
          }),
          show_date_of_sentence,
        },
        nestedFlow: form.nestedFlow,
        childFormData: form.childFormData,
      };
    });
  }

  /**
   * Initializes the offence code listener for a form control.
   * @param form - The FormGroup containing the controls.
   * @param codeControlName - The name of the control for the offence code.
   * @param idControlName - The name of the control for the offence ID.
   * @param destroy$ - Subject to signal when to unsubscribe from observables.
   * @param changeDetector - ChangeDetectorRef to trigger change detection.
   * @param onResult - Optional callback function to handle the result of the code lookup.
   * @param onConfirmChange - Optional callback function to confirm if the code change was successful.
   */
  public initOffenceCodeListener(
    form: FormGroup,
    codeControlName: string,
    idControlName: string,
    destroy$: Subject<void>,
    getOffenceByCjsCode: (code: string) => Observable<IOpalFinesOffencesRefData>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onResult: (result: any) => void,
    onConfirmChange?: (confirmed: boolean) => void,
  ): void {
    const codeControl = form.controls[codeControlName];
    const idControl = form.controls[idControlName];

    const populateHint = (code: string) => {
      idControl.setValue(null);

      if (code?.length >= 7 && code?.length <= 8) {
        const result$ = getOffenceByCjsCode(code).pipe(
          tap((response) => {
            codeControl.setErrors(response.count === 0 ? { invalidOffenceCode: true } : null, { emitEvent: false });
            idControl.setValue(response.count === 1 ? response.refData[0].offence_id : null, { emitEvent: false });

            if (typeof onResult === 'function') {
              onResult(response);
            }
          }),
          takeUntil(destroy$),
        );

        result$.subscribe();
        if (onConfirmChange) onConfirmChange(true);
      } else if (onConfirmChange) {
        onConfirmChange(false);
      }
    };

    if (codeControl.value) {
      populateHint(codeControl.value);
    }

    codeControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap((code: string) => {
          code = this.utilsService.upperCaseAllLetters(code);
          codeControl.setValue(code, { emitEvent: false });
        }),
        debounceTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime),
        takeUntil(destroy$),
      )
      .subscribe((code: string) => {
        populateHint(code);
      });
  }
}

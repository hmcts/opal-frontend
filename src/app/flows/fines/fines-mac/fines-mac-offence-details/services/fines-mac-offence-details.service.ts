import { inject, Injectable } from '@angular/core';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil, tap, catchError, EMPTY } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../constants/fines-mac-offence-details-default-values.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesOffences } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences.interface';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { IFinesMacOffenceDetailsSetupOffenceCodeLookupOptions } from './interfaces/fines-mac-offence-details-setup-offence-code-lookup-options.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesMacOffenceDetailsService {
  public utilsService = inject(UtilsService);

  /**
   * Adds or removes a single custom error key while preserving any other control errors.
   *
   * @param control - The control to update.
   * @param errorKey - The custom error key to add or remove.
   * @param hasError - True to set the error key, false to clear it.
   */
  private setControlError(control: FormControl, errorKey: string, hasError: boolean): void {
    const currentErrors = control.errors ?? {};

    if (hasError) {
      if (!currentErrors[errorKey]) {
        control.setErrors({ ...currentErrors, [errorKey]: true }, { emitEvent: false });
      }
      return;
    }

    if (!currentErrors[errorKey]) {
      return;
    }

    const remainingErrors = { ...currentErrors };
    delete remainingErrors[errorKey];
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null, { emitEvent: false });
  }

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
   * Extracts the offence code from a ref-data item.
   *
   * @param offence - The offence ref-data item.
   * @returns The offence code when present.
   */
  private getOffenceCode(offence: IOpalFinesOffences & { cjs_code?: string }): string | undefined {
    return offence.get_cjs_code ?? offence.cjs_code;
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
   * Finds the exact offence match for a supplied offence code from the returned offence reference data.
   *
   * Supports both `get_cjs_code` and `cjs_code` shaped response objects so the caller does not need
   * to care about the source format.
   *
   * @param response - The offence lookup response.
   * @param offenceCode - The offence code entered by the user.
   * @param offenceId - Optional saved offence ID used to disambiguate duplicate exact-code matches.
   * @returns The unique exact-code match, the saved offence when duplicates can be disambiguated, or `undefined`.
   */
  public findExactOffenceMatch(
    response: IOpalFinesOffencesRefData | null | undefined,
    offenceCode: string | null | undefined,
    offenceId?: number | null,
  ): IOpalFinesOffences | undefined {
    if (!response?.refData?.length || !offenceCode) {
      return undefined;
    }

    const normalisedOffenceCode = offenceCode.trim().toUpperCase();
    const exactCodeMatches = response.refData.filter((offence) => {
      const returnedCode = this.getOffenceCode(offence as IOpalFinesOffences & { cjs_code?: string });
      return returnedCode?.trim().toUpperCase() === normalisedOffenceCode;
    });

    if (exactCodeMatches.length === 1) {
      return exactCodeMatches[0];
    }

    if (offenceId == null) {
      return undefined;
    }

    return exactCodeMatches.find((offence) => offence.offence_id === offenceId);
  }

  /**
   * Wires offence-code lookup state into a form using a single options object.
   * The lookup behaviour is unchanged from the old positional-parameter version,
   * but the named configuration makes each dependency explicit and keeps the
   * public API below the parameter-count threshold.
   *
   * @param options - Configuration for the offence-code lookup wiring.
   * @param options.form - The form containing the offence code and offence id controls.
   * @param options.codeControlName - The offence code control name.
   * @param options.idControlName - The offence id control name.
   * @param options.destroy$ - Emits when subscriptions should be torn down.
   * @param options.getOffenceByCjsCode - Fetches offences for the current code.
   * @param options.onResult - Handles successful lookup responses.
   * @param options.onConfirmChange - Updates the caller with the confirmation state.
   * @param options.hasAttemptedSubmit - Reports whether submit has already been attempted.
   * @param options.refreshSubmittedErrors - Refreshes visible errors after async lookup updates.
   * @returns A callback that re-runs validation for the current offence code value.
   */
  public setupOffenceCodeLookup(lookupOptions: IFinesMacOffenceDetailsSetupOffenceCodeLookupOptions): () => void {
    return this.initOffenceCodeListener(
      lookupOptions.form,
      lookupOptions.codeControlName,
      lookupOptions.idControlName,
      lookupOptions.destroy$,
      lookupOptions.getOffenceByCjsCode,
      lookupOptions.onResult,
      (confirmed) => {
        lookupOptions.onConfirmChange?.(confirmed);
        if (lookupOptions.hasAttemptedSubmit()) {
          lookupOptions.refreshSubmittedErrors();
        }
      },
    );
  }

  /**
   * Ensures offence-code validation has completed before allowing submission.
   * If the latest lookup failed for a 7 or 8 character code, the lookup is retried.
   * Otherwise, unresolved lookup-length codes are marked with a pending-validation
   * error, and that error is cleared once an offence id has been resolved.
   */
  public enforceOffenceCodeValidationBeforeSubmit(
    form: FormGroup,
    codeControlName: string,
    idControlName: string,
    retryOffenceCodeLookup: () => void,
  ): void {
    const offenceCodeControl = form.get(codeControlName) as FormControl | null;
    const offenceIdControl = form.get(idControlName) as FormControl | null;

    if (!offenceCodeControl || !offenceIdControl) {
      return;
    }

    const offenceCode = typeof offenceCodeControl.value === 'string' ? offenceCodeControl.value : '';
    const isLookupLength = offenceCode.length >= 7 && offenceCode.length <= 8;
    const hasOffenceId = offenceIdControl.value !== null && offenceIdControl.value !== undefined;
    const hasInvalidOffenceCodeError = Boolean(offenceCodeControl.errors?.['invalidOffenceCode']);
    const hasOffenceCodeLookupFailedError = Boolean(offenceCodeControl.errors?.['offenceCodeLookupFailed']);

    if (hasOffenceCodeLookupFailedError && isLookupLength && !hasOffenceId && !hasInvalidOffenceCodeError) {
      retryOffenceCodeLookup();
      return;
    }

    this.setControlError(
      offenceCodeControl,
      'offenceCodeValidationPending',
      isLookupLength && !hasOffenceId && !hasInvalidOffenceCodeError,
    );
  }

  /**
   * Initializes the offence code listener for a form control.
   *
   * @param form - The FormGroup containing the controls.
   * @param codeControlName - The name of the control for the offence code.
   * @param idControlName - The name of the control for the offence ID.
   * @param destroy$ - Subject to signal when to unsubscribe from observables.
   * @param getOffenceByCjsCode - Function used to fetch offence details by CJS code.
   * @param onResult - Callback function to handle a successful code lookup result.
   * @param onConfirmChange - Optional callback function to confirm if the code change was successful.
   * @returns A callback that re-runs validation for the current offence code value.
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
  ): () => void {
    const codeControl = form.controls[codeControlName] as FormControl;
    const idControl = form.controls[idControlName] as FormControl;
    let latestLookupRequest = 0;
    const savedOffenceId = idControl.value;
    const savedOffenceCode = typeof codeControl.value === 'string' ? codeControl.value.trim().toUpperCase() : null;

    const populateHint = (code: string, isInitialLoad: boolean = false) => {
      const lookupRequest = ++latestLookupRequest;
      const normalisedCode = code?.trim().toUpperCase();
      const previousOffenceId =
        normalisedCode && savedOffenceCode === normalisedCode ? savedOffenceId : idControl.value;
      const hasCurrentOffenceId = idControl.value !== null && idControl.value !== undefined;
      const shouldDeferPendingValidation =
        isInitialLoad && normalisedCode === savedOffenceCode && savedOffenceId !== null && savedOffenceId !== undefined;
      this.setControlError(codeControl, 'invalidOffenceCode', false);
      this.setControlError(codeControl, 'offenceCodeLookupFailed', false);

      if (code?.length >= 7 && code?.length <= 8) {
        const shouldShowPendingValidation = shouldDeferPendingValidation ? false : !hasCurrentOffenceId;
        this.setControlError(codeControl, 'offenceCodeValidationPending', shouldShowPendingValidation);
        if (shouldShowPendingValidation && onConfirmChange) onConfirmChange(false);

        const result$ = getOffenceByCjsCode(code).pipe(
          tap((response) => {
            const exactMatch = this.findExactOffenceMatch(response, code, previousOffenceId);

            // Ignore stale responses that return after the user has changed the code.
            if (lookupRequest !== latestLookupRequest || codeControl.value !== code) {
              return;
            }

            this.setControlError(codeControl, 'offenceCodeValidationPending', false);
            this.setControlError(codeControl, 'offenceCodeLookupFailed', false);
            this.setControlError(codeControl, 'invalidOffenceCode', !exactMatch);
            idControl.setValue(exactMatch?.offence_id ?? null, { emitEvent: false });

            if (typeof onResult === 'function') {
              onResult(response);
            }

            if (onConfirmChange) onConfirmChange(true);
          }),
          catchError(() => {
            // Ignore stale failures for previous lookups.
            if (lookupRequest !== latestLookupRequest || codeControl.value !== code) {
              return EMPTY;
            }

            this.setControlError(codeControl, 'offenceCodeValidationPending', false);
            this.setControlError(codeControl, 'invalidOffenceCode', false);
            this.setControlError(codeControl, 'offenceCodeLookupFailed', true);
            idControl.setValue(null, { emitEvent: false });
            if (onConfirmChange) onConfirmChange(false);
            return EMPTY;
          }),
          takeUntil(destroy$),
        );

        result$.subscribe();
      } else {
        idControl.setValue(null, { emitEvent: false });
        this.setControlError(codeControl, 'offenceCodeValidationPending', false);
        this.setControlError(codeControl, 'offenceCodeLookupFailed', false);
        if (onConfirmChange) onConfirmChange(false);
      }
    };

    if (codeControl.value) {
      const upperCasedCode = this.utilsService.upperCaseAllLetters(codeControl.value);
      codeControl.setValue(upperCasedCode, { emitEvent: false });
      populateHint(upperCasedCode, true);
    }

    codeControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap((code: string) => {
          const upperCasedCode = this.utilsService.upperCaseAllLetters(code);
          const isLookupLength = upperCasedCode?.length >= 7 && upperCasedCode?.length <= 8;
          codeControl.setValue(upperCasedCode, { emitEvent: false });
          // Invalidate any in-flight lookup as soon as the input changes.
          latestLookupRequest++;
          idControl.setValue(null, { emitEvent: false });
          this.setControlError(codeControl, 'offenceCodeValidationPending', isLookupLength);
          this.setControlError(codeControl, 'invalidOffenceCode', false);
          this.setControlError(codeControl, 'offenceCodeLookupFailed', false);
          if (onConfirmChange) onConfirmChange(false);
        }),
        debounceTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime),
        takeUntil(destroy$),
      )
      .subscribe((code: string) => {
        populateHint(this.utilsService.upperCaseAllLetters(code));
      });

    return () => {
      const code = this.utilsService.upperCaseAllLetters(codeControl.value);

      if (typeof code !== 'string') {
        return;
      }

      codeControl.setValue(code, { emitEvent: false });
      populateHint(code);
    };
  }
}

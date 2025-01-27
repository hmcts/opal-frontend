import { FormArray, FormGroup } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAbstractFormArrayRemovalBaseControlValue } from './interfaces/abstract-form-array-removal-base-control-value.interface';

@Component({
  template: '',
})
export abstract class AbstractFormArrayRemovalComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected getFormArrayControlValue(
    formArray: FormArray,
    controlName: string,
    rowIndex: number,
    defaultValue: IAbstractFormArrayRemovalBaseControlValue[keyof IAbstractFormArrayRemovalBaseControlValue],
  ): IAbstractFormArrayRemovalBaseControlValue[keyof IAbstractFormArrayRemovalBaseControlValue] {
    const value = formArray.controls[rowIndex]?.get(controlName)?.value;

    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }

    return value ?? defaultValue;
  }

  /**
   * Removes a control from the given form array at the specified index and renumbers the remaining controls.
   *
   * @param formArray - The form array from which to remove the control.
   * @param removeIndex - The index of the control to remove.
   * @param fieldNames - The names of the fields associated with the controls.
   * @param dynamicFieldPrefix - The prefix used for dynamically generated field names.
   */
  protected removeControlAndRenumber(
    formArray: FormArray,
    removeIndex: number,
    fieldNames: string[],
    dynamicFieldPrefix: string,
  ): void {
    formArray.removeAt(removeIndex);
    this.renumberControls(formArray, removeIndex, fieldNames, dynamicFieldPrefix);
  }

  /**
   * Renumber the controls in a FormArray starting from a specific index.
   * This method updates the control keys of each FormGroup within the FormArray.
   *
   * @param formArray - The FormArray to renumber the controls for.
   * @param startIndex - The index to start renumbering the controls from.
   * @param fieldNames - The names of the fields in the FormGroup.
   * @param dynamicFieldPrefix - The prefix to use for dynamic field names.
   */
  protected renumberControls(
    formArray: FormArray,
    startIndex: number,
    fieldNames: string[],
    dynamicFieldPrefix: string,
  ): void {
    const formGroups = formArray.controls.slice(startIndex);
    for (const [index, formGroup] of formGroups.entries()) {
      this.updateControlKeys(formGroup as FormGroup, index + startIndex, fieldNames, dynamicFieldPrefix);
    }
  }

  /**
   * Updates the control keys in a form group based on the provided parameters.
   * @param formGroup - The form group to update.
   * @param index - The index of the form group within an array.
   * @param fieldNames - An array of field names to update.
   * @param dynamicFieldPrefix - The prefix to use for dynamic field keys.
   */
  protected updateControlKeys(
    formGroup: FormGroup,
    index: number,
    fieldNames: string[],
    dynamicFieldPrefix: string,
  ): void {
    fieldNames.forEach((field) => {
      const currentKey = `${dynamicFieldPrefix}_${field}_${index + 1}`;
      const newKey = `${dynamicFieldPrefix}_${field}_${index}`;

      // Retrieve the current control, if it exists
      const control = formGroup.get(currentKey);

      if (control) {
        // Remove the old control first, then add it with the new key
        formGroup.removeControl(currentKey);

        // Add the control with the updated key
        formGroup.addControl(newKey, control);
      }
    });
  }

  /**
   * Handles route with the supplied route
   *
   * @param route string of route
   * @param nonRelative boolean indicating if route is relative to the parent
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (nonRelative) {
      this.router.navigate([route]);
    } else {
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }
}

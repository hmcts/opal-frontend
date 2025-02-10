import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractFormBaseComponent } from '../abstract-form-base/abstract-form-base.component';
import { IAbstractFormArrayControls } from '../interfaces/abstract-form-array-controls.interface';
import { IAbstractFormArrayControlValidation } from '../interfaces/abstract-form-array-control-validation.interface';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { IAbstractFormArrayControl } from '../interfaces/abstract-form-array-control.interface';

@Component({
  template: '',
})
export abstract class AbstractFormArrayBaseComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  public formArrayControls: IAbstractFormArrayControls[] = [];
  public formArrayControlsValidation: IAbstractFormArrayControlValidation[] = [];
  public formArrayFields: string[] = [];

  /**
   * Builds an array of form controls for a form array.
   *
   * @param formControlCount - An array of numbers representing the number of form controls to create.
   * @param formArrayName - The name of the form array.
   * @param fieldNames - An array of field names for the form controls.
   * @param controlValidation - An array of control validation configurations.
   * @returns An array of form controls for the form array.
   */
  private buildFormArrayControls(
    formControlCount: number[],
    formArrayName: string,
    fieldNames: string[],
    controlValidation: IAbstractFormArrayControlValidation[],
  ): IAbstractFormArrayControls[] {
    // Directly map each index to a control
    return formControlCount.map((_element, index) =>
      this.addFormArrayControls(index, formArrayName, fieldNames, controlValidation),
    );
  }

  /**
   * Adds form array controls to the specified form array.
   *
   * @param index - The index at which the form array controls should be added.
   * @param formArrayName - The name of the form array.
   * @param fieldNames - The names of the form controls to be created.
   * @param controlValidation - The validation rules for the form controls.
   * @returns An object containing the form controls that were added.
   */
  private addFormArrayControls(
    index: number,
    formArrayName: string,
    fieldNames: string[],
    controlValidation: IAbstractFormArrayControlValidation[],
  ): { [key: string]: IAbstractFormArrayControl } {
    const formArray = this.form.get(formArrayName) as FormArray;
    const formArrayFormGroup = new FormGroup({});

    // Create the form controls...
    const controls = this.createFormArrayControls(fieldNames, index);

    // Add the controls to the form group...
    this.addControlsToFormGroup(formArrayFormGroup, controlValidation, index);

    // Add the form group to the form array...
    formArray.push(formArrayFormGroup);

    // Return the form controls...
    return controls;
  }

  /**
   * Creates a new instance of FormArray with the specified validators and controls.
   *
   * @param validators - An array of validator functions to be applied to the form array.
   * @param controls - An optional array of form controls to initialize the form array with.
   * @returns A new instance of FormArray.
   */
  protected createFormArray(validators: ValidatorFn[], controls: FormControl[] = []): FormArray {
    return new FormArray(controls, { validators: [...validators] });
  }

  /**
   * Sets up the form array form controls based on the provided parameters.
   *
   * @param formArrayCountArray - An array of numbers representing the count of form array controls.
   * @param formArrayName - The name of the form array.
   */
  protected setupFormArrayFormControls(formArrayCountArray: number[], formArrayName: string): void {
    if (formArrayCountArray.length) {
      this.formArrayControls = this.buildFormArrayControls(
        formArrayCountArray,
        formArrayName,
        this.formArrayFields,
        this.formArrayControlsValidation,
      );
    }
  }

  /**
   * Creates an object with form array controls based on the given fields and index.
   *
   * @param fields - An array of field names.
   * @param index - The index of the form array.
   * @returns An object with form array controls.
   */
  protected createFormArrayControls(fields: string[], index: number): { [key: string]: IAbstractFormArrayControl } {
    return fields.reduce(
      (controls, field) => ({
        ...controls,
        [field]: {
          inputId: `${field}_${index}`,
          inputName: `${field}_${index}`,
          controlName: `${field}_${index}`,
        },
      }),
      {},
    );
  }

  /**
   * Removes form array controls errors for a specific index.
   *
   * @param index - The index of the form array control.
   * @param formArrayControls - An array of form array controls.
   * @param fieldNames - An array of field names to remove errors from.
   */
  protected removeFormArrayControlsErrors(
    index: number,
    formArrayControls: IAbstractFormArrayControls[],
    fieldNames: string[],
  ): void {
    const formArrayControl = formArrayControls[index];

    if (formArrayControl) {
      fieldNames.forEach((field) => {
        delete this.formControlErrorMessages?.[formArrayControl[field].controlName];
      });
    }
  }

  /**
   * Adds controls to the form array at the specified index.
   *
   * @param index - The index at which the controls should be added.
   * @param formArrayName - The name of the form array.
   */
  public addControlsToFormArray(index: number, formArrayName: string): void {
    this.formArrayControls.push(
      this.addFormArrayControls(index, formArrayName, this.formArrayFields, this.formArrayControlsValidation),
    );
  }

  /**
   * Removes a form array control at the specified index from the given array of form array controls.
   *
   * @param index - The index of the form array control to be removed.
   * @param formArrayControls - The array of form array controls.
   * @returns The updated array of form array controls after removing the specified control.
   */
  protected removeFormArrayControl(
    index: number,
    formArrayControls: IAbstractFormArrayControls[],
  ): IAbstractFormArrayControls[] {
    formArrayControls.splice(index, 1);
    return formArrayControls;
  }

  /**
   * Retrieves the value of a form control or returns a default value if the control is null or undefined.
   *
   * @param control - The form control to retrieve the value from.
   * @param defaultValue - The default value to return if the control is null or undefined.
   * @returns The value of the control if it exists, otherwise the default value.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getControlValueOrDefault(control: AbstractControl | null, defaultValue: any): any {
    return control?.value || defaultValue;
  }

  /**
   * Removes a form array control at the specified index and updates the form array controls and errors.
   *
   * @param index - The index of the form array control to remove.
   * @param formArrayName - The name of the form array.
   * @param formArrayControls - The list of form array controls.
   * @param fieldNames - The names of the fields associated with the form array controls.
   * @returns The updated list of form array controls.
   */
  public removeFormArrayControls(
    index: number,
    formArrayName: string,
    formArrayControls: IAbstractFormArrayControls[],
    fieldNames: string[],
  ): IAbstractFormArrayControls[] {
    // Get the form array...
    const control = this.form.get(formArrayName) as FormArray;

    // Remove the form array control based on index
    control.removeAt(index);

    // Then remove the form array controls errors...
    this.removeFormArrayControlsErrors(index, formArrayControls, fieldNames);

    // Return the new list of form array controls...
    return this.removeFormArrayControl(index, formArrayControls);
  }

  /**
   * Removes controls from a form array at the specified index.
   *
   * @param index - The index at which to remove the controls.
   * @param formArrayName - The name of the form array.
   */
  public removeControlsFromFormArray(index: number, formArrayName: string): void {
    this.formArrayControls = this.removeFormArrayControls(
      index,
      formArrayName,
      this.formArrayControls,
      this.formArrayFields,
    );
  }

  /**
   * Removes a form array control from the specified form array.
   *
   * @param formArrayControl - The form array control to remove.
   * @param formArrayName - The name of the form array.
   */
  public removeFormArrayControlFromArray(formArrayControl: IAbstractFormArrayControls, formArrayName: string): void {
    const formArrayControlIndex = this.formArrayControls.findIndex((control) => control === formArrayControl);
    this.removeFormArrayControls(formArrayControlIndex, formArrayName, this.formArrayControls, this.formArrayFields);
  }

  /**
   * Retrieves the FormGroup at the specified index from a FormArray.
   *
   * @param index - The index of the FormGroup to retrieve.
   * @param formArrayName - The name of the FormArray.
   * @returns The FormGroup at the specified index.
   */
  public getFormArrayFormGroup(index: number, formArrayName: string): FormGroup {
    const formArray = this.form.get(formArrayName) as FormArray;
    return formArray.controls[index] as FormGroup;
  }

  /**
   * Retrieves the FormControl from a FormGroup within a FormArray at the specified index.
   *
   * @param formGroup - The FormGroup containing the FormControl.
   * @param controlName - The name of the FormControl.
   * @param index - The index of the FormArray.
   * @returns The FormControl at the specified index.
   */
  public getFormArrayFormGroupControl(formGroup: FormGroup, controlName: string, index: number): FormControl {
    return formGroup.controls[`${controlName}_${index}`] as FormControl;
  }

  /**
   * Adds validators to a specific form control within a form array group.
   *
   * @param formGroup - The form group containing the form array.
   * @param controlName - The name of the form control within the form array group.
   * @param index - The index of the form array group within the form array.
   * @param validators - An array of validator functions to be added to the form control.
   */
  public addFormArrayFormGroupControlValidators(formControl: FormControl, validators: ValidatorFn[]): void {
    formControl.setValidators(validators);
    formControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Removes validators from a specific form control within a form array group.
   * @param formGroup - The form group containing the form array.
   * @param controlName - The name of the form control within the form array group.
   * @param index - The index of the form array group within the form array.
   */
  public removeFormArrayFormGroupControlValidators(formControl: FormControl): void {
    formControl.clearValidators();
    formControl.setErrors(null);
    formControl.setValue(null, { emitEvent: false });
    formControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Reverses the form array data by appending the index to each key in the objects.
   *
   * @param data - An array of objects containing form data.
   * @returns An array of objects with keys modified to include their index in the original array.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addIndexToFormArrayData(data: any[]): { [key: string]: any }[] {
    return data.map((item, index) =>
      Object.entries(item).reduce(
        (indexedObject, [key, value]) => {
          if (value !== undefined) {
            indexedObject[`${key}_${index}`] = value;
          }
          return indexedObject;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as { [key: string]: any },
      ),
    );
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    super.ngOnDestroy();
  }
}

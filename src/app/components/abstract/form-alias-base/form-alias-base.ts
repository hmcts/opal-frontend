import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { IFormArrayControl, IFormArrayControlValidation, IFormArrayControls } from '@interfaces';
import { FormBaseComponent } from '../form-base/form-base.component';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  standalone: true,
  template: '',
})
export abstract class FormAliasBaseComponent extends FormBaseComponent implements OnInit, OnDestroy {
  private addAliasListener!: Subscription | undefined;
  public aliasControls: { [key: string]: IFormArrayControl }[] = [];
  public aliasControlsValidation: IFormArrayControlValidation[] = [];
  public aliasFields: string[] = [];

  /**
   * Sets up the listener for the alias checkbox.
   * This method ensures any existing subscription is cleared to avoid memory leaks.
   * It subscribes to the value changes of the 'addAlias' control in the form,
   * and updates the alias controls based on the value of the checkbox.
   */
  private setUpAliasCheckboxListener(): void {
    // Ensure any existing subscription is cleared to avoid memory leaks
    this.addAliasListener?.unsubscribe();

    const addAliasControl = this.form.get('addAlias');
    if (!addAliasControl) {
      return;
    }

    this.addAliasListener = addAliasControl.valueChanges.subscribe((shouldAddAlias) => {
      this.aliasControls = shouldAddAlias
        ? this.buildFormArrayControls([0], 'aliases', this.aliasFields, this.aliasControlsValidation)
        : this.removeAllFormArrayControls(this.aliasControls, 'aliases', this.aliasFields);
    });
  }

  /**
   * Adds controls to a form group.
   *
   * @param formGroup - The form group to add controls to.
   * @param controls - An array of form array control validations.
   * @param index - The index of the form array control.
   */
  private addControlsToFormGroup(formGroup: FormGroup, controls: IFormArrayControlValidation[], index: number): void {
    controls.forEach(({ controlName, validators }) => {
      formGroup.addControl(`${controlName}_${index}`, new FormControl(null, validators));
    });
  }

  /**
   * Sets up the aliases for the personal details form.
   * Re-populates the alias controls if there are any aliases.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected setupAliasFormControls(aliases: any[]): void {
    // Re-populate the alias controls if there are any aliases
    if (aliases.length) {
      this.aliasControls = this.buildFormArrayControls(
        [...Array(aliases.length).keys()],
        'aliases',
        this.aliasFields,
        this.aliasControlsValidation,
      );
    }
  }

  /**
   * Removes a form array control at the specified index from the given array of form array controls.
   *
   * @param index - The index of the form array control to remove.
   * @param formArrayControls - The array of form array controls.
   * @returns The updated array of form array controls after removing the control.
   */
  protected removeFormArrayControl(index: number, formArrayControls: IFormArrayControls[]): IFormArrayControls[] {
    formArrayControls.splice(index, 1);
    return formArrayControls;
  }

  /**
   * Creates form controls based on the given fields and index.
   * @param fields - An array of field names.
   * @param index - The index value.
   * @returns An object containing form controls configuration.
   */
  protected createControls(fields: string[], index: number): { [key: string]: IFormArrayControl } {
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
   * Builds an array of form array controls based on the provided parameters.
   *
   * @param formControlCount - An array of numbers representing the number of form controls to create for each index.
   * @param formArrayName - The name of the form array.
   * @param fieldNames - An array of field names for the form controls.
   * @param controlValidation - An array of control validation objects for the form controls.
   * @returns An array of form array controls.
   */
  protected buildFormArrayControls(
    formControlCount: number[],
    formArrayName: string,
    fieldNames: string[],
    controlValidation: IFormArrayControlValidation[],
  ): IFormArrayControls[] {
    // Directly map each index to a control
    return formControlCount.map((_element, index) =>
      this.addFormArrayControls(index, formArrayName, fieldNames, controlValidation),
    );
  }

  /**
   * Removes all form array controls and clears error messages for the specified form array.
   *
   * @param formArrayControls - The array of form array controls to be removed.
   * @param formArrayName - The name of the form array.
   * @param fieldNames - The names of the fields associated with the form array controls.
   * @returns An empty array of form array controls.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected removeAllFormArrayControls(formArrayControls: any[], formArrayName: string, fieldNames: string[]): any[] {
    const control = this.form.get(formArrayName) as FormArray;

    // Clear the error messages...
    [...formArrayControls].forEach((_element, index) => {
      this.removeFormArrayControlsErrors(index, formArrayControls, fieldNames);
    });

    // Reset the form array controls...
    control.clear();

    // Return en empty array of form array controls...
    return [];
  }

  /**
   * Removes the form array controls errors for the specified index and field names.
   * @param index - The index of the form array control.
   * @param formArrayControls - The array of form array controls.
   * @param fieldNames - The names of the fields to remove errors from.
   */
  protected removeFormArrayControlsErrors(
    index: number,
    formArrayControls: IFormArrayControls[],
    fieldNames: string[],
  ): void {
    // Get the controls from the form array...
    const formArrayControl = formArrayControls[index];

    if (formArrayControl) {
      // Loop over the field names and remove the field errors...
      fieldNames.forEach((field) => {
        if (this.formControlErrorMessages?.[formArrayControl[field].controlName]) {
          delete this.formControlErrorMessages[formArrayControl[field].controlName];
        }
      });
    }
  }

  /**
   * Adds form array controls to a form array and returns the form controls.
   *
   * @param index - The index at which to add the form array controls.
   * @param formArrayName - The name of the form array.
   * @param fieldNames - An array of field names for the form controls.
   * @param controlValidation - An array of control validation configurations.
   * @returns An object containing the form controls added to the form array.
   */
  public addFormArrayControls(
    index: number,
    formArrayName: string,
    fieldNames: string[],
    controlValidation: IFormArrayControlValidation[],
  ): { [key: string]: IFormArrayControl } {
    const formArray = this.form.get(formArrayName) as FormArray;
    const formArrayFormGroup = new FormGroup({});

    // Create the form controls...
    const controls = this.createControls(fieldNames, index);

    // Add the controls to the form group...
    this.addControlsToFormGroup(formArrayFormGroup, controlValidation, index);

    // Add the form group to the form array...
    formArray.push(formArrayFormGroup);

    // Return the form controls...
    return controls;
  }

  /**
   * Removes a form array control at the specified index and updates the list of form array controls.
   *
   * @param index - The index of the form array control to remove.
   * @param formArrayName - The name of the form array.
   * @param formArrayControls - The list of form array controls.
   * @param fieldNames - The names of the fields in the form array control.
   * @returns The updated list of form array controls.
   */
  public removeFormArrayControls(
    index: number,
    formArrayName: string,
    formArrayControls: IFormArrayControls[],
    fieldNames: string[],
  ): IFormArrayControls[] {
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
   * Adds an alias to the aliasControls form array.
   *
   * @param index - The index at which to add the alias.
   */
  public addAlias(index: number): void {
    this.aliasControls.push(
      this.addFormArrayControls(index, 'aliases', this.aliasFields, this.aliasControlsValidation),
    );
  }

  /**
   * Removes an alias from the aliasControls array.
   *
   * @param index - The index of the alias to remove.
   */
  public removeAlias(index: number): void {
    this.aliasControls = this.removeFormArrayControls(index, 'aliases', this.aliasControls, this.aliasFields);
  }

  public override ngOnInit(): void {
    this.setUpAliasCheckboxListener();
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.addAliasListener?.unsubscribe();
    super.ngOnDestroy();
  }
}

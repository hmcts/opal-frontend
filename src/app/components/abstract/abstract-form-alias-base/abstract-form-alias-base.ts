import { AbstractFormBaseComponent } from '../abstract-form-base/abstract-form-base.component';
import { takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IAbstractFormAliasBaseAliasControls } from './interfaces/abstract-form-alias-base-alias-controls.interface';
import { IAbstractFormArrayControlValidation } from '../interfaces/abstract-form-array-control-validation.interface';
import { IAbstractFormArrayControls } from '../interfaces/abstract-form-array-controls.interface';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { IAbstractFormArrayControl } from '../interfaces/abstract-form-array-control.interface';

@Component({
  template: '',
})
export abstract class AbstractFormAliasBaseComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  public aliasControls: IAbstractFormAliasBaseAliasControls[] = [];
  public aliasControlsValidation: IAbstractFormArrayControlValidation[] = [];
  public aliasFields: string[] = [];

  /**
   * Builds an array of form controls for the given form array.
   *
   * @param formControlCount - An array of numbers representing the number of form controls to create.
   * @param formArrayName - The name of the form array.
   * @param fieldNames - An array of field names.
   * @param controlValidation - An array of control validation objects.
   * @returns An array of form controls for the given form array.
   */
  private buildFormAliasControls(
    formControlCount: number[],
    formArrayName: string,
    fieldNames: string[],
    controlValidation: IAbstractFormArrayControlValidation[],
  ): IAbstractFormArrayControls[] {
    // Directly map each index to a control
    return formControlCount.map((_element, index) =>
      this.addAliasControls(index, formArrayName, fieldNames, controlValidation),
    );
  }

  /**
   * Adds alias controls to the form array.
   *
   * @param index - The index of the form array.
   * @param formArrayName - The name of the form array.
   * @param fieldNames - The names of the fields for the alias controls.
   * @param controlValidation - The validation rules for the alias controls.
   * @returns An object containing the form controls.
   */
  private addAliasControls(
    index: number,
    formArrayName: string,
    fieldNames: string[],
    controlValidation: IAbstractFormArrayControlValidation[],
  ): { [key: string]: IAbstractFormArrayControl } {
    const formAliases = this.form.get(formArrayName) as FormArray;
    const formAliasesFormGroup = new FormGroup({});

    // Create the form controls...
    const controls = this.createAliasControls(fieldNames, index);

    // Add the controls to the form group...
    this.addControlsToFormGroup(formAliasesFormGroup, controlValidation, index);

    // Add the form group to the form array...
    formAliases.push(formAliasesFormGroup);

    // Return the form controls...
    return controls;
  }

  /**
   * Removes all form alias controls from a FormArray and clears any associated error messages.
   *
   * @param formArrayControls - An array of form array controls.
   * @param formArrayName - The name of the FormArray.
   * @param fieldNames - An array of field names associated with the form array controls.
   * @returns An empty array of form array controls.
   */
  private removeAllFormAliasControls(
    formArrayControls: IAbstractFormArrayControls[],
    formArrayName: string,
    fieldNames: string[],
  ): [] {
    const control = this.form.get(formArrayName) as FormArray;

    // Clear the error messages...
    [...formArrayControls].forEach((_element, index) => {
      this.removeFormAliasControlsErrors(index, formArrayControls, fieldNames);
    });

    // Reset the form array controls...
    control.clear();

    // Return en empty array of form array controls...
    return [];
  }

  /**
   * Creates a FormArray with the specified validators and controls.
   *
   * @param validators - An array of validators to apply to the FormArray.
   * @param controls - An optional array of initial FormControl instances to add to the FormArray.
   * @returns A new FormArray instance.
   */
  protected createFormAlias(validators: ValidatorFn[], controls: FormControl[] = []): FormArray {
    return new FormArray(controls, { validators: [...validators] });
  }

  /**
   * Removes a form alias control at the specified index from the given form array controls.
   *
   * @param index - The index of the form alias control to remove.
   * @param formArrayControls - The array of form array controls.
   * @returns The updated array of form array controls after removing the specified control.
   */
  protected removeFormAliasControl(
    index: number,
    formArrayControls: IAbstractFormArrayControls[],
  ): IAbstractFormArrayControls[] {
    formArrayControls.splice(index, 1);
    return formArrayControls;
  }

  /**
   * Sets up the alias form controls based on the provided alias count array and form array name.
   * If there are any aliases, the alias controls will be re-populated.
   *
   * @param aliasCountArray - An array containing the count of aliases.
   * @param formArrayName - The name of the form array.
   */
  protected setupAliasFormControls(aliasCountArray: number[], formArrayName: string): void {
    // Re-populate the alias controls if there are any aliases
    if (aliasCountArray.length) {
      this.aliasControls = this.buildFormAliasControls(
        aliasCountArray,
        formArrayName,
        this.aliasFields,
        this.aliasControlsValidation,
      );
    }
  }

  /**
   * Removes the form alias controls errors for a specific index in a form array.
   *
   * @param index - The index of the form array control.
   * @param formArrayControls - An array of form array controls.
   * @param fieldNames - An array of field names to remove errors from.
   */
  protected removeFormAliasControlsErrors(
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
   * Creates alias controls for the given fields and index.
   * @param fields - The list of fields for which alias controls need to be created.
   * @param index - The index value used to generate unique identifiers for the controls.
   * @returns An object containing the alias controls.
   */
  protected createAliasControls(fields: string[], index: number): { [key: string]: IAbstractFormArrayControl } {
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
   * Sets up the alias checkbox listener.
   *
   * @param formCheckboxName - The name of the checkbox control in the form.
   * @param formArrayName - The name of the form array control in the form.
   */
  protected setUpAliasCheckboxListener(formCheckboxName: string, formArrayName: string): void {
    // Ensure any existing subscription is cleared to avoid memory leaks
    this['ngUnsubscribe'].next();
    this['ngUnsubscribe'].complete();

    const addAliasControl = this.form.get(formCheckboxName);
    if (!addAliasControl) {
      return;
    }

    addAliasControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((shouldAddAlias) => {
      this.aliasControls = shouldAddAlias
        ? this.buildFormAliasControls([0], formArrayName, this.aliasFields, this.aliasControlsValidation)
        : this.removeAllFormAliasControls(this.aliasControls, formArrayName, this.aliasFields);
    });
  }

  /**
   * Removes a form alias control from a form array and updates the list of form array controls.
   * @param index - The index of the form alias control to be removed.
   * @param formArrayName - The name of the form array.
   * @param formArrayControls - The list of form array controls.
   * @param fieldNames - The names of the fields associated with the form array controls.
   * @returns The updated list of form array controls after removing the specified control.
   */
  public removeFormAliasControls(
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
    this.removeFormAliasControlsErrors(index, formArrayControls, fieldNames);

    // Return the new list of form array controls...
    return this.removeFormAliasControl(index, formArrayControls);
  }

  /**
   * Adds an alias to the specified index of the form array.
   *
   * @param index - The index at which to add the alias.
   * @param formArrayName - The name of the form array.
   */
  public addAlias(index: number, formArrayName: string): void {
    this.aliasControls.push(
      this.addAliasControls(index, formArrayName, this.aliasFields, this.aliasControlsValidation),
    );
  }

  /**
   * Removes an alias from the form array.
   *
   * @param index - The index of the alias to remove.
   * @param formArrayName - The name of the form array.
   */
  public removeAlias(index: number, formArrayName: string): void {
    this.aliasControls = this.removeFormAliasControls(index, formArrayName, this.aliasControls, this.aliasFields);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this['ngUnsubscribe'].next();
    this['ngUnsubscribe'].complete();
    super.ngOnDestroy();
  }
}

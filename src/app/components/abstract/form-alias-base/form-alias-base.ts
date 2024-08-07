import { IFormArrayControl, IFormArrayControlValidation } from '@interfaces';
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
   * Sets up the aliases for the personal details form.
   * Re-populates the alias controls if there are any aliases.
   */
  protected setupAliasFormControls(aliasCountArray: number[], formArrayName: string): void {
    // Re-populate the alias controls if there are any aliases
    if (aliasCountArray.length) {
      this.aliasControls = this.buildFormArrayControls(
        aliasCountArray,
        formArrayName,
        this.aliasFields,
        this.aliasControlsValidation,
      );
    }
  }

  /**
   * Sets up the listener for the alias checkbox.
   * This method ensures any existing subscription is cleared to avoid memory leaks.
   * It subscribes to the value changes of the 'addAlias' control in the form,
   * and updates the alias controls based on the value of the checkbox.
   */
  protected setUpAliasCheckboxListener(formCheckboxName: string, formArrayName: string): void {
    // Ensure any existing subscription is cleared to avoid memory leaks
    this.addAliasListener?.unsubscribe();

    const addAliasControl = this.form.get(formCheckboxName);
    if (!addAliasControl) {
      return;
    }

    this.addAliasListener = addAliasControl.valueChanges.subscribe((shouldAddAlias) => {
      this.aliasControls = shouldAddAlias
        ? this.buildFormArrayControls([0], formArrayName, this.aliasFields, this.aliasControlsValidation)
        : this.removeAllFormArrayControls(this.aliasControls, formArrayName, this.aliasFields);
    });
  }

  /**
   * Adds an alias to the aliasControls form array.
   *
   * @param index - The index at which to add the alias.
   */
  public addAlias(index: number, formArrayName: string): void {
    this.aliasControls.push(
      this.addFormArrayControls(index, formArrayName, this.aliasFields, this.aliasControlsValidation),
    );
  }

  /**
   * Removes an alias from the aliasControls array.
   *
   * @param index - The index of the alias to remove.
   */
  public removeAlias(index: number, formArrayName: string): void {
    this.aliasControls = this.removeFormArrayControls(index, formArrayName, this.aliasControls, this.aliasFields);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.addAliasListener?.unsubscribe();
    super.ngOnDestroy();
  }
}

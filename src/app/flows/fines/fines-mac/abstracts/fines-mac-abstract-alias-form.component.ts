import { Component, ElementRef, inject, Injector } from '@angular/core';
import { type Signal } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { AbstractFormAliasBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-alias-base';
import { toObservable } from '@angular/core/rxjs-interop';
import { takeUntil } from 'rxjs';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { removeAliasAndRestoreState } from '../../utils/fines-alias-renumbering.utils';

/**
 * Shared alias-removal behaviour for MAC forms.
 */
@Component({
  template: '',
})
export abstract class FinesMacAbstractAliasFormComponent extends AbstractFormAliasBaseComponent {
  protected abstract readonly aliasFormArrayName: string;

  private readonly injector = inject(Injector);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected watchOptionalMaxLengthFeatureFlag<T>(
    featureFlags: Signal<T>,
    controlName: string,
    getConfig: () => { maxLength: number; errorMessage: string },
  ): void {
    toObservable(featureFlags, { injector: this.injector })
      .pipe(takeUntil(this['ngUnsubscribe']))
      .subscribe(() => {
        const config = getConfig();
        const control = this.form.get(controlName);

        if (control) {
          control.setValidators([optionalMaxLengthValidator(config.maxLength)]);
          control.updateValueAndValidity({ emitEvent: false });
        }

        const fieldError = this.fieldErrors[controlName];
        this.fieldErrors = {
          ...this.fieldErrors,
          [controlName]: {
            ...fieldError,
            maxlength: {
              ...fieldError['maxlength'],
              message: config.errorMessage,
            },
          },
        };
        this.setInitialErrorMessages();
      });
  }

  public get aliasFormGroups(): AbstractControl[] {
    return (this.form.get(this.aliasFormArrayName) as FormArray).controls;
  }

  public removeAndRenumberAlias(index: number): void {
    const formArrayName = this.aliasFormArrayName;

    this.aliasControls = removeAliasAndRestoreState({
      aliases: this.form.get(formArrayName) as FormArray,
      aliasFields: this.aliasFields,
      index,
      formArrayName,
      errorSummaryCount: this.formErrorSummaryMessage.length,
      errorMessages: this.formControlErrorMessages,
      removeAlias: (aliasIndex) => this.removeAlias(aliasIndex, formArrayName),
      createAliasControls: (rowIndex) => this.createAliasControls(this.aliasFields, rowIndex),
      refreshErrors: () => this.handleErrorMessages(),
      elementRef: this.elementRef,
      injector: this.injector,
    });
  }
}

import { afterNextRender, ElementRef, Injector } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

/**
 * Renumbers alias FormGroup control keys to match their current positions.
 * Preserves existing controls, values and validators.
 *
 * @param aliases - The alias FormArray after removal.
 * @param aliasFields - Base control names for each alias field.
 */
export function renumberAliasFormControls(aliases: FormArray, aliasFields: string[]): void {
  aliases.controls.forEach((group, rowIndex) => {
    const aliasGroup = group as FormGroup;

    aliasFields.forEach((fieldName) => {
      const newControlName = `${fieldName}_${rowIndex}`;

      const oldControlName = Object.keys(aliasGroup.controls).find((name) =>
        new RegExp(String.raw`^${fieldName}_\d+$`).test(name),
      );

      if (oldControlName && oldControlName !== newControlName) {
        const existingControl = aliasGroup.controls[oldControlName];

        aliasGroup.removeControl(oldControlName);
        aliasGroup.addControl(newControlName, existingControl);
      }
    });
  });
}

/**
 * Removes an alias, renumbers the remaining controls,
 * and rebuilds the corresponding alias metadata.
 */
export function removeAndRenumberAliasControls<T>(
  aliases: FormArray,
  aliasFields: string[],
  index: number,
  removeAlias: (index: number) => void,
  createAliasControls: (index: number) => T,
): T[] {
  removeAlias(index);

  renumberAliasFormControls(aliases, aliasFields);

  return aliases.controls.map((_, rowIndex) => createAliasControls(rowIndex));
}

/**
 * Restores focus to a surviving Remove alias button,
 * or to Add another alias when no Remove buttons remain.
 *
 * @param container - The alias section containing the buttons.
 * @param removedIndex - Index of the removed alias.
 */

export function focusAfterAliasRemoval(container: HTMLElement, removedIndex: number): void {
  const removeButtons = container.querySelectorAll<HTMLButtonElement>('.moj-add-another__remove-button');

  if (removeButtons.length > 0) {
    const focusIndex = Math.min(removedIndex, removeButtons.length - 1);
    removeButtons[focusIndex].focus();
    return;
  }

  container.querySelector<HTMLButtonElement>('#addAlias')?.focus();
}

export interface AliasRemovalOptions<T> {
  aliases: FormArray;
  aliasFields: string[];
  index: number;
  formArrayName: string;
  errorSummaryCount: number;
  errorMessages: Record<string, string | null>;
  removeAlias: (index: number) => void;
  createAliasControls: (index: number) => T;
  refreshErrors: () => void;
  elementRef: ElementRef<HTMLElement>;
  injector: Injector;
}

/**
 * Removes an alias and restores validation and keyboard focus state.
 */
export function removeAliasAndRestoreState<T>(options: AliasRemovalOptions<T>): T[] {
  const {
    aliases,
    aliasFields,
    index,
    formArrayName,
    errorSummaryCount,
    errorMessages,
    removeAlias,
    createAliasControls,
    refreshErrors,
    elementRef,
    injector,
  } = options;

  const hadDisplayedErrors = errorSummaryCount > 0 || Object.values(errorMessages).some((message) => message != null);

  const controls = removeAndRenumberAliasControls(aliases, aliasFields, index, removeAlias, createAliasControls);

  if (hadDisplayedErrors) {
    refreshErrors();
  }

  afterNextRender(
    () => {
      const container = elementRef.nativeElement.querySelector<HTMLElement>(`[formArrayName="${formArrayName}"]`);

      if (container) {
        focusAfterAliasRemoval(container, index);
      }
    },
    { injector },
  );

  return controls;
}

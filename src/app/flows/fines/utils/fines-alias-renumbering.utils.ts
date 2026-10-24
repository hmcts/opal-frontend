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

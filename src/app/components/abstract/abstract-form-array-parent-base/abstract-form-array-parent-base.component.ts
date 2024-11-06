import { AbstractFormParentBaseComponent } from '../abstract-form-parent-base/abstract-form-parent-base.component';

export abstract class AbstractFormArrayParentBaseComponent extends AbstractFormParentBaseComponent {
  /**
   * Removes index suffixes from keys in an array of objects and restructures the data.
   *
   * This function takes an array of objects where keys have an index suffix (e.g., `key_0`, `key_1`),
   * and returns a new array of objects where the keys are grouped by their base name without the index.
   *
   * @param data - The array of objects with indexed keys.
   * @returns A new array of objects with keys grouped by their base name.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeIndexFromFormArrayData(data: any[]): any[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.reduce((result: any[], indexedObject) => {
      let currentIndex!: number;
      Object.keys(indexedObject).forEach((key) => {
        const match = RegExp(/^(.*)_(\d+)$/).exec(key);
        if (match) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, baseKey, index] = match;
          const idx = parseInt(index, 10);

          currentIndex = idx; // Set the current index based on the last indexed key

          result[idx] = result[idx] || {};
          result[idx][baseKey] = indexedObject[key];
        } else {
          // For non-indexed keys, use the currentIndex if available
          result[currentIndex] = result[currentIndex] || {};
          result[currentIndex][key] = indexedObject[key];
        }
      });
      return result;
    }, []);
  }
}

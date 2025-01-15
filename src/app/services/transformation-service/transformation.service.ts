import { inject, Injectable } from '@angular/core';
import { DateService } from '@services/date-service/date.service';
import { ITransformItem } from './interfaces/transform-item.interface';

@Injectable({
  providedIn: 'root',
})
export class TransformationService {
  private readonly dateService = inject(DateService);

  /**
   * Applies a transformation to the given value based on the specified transformation configuration.
   *
   * @param value - The value to be transformed.
   * @param transformItem - The configuration for the transformation, including the type of transformation and any necessary format details.
   * @returns The transformed value, or the original value if no transformation is applied.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyTransformation(value: any, transformItem: ITransformItem): any {
    if (!value) {
      return value;
    }

    if (transformItem.transformType === 'date') {
      if (transformItem.dateInputFormat !== null && transformItem.dateOutputFormat !== null) {
        const parsedDate = this.dateService.getFromFormat(value, transformItem.dateInputFormat);
        if (this.dateService.isValidDate(parsedDate)) {
          return this.dateService.toFormat(parsedDate, transformItem.dateOutputFormat);
        }
      }
      return value;
    }

    return value;
  }

  /**
   * Transforms the values of an object based on a given transformation configuration.
   *
   * @param obj - The object whose values need to be transformed. It should be a non-null object.
   * @param toTransform - An array of transformation configurations, where each configuration specifies
   *                      the key to transform and the transformation details.
   * @returns The transformed object with values modified according to the transformation configuration.
   *
   * @remarks
   * - If the input `obj` is not an object or is null, it returns the input as is.
   * - The function recursively processes nested objects.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transformObjectValues(obj: { [key: string]: any }, toTransform: ITransformItem[]): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const [key, value] of Object.entries(obj)) {
      const transformItem = toTransform.find((item) => item.key === key);

      if (transformItem) {
        obj[key] = this.applyTransformation(value, transformItem);
      } else if (Array.isArray(value)) {
        obj[key] = value.map((item) =>
          typeof item === 'object' ? this.transformObjectValues(item, toTransform) : item,
        );
      } else if (typeof value === 'object') {
        obj[key] = this.transformObjectValues(value, toTransform); // Recursive call
      }
    }
    return obj;
  }

  /**
   * Transforms an object or array of objects from camelCase to snake_case.
   *
   * @param camelCaseObject - The object or array of objects to be transformed.
   * @returns The transformed object or array with keys in snake_case.
   *
   * @example
   * ```typescript
   * const camelCaseObject = {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   address: {
   *     streetName: 'MainStreet',
   *     zipCode: '12345'
   *   }
   * };
   *
   * const snakeCaseObject = transformCamelToSnakeCase(camelCaseObject);
   * console.log(snakeCaseObject);
   * // Output:
   * // {
   * //   first_name: 'John',
   * //   last_name: 'Doe',
   * //   address: {
   * //     street_name: 'MainStreet',
   * //     zip_code: '12345'
   * //   }
   * // }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transformCamelToSnakeCase(camelCaseObject: any): any {
    if (Array.isArray(camelCaseObject)) {
      return camelCaseObject.map((item) => this.transformCamelToSnakeCase(item));
    }

    if (camelCaseObject !== null && typeof camelCaseObject === 'object') {
      return Object.entries(camelCaseObject).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        acc[snakeKey] = this.transformCamelToSnakeCase(value);
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any);
    }

    return camelCaseObject;
  }
}

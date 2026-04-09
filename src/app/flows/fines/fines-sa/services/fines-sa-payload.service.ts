import { inject, Injectable } from '@angular/core';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';

import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FinesSaPayloadService {
  private readonly transformationService = inject(TransformationService);

  /**

   * Transforms the given finesSaPayload object by applying the transformations
   * defined in the FINES_SA_BUILD_TRANSFORM_ITEMS_CONFIG.
   *
   * @param finesSaPayload - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public transformPayload<T extends { [key: string]: any }>(
    finesSaPayload: T,
    transformItemsConfig: ITransformItem[],
  ): T {
    return this.transformationService.transformObjectValues(finesSaPayload, transformItemsConfig);
  }
}

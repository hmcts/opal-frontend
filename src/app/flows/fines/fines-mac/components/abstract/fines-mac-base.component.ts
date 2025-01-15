export abstract class FinesMacBaseComponent<TService> {
  /**
   * Resolves a nested key in an object.
   *
   * @param obj - The object to search.
   * @param key - The nested key (e.g., `finesDraftState.account_status`).
   * @returns The value at the nested key, or undefined if not found.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  /**
   * Sets a nested value within an object based on a dot-separated key string.
   * If any part of the path does not exist, it will be created.
   *
   * @param obj - The object in which to set the value.
   * @param key - The dot-separated key string representing the path to the value.
   * @param value - The value to set at the specified path.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setNestedValue(obj: any, key: string, value: any): void {
    const keys = key.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((acc, k) => (acc[k] ??= {}), obj);
    target[lastKey] = value;
  }

  /**
   * Updates the target state within the provided service.
   *
   * @param service - The service containing the state to be updated.
   * @param statePayload - The data used to update the state.
   * @param stateKey - The key of the state to update (e.g., `finesDraftState`).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected updateServiceState(service: TService, statePayload: any, stateKey: keyof TService): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any)[stateKey] = statePayload;
  }

  /**
   * Retrieves and maps a status from a service's state.
   *
   * @param service - The service containing the state (e.g., FinesService).
   * @param statusKey - The key to retrieve the status from (e.g., `account_status`).
   * @param mappingTable - The table used to map statuses to their descriptions.
   * @returns The mapped status description, or an empty string if not found.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getMappedStatus(service: TService, statusKey: string, mappingTable: any[]): string {
    const statusValue = this.getNestedValue(service, statusKey);
    const matchingStatus = mappingTable.find((status) => status.statuses.includes(statusValue));
    return matchingStatus?.prettyName ?? '';
  }

  /**
   * Maps and assigns data to a target key in the service's state.
   *
   * @param service - The service to update.
   * @param source - The source data to be mapped.
   * @param mappingFunction - A function that defines the mapping logic.
   * @param targetKey - The key in the service to assign the mapped data.
   */
  protected mapAndAssignData(
    service: TService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mappingFunction: (source: any) => any,
    targetKey: keyof TService,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any)[targetKey] = mappingFunction(source);
  }

  /**
   * Updates a nested property in the service's state.
   *
   * @param service - The service to update.
   * @param data - The data to assign.
   * @param targetKey - The nested key to update (e.g., `finesMacState.businessUnit`).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected updateNestedServiceState(service: TService, data: any, targetKey: string): void {
    const keys = targetKey.split('.');
    const lastKey = keys.pop()!; // Extract the final key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = keys.reduce((acc, key) => acc[key] ?? {}, service as any);

    target[lastKey] = data;
  }

  /**
   * Maps data from a source array to a target array within a service object based on matching keys.
   *
   * @template TService - The type of the service object.
   * @param {TService} service - The service object containing the target array.
   * @param {any[]} sourceArray - The array of source data to map from.
   * @param {string} targetKey - The key to access the target array within the service object.
   * @param {string} matchKey - The key used to match items in the target array.
   * @param {string} sourceMatchKey - The key used to match items in the source array.
   * @param {{ sourceKey: string; targetKey: string }[]} mapKeys - An array of objects specifying the keys to map from source to target.
   * @returns {void}
   */
  protected mapArrayData(
    service: TService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sourceArray: any[],
    targetKey: string,
    matchKey: string,
    sourceMatchKey: string,
    mapKeys: { sourceKey: string; targetKey: string }[],
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetArray = this.getNestedValue(service, targetKey) as any[];
    if (!Array.isArray(targetArray)) {
      return;
    }

    targetArray.forEach((targetItem) => {
      const targetMatchValue = this.getNestedValue(targetItem, matchKey);
      const sourceItem = sourceArray.find((source) => targetMatchValue === this.getNestedValue(source, sourceMatchKey));

      mapKeys.forEach(({ sourceKey, targetKey }) => {
        this.setNestedValue(targetItem, targetKey, this.getNestedValue(sourceItem, sourceKey));
      });
    });
  }
}

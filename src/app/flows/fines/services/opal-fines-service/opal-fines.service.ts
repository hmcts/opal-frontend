import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';

import {
  IOpalFinesBusinessUnit,
  IOpalFinesBusinessUnitNonSnakeCase,
  IOpalFinesBusinessUnitRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import {
  IOpalFinesCourt,
  IOpalFinesCourtRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';

import {
  IOpalFinesLocalJusticeArea,
  IOpalFinesLocalJusticeAreaRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';

import { Observable, shareReplay } from 'rxjs';
import {
  IOpalFinesOffencesNonSnakeCase,
  IOpalFinesOffencesRefData,
} from './interfaces/opal-fines-offences-ref-data.interface';
import { IOpalFinesResults, IOpalFinesResultsRefData } from './interfaces/opal-fines-results-ref-data.interface';
import {
  IOpalFinesMajorCreditor,
  IOpalFinesMajorCreditorRefData,
} from './interfaces/opal-fines-major-creditor-ref-data.interface';
import { IFinesMacAddAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { IOpalFinesDraftAccountsResponse } from './interfaces/opal-fines-draft-account-data.interface';
import { IOpalFinesDraftAccountParams } from './interfaces/opal-fines-draft-account-params.interface';
import { IOpalFinesSearchOffencesParams } from './interfaces/opal-fines-search-offences-params.interface';
import { IOpalFinesSearchOffencesData } from './interfaces/opal-fines-search-offences.interface';
import { IFinesMacPatchAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-patch-account.interface';

@Injectable({
  providedIn: 'root',
})
export class OpalFines {
  private readonly http = inject(HttpClient);
  private courtRefDataCache$: { [key: string]: Observable<IOpalFinesCourtRefData> } = {};
  private businessUnitsCache$: { [key: string]: Observable<IOpalFinesBusinessUnitRefData> } = {};
  private localJusticeAreasCache$!: Observable<IOpalFinesLocalJusticeAreaRefData>;
  private resultsCache$!: Observable<IOpalFinesResultsRefData>;
  private offenceCodesCache$: { [key: string]: Observable<IOpalFinesOffencesRefData> } = {};
  private majorCreditorsCache$: { [key: string]: Observable<IOpalFinesMajorCreditorRefData> } = {};
  private draftAccountsCache$: { [key: string]: Observable<IOpalFinesDraftAccountsResponse> } = {};

  private readonly PARAM_BUSINESS_UNIT = 'business_unit';
  private readonly PARAM_STATUS = 'status';
  private readonly PARAM_SUBMITTED_BY = 'submitted_by';
  private readonly PARAM_NOT_SUBMITTED_BY = 'not_submitted_by';
  private readonly PARAM_ACCOUNT_STATUS_DATE_FROM = 'account_status_date_from';
  private readonly PARAM_ACCOUNT_STATUS_DATE_TO = 'account_status_date_to';

  /**
   * Appends an array of values to the given HttpParams object under the specified key.
   *
   * @param params - The HttpParams object to which the values will be appended.
   * @param key - The key under which the values will be appended.
   * @param values - An optional array of string or number values to be appended.
   * @returns The updated HttpParams object with the appended values.
   */
  private appendArrayParams(params: HttpParams, key: string, values?: (string | number)[]): HttpParams {
    if (values) {
      values.forEach((value) => {
        params = params.append(key, value.toString());
      });
    }
    return params;
  }

  /**
   * Generates a unique cache key string for draft accounts based on the provided filter parameters.
   * The key is created by serializing a normalized object containing sorted arrays of filter values,
   * ensuring consistent key generation regardless of input order.
   *
   * @param filters - The filter parameters used to generate the cache key, including business unit IDs,
   *                  statuses, submittedBy, and notSubmittedBy arrays.
   * @returns A string representing the unique cache key for the given filter parameters.
   */
  private generateDraftAccountsCacheKey(filters: IOpalFinesDraftAccountParams): string {
    return JSON.stringify({
      businessUnitIds: [...(filters.businessUnitIds ?? [])].sort((a, b) => a - b),
      statuses: [...(filters.statuses ?? [])].sort((a, b) => a.localeCompare(b)),
      submittedBy: [...(filters.submittedBy ?? [])].sort((a, b) => a.localeCompare(b)),
      notSubmittedBy: [...(filters.notSubmittedBy ?? [])].sort((a, b) => a.localeCompare(b)),
    });
  }

  /**
   * Retrieves the court data for a specific business unit.
   * If the court data is not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   * @param business_unit - The business unit for which to retrieve the court data.
   * @returns An Observable that emits the court data for the specified business unit.
   */
  public getCourts(business_unit: number): Observable<IOpalFinesCourtRefData> {
    if (!this.courtRefDataCache$[business_unit]) {
      this.courtRefDataCache$[business_unit] = this.http
        .get<IOpalFinesCourtRefData>(OPAL_FINES_PATHS.courtRefData, { params: { business_unit } })
        .pipe(shareReplay(1));
    }

    return this.courtRefDataCache$[business_unit];
  }

  /**
   * Returns the pretty name of a court.
   * @param court - The court object.
   * @returns The pretty name of the court.
   */
  public getCourtPrettyName(court: IOpalFinesCourt): string {
    return `${court.name} (${court.court_code})`;
  }

  /**
   * Retrieves the business units based on the specified permission.
   * Business units are cached to prevent multiple requests for the same data.
   * Multiple permission types can be provided, and they will be cached separately.
   * @param permission The permission type for which to retrieve the business units.
   * @returns An Observable that emits the business units.
   */
  public getBusinessUnits(permission: string): Observable<IOpalFinesBusinessUnitRefData> {
    // Business units are cached to prevent multiple requests for the same data.
    // We can have multiple permission types so we need to cache them separately.
    // e.g. ACCOUNT_ENQUIRY, ACCOUNT_ENQUIRY_NOTES, CREATE_MANAGE_DRAFT_ACCOUNTS
    if (!this.businessUnitsCache$[permission]) {
      this.businessUnitsCache$[permission] = this.http
        .get<IOpalFinesBusinessUnitRefData>(OPAL_FINES_PATHS.businessUnitRefData, { params: { permission } })
        .pipe(shareReplay(1));
    }

    return this.businessUnitsCache$[permission];
  }

  /**
   * Retrieves the local justice areas.
   * If the local justice areas are not already cached, it makes an HTTP request to fetch them and caches the result.
   * Subsequent calls to this method will return the cached data.
   * @returns An Observable that emits the local justice areas.
   */
  public getLocalJusticeAreas(): Observable<IOpalFinesLocalJusticeAreaRefData> {
    if (!this.localJusticeAreasCache$) {
      this.localJusticeAreasCache$ = this.http
        .get<IOpalFinesLocalJusticeAreaRefData>(OPAL_FINES_PATHS.localJusticeAreaRefData)
        .pipe(shareReplay(1));
    }

    return this.localJusticeAreasCache$;
  }

  /**
   * Returns the pretty name of a local justice area.
   * @param localJusticeArea - The local justice area object.
   * @returns The pretty name of the local justice area.
   */
  public getLocalJusticeAreaPrettyName(localJusticeArea: IOpalFinesLocalJusticeArea): string {
    return `${localJusticeArea.name} (${localJusticeArea.local_justice_area_id})`;
  }

  /**
   * Retrieves the value of a configuration item for a specific business unit.
   * @param businessUnit - The business unit for which to retrieve the configuration item value.
   * @param itemName - The name of the configuration item.
   * @returns The value of the configuration item, or null if the item is not found.
   */
  public getConfigurationItemValue(businessUnit: IOpalFinesBusinessUnit, itemName: string): string | null {
    return businessUnit.configurationItems.find((item) => item.item_name === itemName)?.item_value ?? null;
  }

  /**
   * Retrieves the Opal fines results based on the provided result IDs.
   * @param result_ids - An array of result IDs.
   * @returns An Observable that emits the Opal fines results reference data.
   */
  public getResults(result_ids: string[]): Observable<IOpalFinesResultsRefData> {
    if (!this.resultsCache$) {
      this.resultsCache$ = this.http
        .get<IOpalFinesResultsRefData>(OPAL_FINES_PATHS.resultsRefData, { params: { result_ids } })
        .pipe(shareReplay(1));
    }

    return this.resultsCache$;
  }

  /**
   * Returns the pretty name of the result.
   * @param result - The IOpalFinesResults object.
   * @returns The pretty name of the result.
   */
  public getResultPrettyName(result: IOpalFinesResults): string {
    return `${result.result_title} (${result.result_id})`;
  }

  /**
   * Retrieves the offence data for a given CJS code.
   * @param cjsCode - The CJS code for the offence.
   * @returns An Observable that emits the offence data.
   */
  public getOffenceByCjsCode(cjsCode: string): Observable<IOpalFinesOffencesRefData> {
    if (!this.offenceCodesCache$[cjsCode]) {
      this.offenceCodesCache$[cjsCode] = this.http
        .get<IOpalFinesOffencesRefData>(`${OPAL_FINES_PATHS.offencesRefData}?q=${cjsCode}`)
        .pipe(shareReplay(1));
    }
    return this.offenceCodesCache$[cjsCode];
  }

  /**
   * Retrieves the major creditors for a given business unit.
   * If the major creditors for the specified business unit have already been fetched,
   * it returns the cached result. Otherwise, it makes an HTTP request to fetch the data
   * and caches the result for future use.
   *
   * @param businessUnit - The business unit for which to retrieve the major creditors.
   * @returns An Observable that emits the major creditors data.
   */
  public getMajorCreditors(businessUnit: number): Observable<IOpalFinesMajorCreditorRefData> {
    if (!this.majorCreditorsCache$[businessUnit]) {
      this.majorCreditorsCache$[businessUnit] = this.http
        .get<IOpalFinesMajorCreditorRefData>(OPAL_FINES_PATHS.majorCreditorRefData, { params: { businessUnit } })
        .pipe(shareReplay(1));
    }

    return this.majorCreditorsCache$[businessUnit];
  }

  /**
   * Returns the pretty name of a major creditor.
   * @param majorCreditor - The major creditor object.
   * @returns The pretty name of the major creditor.
   */
  public getMajorCreditorPrettyName(majorCreditor: IOpalFinesMajorCreditor): string {
    return `${majorCreditor.name} (${majorCreditor.major_creditor_code})`;
  }

  /**
   * Sends a POST request to add a draft account payload.
   *
   * @param body - The payload containing the account details to be added.
   * @returns An Observable of the added account payload.
   */
  public postDraftAddAccountPayload(body: IFinesMacAddAccountPayload): Observable<IFinesMacAddAccountPayload> {
    return this.http.post<IFinesMacAddAccountPayload>(OPAL_FINES_PATHS.draftAccounts, body);
  }

  /**
   * Retrieves draft accounts based on the provided filter parameters.
   * Utilizes an internal cache to avoid redundant HTTP requests for the same filter set.
   *
   * @param filters - The filter parameters used to query draft accounts.
   *   - businessUnitIds: Optional array of business unit IDs to filter by.
   *   - statuses: Optional array of statuses to filter by.
   *   - submittedBy: Optional array of user IDs who submitted the accounts.
   *   - notSubmittedBy: Optional array of user IDs who did not submit the accounts.
   * @returns An Observable that emits the response containing the draft accounts matching the filters.
   */
  public getDraftAccounts(filters: IOpalFinesDraftAccountParams): Observable<IOpalFinesDraftAccountsResponse> {
    const cacheKey = this.generateDraftAccountsCacheKey(filters);

    if (!this.draftAccountsCache$[cacheKey]) {
      let params = new HttpParams();

      const filterMapping = {
        [this.PARAM_BUSINESS_UNIT]: filters.businessUnitIds?.filter((id) => id != null),
        [this.PARAM_STATUS]: filters.statuses,
        [this.PARAM_SUBMITTED_BY]: filters.submittedBy,
        [this.PARAM_NOT_SUBMITTED_BY]: filters.notSubmittedBy,
        [this.PARAM_ACCOUNT_STATUS_DATE_FROM]: filters.accountStatusDateFrom,
        [this.PARAM_ACCOUNT_STATUS_DATE_TO]: filters.accountStatusDateTo,
      };

      Object.entries(filterMapping).forEach(([key, values]) => {
        params = this.appendArrayParams(
          params,
          key,
          values?.filter((v) => v != null),
        );
      });

      this.draftAccountsCache$[cacheKey] = this.http
        .get<IOpalFinesDraftAccountsResponse>(OPAL_FINES_PATHS.draftAccounts, { params })
        .pipe(shareReplay(1));
    }

    return this.draftAccountsCache$[cacheKey];
  }

  /**
   * Clears the cache of draft accounts by resetting the `draftAccountsCache$` property to an empty object.
   * This method is typically used to remove all cached draft account data, ensuring that subsequent operations
   * fetch fresh data or start with a clean state.
   */
  public clearDraftAccountsCache(): void {
    this.draftAccountsCache$ = {};
  }

  /**
   * Retrieves a draft account summary by its ID.
   *
   * @param draftAccountId - The ID of the draft account to retrieve.
   * @returns An Observable that emits the draft account summary.
   */
  public getDraftAccountById(draftAccountId: number): Observable<IFinesMacAddAccountPayload> {
    return this.http.get<IFinesMacAddAccountPayload>(`${OPAL_FINES_PATHS.draftAccounts}/${draftAccountId}`);
  }

  /**
   * Retrieves a business unit by its ID.
   *
   * @param businessUnitId - The ID of the business unit to retrieve.
   * @returns An Observable that emits the business unit data.
   */
  public getBusinessUnitById(businessUnitId: number): Observable<IOpalFinesBusinessUnitNonSnakeCase> {
    return this.http.get<IOpalFinesBusinessUnitNonSnakeCase>(
      `${OPAL_FINES_PATHS.businessUnitRefData}/${businessUnitId}`,
    );
  }

  /**
   * Retrieves an offence by its ID.
   *
   * @param {number} offenceId - The ID of the offence to retrieve.
   * @returns {Observable<IOpalFinesOffencesNonSnakeCase>} An observable containing the offence data.
   */
  public getOffenceById(offenceId: number): Observable<IOpalFinesOffencesNonSnakeCase> {
    return this.http.get<IOpalFinesOffencesNonSnakeCase>(`${OPAL_FINES_PATHS.offencesRefData}/${offenceId}`);
  }

  /**
   * Sends a PUT request to update the draft account payload.
   *
   * @param body - The payload containing the account information to be added.
   * @returns An Observable of the updated account payload.
   */
  public putDraftAddAccountPayload(body: IFinesMacAddAccountPayload): Observable<IFinesMacAddAccountPayload> {
    return this.http.put<IFinesMacAddAccountPayload>(
      `${OPAL_FINES_PATHS.draftAccounts}/${body.draft_account_id}`,
      body,
    );
  }

  /**
   * Sends a PATCH request to update the draft account.
   *
   * @param body - The payload containing the account information to be patched as well as the draft account ID.
   * @returns An Observable of the updated account payload.
   */
  public patchDraftAccountPayload(
    accountId: string,
    body: IFinesMacPatchAccountPayload,
  ): Observable<IFinesMacAddAccountPayload> {
    return this.http.patch<IFinesMacAddAccountPayload>(`${OPAL_FINES_PATHS.draftAccounts}/${accountId}`, body);
  }

  /**
   * Searches for offences based on the provided parameters.
   *
   * @param body - The parameters for searching offences, adhering to the `IOpalFinesSearchOffencesParams` interface.
   * @returns An observable that emits the offences reference data, conforming to the `IOpalFinesSearchOffencesData` interface.
   */
  public searchOffences(body: IOpalFinesSearchOffencesParams): Observable<IOpalFinesSearchOffencesData> {
    body.maxResults = 100; // Set the maximum number of results to 100
    return this.http.post<IOpalFinesSearchOffencesData>(`${OPAL_FINES_PATHS.searchOffences}`, body);
  }
}

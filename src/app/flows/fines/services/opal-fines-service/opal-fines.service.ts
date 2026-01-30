import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';

import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-non-snake-case.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesCourt } from '@services/fines/opal-fines-service/interfaces/opal-fines-court.interface';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IOpalFinesProsecutor } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor.interface';
import { IOpalFinesProsecutorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';
import { IOpalFinesLocalJusticeArea } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area.interface';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';

import { map, Observable, of, shareReplay } from 'rxjs';
import { IOpalFinesOffencesNonSnakeCase } from './interfaces/opal-fines-offences-non-snake-case.interface';
import { IOpalFinesOffencesRefData } from './interfaces/opal-fines-offences-ref-data.interface';
import { IOpalFinesResults } from './interfaces/opal-fines-results.interface';
import { IOpalFinesResultsRefData } from './interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesMajorCreditor } from './interfaces/opal-fines-major-creditor.interface';
import { IOpalFinesMajorCreditorRefData } from './interfaces/opal-fines-major-creditor-ref-data.interface';
import { IFinesMacAddAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { IOpalFinesDraftAccountsResponse } from './interfaces/opal-fines-draft-account-data.interface';
import { IOpalFinesDraftAccountParams } from './interfaces/opal-fines-draft-account-params.interface';
import { IOpalFinesSearchOffencesParams } from './interfaces/opal-fines-search-offences-params.interface';
import { IOpalFinesSearchOffencesData } from './interfaces/opal-fines-search-offences.interface';
import { IOpalFinesDraftAccountPatchPayload } from './interfaces/opal-fines-draft-account.interface';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesAccountDefendantAtAGlance } from './interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from './mocks/opal-fines-account-defendant-details-impositions-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from './mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { IOpalFinesUpdateDefendantAccountPayload } from './interfaces/opal-fines-update-defendant-account.interface';
import { IOpalFinesUpdateDefendantAccountResponse } from './interfaces/opal-fines-update-defendant-account-response.interface';
import { IOpalFinesAccountDefendantAccountParty } from './interfaces/opal-fines-account-defendant-account-party.interface';
import { IOpalFinesAccountPartyDetails } from './interfaces/opal-fines-account-party-details.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from './interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from './interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { IOpalFinesAmendPaymentTermsPayload } from './interfaces/opal-fines-amend-payment-terms-payload.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from './interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { IOpalFinesAddNotePayload } from './interfaces/opal-fines-add-note.interface';
import { IOpalFinesAddNoteResponse } from './interfaces/opal-fines-add-note-response.interface';
import { IOpalFinesDefendantAccountResponse } from './interfaces/opal-fines-defendant-account-response.interface';
import { IOpalFinesDefendantAccountSearchParams } from './interfaces/opal-fines-defendant-account-search-params.interface';
import { IOpalFinesMinorCreditorAccountsResponse } from './interfaces/opal-fines-minor-creditors-accounts.interface';
import { IOpalFinesCreditorAccountsSearchParams } from './interfaces/opal-fines-creditor-accounts-search-params.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from './interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { OPAL_FINES_CACHE_DEFAULTS } from './constants/opal-fines-cache-defaults.constant';
import { IOpalFinesCache } from './interfaces/opal-fines-cache.interface';
import { IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData } from './interfaces/opal-fines-account-defendant-details-fixed-penalty-tab-ref-data.interface';
import { IOpalFinesResultRefData } from './interfaces/opal-fines-result-ref-data.interface';

@Injectable({
  providedIn: 'root',
})
export class OpalFines {
  private readonly http = inject(HttpClient);
  private cache = structuredClone(OPAL_FINES_CACHE_DEFAULTS);

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
      for (const value of values) {
        params = params.append(key, value.toString());
      }
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
   * Extracts the ETag version from the provided HTTP response headers.
   *
   * Attempts to retrieve the value of the 'ETag' or 'Etag' header from the given headers object.
   * Returns the ETag value as a string if present, or `null` if the header is not found.
   *
   * @param headers - The HTTP response headers from which to extract the ETag.
   * @returns The ETag value as a string, or `null` if not present.
   */
  private extractEtagVersion(headers: HttpResponse<unknown>['headers']): string | null {
    const etag = headers.get('ETag') ?? headers.get('Etag');
    if (!etag) return null;
    return etag;
  }

  /**
   * Builds an HTTP headers object containing the `If-Match` header if a version is provided.
   *
   * @param version - The version string to be used as the value for the `If-Match` header.
   * @returns An object with a `headers` property containing the `If-Match` header if the version is defined; otherwise, an empty object.
   */
  private buildIfMatchHeader(version: string): {
    headers?: { [header: string]: string };
  } {
    if (version !== undefined && version !== null) {
      return { headers: { 'If-Match': version } };
    }
    return {};
  }

  /**
   * Clears reference data caches to force fresh fetches.
   */
  private clearReferenceDataCaches(): void {
    const referenceCaches: (keyof IOpalFinesCache)[] = [
      'courtRefDataCache$',
      'businessUnitsCache$',
      'businessUnitsPermissionCache$',
      'localJusticeAreasCache$',
      'resultsCache$',
      'resultCache$',
      'offenceCodesCache$',
      'majorCreditorsCache$',
      'prosecutorDataCache$',
    ];

    referenceCaches.forEach((cacheKey) => this.clearCache(cacheKey));
  }

  /**
   * Retrieves the court data for a specific business unit.
   * If the court data is not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   * @param business_unit - The business unit for which to retrieve the court data.
   * @returns An Observable that emits the court data for the specified business unit.
   */
  public getCourts(business_unit: number): Observable<IOpalFinesCourtRefData> {
    if (!this.cache.courtRefDataCache$[business_unit]) {
      this.cache.courtRefDataCache$[business_unit] = this.http
        .get<IOpalFinesCourtRefData>(OPAL_FINES_PATHS.courtRefData, { params: { business_unit } })
        .pipe(shareReplay(1));
    }

    return this.cache.courtRefDataCache$[business_unit];
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
   * Returns the pretty name of a prosecutor.
   * @param prosecutor - The prosecutor object.
   * @returns The pretty name of the prosecutor.
   */
  public getProsecutorPrettyName(prosecutor: IOpalFinesProsecutor): string {
    return `${prosecutor.prosecutor_name} (${prosecutor.prosecutor_code})`;
  }

  /**
   * Retrieves business unit reference data based on the specified permission.
   *
   * This method caches the business unit data for each permission type to avoid
   * making multiple HTTP requests for the same data. Permissions are cached
   * separately to account for different permission types such as
   * `ACCOUNT_ENQUIRY`, `ACCOUNT_ENQUIRY_NOTES`, and `CREATE_MANAGE_DRAFT_ACCOUNTS`.
   *
   * @param permission - The permission type for which to retrieve business unit data.
   * @returns An `Observable` emitting the business unit reference data associated with the given permission.
   */
  public getBusinessUnitsByPermission(permission: string): Observable<IOpalFinesBusinessUnitRefData> {
    // Business units are cached to prevent multiple requests for the same data.
    // We can have multiple permission types so we need to cache them separately.
    // e.g. ACCOUNT_ENQUIRY, ACCOUNT_ENQUIRY_NOTES, CREATE_MANAGE_DRAFT_ACCOUNTS
    if (!this.cache.businessUnitsPermissionCache$[permission]) {
      this.cache.businessUnitsPermissionCache$[permission] = this.http
        .get<IOpalFinesBusinessUnitRefData>(OPAL_FINES_PATHS.businessUnitRefData, { params: { permission } })
        .pipe(shareReplay(1));
    }

    return this.cache.businessUnitsPermissionCache$[permission];
  }

  /**
   * Retrieves the business unit reference data as an observable.
   *
   * This method caches the HTTP response to avoid redundant network requests.
   * If the cache is empty, it performs an HTTP GET request to fetch the data
   * from the `OPAL_FINES_PATHS.businessUnitRefData` endpoint and shares the
   * result among subscribers using `shareReplay(1)`.
   *
   * @returns An observable of `IOpalFinesBusinessUnitRefData` containing the
   *          business unit reference data.
   */
  public getBusinessUnits(): Observable<IOpalFinesBusinessUnitRefData> {
    if (!this.cache.businessUnitsCache$) {
      this.cache.businessUnitsCache$ = this.http
        .get<IOpalFinesBusinessUnitRefData>(OPAL_FINES_PATHS.businessUnitRefData)
        .pipe(shareReplay(1));
    }

    return this.cache.businessUnitsCache$;
  }

  /**
   * Retrieves the local justice areas.
   * If the local justice areas are not already cached, it makes an HTTP request to fetch them and caches the result.
   * Subsequent calls to this method will return the cached data.
   * @returns An Observable that emits the local justice areas.
   */
  public getLocalJusticeAreas(): Observable<IOpalFinesLocalJusticeAreaRefData> {
    if (!this.cache.localJusticeAreasCache$) {
      this.cache.localJusticeAreasCache$ = this.http
        .get<IOpalFinesLocalJusticeAreaRefData>(OPAL_FINES_PATHS.localJusticeAreaRefData)
        .pipe(shareReplay(1));
    }

    return this.cache.localJusticeAreasCache$;
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
  public getConfigurationItemValue(
    businessUnit: IOpalFinesBusinessUnit | IOpalFinesBusinessUnitNonSnakeCase,
    itemName: string,
  ): string | null {
    if ('configurationItems' in businessUnit === false) {
      return businessUnit.configuration_items.find((item) => item.item_name === itemName)?.item_value ?? null;
    }
    return businessUnit.configurationItems.find((item) => item.itemName === itemName)?.itemValue ?? null;
  }

  /**
   * Retrieves the Opal fines results based on the provided result IDs.
   * @param result_ids - An array of result IDs.
   * @returns An Observable that emits the Opal fines results reference data.
   */
  public getResults(result_ids: string[]): Observable<IOpalFinesResultsRefData> {
    if (!this.cache.resultsCache$) {
      this.cache.resultsCache$ = this.http
        .get<IOpalFinesResultsRefData>(OPAL_FINES_PATHS.resultsRefData, { params: { result_ids } })
        .pipe(shareReplay(1));
    }

    return this.cache.resultsCache$;
  }

  /**
   * Retrieves the Opal fines result based on the provided result ID.
   * @param result_id - Result ID.
   * @param refresh - Whether to refresh the cached data. Defaulted to false.
   * @returns An Observable that emits the Opal fines results reference data.
   */
  public getResult(result_id: string, refresh = false): Observable<IOpalFinesResultRefData> {
    if (refresh) {
      this.clearCache('resultCache$', result_id);
    }
    if (!this.cache.resultCache$[result_id]) {
      this.cache.resultCache$[result_id] = this.http
        .get<IOpalFinesResultRefData>(`${OPAL_FINES_PATHS.resultsRefData}/${result_id}`)
        .pipe(shareReplay(1));
    }

    return this.cache.resultCache$[result_id];
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
    if (!this.cache.offenceCodesCache$[cjsCode]) {
      this.cache.offenceCodesCache$[cjsCode] = this.http
        .get<IOpalFinesOffencesRefData>(`${OPAL_FINES_PATHS.offencesRefData}?q=${cjsCode}`)
        .pipe(shareReplay(1));
    }
    return this.cache.offenceCodesCache$[cjsCode];
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
    if (!this.cache.majorCreditorsCache$[businessUnit]) {
      this.cache.majorCreditorsCache$[businessUnit] = this.http
        .get<IOpalFinesMajorCreditorRefData>(OPAL_FINES_PATHS.majorCreditorRefData, { params: { businessUnit } })
        .pipe(shareReplay(1));
    }

    return this.cache.majorCreditorsCache$[businessUnit];
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

    if (!this.cache.draftAccountsCache$[cacheKey]) {
      let params = new HttpParams();

      const filterMapping = {
        [this.PARAM_BUSINESS_UNIT]: filters.businessUnitIds?.filter((id) => id != null),
        [this.PARAM_STATUS]: filters.statuses,
        [this.PARAM_SUBMITTED_BY]: filters.submittedBy,
        [this.PARAM_NOT_SUBMITTED_BY]: filters.notSubmittedBy,
        [this.PARAM_ACCOUNT_STATUS_DATE_FROM]: filters.accountStatusDateFrom,
        [this.PARAM_ACCOUNT_STATUS_DATE_TO]: filters.accountStatusDateTo,
      };

      for (const [key, values] of Object.entries(filterMapping)) {
        params = this.appendArrayParams(
          params,
          key,
          values?.filter((v) => v != null),
        );
      }

      this.cache.draftAccountsCache$[cacheKey] = this.http
        .get<IOpalFinesDraftAccountsResponse>(OPAL_FINES_PATHS.draftAccounts, { params })
        .pipe(shareReplay(1));
    }

    return this.cache.draftAccountsCache$[cacheKey];
  }

  /**
   * Clears a specific cache item, resetting to default.
   * This method is typically used to remove cached data, ensuring that subsequent operations
   * fetch fresh data or start with a clean state.
   *
   * @param cacheKey - The key of the cache item to be cleared.
   * @param key - An optional specific key within the cache item to be deleted.
   */
  public clearCache(cacheKey: keyof IOpalFinesCache, nestedKey?: string): void {
    if (cacheKey in OPAL_FINES_CACHE_DEFAULTS) {
      if (nestedKey && this.cache[cacheKey]) {
        delete this.cache[cacheKey][nestedKey as keyof (typeof this.cache)[typeof cacheKey]];
      } else {
        /*eslint-disable @typescript-eslint/no-explicit-any */
        this.cache[cacheKey] = structuredClone(OPAL_FINES_CACHE_DEFAULTS as any)[cacheKey];
      }
    }
  }

  /**
   * Clears all cached account detail responses.
   */
  public clearAccountDetailsCache(): void {
    const accountCaches: (keyof IOpalFinesCache)[] = [
      'defendantAccountAtAGlanceCache$',
      'defendantAccountPartyCache$',
      'defendantAccountparentOrGuardianAccountPartyCache$',
      'defendantAccountEnforcementCache$',
      'defendantAccountImpositionsCache$',
      'defendantAccountHistoryAndNotesCache$',
      'defendantAccountPaymentTermsLatestCache$',
      'defendantAccountFixedPenaltyCache$',
    ];

    accountCaches.forEach((cacheKey) => this.clearCache(cacheKey));
  }

  /**
   * Clears all cached draft account responses.
   */
  public clearDraftAccountsCache(): void {
    this.clearCache('draftAccountsCache$');
  }

  /**
   * Clears all caches maintained by this service.
   */
  public clearAllCaches(): void {
    this.clearDraftAccountsCache();
    this.clearAccountDetailsCache();
    this.clearReferenceDataCaches();
  }

  /**
   * Retrieves a draft account summary by its ID.
   *
   * @param draftAccountId - The ID of the draft account to retrieve.
   * @returns An Observable that emits the draft account summary.
   */
  public getDraftAccountById(draftAccountId: number): Observable<IFinesMacAddAccountPayload> {
    return this.http
      .get<IFinesMacAddAccountPayload>(`${OPAL_FINES_PATHS.draftAccounts}/${draftAccountId}`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<IFinesMacAddAccountPayload>) => {
          const payload = response.body as IFinesMacAddAccountPayload;
          const version = this.extractEtagVersion(response.headers);
          return {
            ...payload,
            version,
          };
        }),
      );
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
      this.buildIfMatchHeader(body.version!),
    );
  }

  /**
   * Searches for offences based on the provided parameters.
   *
   * @param body - The parameters for searching offences, adhering to the `IOpalFinesSearchOffencesParams` interface.
   * @returns An observable that emits the offences reference data, conforming to the `IOpalFinesSearchOffencesData` interface.
   */
  public searchOffences(body: IOpalFinesSearchOffencesParams): Observable<IOpalFinesSearchOffencesData> {
    body.max_results = 100; // Set the maximum number of results to 100
    return this.http.post<IOpalFinesSearchOffencesData>(`${OPAL_FINES_PATHS.searchOffences}`, body);
  }

  /**
   * Sends a PATCH request to update a draft account with the specified payload.
   *
   * @param draftAccountId - The unique identifier of the draft account to update.
   * @param payload - The partial payload containing the fields to update in the draft account.
   * @returns An Observable emitting the updated account payload as an `IFinesMacAddAccountPayload`.
   */
  public patchDraftAccountPayload(
    draftAccountId: number,
    payload: IOpalFinesDraftAccountPatchPayload,
  ): Observable<IFinesMacAddAccountPayload> {
    return this.http.patch<IFinesMacAddAccountPayload>(
      `${OPAL_FINES_PATHS.draftAccounts}/${draftAccountId}`,
      payload,
      this.buildIfMatchHeader(payload.version),
    );
  }

  /**
   * Retrieves the prosecutor data for a specific business unit.
   * If the prosecutor data is not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   * @param business_unit - The business unit for which to retrieve the prosecutor data.
   * @returns An Observable that emits the prosecutor data for the specified business unit.
   */
  public getProsecutors(business_unit: number): Observable<IOpalFinesProsecutorRefData> {
    if (!this.cache.prosecutorDataCache$[business_unit]) {
      this.cache.prosecutorDataCache$[business_unit] = this.http
        .get<IOpalFinesProsecutorRefData>(OPAL_FINES_PATHS.prosecutorRefData, { params: { business_unit } })
        .pipe(shareReplay(1));
    }

    return this.cache.prosecutorDataCache$[business_unit];
  }

  /**
   * Retrieves the defendant account details at a glance for a specific tab.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @returns An Observable that emits the account details at a glance for the specified tab.
   */
  public getDefendantAccountAtAGlance(account_id: number | null): Observable<IOpalFinesAccountDefendantAtAGlance> {
    if (!this.cache.defendantAccountAtAGlanceCache$) {
      const url = `${OPAL_FINES_PATHS.defendantAccounts}/${account_id}/at-a-glance`;
      this.cache.defendantAccountAtAGlanceCache$ = this.http
        .get<IOpalFinesAccountDefendantAtAGlance>(url, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<IOpalFinesAccountDefendantAtAGlance>) => {
            const version = this.extractEtagVersion(response.headers);
            const payload = response.body as IOpalFinesAccountDefendantAtAGlance;
            return {
              ...payload,
              version,
            };
          }),
          shareReplay(1),
        );
    }

    return this.cache.defendantAccountAtAGlanceCache$;
  }

  /**
   * Retrieves the defendant account party data.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @param defendant_party_id - The ID of the defendant account party.
   * @returns An Observable that emits the account details at a glance for the specified tab.
   */
  public getDefendantAccountParty(
    account_id: number | null,
    defendant_party_id: string | null,
  ): Observable<IOpalFinesAccountDefendantAccountParty> {
    if (!this.cache.defendantAccountPartyCache$) {
      const url = `${OPAL_FINES_PATHS.defendantAccounts}/${account_id}/defendant-account-parties/${defendant_party_id}`;
      this.cache.defendantAccountPartyCache$ = this.http
        .get<IOpalFinesAccountDefendantAccountParty>(url, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<IOpalFinesAccountDefendantAccountParty>) => {
            const version = this.extractEtagVersion(response.headers);
            const payload = response.body as IOpalFinesAccountDefendantAccountParty;
            return {
              ...payload,
              version,
            };
          }),
          shareReplay(1),
        );
    }
    return this.cache.defendantAccountPartyCache$;
  }

  /**
   * Retrieves the parent/guardian account party data.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @param parent_guardian_party_id - The ID of the parent/guardian account party.
   * @returns An Observable that emits the account details at a glance for the specified tab.
   */
  public getParentOrGuardianAccountParty(
    account_id: number | null,
    party_account_id: string | null,
  ): Observable<IOpalFinesAccountDefendantAccountParty> {
    if (!this.cache.defendantAccountparentOrGuardianAccountPartyCache$) {
      const url = `${OPAL_FINES_PATHS.defendantAccounts}/${account_id}/defendant-account-parties/${party_account_id}`;
      this.cache.defendantAccountparentOrGuardianAccountPartyCache$ = this.http
        .get<IOpalFinesAccountDefendantAccountParty>(url, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<IOpalFinesAccountDefendantAccountParty>) => {
            const version = this.extractEtagVersion(response.headers);
            const payload = response.body as IOpalFinesAccountDefendantAccountParty;
            return {
              ...payload,
              version,
            };
          }),
          shareReplay(1),
        );
    }
    return this.cache.defendantAccountparentOrGuardianAccountPartyCache$;
  }

  /**
   * Retrieves the defendant account fixed penalty details tab data.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @returns An Observable that emits the account's fixed penalty details.
   */
  public getDefendantAccountFixedPenalty(
    account_id: number | null,
  ): Observable<IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData> {
    if (!this.cache.defendantAccountFixedPenaltyCache$) {
      const url = `${OPAL_FINES_PATHS.defendantAccounts}/${account_id}/fixed-penalty`;
      this.cache.defendantAccountFixedPenaltyCache$ = this.http
        .get<IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData>(url, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData>) => {
            const version = this.extractEtagVersion(response.headers);
            const payload = response.body as IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData;
            return {
              ...payload,
              version,
            };
          }),
          shareReplay(1),
        );
    }
    return this.cache.defendantAccountFixedPenaltyCache$;
  }

  /**
   * Retrieves the defendant account details enforcement tab data.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @returns An Observable that emits the account details at a glance for the specified tab.
   */
  public getDefendantAccountEnforcementTabData(
    account_id: number | null,
  ): Observable<IOpalFinesAccountDefendantDetailsEnforcementTabRefData> {
    if (!this.cache.defendantAccountEnforcementCache$) {
      const url = `${OPAL_FINES_PATHS.defendantAccounts}/${account_id}/enforcement-status`;
      this.cache.defendantAccountEnforcementCache$ = this.http
        .get<IOpalFinesAccountDefendantDetailsEnforcementTabRefData>(url, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<IOpalFinesAccountDefendantDetailsEnforcementTabRefData>) => {
            const version = this.extractEtagVersion(response.headers);
            const payload = response.body as IOpalFinesAccountDefendantDetailsEnforcementTabRefData;
            return {
              ...payload,
              version,
            };
          }),
          shareReplay(1),
        );
    }
    return this.cache.defendantAccountEnforcementCache$;
  }

  /**
   * Retrieves the defendant account details impositions tab data.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @param business_unit_id - The ID of the business unit.
   * @param business_unit_user_id - The ID of the business unit user.
   * @returns An Observable that emits the account details at a glance for the specified tab.
   */
  public getDefendantAccountImpositionsTabData(): Observable<IOpalFinesAccountDefendantDetailsImpositionsTabRefData> {
    return (
      this.cache.defendantAccountImpositionsCache$ ??
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK)
    );
  }

  /**
   * Retrieves the defendant account details history and notes tab data.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @param business_unit_id - The ID of the business unit.
   * @param business_unit_user_id - The ID of the business unit user.
   * @returns An Observable that emits the account details at a glance for the specified tab.
   */
  public getDefendantAccountHistoryAndNotesTabData(): Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> {
    return (
      this.cache.defendantAccountHistoryAndNotesCache$ ??
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK)
    );
  }

  /**
   * Retrieves the defendant account details payment terms latest data.
   * If the account details for the specified tab are not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   *
   * @param account_id - The ID of the defendant account.
   * @param refresh - Whether to refresh the cached data. Defaulted to false.
   * @returns An Observable that emits the account details at a glance for the specified tab.
   */
  public getDefendantAccountPaymentTermsLatest(
    account_id: number | null,
    refresh = false,
  ): Observable<IOpalFinesAccountDefendantDetailsPaymentTermsLatest> {
    if (refresh) {
      this.clearCache('defendantAccountPaymentTermsLatestCache$');
    }
    if (!this.cache.defendantAccountPaymentTermsLatestCache$) {
      const url = `${OPAL_FINES_PATHS.defendantAccounts}/${account_id}/payment-terms/latest`;
      this.cache.defendantAccountPaymentTermsLatestCache$ = this.http
        .get<IOpalFinesAccountDefendantDetailsPaymentTermsLatest>(url, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<IOpalFinesAccountDefendantDetailsPaymentTermsLatest>) => {
            const version = this.extractEtagVersion(response.headers);
            const payload = response.body as IOpalFinesAccountDefendantDetailsPaymentTermsLatest;
            return {
              ...payload,
              version,
            };
          }),
          shareReplay(1),
        );
    }
    return this.cache.defendantAccountPaymentTermsLatestCache$;
  }

  /**
   * Sends a PUT request to add payment terms to a defendant account.
   *
   * @param defendantAccountId - The ID of the defendant account to add payment terms to.
   * @param payload - The payment terms payload containing the payment terms data.
   * @param businessUnitId - Optional Business Unit ID header.
   * @param ifMatch - Optional If-Match header for optimistic locking.
   * @returns An Observable of the payment terms response.
   */
  public postDefendantAccountPaymentTerms(
    defendantAccountId: number,
    payload: IOpalFinesAmendPaymentTermsPayload,
    businessUnitId?: string,
    ifMatch?: string,
  ): Observable<IOpalFinesAmendPaymentTermsPayload> {
    const url = `${OPAL_FINES_PATHS.defendantAccounts}/${defendantAccountId}/payment-terms`;

    const headers: Record<string, string> = {};
    if (businessUnitId !== undefined) {
      headers['Business-Unit-Id'] = businessUnitId;
    }
    if (ifMatch) {
      headers['If-Match'] = ifMatch;
    }

    return this.http.post<IOpalFinesAmendPaymentTermsPayload>(url, payload, { headers });
  }

  /**
   * Retrieves the defendant account header data for a specific account ID.
   * This method makes an HTTP GET request to fetch the header summary for the specified defendant account.
   *
   * @param accountId - The unique identifier of the defendant account.
   * @returns An Observable that emits the defendant account header data.
   */
  public getDefendantAccountHeadingData(accountId: number): Observable<IOpalFinesAccountDefendantDetailsHeader> {
    const url = `${OPAL_FINES_PATHS.defendantAccounts}/${accountId}/header-summary`;
    return this.http.get<IOpalFinesAccountDefendantDetailsHeader>(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<IOpalFinesAccountDefendantDetailsHeader>) => {
        const payload = response.body as IOpalFinesAccountDefendantDetailsHeader;
        const version = this.extractEtagVersion(response.headers);
        return {
          ...payload,
          version,
        };
      }),
    );
  }

  /**
   * Adds a note to be associated with a record (Entity).
   * In this instance, the associated record (Entity) will be the Defendant Account.
   *
   * Permission required: 'Account Maintenance' (in the Business Unit that the Defendant Account belongs to).
   *
   * @param payload - The payload containing note details including associated record information,
   *                  note type, note text, and defendant account version for concurrency.
   * @param version - The version string to be used as the value for the `If-Match` header.
   * @returns An Observable that emits the created note data.
   */
  public addNote(payload: IOpalFinesAddNotePayload, version: string): Observable<IOpalFinesAddNoteResponse> {
    return this.http.post<IOpalFinesAddNoteResponse>(OPAL_FINES_PATHS.notes, payload, this.buildIfMatchHeader(version));
  }

  /**
   * Retrieves defendant account information based on the provided search parameters.
   *
   * @param searchParams - The parameters used to search for defendant accounts.
   * @returns An Observable that emits the response containing defendant account details.
   */
  public getDefendantAccounts(
    searchParams: IOpalFinesDefendantAccountSearchParams,
  ): Observable<IOpalFinesDefendantAccountResponse> {
    return this.http.post<IOpalFinesDefendantAccountResponse>(
      `${OPAL_FINES_PATHS.searchDefendantAccounts}`,
      searchParams,
    );
  }

  /**
   * Retrieves a list of minor creditor accounts based on the provided search parameters.
   *
   * @param searchParams - The parameters used to filter and search for minor creditor accounts.
   * @returns An Observable that emits the response containing the minor creditor accounts.
   */
  public getMinorCreditorAccounts(
    searchParams: IOpalFinesCreditorAccountsSearchParams,
  ): Observable<IOpalFinesMinorCreditorAccountsResponse> {
    return this.http.post<IOpalFinesMinorCreditorAccountsResponse>(
      `${OPAL_FINES_PATHS.searchMinorCreditorAccounts}`,
      searchParams,
    );
  }

  /**
   * Updates a defendant account with new account notes and comments.
   * Currently returns a mock response since the API is not yet developed.
   *
   * @param accountId - The unique identifier of the defendant account to update.
   * @param payload - The payload containing the updated account notes and version for concurrency control.
   * @returns An Observable that emits the updated defendant account response.
   */
  public patchDefendantAccount(
    accountId: number,
    payload: IOpalFinesUpdateDefendantAccountPayload,
    version?: string,
    businessUnitId?: string,
  ): Observable<IOpalFinesUpdateDefendantAccountResponse> {
    const url = `${OPAL_FINES_PATHS.defendantAccounts}/${accountId}`;

    const headers: Record<string, string> = {};
    if (version) {
      headers['If-Match'] = version;
    }
    if (businessUnitId !== undefined) {
      headers['Business-Unit-Id'] = businessUnitId;
    }

    return this.http.patch<IOpalFinesUpdateDefendantAccountResponse>(url, payload, { headers });
  }

  /**
   * Updates defendant account party details.
   *
   * @param defendantAccountId - The unique identifier of the defendant account.
   * @param defendantAccountPartyId - The unique identifier of the defendant account party.
   * @param payload - The payload containing the updated party details.
   * @param version - The version for optimistic concurrency control (If-Match header).
   * @param businessUnitId - The business unit identifier.
   * @returns An Observable that emits the updated defendant account party response.
   */
  public putDefendantAccountParty(
    defendantAccountId: number,
    defendantAccountPartyId: string,
    payload: IOpalFinesAccountPartyDetails,
    version?: string,
    businessUnitId?: string,
  ): Observable<IOpalFinesAccountDefendantAccountParty> {
    const url = `${OPAL_FINES_PATHS.defendantAccounts}/${defendantAccountId}/defendant-account-parties/${defendantAccountPartyId}`;

    const headers: Record<string, string> = {};
    if (version) {
      headers['If-Match'] = version;
    }
    if (businessUnitId !== undefined) {
      headers['Business-Unit-Id'] = businessUnitId;
    }

    return this.http.put<IOpalFinesAccountDefendantAccountParty>(url, payload, { headers });
  }
}

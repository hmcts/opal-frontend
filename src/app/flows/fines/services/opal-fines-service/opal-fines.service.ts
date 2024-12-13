import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';

import { IOpalFinesAddDefendantAccountNoteBody } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-defendant-account-note-body.interface';
import {
  IOpalFinesBusinessUnit,
  IOpalFinesBusinessUnitRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import {
  IOpalFinesCourt,
  IOpalFinesCourtRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { IOpalFinesDefendantAccount } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalFinesDefendantAccountDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-details.interface';
import { IOpalFinesDefendantAccountNote } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-note.interface';
import { IOpalFinesGetDefendantAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-get-defendant-account-params.interface';
import {
  IOpalFinesLocalJusticeArea,
  IOpalFinesLocalJusticeAreaRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { IOpalFinesSearchCourt } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-court.interface';
import { IOpalFinesSearchCourtBody } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-court-body.interface';
import { IOpalFinesSearchDefendantAccountBody } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-defendant-account-body.interface';
import { IOpalFinesSearchDefendantAccounts } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-defendant-accounts.interface';

import { Observable, shareReplay } from 'rxjs';
import { IOpalFinesOffencesRefData } from './interfaces/opal-fines-offences-ref-data.interface';
import { IOpalFinesResults, IOpalFinesResultsRefData } from './interfaces/opal-fines-results-ref-data.interface';
import {
  IOpalFinesMajorCreditor,
  IOpalFinesMajorCreditorRefData,
} from './interfaces/opal-fines-major-creditor-ref-data.interface';
import { IFinesMacAddAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
@Injectable({
  providedIn: 'root',
})
export class OpalFines {
  private readonly http = inject(HttpClient);
  private courtCache$: { [key: string]: Observable<IOpalFinesSearchCourt[]> } = {};
  private courtRefDataCache$: { [key: string]: Observable<IOpalFinesCourtRefData> } = {};
  private businessUnitsCache$: { [key: string]: Observable<IOpalFinesBusinessUnitRefData> } = {};
  private localJusticeAreasCache$!: Observable<IOpalFinesLocalJusticeAreaRefData>;
  private resultsCache$!: Observable<IOpalFinesResultsRefData>;
  private offenceCodesCache$: { [key: string]: Observable<IOpalFinesOffencesRefData> } = {};
  private majorCreditorsCache$: { [key: string]: Observable<IOpalFinesMajorCreditorRefData> } = {};

  /**
   * Searches for courts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits an array of IFinesSearchCourt objects.
   */
  public searchCourt(body: IOpalFinesSearchCourtBody): Observable<IOpalFinesSearchCourt[]> {
    const key = `${JSON.stringify(body.courtId)}${JSON.stringify(body.courtCode)}}`;

    // Court search is cached to prevent multiple requests for the same data.
    if (!this.courtCache$[key]) {
      this.courtCache$[key] = this.http
        .post<IOpalFinesSearchCourt[]>(OPAL_FINES_PATHS.courtSearch, body)
        .pipe(shareReplay(1));
    }

    return this.courtCache$[key];
  }

  /**
   * Retrieves the court data for a specific business unit.
   * If the court data is not already cached, it makes an HTTP request to fetch the data and caches it for future use.
   * @param businessUnit - The business unit for which to retrieve the court data.
   * @returns An Observable that emits the court data for the specified business unit.
   */
  public getCourts(businessUnit: number): Observable<IOpalFinesCourtRefData> {
    if (!this.courtRefDataCache$[businessUnit]) {
      this.courtRefDataCache$[businessUnit] = this.http
        .get<IOpalFinesCourtRefData>(OPAL_FINES_PATHS.courtRefData, { params: { businessUnit } })
        .pipe(shareReplay(1));
    }

    return this.courtRefDataCache$[businessUnit];
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
   * Retrieves the defendant account based on the provided parameters.
   * @param params - The parameters for retrieving the defendant account.
   * @returns An Observable that emits the defendant account.
   */
  public getDefendantAccount(params: IOpalFinesGetDefendantAccountParams): Observable<IOpalFinesDefendantAccount> {
    return this.http.get<IOpalFinesDefendantAccount>(
      `${OPAL_FINES_PATHS.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`,
    );
  }

  /**
   * Searches for defendant accounts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits the search results.
   */
  public searchDefendantAccounts(
    body: IOpalFinesSearchDefendantAccountBody,
  ): Observable<IOpalFinesSearchDefendantAccounts> {
    return this.http.post<IOpalFinesSearchDefendantAccounts>(OPAL_FINES_PATHS.defendantAccountSearch, body);
  }

  /**
   * Retrieves the details of a defendant account.
   * @param defendantAccountId - The ID of the defendant account.
   * @returns An Observable that emits the defendant account details.
   */
  public getDefendantAccountDetails(defendantAccountId: number): Observable<IOpalFinesDefendantAccountDetails> {
    return this.http.get<IOpalFinesDefendantAccountDetails>(
      `${OPAL_FINES_PATHS.defendantAccount}/${defendantAccountId}`,
    );
  }

  /**
   * Adds a note to a defendant account.
   * @param body - The body of the note to be added.
   * @returns An observable that emits the added defendant account note.
   */
  public addDefendantAccountNote(
    body: IOpalFinesAddDefendantAccountNoteBody,
  ): Observable<IOpalFinesDefendantAccountNote> {
    return this.http.post<IOpalFinesDefendantAccountNote>(OPAL_FINES_PATHS.defendantAccountAddNote, body);
  }

  /**
   * Retrieves the notes associated with a defendant account.
   * @param defendantAccountId - The ID of the defendant account.
   * @returns An Observable that emits an array of defendant account notes.
   */
  public getDefendantAccountNotes(defendantAccountId: number): Observable<IOpalFinesDefendantAccountNote[]> {
    return this.http.get<IOpalFinesDefendantAccountNote[]>(
      `${OPAL_FINES_PATHS.defendantAccountNotes}/${defendantAccountId}`,
    );
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
    return `${localJusticeArea.name} (${localJusticeArea.lja_code})`;
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
}

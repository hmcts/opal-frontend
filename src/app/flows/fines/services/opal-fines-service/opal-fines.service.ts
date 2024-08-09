import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OPAL_FINES_PATHS } from '@constants/fines';
import {
  IFinesAddDefendantAccountNoteBody,
  IFinesBusinessUnitRefData,
  IFinesCourtRefData,
  IFinesDefendantAccount,
  IFinesDefendantAccountDetails,
  IFinesDefendantAccountNote,
  IFinesGetDefendantAccountParams,
  IFinesLocalJusticeAreaRefData,
  IFinesSearchCourt,
  IFinesSearchCourtBody,
  IFinesSearchDefendantAccountBody,
  IFinesSearchDefendantAccounts,
} from '@interfaces/fines';
import { Observable, shareReplay } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OpalFines {
  private readonly http = inject(HttpClient);
  private courtCache$: { [key: string]: Observable<IFinesSearchCourt[]> } = {};
  private courtRefDataCache$: { [key: string]: Observable<IFinesCourtRefData> } = {};
  private businessUnitsCache$: { [key: string]: Observable<IFinesBusinessUnitRefData> } = {};
  private localJusticeAreasCache$!: Observable<IFinesLocalJusticeAreaRefData>;

  /**
   * Searches for courts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits an array of IFinesSearchCourt objects.
   */
  public searchCourt(body: IFinesSearchCourtBody): Observable<IFinesSearchCourt[]> {
    const key = `${JSON.stringify(body.courtId)}${JSON.stringify(body.courtCode)}}`;

    // Court search is cached to prevent multiple requests for the same data.
    if (!this.courtCache$[key]) {
      this.courtCache$[key] = this.http
        .post<IFinesSearchCourt[]>(OPAL_FINES_PATHS.courtSearch, body)
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
  public getCourts(businessUnit: number) {
    if (!this.courtRefDataCache$[businessUnit]) {
      this.courtRefDataCache$[businessUnit] = this.http
        .get<IFinesCourtRefData>(OPAL_FINES_PATHS.courtRefData, { params: { businessUnit } })
        .pipe(shareReplay(1));
    }

    return this.courtRefDataCache$[businessUnit];
  }

  /**
   * Retrieves the defendant account based on the provided parameters.
   * @param params - The parameters for retrieving the defendant account.
   * @returns An Observable that emits the defendant account.
   */
  public getDefendantAccount(params: IFinesGetDefendantAccountParams): Observable<IFinesDefendantAccount> {
    return this.http.get<IFinesDefendantAccount>(
      `${OPAL_FINES_PATHS.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`,
    );
  }

  /**
   * Searches for defendant accounts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits the search results.
   */
  public searchDefendantAccounts(body: IFinesSearchDefendantAccountBody): Observable<IFinesSearchDefendantAccounts> {
    return this.http.post<IFinesSearchDefendantAccounts>(OPAL_FINES_PATHS.defendantAccountSearch, body);
  }

  /**
   * Retrieves the details of a defendant account.
   * @param defendantAccountId - The ID of the defendant account.
   * @returns An Observable that emits the defendant account details.
   */
  public getDefendantAccountDetails(defendantAccountId: number): Observable<IFinesDefendantAccountDetails> {
    return this.http.get<IFinesDefendantAccountDetails>(`${OPAL_FINES_PATHS.defendantAccount}/${defendantAccountId}`);
  }

  /**
   * Adds a note to a defendant account.
   * @param body - The body of the note to be added.
   * @returns An observable that emits the added defendant account note.
   */
  public addDefendantAccountNote(body: IFinesAddDefendantAccountNoteBody): Observable<IFinesDefendantAccountNote> {
    return this.http.post<IFinesDefendantAccountNote>(OPAL_FINES_PATHS.defendantAccountAddNote, body);
  }

  /**
   * Retrieves the notes associated with a defendant account.
   * @param defendantAccountId - The ID of the defendant account.
   * @returns An Observable that emits an array of defendant account notes.
   */
  public getDefendantAccountNotes(defendantAccountId: number): Observable<IFinesDefendantAccountNote[]> {
    return this.http.get<IFinesDefendantAccountNote[]>(
      `${OPAL_FINES_PATHS.defendantAccountNotes}/${defendantAccountId}`,
    );
  }

  public getBusinessUnits(permission: string) {
    // Business units are cached to prevent multiple requests for the same data.
    // We can have multiple permission types so we need to cache them separately.
    // e.g. ACCOUNT_ENQUIRY, ACCOUNT_ENQUIRY_NOTES, MANUAL_ACCOUNT_CREATION
    if (!this.businessUnitsCache$[permission]) {
      this.businessUnitsCache$[permission] = this.http
        .get<IFinesBusinessUnitRefData>(OPAL_FINES_PATHS.businessUnitRefData, { params: { permission } })
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
  public getLocalJusticeAreas() {
    if (!this.localJusticeAreasCache$) {
      this.localJusticeAreasCache$ = this.http
        .get<IFinesLocalJusticeAreaRefData>(OPAL_FINES_PATHS.localJusticeAreaRefData)
        .pipe(shareReplay(1));
    }

    return this.localJusticeAreasCache$;
  }
}

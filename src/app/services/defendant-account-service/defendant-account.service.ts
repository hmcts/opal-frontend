import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths } from '@enums';
import {
  IDefendantAccount,
  ISearchDefendantAccounts,
  IGetDefendantAccountParams,
  ISearchDefendantAccountBody,
  IDefendantAccountDetails,
  IAddDefendantAccountNoteBody,
  IDefendantAccountNote,
  IAddDefendantAccountNoteBody,
  IDefendantAccountNote,
} from '@interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class DefendantAccountService {
  private readonly http = inject(HttpClient);

  /**
   * Retrieves the defendant account based on the provided parameters.
   * @param params - The parameters for retrieving the defendant account.
   * @returns An Observable that emits the defendant account.
   */
  public getDefendantAccount(params: IGetDefendantAccountParams): Observable<IDefendantAccount> {
    return this.http.get<IDefendantAccount>(
      `${ApiPaths.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`,
    );
  }

  /**
   * Searches for defendant accounts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits the search results.
   */
  public searchDefendantAccounts(body: ISearchDefendantAccountBody): Observable<ISearchDefendantAccounts> {
    return this.http.post<ISearchDefendantAccounts>(ApiPaths.defendantAccountSearch, body);
  }

  /**
   * Retrieves the details of a defendant account.
   * @param defendantAccountId - The ID of the defendant account.
   * @returns An Observable that emits the defendant account details.
   */
  public getDefendantAccountDetails(defendantAccountId: number): Observable<IDefendantAccountDetails> {
    return this.http.get<IDefendantAccountDetails>(
      `${ApiPaths.defendantAccountDetails}?defendantAccountId=${defendantAccountId}`,
    );
  }

  /**
   * Adds a note to a defendant account.
   * @param body - The body of the note to be added.
   * @returns An observable that emits the added defendant account note.
   */
  public addDefendantAccountNote(body: IAddDefendantAccountNoteBody): Observable<IDefendantAccountNote> {
    return this.http.post<IDefendantAccountNote>(ApiPaths.defendantAccountAddNote, body);
  }

  /**
   * Retrieves the notes associated with a defendant account.
   * @param defendantAccountId - The ID of the defendant account.
   * @returns An Observable that emits an array of defendant account notes.
   */
  public getDefendantAccountNotes(defendantAccountId: number): Observable<IDefendantAccountNote[]> {
    return this.http.get<IDefendantAccountNote[]>(`${ApiPaths.defendantAccountNotes}/${defendantAccountId}`);
  }
}

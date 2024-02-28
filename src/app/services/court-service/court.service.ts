import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths } from '@enums';
import { ISearchCourt, ISearchCourtBody } from '@interfaces';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private readonly http = inject(HttpClient);
  private courtCache$: { [key: string]: Observable<ISearchCourt[]> } = {};

  /**
   * Searches for courts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits an array of ISearchCourt objects.
   */
  public searchCourt(body: ISearchCourtBody): Observable<ISearchCourt[]> {
    const key = `${JSON.stringify(body.courtId)}${JSON.stringify(body.courtCode)}}`;

    // Court search is cached to prevent multiple requests for the same data.
    if (!this.courtCache$[key]) {
      this.courtCache$[key] = this.http.post<ISearchCourt[]>(ApiPaths.courtSearch, body).pipe(shareReplay(1));
    }

    return this.courtCache$[key];
  }
}

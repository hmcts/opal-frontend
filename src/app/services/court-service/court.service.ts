import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_PATHS } from '@constants';
import { ICourtRefData, ISearchCourt, ISearchCourtBody } from '@interfaces';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private readonly http = inject(HttpClient);
  private courtCache$: { [key: string]: Observable<ISearchCourt[]> } = {};
  private courtRefDataCache$: { [key: string]: Observable<ICourtRefData> } = {};

  /**
   * Searches for courts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits an array of ISearchCourt objects.
   */
  public searchCourt(body: ISearchCourtBody): Observable<ISearchCourt[]> {
    const key = `${JSON.stringify(body.courtId)}${JSON.stringify(body.courtCode)}}`;

    // Court search is cached to prevent multiple requests for the same data.
    if (!this.courtCache$[key]) {
      this.courtCache$[key] = this.http.post<ISearchCourt[]>(API_PATHS.courtSearch, body).pipe(shareReplay(1));
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
        .get<ICourtRefData>(API_PATHS.courtRefData, { params: { businessUnit } })
        .pipe(shareReplay(1));
    }

    return this.courtRefDataCache$[businessUnit];
  }
}

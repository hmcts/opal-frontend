import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths } from '@enums';
import { ISearchCourt, ISearchCourtBody } from '@interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class CourtService {
  private readonly http = inject(HttpClient);

  /**
   * Searches for courts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits an array of ISearchCourt objects.
   */
  public searchCourt(body: ISearchCourtBody): Observable<ISearchCourt[]> {
    return this.http.post<ISearchCourt[]>(ApiPaths.courtSearch, body);
  }
}

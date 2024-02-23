import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths } from '@enums';
import { ISearchCourt, ISearchCourtBody } from '@interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class CourtService {
  private readonly http = inject(HttpClient);

  public searchCourt(body: ISearchCourtBody): Observable<ISearchCourt[]> {
    return this.http.post<ISearchCourt[]>(ApiPaths.courtSearch, body);
  }
}

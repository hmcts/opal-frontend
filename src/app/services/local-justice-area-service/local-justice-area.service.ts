import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_PATHS } from '@constants';
import { ILocalJusticeAreaRefData } from '@interfaces';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalJusticeAreaService {
  private readonly http = inject(HttpClient);

  private localJusticeAreasCache$!: Observable<ILocalJusticeAreaRefData>;

  /**
   * Retrieves the local justice areas.
   * If the local justice areas are not already cached, it makes an HTTP request to fetch them and caches the result.
   * Subsequent calls to this method will return the cached data.
   * @returns An Observable that emits the local justice areas.
   */
  public getLocalJusticeAreas() {
    if (!this.localJusticeAreasCache$) {
      this.localJusticeAreasCache$ = this.http
        .get<ILocalJusticeAreaRefData>(API_PATHS.localJusticeAreaRefData)
        .pipe(shareReplay(1));
    }

    return this.localJusticeAreasCache$;
  }
}

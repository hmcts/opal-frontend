import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { ApiPaths } from '@enums';
import { ISearchCourt, ISearchCourtBody } from '@interfaces';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourtService implements OnDestroy {
  private readonly http = inject(HttpClient);

  private courtCache$!: Observable<ISearchCourt[]>;
  private courtCacheTime: Date | null = null;
  private courtCacheExpiry = 30000;

  private refreshCacheIfNeeded(cacheTime: Date | null, cacheExpiry: number): boolean {
    const now = new Date();
    return cacheTime && now.getTime() - cacheTime.getTime() > cacheExpiry ? true : false;
  }

  /**
   * Searches for courts based on the provided search criteria.
   * @param body - The search criteria.
   * @returns An Observable that emits an array of ISearchCourt objects.
   */
  public searchCourt(body: ISearchCourtBody): Observable<ISearchCourt[]> {
    const refreshCache = this.refreshCacheIfNeeded(this.courtCacheTime, this.courtCacheExpiry);
    const setCache = !this.courtCache$ || refreshCache;

    if (setCache) {
      this.courtCache$ = this.http.post<ISearchCourt[]>(ApiPaths.courtSearch, body).pipe(shareReplay(1));
      this.courtCacheTime = new Date();
    }

    return this.courtCache$;
  }

  ngOnDestroy(): void {
    console.log('CourtService ngOnDestroy');
  }
}

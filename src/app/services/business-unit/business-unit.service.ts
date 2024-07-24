import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IBusinessUnitRefData } from '@interfaces';
import { Observable, shareReplay } from 'rxjs';
import { API_PATHS } from '@constants';

@Injectable({
  providedIn: 'root',
})
export class BusinessUnitService {
  private readonly http = inject(HttpClient);

  private businessUnitsCache$: { [key: string]: Observable<IBusinessUnitRefData> } = {};

  public getBusinessUnits(permission: string) {
    // Business units are cached to prevent multiple requests for the same data.
    // We can have multiple permission types so we need to cache them separately.
    // e.g. ACCOUNT_ENQUIRY, ACCOUNT_ENQUIRY_NOTES, MANUAL_ACCOUNT_CREATION
    if (!this.businessUnitsCache$[permission]) {
      this.businessUnitsCache$[permission] = this.http
        .get<IBusinessUnitRefData>(API_PATHS.businessUnitRefData, { params: { permission } })
        .pipe(shareReplay(1));
    }

    return this.businessUnitsCache$[permission];
  }
}

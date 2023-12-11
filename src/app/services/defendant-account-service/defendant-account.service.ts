import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths } from '@enums';
import { IDefendantAccount, IGetDefendantAccountParams, ISearchDefendantAccountBody } from '@interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class DefendantAccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/';

  public getDefendantAccount(params: IGetDefendantAccountParams): Observable<IDefendantAccount> {
    return this.http.get<IDefendantAccount>(
      `${ApiPaths.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`,
    );
  }

  public searchDefendantAccount(body: ISearchDefendantAccountBody): Observable<any> {
    return this.http.post<any>(ApiPaths.defendantAccountSearch, body);
  }
}

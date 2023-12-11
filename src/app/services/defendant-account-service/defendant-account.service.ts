import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDefendantAccount, IGetDefendantAccountParams } from '@interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class DefendantAccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/';

  public getDefendantAccount(params: IGetDefendantAccountParams): Observable<IDefendantAccount> {
    return this.http.get<IDefendantAccount>(
      `${this.baseUrl}defendant-account?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`,
    );
  }

  public searchDefendantAccount(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}defendant-account/search`, body);
  }
}

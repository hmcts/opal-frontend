import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

interface IGetDefendantAccountParams {
  businessUnitId: number;
  accountNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class DefendantAccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/';

  public getDefendantAccount(params: IGetDefendantAccountParams) {
    return this.http.get(
      `${this.baseUrl}defendant-account?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`,
    );
  }
}

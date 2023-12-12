import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths } from '@enums';
import {
  IDefendantAccount,
  ISearchDefendantAccounts,
  IGetDefendantAccountParams,
  ISearchDefendantAccountBody,
} from '@interfaces';
import { EMPTY, Observable, catchError, of } from 'rxjs';
import { StateService } from '../state-service/state.service';

@Injectable()
export class DefendantAccountService {
  private readonly http = inject(HttpClient);
  private readonly stateService = inject(StateService);

  private resetErrors(): void {
    this.stateService.error.set({
      error: false,
      message: '',
    });
  }

  public getDefendantAccount(params: IGetDefendantAccountParams): Observable<IDefendantAccount> {
    return this.http.get<IDefendantAccount>(
      `${ApiPaths.defendantAccount}?businessUnitId=${params.businessUnitId}&accountNumber=${params.accountNumber}`,
    );
  }

  public searchDefendantAccounts(body: ISearchDefendantAccountBody): Observable<ISearchDefendantAccounts> {
    return this.http.post<ISearchDefendantAccounts>(ApiPaths.defendantAccountSearch, body);
  }
}

import { TestBed } from '@angular/core/testing';
import { RedirectCommand, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { handleObservableResult } from './handle-observable-result';

export type GuardReturnType = boolean | UrlTree | RedirectCommand;

export async function runCanActivateGuardWithContext(
  canActivateGuard: () => GuardReturnType | Promise<GuardReturnType> | Observable<GuardReturnType>,
): Promise<GuardReturnType> {
  const result = TestBed.runInInjectionContext(canActivateGuard);
  const emptyFlow = result instanceof Observable ? await handleObservableResult(result) : result;
  return emptyFlow;
}

import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { handleObservableResult } from './handle-observable-result';
import { GuardReturnType } from '../types';

/**
 * Runs an authentication guard function within the injection context of TestBed.
 *
 * @param authGuard - The authentication guard function to run.
 * @returns A promise that resolves to a boolean or UrlTree indicating whether the user is authenticated.
 */
export async function runAuthGuardWithContext(
  authGuard: () => GuardReturnType | Promise<GuardReturnType> | Observable<GuardReturnType>,
): Promise<GuardReturnType> {
  const result = TestBed.runInInjectionContext(authGuard);
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

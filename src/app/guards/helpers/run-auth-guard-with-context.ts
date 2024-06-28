import { TestBed } from '@angular/core/testing';
import { RedirectCommand, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { handleObservableResult } from './handle-observable-result';

/**
 * Runs an authentication guard function within the injection context of TestBed.
 *
 * @param authGuard - The authentication guard function to run.
 * @returns A promise that resolves to a boolean or UrlTree indicating whether the user is authenticated.
 */
export async function runAuthGuardWithContext(
  authGuard: () =>
    | boolean
    | UrlTree
    | RedirectCommand
    | Promise<boolean | UrlTree | RedirectCommand>
    | Observable<boolean | UrlTree | RedirectCommand>,
): Promise<boolean | UrlTree | RedirectCommand> {
  const result = TestBed.runInInjectionContext(authGuard);
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

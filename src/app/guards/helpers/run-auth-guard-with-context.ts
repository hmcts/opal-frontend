import { TestBed } from '@angular/core/testing';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Runs an authentication guard function within the injection context of TestBed.
 *
 * @param authGuard - The authentication guard function to run.
 * @returns A promise that resolves to a boolean or UrlTree indicating whether the user is authenticated.
 */
export async function runAuthGuardWithContext(
  authGuard: () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>,
): Promise<boolean | UrlTree> {
  const result = TestBed.runInInjectionContext(authGuard);
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

/**
 * Converts an Observable result to a Promise.
 * @param result The Observable result to handle.
 * @returns A Promise that resolves with the value of the Observable.
 */
function handleObservableResult(result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
  return new Promise<boolean | UrlTree>((resolve) => {
    result.subscribe((value) => {
      resolve(value);
    });
  });
}

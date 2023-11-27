import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { TestBed } from '@angular/core/testing';

export async function runAuthGuardWithContext(
  authGuard: () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>,
): Promise<boolean | UrlTree> {
  const result = TestBed.runInInjectionContext(authGuard);
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

export function handleObservableResult(result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
  return new Promise<boolean | UrlTree>((resolve) => {
    result.subscribe((value) => {
      resolve(value);
    });
  });
}

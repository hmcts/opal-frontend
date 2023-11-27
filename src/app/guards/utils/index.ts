import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { authGuard, signedInGuard } from '@guards';

export function getGuardWithDummyUrl(
  guard: typeof authGuard | typeof signedInGuard,
  urlPath: string,
): () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];
  const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };
  return () => guard(dummyRoute, dummyState);
}

export async function runAuthGuardWithContext(
  authGuard: () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>,
): Promise<boolean | UrlTree> {
  const result = TestBed.runInInjectionContext(authGuard);
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

function handleObservableResult(result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
  return new Promise<boolean | UrlTree>((resolve) => {
    result.subscribe((value) => {
      resolve(value);
    });
  });
}

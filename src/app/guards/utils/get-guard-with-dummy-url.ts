import { UrlTree, ActivatedRouteSnapshot, UrlSegment, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { authGuard } from '../auth/auth.guard';
import { signedInGuard } from '../signed-in/signed-in.guard';

export function getGuardWithDummyUrl(
  guard: typeof authGuard | typeof signedInGuard,
  urlPath: string,
): () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];
  const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };
  return () => guard(dummyRoute, dummyState);
}

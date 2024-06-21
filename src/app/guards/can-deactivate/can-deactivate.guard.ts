import { EventEmitter } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  deactivateResult: EventEmitter<Object>;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot,
): Observable<boolean> | Promise<boolean> | boolean => {
  const result = component.canDeactivate ? component.canDeactivate() : true;

  if (result instanceof Observable) {
    result.subscribe((res) => component.deactivateResult.emit({ canDeactivate: res, target: nextState.url }));
  } else if (result instanceof Promise) {
    result.then((res) => component.deactivateResult.emit({ canDeactivate: res, target: nextState.url }));
  } else {
    component.deactivateResult.emit({ canDeactivate: result, target: nextState.url });
  }

  return result;
};

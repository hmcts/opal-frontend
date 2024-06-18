import { EventEmitter } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  deactivateResult: EventEmitter<boolean>;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
): Observable<boolean> | Promise<boolean> | boolean => {
  const result = component.canDeactivate ? component.canDeactivate() : true;

  if (result instanceof Observable) {
    result.subscribe((res) => component.deactivateResult.emit(res));
  } else if (result instanceof Promise) {
    result.then((res) => component.deactivateResult.emit(res));
  } else {
    component.deactivateResult.emit(result);
  }

  return result;
};

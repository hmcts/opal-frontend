import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Converts an Observable result to a Promise.
 * @param result The Observable result to handle.
 * @returns A Promise that resolves with the value of the Observable.
 */
export function handleObservableResult(result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
  return new Promise<boolean | UrlTree>((resolve) => {
    result.subscribe((value) => {
      resolve(value);
    });
  });
}

import { Observable } from 'rxjs';
import { GuardReturnType } from '../types';

/**
 * Converts an Observable result to a Promise.
 * @param result The Observable result to handle.
 * @returns A Promise that resolves with the value of the Observable.
 */
export function handleObservableResult(result: Observable<GuardReturnType>): Promise<GuardReturnType> {
  return new Promise<GuardReturnType>((resolve) => {
    result.subscribe((value) => {
      resolve(value);
    });
  });
}

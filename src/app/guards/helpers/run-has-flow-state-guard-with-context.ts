import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { handleObservableResult } from './handle-observable-result';
import { GuardReturnType } from '../types';

export async function runHasFlowStateGuardWithContext(
  hasFlowStateGuard: () => GuardReturnType | Promise<GuardReturnType> | Observable<GuardReturnType>,
): Promise<GuardReturnType> {
  const result = TestBed.runInInjectionContext(hasFlowStateGuard);
  const emptyFlow = result instanceof Observable ? await handleObservableResult(result) : result;
  return emptyFlow;
}

import { TestBed } from '@angular/core/testing';
import { RedirectCommand, UrlTree } from '@angular/router';
import { handleObservableResult } from '@hmcts/opal-frontend-common/guards/helpers';
import { Observable } from 'rxjs';

export type GuardReturnType = boolean | UrlTree | RedirectCommand;

export async function runFinesSaEmptyFlowGuardWithContext(
  finesSaEmptyFlowGuard: () => GuardReturnType | Promise<GuardReturnType> | Observable<GuardReturnType>,
): Promise<GuardReturnType> {
  const result = TestBed.runInInjectionContext(finesSaEmptyFlowGuard);
  const emptyFlow = result instanceof Observable ? await handleObservableResult(result) : result;
  return emptyFlow;
}

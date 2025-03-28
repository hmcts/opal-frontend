import { TestBed } from '@angular/core/testing';
import { RedirectCommand, UrlTree } from '@angular/router';
import { handleObservableResult } from '@hmcts/opal-frontend-common/core/guards';
import { Observable } from 'rxjs';

export type GuardReturnType = boolean | UrlTree | RedirectCommand;

export async function runFinesMacEmptyFlowGuardWithContext(
  finesMacEmptyFlowGuard: () => GuardReturnType | Promise<GuardReturnType> | Observable<GuardReturnType>,
): Promise<GuardReturnType> {
  const result = TestBed.runInInjectionContext(finesMacEmptyFlowGuard);
  const emptyFlow = result instanceof Observable ? await handleObservableResult(result) : result;
  return emptyFlow;
}

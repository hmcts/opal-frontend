import { TestBed } from '@angular/core/testing';
import { UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { GuardReturnType, runFinesAccEmptyFlowGuardWithContext } from './run-fines-acc-empty-flow-guard-with-context';

describe('runFinesAccEmptyFlowGuardWithContext', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should resolve observable guard results', async () => {
    const result = await runFinesAccEmptyFlowGuardWithContext(() => of(true) as Observable<GuardReturnType>);

    expect(result).toBe(true);
  });

  it('should return synchronous guard results unchanged', async () => {
    const urlTree = new UrlTree();

    const result = await runFinesAccEmptyFlowGuardWithContext(() => urlTree);

    expect(result).toBe(urlTree);
  });
});

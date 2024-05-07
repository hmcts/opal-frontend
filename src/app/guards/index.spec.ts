import { UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { runAuthGuardWithContext } from './helpers/run-auth-guard-with-context';

describe('helper - runAuthGuardWithContext', () => {
  it('should handle direct boolean return from authGuard', async () => {
    const authGuard = () => true;
    const result = await runAuthGuardWithContext(authGuard);
    expect(result).toBeTrue();
  });

  it('should handle direct UrlTree return from authGuard', async () => {
    const urlTree = new UrlTree();
    const authGuard = () => urlTree;
    const result = await runAuthGuardWithContext(authGuard);
    expect(result).toEqual(urlTree);
  });

  it('should handle Observable return from authGuard', async () => {
    const authGuard = () => of(true);
    const result = await runAuthGuardWithContext(authGuard);
    expect(result).toBeTrue();
  });
});

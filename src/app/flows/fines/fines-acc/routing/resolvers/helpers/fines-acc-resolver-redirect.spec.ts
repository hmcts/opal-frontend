import { Router, UrlTree } from '@angular/router';
import { createDefendantDetailsRedirect } from './fines-acc-resolver-redirect';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../constants/fines-acc-defendant-routing-paths.constant';

describe('fines-acc-resolver-redirect', () => {
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);
  });

  describe('createDefendantDetailsRedirect', () => {
    it('should create a redirect command to defendant details page', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter.createUrlTree.and.returnValue(mockUrlTree);

      const result = createDefendantDetailsRedirect(mockRouter);

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
      expect(result).toEqual(jasmine.any(Object));
      expect(result.constructor.name).toBe('RedirectCommand');
    });

    it('should use the correct routing path constant', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter.createUrlTree.and.returnValue(mockUrlTree);

      createDefendantDetailsRedirect(mockRouter);

      const expectedPath = FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details;
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedPath]);
    });

    it('should return a RedirectCommand instance', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter.createUrlTree.and.returnValue(mockUrlTree);

      const result = createDefendantDetailsRedirect(mockRouter);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });
});

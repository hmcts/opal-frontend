import { RedirectCommand, Router, UrlTree } from '@angular/router';
import {
  amendMinorCreditorDetailsRedirect,
  createDefendantDetailsRedirect,
  majorCreditorDetailsRedirect,
} from './fines-acc-resolver-redirect';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS } from '../../constants/fines-acc-major-creditor-routing-paths.constant';
import { beforeEach, describe, expect, it } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('fines-acc-resolver-redirect', () => {
  let mockRouter: ReturnType<typeof createSpyObj>;

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
  });

  describe('createDefendantDetailsRedirect', () => {
    it('should create a redirect command to defendant details page', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter['createUrlTree'].mockReturnValue(mockUrlTree);

      const result = createDefendantDetailsRedirect(mockRouter as unknown as Router);

      expect(mockRouter['createUrlTree']).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
      expect(result).toEqual(expect.any(Object));
      expect(result.constructor.name).toBe('RedirectCommand');
    });

    it('should use the correct routing path constant', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter['createUrlTree'].mockReturnValue(mockUrlTree);

      createDefendantDetailsRedirect(mockRouter as unknown as Router);

      const expectedPath = FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details;
      expect(mockRouter['createUrlTree']).toHaveBeenCalledWith([expectedPath]);
    });

    it('should return a RedirectCommand instance', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter['createUrlTree'].mockReturnValue(mockUrlTree);

      const result = createDefendantDetailsRedirect(mockRouter as unknown as Router);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('amendMinorCreditorDetailsRedirect', () => {
    it('should create a redirect command to minor creditor details page', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter['createUrlTree'].mockReturnValue(mockUrlTree);

      const result = amendMinorCreditorDetailsRedirect(mockRouter as unknown as Router);

      expect(mockRouter['createUrlTree']).toHaveBeenCalledWith([
        FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details,
      ]);
      expect(result).toEqual(expect.any(Object));
      expect(result.constructor.name).toBe('RedirectCommand');
    });

    it('should use the correct minor creditor routing path constant', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter['createUrlTree'].mockReturnValue(mockUrlTree);

      amendMinorCreditorDetailsRedirect(mockRouter as unknown as Router);

      const expectedPath = FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details;
      expect(mockRouter['createUrlTree']).toHaveBeenCalledWith([expectedPath]);
    });
  });

  describe('majorCreditorDetailsRedirect', () => {
    it('should create a redirect command to major creditor details page', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter['createUrlTree'].mockReturnValue(mockUrlTree);

      const result = majorCreditorDetailsRedirect(mockRouter as unknown as Router);

      expect(mockRouter['createUrlTree']).toHaveBeenCalledWith([
        FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.children.details,
      ]);
      expect(result).toBeInstanceOf(RedirectCommand);
    });

    it('should use the correct major creditor routing path constant', () => {
      const mockUrlTree = {} as UrlTree;
      mockRouter['createUrlTree'].mockReturnValue(mockUrlTree);

      majorCreditorDetailsRedirect(mockRouter as unknown as Router);

      const expectedPath = FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.children.details;
      expect(mockRouter['createUrlTree']).toHaveBeenCalledWith([expectedPath]);
    });
  });
});

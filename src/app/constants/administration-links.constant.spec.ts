import { describe, expect, it } from 'vitest';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { ADMINISTRATION_LINKS } from './administration-links.constant';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';

describe('ADMINISTRATION_LINKS', () => {
  it('should include the Auto-Enforcement configuration link', () => {
    const autoEnforcementConfigLink = ADMINISTRATION_LINKS.find((link) => link.id === 'autoEnforcementConfigurationLink');

    expect(autoEnforcementConfigLink).toEqual({
      id: 'autoEnforcementConfigurationLink',
      text: 'Auto-enforcement configuration',
      routerLink: [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_ROUTING_PATHS.children.aec.root,
        FINES_ROUTING_PATHS.children.aec.children['config'],
      ],
      fragment: null,
      permissionIds: [FINES_PERMISSIONS['auto-enforcement']],
      newTab: false,
      style: null,
    });
  });
});

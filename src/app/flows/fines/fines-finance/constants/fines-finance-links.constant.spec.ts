import { describe, expect, it } from 'vitest';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_EXTERNAL_BANKING_LINKS } from './fines-finance-links.constant';

describe('FINES_EXTERNAL_BANKING_LINKS', () => {
  it('should link to the Finance inbound files search', () => {
    expect(FINES_EXTERNAL_BANKING_LINKS[0]).toEqual({
      id: 'finesExternalBankingInboundFilesLink',
      text: 'Inbound files',
      routerLink: [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_ROUTING_PATHS.children.finance.root,
        FINES_ROUTING_PATHS.children.finance.children['inbound'],
        FINES_ROUTING_PATHS.children.finance.children['search'],
      ],
      fragment: null,
      permissionIds: [],
      newTab: false,
      style: 'guidance-panel-blue',
    });
  });

  it('should link to the Finance outbound files search', () => {
    expect(FINES_EXTERNAL_BANKING_LINKS[1]).toEqual({
      id: 'finesExternalBankingOutboundFilesLink',
      text: 'Outbound files',
      routerLink: [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_ROUTING_PATHS.children.finance.root,
        FINES_ROUTING_PATHS.children.finance.children['outbound'],
        FINES_ROUTING_PATHS.children.finance.children['search'],
      ],
      fragment: null,
      permissionIds: [],
      newTab: false,
      style: 'guidance-panel-blue',
    });
  });

  it('should link to the Finance variant banking file upload', () => {
    expect(FINES_EXTERNAL_BANKING_LINKS[2]).toEqual({
      id: 'finesExternalBankingUploadFilesLink',
      text: 'Upload Variant banking files',
      routerLink: [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_ROUTING_PATHS.children.finance.root,
        FINES_ROUTING_PATHS.children.finance.children['variantbankingfiles'],
        FINES_ROUTING_PATHS.children.finance.children['upload'],
      ],
      fragment: null,
      permissionIds: [],
      newTab: false,
      style: 'guidance-panel-blue',
    });
  });
});

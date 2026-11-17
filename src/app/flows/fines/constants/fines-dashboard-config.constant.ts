import { FINES_CON_LINKS } from '@app/flows/fines/fines-con/constants/fines-con-links.constant';
import { FINES_DRAFT_LINKS } from '@app/flows/fines/fines-draft/constants/fines-draft-links.constant';
import { FINES_FPU_LINKS } from '../fines-fpu/constants/fines-fpu-links.constant';
import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';

export const FINES_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Accounts',
  highlights: [],
  groups: [
    {
      id: 'draft-accounts',
      title: 'Draft accounts',
      links: FINES_DRAFT_LINKS,
    },
    {
      id: 'fixed-penalty-uploads',
      title: 'Fixed penalty uploads',
      links: FINES_FPU_LINKS,
    },
    {
      id: 'account-management',
      title: 'Account management',
      links: [...FINES_CON_LINKS],
    },
  ],
};

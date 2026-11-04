import { type FinesPermissionCode } from '@app/constants/fines-permissions.constant';
import {
  type IDashboardPageConfiguration,
  type IDashboardPageConfigurationLink,
  type IDashboardPageConfigurationLinkGroup,
} from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';

export interface IFinesDashboardConfigurationLink extends Omit<IDashboardPageConfigurationLink, 'permissionCodes'> {
  permissionCodes: FinesPermissionCode[];
}

export interface IFinesDashboardConfigurationLinkGroup extends Omit<IDashboardPageConfigurationLinkGroup, 'links'> {
  links: IFinesDashboardConfigurationLink[];
}

export interface IFinesDashboardConfiguration extends Omit<IDashboardPageConfiguration, 'highlights' | 'groups'> {
  highlights: IFinesDashboardConfigurationLink[];
  groups: IFinesDashboardConfigurationLinkGroup[];
}
